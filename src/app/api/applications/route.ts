import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applicationSchema } from "@/lib/validators";
import { UserRole } from "@prisma/client";
import { sendApplicationReceivedEmail, sendNewApplicationNotificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.NURSE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const nurseProfile = await prisma.nurseProfile.findUnique({ where: { userId: session.user.id } });
    if (!nurseProfile) return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });

    const job = await prisma.job.findUnique({
      where: { id: parsed.data.jobId },
      include: { facility: { include: { user: { select: { email: true, name: true } } } } },
    });

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    if (job.status !== "OPEN") return NextResponse.json({ error: "This job is no longer accepting applications" }, { status: 400 });

    const existing = await prisma.application.findUnique({
      where: { jobId_nurseProfileId: { jobId: parsed.data.jobId, nurseProfileId: nurseProfile.id } },
    });
    if (existing) return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });

    const application = await prisma.application.create({
      data: {
        jobId: parsed.data.jobId,
        nurseProfileId: nurseProfile.id,
        coverLetter: parsed.data.coverLetter,
      },
    });

    // Create notification for facility
    await prisma.notification.create({
      data: {
        userId: job.facility.userId,
        type: "APPLICATION_RECEIVED",
        title: "New Application",
        message: `${session.user.name} applied for ${job.title}`,
        data: { applicationId: application.id },
      },
    });

    // Send emails non-blocking
    const nurse = await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, name: true } });
    if (nurse) {
      sendApplicationReceivedEmail(nurse.email, nurse.name || "there", job.title, job.facility.facilityName).catch(console.error);
      sendNewApplicationNotificationEmail(job.facility.user.email, job.facility.facilityName, job.title, nurse.name || "A nurse").catch(console.error);
    }

    return NextResponse.json({ data: application }, { status: 201 });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 20;

  const where: any = {};

  if (session.user.role === UserRole.NURSE) {
    const nurseProfile = await prisma.nurseProfile.findUnique({ where: { userId: session.user.id } });
    if (!nurseProfile) return NextResponse.json({ data: [], total: 0 });
    where.nurseProfileId = nurseProfile.id;
  } else if (session.user.role === UserRole.FACILITY) {
    const facilityProfile = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
    if (!facilityProfile) return NextResponse.json({ data: [], total: 0 });
    where.job = { facilityId: facilityProfile.id };
  }

  const [apps, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        job: { include: { facility: { select: { facilityName: true } } } },
        nurseProfile: { include: { user: { select: { name: true, email: true } } } },
        interviews: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { appliedAt: "desc" },
    }),
    prisma.application.count({ where }),
  ]);

  return NextResponse.json({ data: apps, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}
