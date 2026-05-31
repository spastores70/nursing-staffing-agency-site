import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.NURSE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nurseProfile = await prisma.nurseProfile.findUnique({ where: { userId: session.user.id } });
  if (!nurseProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  await prisma.savedJob.upsert({
    where: { nurseProfileId_jobId: { nurseProfileId: nurseProfile.id, jobId: params.id } },
    update: {},
    create: { nurseProfileId: nurseProfile.id, jobId: params.id },
  });

  return NextResponse.json({ message: "Job saved" });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.NURSE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nurseProfile = await prisma.nurseProfile.findUnique({ where: { userId: session.user.id } });
  if (!nurseProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  await prisma.savedJob.deleteMany({
    where: { nurseProfileId: nurseProfile.id, jobId: params.id },
  });

  return NextResponse.json({ message: "Job unsaved" });
}
