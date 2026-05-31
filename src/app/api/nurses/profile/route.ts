import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nurseProfileSchema } from "@/lib/validators";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.nurseProfile.findUnique({
    where: { userId: session.user.id },
    include: { certifications: true, workExperiences: true, user: { select: { name: true, email: true, image: true, phone: true } } },
  });

  return NextResponse.json({ data: profile });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.NURSE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = nurseProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const existing = await prisma.nurseProfile.findUnique({ where: { userId: session.user.id } });

    const profileData = {
      ...parsed.data,
      profileComplete:
        !!parsed.data.bio &&
        parsed.data.specializations.length > 0 &&
        parsed.data.yearsOfExperience > 0,
    };

    let profile;
    if (existing) {
      profile = await prisma.nurseProfile.update({ where: { userId: session.user.id }, data: profileData });
    } else {
      profile = await prisma.nurseProfile.create({ data: { userId: session.user.id, ...profileData } });
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
