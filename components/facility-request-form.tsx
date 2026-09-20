"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Guide({ id, children }: { id: string; children: React.ReactNode }) {
  return <p id={id} className="text-sm leading-5 text-slate-500">{children}</p>;
}

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

  return <form onSubmit={submit} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:grid-cols-2 sm:p-8">
    <div className="grid gap-2 sm:col-span-2"><h2 className="text-2xl font-black tracking-tight">Tell us what coverage you need</h2><p className="text-slate-600">Enter one position per request. All fields are required except additional requirements.</p></div>

    <div className="flex gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-slate-700 sm:col-span-2"><Info className="mt-0.5 size-5 shrink-0 text-[#047f83]"/><p><strong>Before you begin:</strong> use the facility’s business contact information. Include the shift, required experience, license or certification, and contract length in the final box.</p></div>

    <div className="grid gap-2"><Label htmlFor="facilityName">Facility name</Label><Input id="facilityName" name="facilityName" placeholder="Example: Cypress Ridge Care Center" aria-describedby="facilityName-guide" required/><Guide id="facilityName-guide">Enter the complete legal or commonly used facility name.</Guide></div>
    <div className="grid gap-2"><Label htmlFor="contactName">Contact person</Label><Input id="contactName" name="contactName" placeholder="Example: Maria Santos, HR Director" aria-describedby="contactName-guide" required/><Guide id="contactName-guide">Enter the name and title of the person handling staffing.</Guide></div>

    <div className="grid gap-2"><Label htmlFor="facilityEmail">Work email</Label><Input id="facilityEmail" name="email" type="email" placeholder="Example: hiring@facility.com" aria-describedby="facilityEmail-guide" required/><Guide id="facilityEmail-guide">Use an email address monitored for hiring or staffing replies.</Guide></div>
    <div className="grid gap-2"><Label htmlFor="facilityPhone">Contact phone</Label><Input id="facilityPhone" name="phone" type="tel" placeholder="Example: (214) 555-0123" aria-describedby="facilityPhone-guide" required/><Guide id="facilityPhone-guide">Include the area code and the best direct number to call.</Guide></div>

    <div className="grid gap-2"><Label htmlFor="roleNeeded">Position needed</Label><Input id="roleNeeded" name="roleNeeded" placeholder="Example: ICU Registered Nurse" aria-describedby="roleNeeded-guide" required/><Guide id="roleNeeded-guide">Be specific: RN, LVN/LPN, CNA, DON, or specialty role.</Guide></div>
    <div className="grid gap-2"><Label htmlFor="location">Work location</Label><Input id="location" name="location" placeholder="Example: Dallas, Texas 75201" aria-describedby="location-guide" required/><Guide id="location-guide">Enter the city and state; ZIP code is helpful.</Guide></div>

    <div className="grid gap-2"><Label htmlFor="startDate">Target start date</Label><Input id="startDate" name="startDate" type="date" aria-describedby="startDate-guide" required/><Guide id="startDate-guide">Choose the earliest date the selected professional should begin.</Guide></div>
    <div className="grid gap-2"><Label htmlFor="openings">Number of openings</Label><Input id="openings" name="openings" type="number" min="1" max="500" placeholder="Example: 3" aria-describedby="openings-guide" required/><Guide id="openings-guide">Enter the total number of people needed for this role.</Guide></div>

    <div className="grid gap-2 sm:col-span-2"><Label htmlFor="notes">Schedule and requirements <span className="font-normal text-slate-500">(optional)</span></Label><Textarea id="notes" name="notes" rows={6} placeholder="Example: Three 12-hour night shifts per week. Active Texas RN license, BLS and ACLS required. Minimum two years of ICU experience. Permanent full-time position with weekend rotation." aria-describedby="notes-guide"/><Guide id="notes-guide">Include shift and hours, employment type, contract length, license, certifications, experience, pay range, and any weekend or on-call expectations.</Guide></div>

    {error && <p className="text-sm font-semibold text-red-600 sm:col-span-2" role="alert">{error}</p>}
    <Button disabled={status === "sending"} className="h-12 rounded-xl bg-[#e5a327] text-slate-950 hover:bg-[#f0b33b] sm:col-span-2">{status === "sending" ? "Saving…" : "Save staffing request"}</Button>
  </form>;
}
