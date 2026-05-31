import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { NurseDashboardClient } from "./dashboard-client";

export const metadata = { title: "Nurse Dashboard" };

export default async function NurseDashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [nurseProfile, recentApplications, upcomingInterviews, savedJobsCount, notifications] =
    await Promise.all([
      prisma.nurseProfile.findUnique({
        where: { userId: session.user.id },
        include: { certifications: true, workExperiences: true },
      }),
      prisma.application.findMany({
        where: { nurseProfile: { userId: session.user.id } },
        include: { job: { include: { facility: true } } },
        orderBy: { appliedAt: "desc" },
        take: 5,
      }),
      prisma.interview.findMany({
        where: {
          application: { nurseProfile: { userId: session.user.id } },
          scheduledAt: { gte: new Date() },
          status: "SCHEDULED",
        },
        include: { application: { include: { job: { include: { facility: true } } } } },
        orderBy: { scheduledAt: "asc" },
        take: 3,
      }),
      prisma.savedJob.count({
        where: { nurseProfile: { userId: session.user.id } },
      }),
      prisma.notification.count({
        where: { userId: session.user.id, isRead: false },
      }),
    ]);

  const stats = {
    totalApplications: await prisma.application.count({
      where: { nurseProfile: { userId: session.user.id } },
    }),
    activeApplications: await prisma.application.count({
      where: {
        nurseProfile: { userId: session.user.id },
        status: { in: ["PENDING", "REVIEWED", "SHORTLISTED", "INTERVIEW_SCHEDULED"] },
      },
    }),
    offersReceived: await prisma.application.count({
      where: { nurseProfile: { userId: session.user.id }, status: "OFFERED" },
    }),
    savedJobs: savedJobsCount,
    unreadNotifications: notifications,
  };

  return (
    <NurseDashboardClient
      user={session.user}
      nurseProfile={nurseProfile}
      recentApplications={recentApplications as any}
      upcomingInterviews={upcomingInterviews as any}
      stats={stats}
    />
  );
}
