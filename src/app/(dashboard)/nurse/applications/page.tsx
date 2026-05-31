import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ApplicationsClient } from "./applications-client";

export const metadata = { title: "My Applications" };

export default async function ApplicationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const applications = await prisma.application.findMany({
    where: { nurseProfile: { userId: session.user.id } },
    include: {
      job: {
        include: {
          facility: { select: { facilityName: true, facilityType: true, city: true, state: true } },
        },
      },
      interviews: { orderBy: { scheduledAt: "asc" } },
    },
    orderBy: { appliedAt: "desc" },
  });

  return <ApplicationsClient applications={applications as any} />;
}
