import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalUsers,
    totalNurses,
    totalFacilities,
    pendingApprovals,
    totalJobs,
    activeJobs,
    totalApplications,
    totalRevenue,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "NURSE" } }),
    prisma.user.count({ where: { role: "FACILITY" } }),
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.application.count(),
    prisma.payment.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amount: true } }),
    prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: { amount: true },
    }),
  ]);

  // User growth data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const userGrowth = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
    SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
           COUNT(*)::bigint as count
    FROM "User"
    WHERE "createdAt" >= ${sixMonthsAgo}
    GROUP BY DATE_TRUNC('month', "createdAt"), TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon')
    ORDER BY DATE_TRUNC('month', "createdAt")
  `;

  return NextResponse.json({
    data: {
      totalUsers,
      totalNurses,
      totalFacilities,
      pendingApprovals,
      totalJobs,
      activeJobs,
      totalApplications,
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      userGrowthData: userGrowth.map((r) => ({ label: r.month, value: Number(r.count) })),
    },
  });
}
