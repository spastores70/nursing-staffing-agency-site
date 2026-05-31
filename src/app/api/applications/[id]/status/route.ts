import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateApplicationStatusSchema } from "@/lib/validators";
import { UserRole } from "@prisma/client";
import { sendApplicationStatusEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.FACILITY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateApplicationStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
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

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: parsed.data.status as any,
        facilityNotes: parsed.data.notes,
        reviewedAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        userId: application.nurseProfile.userId,
        type: "APPLICATION_STATUS",
        title: "Application Update",
        message: `Your application for ${application.job.title} has been updated to: ${parsed.data.status}`,
        data: { applicationId: id },
      },
    });

    sendApplicationStatusEmail(
      application.nurseProfile.user.email,
      application.nurseProfile.user.name || "there",
      application.job.title,
      parsed.data.status
    ).catch(console.error);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
