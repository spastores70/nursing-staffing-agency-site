import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "./dashboard-client";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const [
    totalUsers,
    totalNurses,
    totalFacilities,
    pendingApprovals,
    totalJobs,
    activeJobs,
    totalApplications,
    recentPayments,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "NURSE" } }),
    prisma.user.count({ where: { role: "FACILITY" } }),
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.application.count(),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { subscription: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    }),
  ]);

  const monthlyRevenue = recentPayments
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminDashboardClient
      stats={{ totalUsers, totalNurses, totalFacilities, pendingApprovals, totalJobs, activeJobs, totalApplications, monthlyRevenue }}
      recentUsers={recentUsers as any}
      recentPayments={recentPayments as any}
    />
  );
}
