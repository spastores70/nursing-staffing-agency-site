import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { FacilityJobsClient } from "./jobs-client";

export const metadata = { title: "Job Postings" };

export default async function FacilityJobsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const facilityProfile = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
  if (!facilityProfile) redirect("/facility/settings");

  const jobs = await prisma.job.findMany({
    where: { facilityId: facilityProfile.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <FacilityJobsClient jobs={jobs as any} facilityId={facilityProfile.id} />;
}
