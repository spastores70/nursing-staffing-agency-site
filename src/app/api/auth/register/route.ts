import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators";
import { sendWelcomeEmail } from "@/lib/email";
import { authRateLimit } from "@/lib/rate-limit";
import { UserRole, UserStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const limited = authRateLimit(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role, facilityName, phone } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role as UserRole,
        status: UserStatus.PENDING,
        phone,
      },
    });

    // Create default profile
    if (role === "NURSE") {
      await prisma.nurseProfile.create({
        data: { userId: user.id },
      });
    } else if (role === "FACILITY") {
      await prisma.facilityProfile.create({
        data: {
          userId: user.id,
          facilityName: facilityName || name,
          facilityType: "Hospital",
        },
      });
    }

    // Send welcome email (don't await - non-blocking)
    sendWelcomeEmail(user.email, user.name || "there", role).catch(console.error);

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
