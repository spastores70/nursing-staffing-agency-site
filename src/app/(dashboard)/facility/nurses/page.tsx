import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { SearchNursesClient } from "./search-nurses-client";

export const metadata = { title: "Search Nurses" };

export default async function SearchNursesPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const nurses = await prisma.nurseProfile.findMany({
    where: { profileComplete: true, user: { status: "ACTIVE" } },
    include: {
      user: { select: { name: true, email: true, image: true } },
      certifications: { select: { name: true, isVerified: true, type: true } },
    },
    orderBy: [{ rating: "desc" }, { yearsOfExperience: "desc" }],
    take: 30,
  });

  return <SearchNursesClient nurses={nurses as any} />;
}
