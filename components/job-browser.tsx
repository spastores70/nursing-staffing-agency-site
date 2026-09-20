"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CheckCircle2, Clock3, MapPin, Search, ShieldCheck } from "lucide-react";
import { Job, jobs, specialties } from "@/lib/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ModelContextLike = { registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void> };

export function JobBrowser() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState<Job | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);

  const filtered = useMemo(() => jobs.filter((job) => {
    const haystack = `${job.title} ${job.facility} ${job.location} ${job.specialty}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (specialty === "all" || job.specialty === specialty) && (type === "all" || job.type === type);
  }), [query, specialty, type]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContextLike }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    Promise.resolve(context.registerTool({
      name: "find_nursing_jobs", title: "Find nursing jobs", description: "Filter the visible NurseConnect job list by keywords, specialty, or employment type.",
      inputSchema: { type: "object", properties: { query: { type: "string" }, specialty: { type: "string" }, type: { type: "string" } }, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input: unknown) { const value = input as { query?: string; specialty?: string; type?: string }; setQuery(value.query ?? ""); setSpecialty(value.specialty ?? "all"); setType(value.type ?? "all"); return { updated: true }; },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selected) return; setStatus("sending"); setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const saved = JSON.parse(localStorage.getItem("nurseconnect_applications") || "[]") as Array<Record<string, unknown>>;
      saved.unshift({ ...payload, id: crypto.randomUUID(), jobId: selected.id, jobTitle: selected.title, status: "Received", createdAt: new Date().toISOString() });
      localStorage.setItem("nurseconnect_applications", JSON.stringify(saved));
      setStatus("success");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Application failed"); setStatus("error"); }
  }

  function openJob(job: Job) { setSelected(job); setStatus("idle"); setError(""); }

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.16em] text-[#047f83]">Nursing opportunities</p><h1 className="mt-3 text-4xl font-black tracking-[-.04em] sm:text-5xl">Work that fits your life.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Explore clear rates, schedules, and requirements before you apply.</p></div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px]">
          <label className="relative"><span className="sr-only">Search jobs</span><Search className="absolute left-3 top-3.5 size-4 text-slate-400"/><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 rounded-xl pl-9" placeholder="Role, facility, or city"/></label>
          <Select value={specialty} onValueChange={(value) => setSpecialty(value ?? "all")}><SelectTrigger className="h-11 w-full rounded-xl"><SelectValue placeholder="Specialty"/></SelectTrigger><SelectContent><SelectItem value="all">All specialties</SelectItem>{specialties.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
          <Select value={type} onValueChange={(value) => setType(value ?? "all")}><SelectTrigger className="h-11 w-full rounded-xl"><SelectValue placeholder="Job type"/></SelectTrigger><SelectContent><SelectItem value="all">All job types</SelectItem><SelectItem value="Permanent">Permanent</SelectItem><SelectItem value="Travel">Travel</SelectItem><SelectItem value="Contract">Contract</SelectItem><SelectItem value="Per diem">Per diem</SelectItem></SelectContent></Select>
        </div>
        <div className="mt-7 flex items-center justify-between"><h2 className="text-xl font-extrabold">{filtered.length} matching opportunities</h2><p className="hidden text-sm text-slate-500 sm:block">Rates shown before you apply</p></div>
        {filtered.length ? <div className="mt-5 grid gap-5 lg:grid-cols-2">{filtered.map((job) => (
          <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1ba4a8] hover:shadow-lg">
            <div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-[#dff5f3] px-3 py-1 text-xs font-bold text-[#075f63]">{job.specialty}</span><h3 className="mt-4 text-xl font-black tracking-tight">{job.title}</h3><p className="mt-1 font-semibold text-slate-600">{job.facility}</p></div><span className="text-right text-lg font-black text-[#0b3558]">{job.pay}</span></div>
            <p className="mt-4 leading-7 text-slate-600">{job.description}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium text-slate-600"><span className="flex items-center gap-1.5"><MapPin className="size-4"/>{job.location}</span><span className="flex items-center gap-1.5"><Clock3 className="size-4"/>{job.shift}</span><span className="flex items-center gap-1.5"><BriefcaseBusiness className="size-4"/>{job.type}</span></div>
            <div className="mt-6 flex items-center justify-between gap-4"><span className="text-sm text-slate-500">Posted {job.posted.toLowerCase()}</span><Button onClick={() => openJob(job)} className="rounded-xl bg-[#0b3558]">View & apply</Button></div>
          </article>
        ))}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><Search className="mx-auto size-8 text-slate-400"/><h2 className="mt-4 text-xl font-bold">No exact matches yet</h2><p className="mt-2 text-slate-600">Try a broader role, location, or job type.</p></div>}
      </section>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          {selected && status !== "success" && <><DialogHeader><DialogTitle className="text-2xl font-black">Apply for {selected.title}</DialogTitle><DialogDescription>{selected.facility} · {selected.location} · {selected.pay}</DialogDescription></DialogHeader>
          <div className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-bold text-slate-700">Minimum requirements</p><ul className="mt-2 grid gap-1.5 text-sm text-slate-600">{selected.requirements.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-[#047f83]"/>{item}</li>)}</ul></div>
          <form onSubmit={submitApplication} className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="fullName">Full name</Label><Input id="fullName" name="fullName" required/></div><div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required/></div>
            <div className="grid gap-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" required/></div><div className="grid gap-2"><Label htmlFor="licenseType">License or certification</Label><Input id="licenseType" name="licenseType" placeholder="RN, LVN, CNA…" required/></div>
            <div className="grid gap-2"><Label htmlFor="licenseState">License state</Label><Input id="licenseState" name="licenseState" placeholder="Texas" required/></div><div className="grid gap-2"><Label htmlFor="yearsExperience">Years of experience</Label><Input id="yearsExperience" name="yearsExperience" type="number" min="0" max="60" required/></div>
            <div className="grid gap-2 sm:col-span-2"><Label htmlFor="message">Anything we should know? <span className="font-normal text-slate-500">Optional</span></Label><Textarea id="message" name="message" rows={3}/></div>
            {error && <p className="text-sm font-semibold text-red-600 sm:col-span-2" role="alert">{error}</p>}
            <Button disabled={status === "sending"} className="h-11 rounded-xl bg-[#0b3558] sm:col-span-2">{status === "sending" ? "Submitting…" : "Submit application"}</Button>
            <p className="text-center text-xs leading-5 text-slate-500 sm:col-span-2">This Vercel edition saves the application on this device so you can review it in your dashboard. It does not transmit the application to an employer.</p>
          </form></>}
          {selected && status === "success" && <div className="py-8 text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-8"/></span><DialogTitle className="mt-5 text-2xl font-black">Application saved</DialogTitle><p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">Your application for {selected.title} is saved on this device and now appears in your dashboard.</p><Button onClick={() => setSelected(null)} className="mt-6 rounded-xl bg-[#0b3558]">Continue browsing</Button></div>}
        </DialogContent>
      </Dialog>
    </>
  );
}
