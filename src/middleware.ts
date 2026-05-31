import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;
    const status = token.status as string;

    // Block suspended/rejected users from dashboard
    if (
      (status === "SUSPENDED" || status === "REJECTED") &&
      (pathname.startsWith("/nurse") ||
        pathname.startsWith("/facility") ||
        pathname.startsWith("/admin"))
    ) {
      return NextResponse.redirect(new URL("/login?error=account_suspended", req.url));
    }

    // Pending users: only allow profile completion
    if (
      status === "PENDING" &&
      !pathname.startsWith("/register") &&
      !pathname.startsWith("/api") &&
      (pathname.startsWith("/nurse") ||
        pathname.startsWith("/facility") ||
        pathname.startsWith("/admin"))
    ) {
      return NextResponse.redirect(new URL("/register/pending", req.url));
    }

    // Role-based routing
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    if (pathname.startsWith("/facility") && role !== "FACILITY" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    if (pathname.startsWith("/nurse") && role !== "NURSE" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/nurse/:path*",
    "/facility/:path*",
    "/admin/:path*",
    "/api/nurses/:path*",
    "/api/facilities/:path*",
    "/api/jobs/:path*",
    "/api/applications/:path*",
    "/api/admin/:path*",
    "/api/payments/:path*",
    "/api/upload/:path*",
  ],
};
