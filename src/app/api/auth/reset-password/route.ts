import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { resetToken: token } });

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
