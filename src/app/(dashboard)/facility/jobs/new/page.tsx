"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jobSchema, type JobInput } from "@/lib/validators";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

const SPECIALIZATIONS = ["ICU", "Emergency Medicine", "Pediatrics", "Oncology", "Cardiology", "Geriatrics", "Mental Health", "Surgery", "OB/GYN", "Trauma", "NICU", "Med-Surg", "Home Health"];
const BENEFITS = ["Health Insurance", "Dental & Vision", "401(k)", "PTO", "Sign-on Bonus", "Relocation Assistance", "Tuition Reimbursement", "Free Parking", "Shift Differentials", "Student Loan Repayment"];

export default function NewJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: { jobType: "FULL_TIME", shiftType: "DAY", salaryUnit: "YEAR", positions: 1 },
  });

  function toggleSpec(spec: string) {
    setSelectedSpecs((prev) => prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]);
  }
  function toggleBenefit(b: string) {
    setSelectedBenefits((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  }

  async function onSubmit(data: JobInput) {
    if (selectedSpecs.length === 0) {
      toast({ title: "Select at least one specialization", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, specializations: selectedSpecs, benefits: selectedBenefits }),
      });
      const json = await res.json();
      if (res.ok) {
        toast({ title: "Job posted successfully!", variant: "success" });
        router.push("/facility/jobs");
      } else {
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild><Link href="/facility/jobs"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-bold">Post New Job</h1>
          <p className="text-muted-foreground mt-0.5">Fill in the details for your job posting</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input placeholder="e.g. ICU Registered Nurse" error={errors.title?.message} {...register("title")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Type *</Label>
                <Select defaultValue="FULL_TIME" onValueChange={(v) => setValue("jobType", v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["FULL_TIME", "PART_TIME", "CONTRACT", "PER_DIEM", "TRAVEL"].map((t) => (
                      <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Shift Type *</Label>
                <Select defaultValue="DAY" onValueChange={(v) => setValue("shiftType", v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["DAY", "EVENING", "NIGHT", "ROTATING", "WEEKEND"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input placeholder="New York" error={errors.city?.message} {...register("city")} />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input placeholder="NY" error={errors.state?.message} {...register("state")} />
              </div>
              <div className="space-y-2">
                <Label>Open Positions</Label>
                <Input type="number" min={1} {...register("positions", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Min Salary</Label>
                <Input type="number" placeholder="80000" {...register("salaryMin", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Max Salary</Label>
                <Input type="number" placeholder="120000" {...register("salaryMax", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Per</Label>
                <Select defaultValue="YEAR" onValueChange={(v) => setValue("salaryUnit", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["HOUR", "DAY", "WEEK", "MONTH", "YEAR"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Job Description *</Label>
              <Textarea placeholder="Describe the position, unit, and what makes your facility a great place to work..." className="h-32" error={errors.description?.message} {...register("description")} />
            </div>
            <div className="space-y-2">
              <Label>Requirements *</Label>
              <Textarea placeholder="• Active RN license&#10;• Minimum 2 years experience&#10;• BLS/ACLS required..." className="h-28" error={errors.requirements?.message} {...register("requirements")} />
            </div>
            <div className="space-y-2">
              <Label>Responsibilities *</Label>
              <Textarea placeholder="• Assess and monitor patients&#10;• Administer medications..." className="h-28" error={errors.responsibilities?.message} {...register("responsibilities")} />
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader><CardTitle>Required Specializations</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <button key={spec} type="button" onClick={() => toggleSpec(spec)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedSpecs.includes(spec) ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground hover:bg-brand-50 hover:text-brand-700"}`}>
                  {spec}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader><CardTitle>Benefits & Perks</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {BENEFITS.map((b) => (
                <button key={b} type="button" onClick={() => toggleBenefit(b)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedBenefits.includes(b) ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground hover:bg-teal-50 hover:text-teal-700"}`}>
                  {b}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={isLoading}>Post Job</Button>
        </div>
      </form>
    </div>
  );
}
