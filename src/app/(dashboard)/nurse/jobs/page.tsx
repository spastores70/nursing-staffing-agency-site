import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { JobsClient } from "./jobs-client";

export const metadata = { title: "Find Jobs" };

export default async function NurseJobsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const nurseProfile = await prisma.nurseProfile.findUnique({
    where: { userId: session.user.id },
  });

  const savedJobIds = nurseProfile
    ? (await prisma.savedJob.findMany({ where: { nurseProfileId: nurseProfile.id }, select: { jobId: true } })).map((s) => s.jobId)
    : [];

  const appliedJobIds = nurseProfile
    ? (await prisma.application.findMany({ where: { nurseProfileId: nurseProfile.id }, select: { jobId: true } })).map((a) => a.jobId)
    : [];

  const jobs = await prisma.job.findMany({
    where: { status: "OPEN" },
    include: { facility: { select: { facilityName: true, facilityType: true, city: true, state: true, logoUrl: true, isVerified: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <JobsClient
      jobs={jobs as any}
      savedJobIds={savedJobIds}
      appliedJobIds={appliedJobIds}
      nurseProfileId={nurseProfile?.id}
    />
  );
}
