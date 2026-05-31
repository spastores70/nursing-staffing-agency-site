import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole, UserStatus } from "@prisma/client";
import { sendAccountApprovedEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();

    if (!Object.values(UserStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.id === session.user.id) {
      return NextResponse.json({ error: "Cannot change your own status" }, { status: 400 });
    }

    const wasActive = user.status !== UserStatus.ACTIVE && status === UserStatus.ACTIVE;

    const updated = await prisma.user.update({
      where: { id },
      data: { status },
    });

    if (wasActive) {
      sendAccountApprovedEmail(user.email, user.name || "there").catch(console.error);

      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "ACCOUNT_APPROVED",
          title: "Account Approved",
          message: "Your NurseConnect account has been approved! You can now access all features.",
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_USER_STATUS",
        resource: "User",
        resourceId: id,
        details: { from: user.status, to: status },
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Update user status error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
