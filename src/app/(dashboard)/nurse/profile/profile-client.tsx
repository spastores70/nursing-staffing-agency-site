"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { nurseProfileSchema, type NurseProfileInput } from "@/lib/validators";
import { toast } from "@/hooks/use-toast";
import { getInitials, formatDate } from "@/lib/utils";
import { User, Plus, X, Save, Award, Briefcase, Upload } from "lucide-react";

const SPECIALIZATIONS = [
  "ICU", "Emergency Medicine", "Pediatrics", "Oncology", "Cardiology",
  "Geriatrics", "Mental Health", "Surgery", "OB/GYN", "Trauma",
  "NICU", "Step-Down", "Med-Surg", "Home Health", "Travel Nursing",
];

export function NurseProfileClient({ user }: { user: any }) {
  const profile = user.nurseProfile;
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(profile?.specializations || []);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<NurseProfileInput>({
    resolver: zodResolver(nurseProfileSchema),
    defaultValues: {
      bio: profile?.bio || "",
      specializations: profile?.specializations || [],
      yearsOfExperience: profile?.yearsOfExperience || 0,
      education: profile?.education || "",
      currentLocation: profile?.currentLocation || "",
      willingToRelocate: profile?.willingToRelocate || false,
      expectedSalaryMin: profile?.expectedSalaryMin || undefined,
      expectedSalaryMax: profile?.expectedSalaryMax || undefined,
    },
  });

  function toggleSpec(spec: string) {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  }

  async function onSubmit(data: NurseProfileInput) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/nurses/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, specializations: selectedSpecs }),
      });
      if (res.ok) {
        toast({ title: "Profile updated!", description: "Your profile has been saved.", variant: "success" });
      } else {
        const json = await res.json();
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your nursing profile and credentials</p>
      </div>

      {/* Avatar / Basic Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-brand-100 text-brand-700 text-2xl font-bold">
                  {getInitials(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-white hover:bg-brand-700 transition-colors">
                <Upload className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              {profile?.rating > 0 && (
                <p className="text-sm text-yellow-600 font-medium mt-1">⭐ {profile.rating.toFixed(1)} ({profile.totalRatings} reviews)</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Professional Info */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-4 w-4" />Professional Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Professional Bio</Label>
              <Textarea
                placeholder="Describe your nursing background, expertise, and career goals..."
                className="h-28"
                error={errors.bio?.message}
                {...register("bio")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input type="number" min={0} max={50} error={errors.yearsOfExperience?.message} {...register("yearsOfExperience", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Education</Label>
                <Input placeholder="BSN, University of..." error={errors.education?.message} {...register("education")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Location</Label>
              <Input placeholder="New York, NY" error={errors.currentLocation?.message} {...register("currentLocation")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Expected Salary ($/yr)</Label>
                <Input type="number" placeholder="80000" {...register("expectedSalaryMin", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Max Expected Salary ($/yr)</Label>
                <Input type="number" placeholder="120000" {...register("expectedSalaryMax", { valueAsNumber: true })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader><CardTitle>Specializations</CardTitle></CardHeader>
          <CardContent>
            {errors.specializations && <p className="text-xs text-destructive mb-3">{errors.specializations.message}</p>}
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleSpec(spec)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedSpecs.includes(spec)
                      ? "bg-brand-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications list */}
        {profile?.certifications && profile.certifications.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Award className="h-4 w-4" />Certifications</CardTitle>
              <Button size="sm" variant="outline" asChild>
                <a href="/nurse/certifications"><Plus className="h-3.5 w-3.5 mr-1" />Manage</a>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.certifications.map((cert: any) => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuingBody} {cert.expiryDate && `· Expires ${formatDate(cert.expiryDate)}`}</p>
                  </div>
                  {cert.isVerified && <Badge variant="success">Verified</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Button type="submit" loading={isLoading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </form>
    </div>
  );
}
