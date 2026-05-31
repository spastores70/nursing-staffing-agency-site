"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Search, MapPin, Clock, DollarSign, Heart, Bookmark, Building2, CheckCircle, Filter,
} from "lucide-react";
import { formatSalaryRange, formatJobType, getStatusColor, timeAgo } from "@/lib/utils";

interface Props {
  jobs: any[];
  savedJobIds: string[];
  appliedJobIds: string[];
  nurseProfileId?: string;
}

export function JobsClient({ jobs, savedJobIds: initialSaved, appliedJobIds, nurseProfileId }: Props) {
  const [search, setSearch] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("ALL");
  const [shiftFilter, setShiftFilter] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set(initialSaved));
  const [isPending, startTransition] = useTransition();
  const [applying, setApplying] = useState(false);

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.facility.facilityName.toLowerCase().includes(search.toLowerCase()) ||
      job.city.toLowerCase().includes(search.toLowerCase());
    const matchesType = jobTypeFilter === "ALL" || job.jobType === jobTypeFilter;
    const matchesShift = shiftFilter === "ALL" || job.shiftType === shiftFilter;
    return matchesSearch && matchesType && matchesShift;
  });

  async function handleSaveJob(jobId: string) {
    if (!nurseProfileId) return;
    startTransition(async () => {
      const isSaved = savedJobs.has(jobId);
      const res = await fetch(`/api/jobs/${jobId}/save`, { method: isSaved ? "DELETE" : "POST" });
      if (res.ok) {
        setSavedJobs((prev) => {
          const next = new Set(prev);
          if (isSaved) next.delete(jobId);
          else next.add(jobId);
          return next;
        });
      }
    });
  }

  async function handleApply() {
    if (!selectedJob || !nurseProfileId) return;
    setApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob.id, coverLetter }),
      });
      if (res.ok) {
        toast({ title: "Applied successfully!", description: `Your application for ${selectedJob.title} has been submitted.`, variant: "success" });
        setApplyOpen(false);
        setSelectedJob(null);
        setCoverLetter("");
      } else {
        const json = await res.json();
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Find Jobs</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} jobs available</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search jobs, facilities, or locations..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="FULL_TIME">Full-Time</SelectItem>
            <SelectItem value="PART_TIME">Part-Time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="PER_DIEM">Per Diem</SelectItem>
            <SelectItem value="TRAVEL">Travel</SelectItem>
          </SelectContent>
        </Select>
        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Shifts</SelectItem>
            <SelectItem value="DAY">Day</SelectItem>
            <SelectItem value="EVENING">Evening</SelectItem>
            <SelectItem value="NIGHT">Night</SelectItem>
            <SelectItem value="ROTATING">Rotating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filtered.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="card-hover cursor-pointer" onClick={() => setSelectedJob(job)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                          {job.facility.facilityName}
                          {job.facility.isVerified && <CheckCircle className="h-3.5 w-3.5 text-brand-500" />}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSaveJob(job.id); }}
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
                        disabled={isPending}
                      >
                        <Heart className={`h-4 w-4 ${savedJobs.has(job.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />{job.city}, {job.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />{job.shiftType}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />{formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryUnit)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary">{formatJobType(job.jobType)}</Badge>
                      {job.specializations.slice(0, 2).map((s: string) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                      <span className="text-xs text-muted-foreground ml-auto">{timeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {appliedJobIds.includes(job.id) && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700 font-medium">Applied</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium text-muted-foreground">No jobs found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <Dialog open={!!selectedJob && !applyOpen} onOpenChange={(o) => !o && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedJob.facility.facilityName} · {selectedJob.city}, {selectedJob.state}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{formatJobType(selectedJob.jobType)}</Badge>
                  <Badge variant="outline">{selectedJob.shiftType}</Badge>
                  {selectedJob.specializations.map((s: string) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
                <p className="text-sm font-semibold text-green-700">
                  {formatSalaryRange(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryUnit)}
                </p>
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.requirements}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.benefits?.map((b: string) => (
                      <Badge key={b} variant="success">{b}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  {appliedJobIds.includes(selectedJob.id) ? (
                    <Button disabled className="flex-1 gap-2"><CheckCircle className="h-4 w-4" /> Already Applied</Button>
                  ) : (
                    <Button className="flex-1" onClick={() => { setApplyOpen(true); }}>Apply Now</Button>
                  )}
                  <Button variant="outline" onClick={() => handleSaveJob(selectedJob.id)}>
                    <Heart className={`h-4 w-4 ${savedJobs.has(selectedJob.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Apply Modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Apply to <strong>{selectedJob?.facility.facilityName}</strong> for the <strong>{selectedJob?.title}</strong> position.
            </p>
            <div className="space-y-2">
              <Label>Cover Letter (Optional)</Label>
              <Textarea
                placeholder="Tell the facility why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="h-32"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setApplyOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleApply} loading={applying}>Submit Application</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
