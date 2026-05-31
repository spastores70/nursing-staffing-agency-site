import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jobSchema } from "@/lib/validators";
import { UserRole, JobStatus } from "@prisma/client";
import { apiRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const limited = apiRateLimit(req);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const jobType = searchParams.get("jobType") || "";
  const shiftType = searchParams.get("shiftType") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const specialization = searchParams.get("specialization") || "";
  const salaryMin = Number(searchParams.get("salaryMin") || 0);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 50);

  const where: any = { status: JobStatus.OPEN };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { facility: { facilityName: { contains: search, mode: "insensitive" } } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }
  if (jobType) where.jobType = jobType;
  if (shiftType) where.shiftType = shiftType;
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (state) where.state = { contains: state, mode: "insensitive" };
  if (specialization) where.specializations = { has: specialization };
  if (salaryMin > 0) where.salaryMin = { gte: salaryMin };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        facility: { select: { facilityName: true, facilityType: true, city: true, state: true, logoUrl: true, isVerified: true } },
        _count: { select: { applications: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.count({ where }),
  ]);

  // Increment view counts
  await prisma.job.updateMany({
    where: { id: { in: jobs.map((j) => j.id) } },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({ data: jobs, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.FACILITY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const facilityProfile = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
    if (!facilityProfile) return NextResponse.json({ error: "Facility profile not found" }, { status: 404 });

    const job = await prisma.job.create({
      data: {
        ...parsed.data,
        facilityId: facilityProfile.id,
        location: `${parsed.data.city}, ${parsed.data.state}`,
        status: JobStatus.OPEN,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ data: job }, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
