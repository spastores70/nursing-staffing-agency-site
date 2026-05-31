import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 20;

  const where: any = { userId: session.user.id };
  if (unreadOnly) where.isRead = false;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
  ]);

  return NextResponse.json({ data: notifications, total, unreadCount, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids, markAll } = await req.json();

  if (markAll) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  } else if (ids?.length) {
    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId: session.user.id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  return NextResponse.json({ message: "Notifications marked as read" });
}
