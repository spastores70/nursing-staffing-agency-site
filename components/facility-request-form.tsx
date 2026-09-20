"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FacilityRequestForm() {
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle"); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setStatus("sending"); setError(""); const form = event.currentTarget;
    try { const payload = Object.fromEntries(new FormData(form).entries()); const saved = JSON.parse(localStorage.getItem("nurseconnect_facility_requests") || "[]") as Array<Record<string, unknown>>; saved.unshift({ ...payload, id: crypto.randomUUID(), openings: Number(payload.openings), status: "Saved", createdAt: new Date().toISOString() }); localStorage.setItem("nurseconnect_facility_requests", JSON.stringify(saved)); form.reset(); setStatus("success"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Request failed"); setStatus("error"); }
  }
  if (status === "success") return <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center"><CheckCircle2 className="mx-auto size-12 text-emerald-700"/><h2 className="mt-4 text-2xl font-black">Staffing request saved</h2><p className="mt-3 leading-7 text-slate-600">The request is saved on this device and now appears in your dashboard.</p><Button onClick={() => setStatus("idle")} variant="outline" className="mt-6 rounded-xl">Save another request</Button></div>;
  return <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:grid-cols-2 sm:p-8">
    <div className="grid gap-2 sm:col-span-2"><h2 className="text-2xl font-black tracking-tight">Tell us what coverage you need</h2><p className="text-slate-600">Clear details help us route your request faster.</p></div>
    <div className="grid gap-2"><Label htmlFor="facilityName">Facility name</Label><Input id="facilityName" name="facilityName" required/></div><div className="grid gap-2"><Label htmlFor="contactName">Contact name</Label><Input id="contactName" name="contactName" required/></div>
    <div className="grid gap-2"><Label htmlFor="facilityEmail">Work email</Label><Input id="facilityEmail" name="email" type="email" required/></div><div className="grid gap-2"><Label htmlFor="facilityPhone">Phone</Label><Input id="facilityPhone" name="phone" type="tel" required/></div>
    <div className="grid gap-2"><Label htmlFor="roleNeeded">Role needed</Label><Input id="roleNeeded" name="roleNeeded" placeholder="RN, LVN, CNA…" required/></div><div className="grid gap-2"><Label htmlFor="location">Work location</Label><Input id="location" name="location" placeholder="City, state" required/></div>
    <div className="grid gap-2"><Label htmlFor="startDate">Target start date</Label><Input id="startDate" name="startDate" type="date" required/></div><div className="grid gap-2"><Label htmlFor="openings">Number of openings</Label><Input id="openings" name="openings" type="number" min="1" max="500" required/></div>
    <div className="grid gap-2 sm:col-span-2"><Label htmlFor="notes">Schedule, experience, and other requirements</Label><Textarea id="notes" name="notes" rows={5}/></div>
    {error && <p className="text-sm font-semibold text-red-600 sm:col-span-2" role="alert">{error}</p>}<Button disabled={status === "sending"} className="h-12 rounded-xl bg-[#e5a327] text-slate-950 hover:bg-[#f0b33b] sm:col-span-2">{status === "sending" ? "Sending…" : "Request qualified staff"}</Button>
  </form>;
}
