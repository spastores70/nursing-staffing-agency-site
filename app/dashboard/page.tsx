"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Building2, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";

type FacilityRequest = { id: string; roleNeeded: string; facilityName: string; location: string; openings: number; startDate: string; status: string };

export default function DashboardPage() {
  const [requests, setRequests] = useState<FacilityRequest[]>([]); const [ready, setReady] = useState(false);
  useEffect(() => { try { setRequests(JSON.parse(localStorage.getItem("nurseconnect_facility_requests") || "[]")); } finally { setReady(true); } }, []);
  return <main className="min-h-screen bg-[#f4f8fb]"><SiteHeader/><section className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.16em] text-[#047f83]">Your workspace</p><h1 className="mt-3 text-4xl font-black tracking-tight">Submission dashboard</h1><p className="mt-3 text-slate-600">Records saved on this device appear here.</p>
    <div className="mt-8 grid gap-5 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6"><BriefcaseBusiness className="size-6 text-[#047f83]"/><h2 className="mt-5 text-xl font-black">Applications are handled by employers</h2><p className="mt-2 leading-7 text-slate-600">Job applications now open directly on the verified employer’s hiring site and are not stored by NurseConnect.</p><a className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#047f83]" href="/jobs">View verified jobs <ExternalLink className="size-4"/></a></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><Building2 className="size-6 text-[#047f83]"/><p className="mt-5 text-4xl font-black">{ready ? requests.length : "—"}</p><p className="mt-1 text-slate-600">Facility requests saved on this device</p></div></div>
    <section className="mt-10"><div className="flex items-center justify-between"><h2 className="text-2xl font-black">Staffing requests</h2><a className="text-sm font-bold text-[#047f83]" href="/facilities">New request</a></div><div className="mt-4 grid gap-3">{requests.length ? requests.map((item)=><article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-black">{item.roleNeeded}</h3><p className="mt-1 text-sm text-slate-500">{item.facilityName} · {item.location}</p></div><Badge className="bg-amber-100 text-amber-800">{item.status}</Badge></div><p className="mt-4 text-sm text-slate-500">{item.openings} opening{item.openings === 1 ? "" : "s"} · starts {item.startDate}</p></article>) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No staffing requests saved on this device yet.</div>}</div></section>
  </section><SiteFooter/></main>;
}
