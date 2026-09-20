"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarDays, ExternalLink, MapPin, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { LiveJob, PARKLAND_CAREERS_URL } from "@/lib/live-jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ModelContextLike = { registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void> };

function postedLabel(value: string) {
  if (!value) return "See employer listing";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function JobBrowser() {
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
    fetch("/api/jobs")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { jobs: LiveJob[] }) => { setJobs(data.jobs); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const roles = useMemo(() => Array.from(new Set(jobs.map((job) => job.role))).sort(), [jobs]);
  const types = useMemo(() => Array.from(new Set(jobs.map((job) => job.type))).sort(), [jobs]);
  const filtered = useMemo(() => jobs.filter((job) => {
    const haystack = `${job.title} ${job.facility} ${job.location} ${job.role} ${job.description}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (role === "all" || job.role === role) && (type === "all" || job.type === type);
  }), [jobs, query, role, type]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContextLike }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    Promise.resolve(context.registerTool({
      name: "find_nursing_jobs", title: "Find verified nursing jobs", description: "Filter live Parkland Health nursing openings by keywords, role, or employment type.",
      inputSchema: { type: "object", properties: { query: { type: "string" }, role: { type: "string" }, type: { type: "string" } }, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute(input: unknown) { const value = input as { query?: string; role?: string; type?: string }; setQuery(value.query ?? ""); setRole(value.role ?? "all"); setType(value.type ?? "all"); return { updated: true }; },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  return <>
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><div className="flex flex-wrap items-center gap-3"><p className="text-sm font-bold uppercase tracking-[.16em] text-[#047f83]">Verified nursing opportunities</p><span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><ShieldCheck className="size-3.5"/>Official Parkland feed</span></div><h1 className="mt-3 text-4xl font-black tracking-[-.04em] sm:text-5xl">Current roles from a real employer.</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">These openings come directly from Parkland Health’s public job feed. Applications open on Parkland’s official Workday site.</p></div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px]">
        <label className="relative"><span className="sr-only">Search jobs</span><Search className="absolute left-3 top-3.5 size-4 text-slate-400"/><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 rounded-xl pl-9" placeholder="Role, specialty, or city"/></label>
        <Select value={role} onValueChange={(value) => setRole(value ?? "all")}><SelectTrigger className="h-11 w-full rounded-xl"><SelectValue placeholder="Role"/></SelectTrigger><SelectContent><SelectItem value="all">All nursing roles</SelectItem>{roles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={type} onValueChange={(value) => setType(value ?? "all")}><SelectTrigger className="h-11 w-full rounded-xl"><SelectValue placeholder="Job type"/></SelectTrigger><SelectContent><SelectItem value="all">All job types</SelectItem>{types.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
      </div>

      {loading ? <div className="mt-7 grid gap-5 lg:grid-cols-2" aria-label="Loading live jobs">{[1,2,3,4].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-white"/>)}</div> : error ? <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"><RefreshCw className="mx-auto size-8 text-amber-700"/><h2 className="mt-4 text-xl font-bold">The live feed is temporarily unavailable</h2><p className="mt-2 text-slate-600">You can still browse every nursing opening on Parkland Health’s official careers site.</p><Button asChild className="mt-5 rounded-xl bg-[#0b3558]"><a href={PARKLAND_CAREERS_URL} target="_blank" rel="noreferrer">Open Parkland careers <ExternalLink/></a></Button></div> : <>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-extrabold">{filtered.length} current opportunities</h2><p className="text-sm text-slate-500">Source: Parkland Health official job feed</p></div>
        {filtered.length ? <div className="mt-5 grid gap-5 lg:grid-cols-2">{filtered.map((job) => <article key={job.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1ba4a8] hover:shadow-lg">
          <div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-[#dff5f3] px-3 py-1 text-xs font-bold text-[#075f63]">{job.role}</span><h3 className="mt-4 text-xl font-black tracking-tight">{job.title}</h3><p className="mt-1 font-semibold text-slate-600">{job.facility} · Req. {job.id}</p></div><span className="flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-700"><ShieldCheck className="size-4"/>Verified</span></div>
          <p className="mt-4 line-clamp-3 leading-7 text-slate-600">{job.description}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium text-slate-600"><span className="flex items-center gap-1.5"><MapPin className="size-4"/>{job.location}</span><span className="flex items-center gap-1.5"><BriefcaseBusiness className="size-4"/>{job.type}</span><span className="flex items-center gap-1.5"><CalendarDays className="size-4"/>Posted {postedLabel(job.posted)}</span></div>
          <div className="mt-auto flex items-center justify-between gap-4 pt-6"><a className="text-sm font-bold text-[#047f83] underline" href={job.sourceUrl} target="_blank" rel="noreferrer">View source</a><Button asChild className="rounded-xl bg-[#0b3558]"><a href={job.applyUrl} target="_blank" rel="noreferrer">Apply on Parkland <ExternalLink/></a></Button></div>
        </article>)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><Search className="mx-auto size-8 text-slate-400"/><h2 className="mt-4 text-xl font-bold">No exact matches</h2><p className="mt-2 text-slate-600">Try a broader title or clear one of the filters.</p></div>}
      </>}
    </section>
  </>;
}
