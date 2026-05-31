import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { NurseProfileClient } from "./profile-client";

export const metadata = { title: "My Profile" };

export default async function NurseProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      nurseProfile: {
        include: { certifications: true, workExperiences: { orderBy: { startDate: "desc" } } },
      },
    },
  });

  if (!user) redirect("/login");

  return <NurseProfileClient user={user as any} />;
}
