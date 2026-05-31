"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatSalaryRange, formatJobType, getStatusColor } from "@/lib/utils";
import { Plus, Eye, Edit, Pause, Play, Trash2, Users, MapPin, DollarSign } from "lucide-react";
import Link from "next/link";

export function FacilityJobsClient({ jobs, facilityId }: { jobs: any[]; facilityId: string }) {
  const router = useRouter();
  const [localJobs, setLocalJobs] = useState(jobs);
  const [loading, setLoading] = useState<string | null>(null);

  async function toggleJobStatus(job: any) {
    const newStatus = job.status === "OPEN" ? "PAUSED" : "OPEN";
    setLoading(job.id);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLocalJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
        toast({ title: `Job ${newStatus === "OPEN" ? "activated" : "paused"}`, variant: "success" });
      }
    } finally {
      setLoading(null);
    }
  }

  async function deleteJob(jobId: string) {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    setLoading(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) {
        setLocalJobs((prev) => prev.filter((j) => j.id !== jobId));
        toast({ title: "Job deleted", variant: "success" });
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground mt-1">{localJobs.length} total postings</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/facility/jobs/new"><Plus className="h-4 w-4" />Post New Job</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {localJobs.map((job, i) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.city}, {job.state}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryUnit)}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{job._count.applications} applicants</span>
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{formatJobType(job.jobType)}</Badge>
                      <Badge variant="outline">{job.shiftType}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/facility/applications?jobId=${job.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleJobStatus(job)}
                      loading={loading === job.id}
                    >
                      {job.status === "OPEN"
                        ? <><Pause className="h-3.5 w-3.5 mr-1" />Pause</>
                        : <><Play className="h-3.5 w-3.5 mr-1" />Activate</>
                      }
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteJob(job.id)}
                      loading={loading === job.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {localJobs.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-xl">
            <Plus className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">No jobs posted yet</p>
            <Button asChild className="mt-4">
              <Link href="/facility/jobs/new">Post Your First Job</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
