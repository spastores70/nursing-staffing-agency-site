import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || (session.user.role !== UserRole.FACILITY && session.user.role !== UserRole.ADMIN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const specialization = searchParams.get("specialization") || "";
  const available = searchParams.get("available") === "true";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 50);

  const where: any = {
    profileComplete: true,
    user: { status: "ACTIVE" },
  };

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { specializations: { has: search } },
      { currentLocation: { contains: search, mode: "insensitive" } },
    ];
  }
  if (specialization) where.specializations = { has: specialization };
  if (available) where.isAvailable = true;

  const [nurses, total] = await Promise.all([
    prisma.nurseProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, image: true } },
        certifications: { select: { name: true, isVerified: true, type: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [{ rating: "desc" }, { yearsOfExperience: "desc" }],
    }),
    prisma.nurseProfile.count({ where }),
  ]);

  return NextResponse.json({
    data: nurses,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
