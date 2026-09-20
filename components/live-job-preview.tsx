"use client";

import { useEffect, useState } from "react";
import { ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { LiveJob } from "@/lib/live-jobs";

export function LiveJobPreview() {
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { jobs: LiveJob[] }) => setJobs(data.jobs))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mt-6 grid gap-3" aria-label="Loading current jobs">{[1,2,3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-100"/>)}</div>;

  if (!jobs.length) return <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">The live feed is temporarily unavailable. <a className="font-bold text-[#047f83] underline" href="https://jobs.parklandcareers.com/careers/632cb21de491d9002ffa50c0" target="_blank" rel="noreferrer">Browse Parkland nursing careers</a>.</div>;

  return <div className="mt-6 space-y-3">{jobs.slice(0,3).map((job) => <a href={job.applyUrl} target="_blank" rel="noreferrer" key={job.id} className="block rounded-2xl border border-slate-200 p-4 transition hover:border-[#1ba4a8] hover:shadow-lg">
    <div className="flex items-start justify-between gap-4"><div><h3 className="font-extrabold tracking-tight">{job.title}</h3><p className="mt-1 text-sm font-medium text-slate-500">{job.facility} · Requisition {job.id}</p></div><span className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"><ShieldCheck className="size-3.5"/>Official</span></div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><span className="flex items-center gap-1.5 text-slate-600"><MapPin className="size-4"/>{job.location}</span><span className="flex items-center gap-1.5 font-bold text-[#0b3558]">Apply at Parkland <ExternalLink className="size-3.5"/></span></div>
  </a>)}</div>;
}
