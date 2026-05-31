import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.NURSE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nurseProfile = await prisma.nurseProfile.findUnique({ where: { userId: session.user.id } });
  if (!nurseProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  await prisma.savedJob.upsert({
    where: { nurseProfileId_jobId: { nurseProfileId: nurseProfile.id, jobId: id } },
    update: {},
    create: { nurseProfileId: nurseProfile.id, jobId: id },
  });

  return NextResponse.json({ message: "Job saved" });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.NURSE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nurseProfile = await prisma.nurseProfile.findUnique({ where: { userId: session.user.id } });
  if (!nurseProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  await prisma.savedJob.deleteMany({
    where: { nurseProfileId: nurseProfile.id, jobId: id },
  });

  return NextResponse.json({ message: "Job unsaved" });
}
