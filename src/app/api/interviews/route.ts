import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { interviewSchema } from "@/lib/validators";
import { UserRole } from "@prisma/client";
import { sendInterviewScheduledEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.FACILITY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = interviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: parsed.data.applicationId },
      include: {
        job: { include: { facility: true } },
        nurseProfile: { include: { user: { select: { email: true, name: true } } } },
      },
    });

    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const facilityProfile = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
    if (!facilityProfile || facilityProfile.id !== application.job.facilityId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const interview = await prisma.interview.create({
      data: {
        applicationId: parsed.data.applicationId,
        scheduledAt: new Date(parsed.data.scheduledAt),
        duration: parsed.data.duration,
        type: parsed.data.type,
        location: parsed.data.location,
        meetingLink: parsed.data.meetingLink,
        notes: parsed.data.notes,
      },
    });

    // Update application status
    await prisma.application.update({
      where: { id: parsed.data.applicationId },
      data: { status: "INTERVIEW_SCHEDULED" },
    });

    // Notify nurse
    await prisma.notification.create({
      data: {
        userId: application.nurseProfile.userId,
        type: "INTERVIEW_SCHEDULED",
        title: "Interview Scheduled",
        message: `Your interview for ${application.job.title} at ${application.job.facility.facilityName} has been scheduled.`,
        data: { interviewId: interview.id },
      },
    });

    // Send email non-blocking
    sendInterviewScheduledEmail(
      application.nurseProfile.user.email,
      application.nurseProfile.user.name || "there",
      application.job.title,
      new Date(parsed.data.scheduledAt),
      parsed.data.meetingLink || undefined
    ).catch(console.error);

    return NextResponse.json({ data: interview }, { status: 201 });
  } catch (error) {
    console.error("Interview schedule error:", error);
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
  }
}
