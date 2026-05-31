import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  limit: number = 10,
  windowMs: number = 60 * 1000
) {
  return function rateLimitMiddleware(req: NextRequest) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
      return null;
    }

    entry.count += 1;

    if (entry.count > limit) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    return null;
  };
}

export const authRateLimit = rateLimit(5, 60 * 1000);
export const apiRateLimit = rateLimit(100, 60 * 1000);
export const strictRateLimit = rateLimit(3, 15 * 60 * 1000);
