import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { FacilityApplicationsClient } from "./applications-client";

export const metadata = { title: "Applications" };

export default async function FacilityApplicationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const facilityProfile = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
  if (!facilityProfile) redirect("/facility/settings");

  const applications = await prisma.application.findMany({
    where: { job: { facilityId: facilityProfile.id } },
    include: {
      job: { select: { title: true, jobType: true, city: true, state: true } },
      nurseProfile: {
        include: {
          user: { select: { name: true, email: true, image: true } },
          certifications: { select: { name: true, isVerified: true } },
        },
      },
      interviews: true,
    },
    orderBy: { appliedAt: "desc" },
  });

  return <FacilityApplicationsClient applications={applications as any} />;
}
