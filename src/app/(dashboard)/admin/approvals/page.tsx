import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ApprovalsClient } from "./approvals-client";

export const metadata = { title: "Pending Approvals" };

export default async function ApprovalsPage() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const pendingUsers = await prisma.user.findMany({
    where: { status: "PENDING" },
    include: {
      nurseProfile: { include: { certifications: true } },
      facilityProfile: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return <ApprovalsClient users={pendingUsers as any} />;
}
