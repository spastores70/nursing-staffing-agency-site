import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { strictRateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const limited = strictRateLimit(req);
  if (limited) return limited;

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpires: expires },
    });

    await sendPasswordResetEmail(user.email, token);

    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
