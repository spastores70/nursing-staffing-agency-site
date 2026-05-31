import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminUsersClient } from "./users-client";

export const metadata = { title: "User Management" };

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, status: true,
      createdAt: true, lastLoginAt: true, phone: true,
      _count: { select: { sessions: true } },
    },
  });

  return <AdminUsersClient users={users as any} />;
}
