"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FacilityRequestForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const saved = JSON.parse(localStorage.getItem("nurseconnect_facility_requests") || "[]") as Array<Record<string, unknown>>;
      saved.unshift({ ...payload, id: crypto.randomUUID(), openings: Number(payload.openings), status: "Saved", createdAt: new Date().toISOString() });
      localStorage.setItem("nurseconnect_facility_requests", JSON.stringify(saved));
      form.reset();
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Request failed");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center"><CheckCircle2 className="mx-auto size-12 text-emerald-700"/><h2 className="mt-4 text-2xl font-black">Staffing request saved</h2><p className="mt-3 leading-7 text-slate-600">The request is saved on this device and now appears in your dashboard.</p><Button onClick={() => setStatus("idle")} variant="outline" className="mt-6 rounded-xl">Save another request</Button></div>;
  }

  const fieldClass = "relative z-10 pointer-events-auto bg-white text-slate-950 touch-auto select-text";

  return <form onSubmit={submit} className="relative z-10 grid pointer-events-auto gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:grid-cols-2 sm:p-8">
    <div className="grid gap-2 sm:col-span-2"><h2 className="text-2xl font-black tracking-tight">Tell us what coverage you need</h2><p className="text-sm text-slate-600">One role per request. Add shift and license details in the last box.</p></div>

    <div className="grid gap-2"><Label htmlFor="facilityName">Facility name</Label><Input className={fieldClass} id="facilityName" name="facilityName" placeholder="Cypress Ridge Care Center" autoComplete="organization" required/></div>
    <div className="grid gap-2"><Label htmlFor="contactName">Contact person</Label><Input className={fieldClass} id="contactName" name="contactName" placeholder="Maria Santos, HR Director" autoComplete="name" required/></div>

    <div className="grid gap-2"><Label htmlFor="facilityEmail">Work email</Label><Input className={fieldClass} id="facilityEmail" name="email" type="email" placeholder="hiring@facility.com" autoComplete="email" required/></div>
    <div className="grid gap-2"><Label htmlFor="facilityPhone">Contact phone</Label><Input className={fieldClass} id="facilityPhone" name="phone" type="tel" placeholder="(214) 555-0123" autoComplete="tel" required/></div>

    <div className="grid gap-2"><Label htmlFor="roleNeeded">Position needed</Label><Input className={fieldClass} id="roleNeeded" name="roleNeeded" placeholder="ICU Registered Nurse" autoComplete="off" required/></div>
    <div className="grid gap-2"><Label htmlFor="location">Work location</Label><Input className={fieldClass} id="location" name="location" placeholder="Dallas, Texas 75201" autoComplete="street-address" required/></div>

    <div className="grid gap-2"><Label htmlFor="startDate">Target start date</Label><Input className={fieldClass} id="startDate" name="startDate" type="date" required/></div>
    <div className="grid gap-2"><Label htmlFor="openings">Number of openings</Label><Input className={fieldClass} id="openings" name="openings" type="number" min="1" max="500" inputMode="numeric" placeholder="3" required/></div>

    <div className="grid gap-2 sm:col-span-2"><Label htmlFor="notes">Schedule and requirements <span className="font-normal text-slate-500">(optional)</span></Label><Textarea className={fieldClass} id="notes" name="notes" rows={5} placeholder="Night shift · Texas RN · BLS/ACLS · 2+ years ICU"/></div>

    {error && <p className="text-sm font-semibold text-red-600 sm:col-span-2" role="alert">{error}</p>}
    <Button disabled={status === "sending"} className="h-12 rounded-xl bg-[#e5a327] text-slate-950 hover:bg-[#f0b33b] sm:col-span-2">{status === "sending" ? "Saving…" : "Save staffing request"}</Button>
  </form>;
}
