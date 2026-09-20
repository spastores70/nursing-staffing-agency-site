import { NextResponse } from "next/server";
import { LiveJob, PARKLAND_CAREERS_URL } from "@/lib/live-jobs";

export const dynamic = "force-dynamic";

type ParklandJob = {
  requisitionId?: string;
  title?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  datePosted?: string;
  applyUrl?: string;
  description?: string;
};

type ParklandResponse = {
  results?: ParklandJob[];
  totalCount?: number;
};

function roleFor(title: string) {
  const value = title.toLowerCase();
  if (value.includes("resident") || value.includes("fellow")) return "Nurse residency";
  if (value.includes("vocational") || /\blvn\b/.test(value)) return "LVN";
  if (value.includes("manager") || value.includes("director")) return "Nursing leadership";
  if (value.includes("technician") || value.includes("assistant")) return "Nursing support";
  return "Registered nurse";
}

function cleanEmploymentType(value = "") {
  if (!value) return "See employer details";
  const middle = Math.floor(value.length / 2);
  if (value.slice(0, middle) === value.slice(middle)) return value.slice(0, middle);
  return value;
}

function safeApplyUrl(value = "") {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith("myworkdaysite.com") ? url.toString() : PARKLAND_CAREERS_URL;
  } catch {
    return PARKLAND_CAREERS_URL;
  }
}

export async function GET() {
  try {
    const endpoint = new URL("https://jobs.parklandcareers.com/api/mcp/jobs");
    endpoint.searchParams.set("tool", "search_jobs");
    endpoint.searchParams.set("search", "RN");
    endpoint.searchParams.set("page", "1");
    endpoint.searchParams.set("pageSize", "60");

    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error(`Employer feed returned ${response.status}`);

    const data = await response.json() as ParklandResponse;
    const jobs: LiveJob[] = (data.results ?? [])
      .filter((job) => job.requisitionId && job.title && job.department === "Nursing")
      .map((job) => ({
        id: job.requisitionId!,
        title: job.title!,
        facility: "Parkland Health",
        location: job.location || "Dallas, TX",
        role: roleFor(job.title!),
        type: cleanEmploymentType(job.employmentType),
        posted: job.datePosted || "",
        description: job.description || "Review the complete role description, qualifications, and schedule on Parkland Health's official careers site.",
        applyUrl: safeApplyUrl(job.applyUrl),
        sourceUrl: PARKLAND_CAREERS_URL,
      }));

    return NextResponse.json(
      { jobs, source: "Parkland Health official job feed", refreshedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json(
      { jobs: [], source: "Parkland Health official job feed", sourceUrl: PARKLAND_CAREERS_URL, error: "The employer feed is temporarily unavailable." },
      { status: 502 },
    );
  }
}
