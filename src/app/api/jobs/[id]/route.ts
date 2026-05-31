import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      facility: true,
      _count: { select: { applications: true } },
    },
  });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ data: job });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const job = await prisma.job.findUnique({ where: { id: params.id }, include: { facility: true } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  // Only the facility owner or admin can update
  if (session.user.role !== UserRole.ADMIN) {
    const facilityProfile = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
    if (!facilityProfile || facilityProfile.id !== job.facilityId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const body = await req.json();
  const updated = await prisma.job.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  if (session.user.role !== UserRole.ADMIN) {
    const facilityProfile = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
    if (!facilityProfile || facilityProfile.id !== job.facilityId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  await prisma.job.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Job deleted" });
}
