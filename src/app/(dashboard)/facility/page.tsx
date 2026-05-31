import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { FacilityDashboardClient } from "./dashboard-client";

export const metadata = { title: "Facility Dashboard" };

export default async function FacilityDashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const facilityProfile = await prisma.facilityProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!facilityProfile) {
    redirect("/facility/settings");
  }

  const [activeJobs, totalApplications, newApplications, scheduledInterviews, recentApplications] =
    await Promise.all([
      prisma.job.count({ where: { facilityId: facilityProfile.id, status: "OPEN" } }),
      prisma.application.count({ where: { job: { facilityId: facilityProfile.id } } }),
      prisma.application.count({
        where: {
          job: { facilityId: facilityProfile.id },
          status: "PENDING",
        },
      }),
      prisma.interview.count({
        where: {
          application: { job: { facilityId: facilityProfile.id } },
          scheduledAt: { gte: new Date() },
          status: "SCHEDULED",
        },
      }),
      prisma.application.findMany({
        where: { job: { facilityId: facilityProfile.id } },
        include: {
          job: true,
          nurseProfile: { include: { user: { select: { name: true, email: true, image: true } } } },
        },
        orderBy: { appliedAt: "desc" },
        take: 8,
      }),
    ]);

  return (
    <FacilityDashboardClient
      facilityProfile={facilityProfile as any}
      stats={{ activeJobs, totalApplications, newApplications, scheduledInterviews }}
      recentApplications={recentApplications as any}
      user={session.user}
    />
  );
}
