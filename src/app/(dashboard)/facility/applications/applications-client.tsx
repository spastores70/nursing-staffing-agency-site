"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatDateTime, getInitials, getStatusColor, timeAgo } from "@/lib/utils";
import { User, Award, Calendar, MessageSquare, Check, X, Clock, Video } from "lucide-react";

const STATUSES = ["PENDING", "REVIEWED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "OFFERED", "ACCEPTED", "REJECTED"];

export function FacilityApplicationsClient({ applications }: { applications: any[] }) {
  const [localApps, setLocalApps] = useState(applications);
  const [selected, setSelected] = useState<any>(null);
  const [tab, setTab] = useState("PENDING");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [interview, setInterview] = useState({ scheduledAt: "", type: "VIDEO", duration: 60, meetingLink: "", notes: "" });
  const [updating, setUpdating] = useState(false);

  const filtered = tab === "ALL" ? localApps : localApps.filter((a) => a.status === tab);

  async function updateStatus(appId: string, status: string, notes?: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        setLocalApps((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
        if (selected?.id === appId) setSelected((p: any) => ({ ...p, status }));
        toast({ title: "Status updated", variant: "success" });
      }
    } finally {
      setUpdating(false);
    }
  }

  async function scheduleInterview() {
    if (!selected || !interview.scheduledAt) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: selected.id, ...interview }),
      });
      if (res.ok) {
        const data = await res.json();
        setLocalApps((prev) => prev.map((a) => a.id === selected.id
          ? { ...a, status: "INTERVIEW_SCHEDULED", interviews: [...a.interviews, data.data] }
          : a
        ));
        toast({ title: "Interview scheduled!", variant: "success" });
        setScheduleOpen(false);
      }
    } finally {
      setUpdating(false);
    }
  }

  const counts: Record<string, number> = {};
  for (const a of applications) counts[a.status] = (counts[a.status] || 0) + 1;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-muted-foreground mt-1">{applications.length} total applications</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="ALL">All ({applications.length})</TabsTrigger>
          {STATUSES.slice(0, 4).map((s) => (
            <TabsTrigger key={s} value={s}>{s.replace(/_/g, " ")} {counts[s] ? `(${counts[s]})` : ""}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="space-y-3">
            {filtered.map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="cursor-pointer card-hover" onClick={() => setSelected(app)}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-teal-50 text-teal-700 font-semibold">
                          {getInitials(app.nurseProfile.user.name || "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">{app.nurseProfile.user.name}</p>
                            <p className="text-sm text-muted-foreground">{app.job.title} · Applied {timeAgo(app.appliedAt)}</p>
                          </div>
                          <Badge className={getStatusColor(app.status)}>{app.status.replace(/_/g, " ")}</Badge>
                        </div>
                        <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{app.nurseProfile.yearsOfExperience}y experience</span>
                          <span>·</span>
                          <span>{app.nurseProfile.certifications.filter((c: any) => c.isVerified).length} verified certs</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed rounded-xl">
                <User className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No applications in this category</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-teal-50 text-teal-700 text-sm">
                      {getInitials(selected.nurseProfile.user.name || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{selected.nurseProfile.user.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selected.job.title}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(selected.status)}>{selected.status.replace(/_/g, " ")}</Badge>
                  <p className="text-sm text-muted-foreground">Applied {formatDate(selected.appliedAt)}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-medium">{selected.nurseProfile.yearsOfExperience} years</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{selected.nurseProfile.user.email}</p>
                  </div>
                </div>

                {selected.nurseProfile.certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-1"><Award className="h-4 w-4" />Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.nurseProfile.certifications.map((cert: any) => (
                        <Badge key={cert.name} variant={cert.isVerified ? "success" : "secondary"}>
                          {cert.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selected.coverLetter && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Cover Letter</p>
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{selected.coverLetter}</p>
                  </div>
                )}

                {selected.interviews.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Interviews</p>
                    {selected.interviews.map((iv: any) => (
                      <div key={iv.id} className="border rounded-lg p-3">
                        <p className="text-sm font-medium">{iv.type} · {formatDateTime(iv.scheduledAt)}</p>
                        {iv.meetingLink && <p className="text-xs text-brand-600 mt-1">{iv.meetingLink}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {selected.status === "PENDING" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "SHORTLISTED")} loading={updating}>
                      <Check className="h-3.5 w-3.5 mr-1" />Shortlist
                    </Button>
                  )}
                  {["PENDING", "REVIEWED", "SHORTLISTED"].includes(selected.status) && (
                    <Button size="sm" onClick={() => setScheduleOpen(true)}>
                      <Calendar className="h-3.5 w-3.5 mr-1" />Schedule Interview
                    </Button>
                  )}
                  {selected.status === "INTERVIEW_SCHEDULED" && (
                    <Button size="sm" variant="success" onClick={() => updateStatus(selected.id, "OFFERED")} loading={updating}>
                      <Check className="h-3.5 w-3.5 mr-1" />Make Offer
                    </Button>
                  )}
                  {!["REJECTED", "WITHDRAWN", "ACCEPTED"].includes(selected.status) && (
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => updateStatus(selected.id, "REJECTED")} loading={updating}>
                      <X className="h-3.5 w-3.5 mr-1" />Reject
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date & Time *</Label>
              <Input type="datetime-local" value={interview.scheduledAt} onChange={(e) => setInterview((p) => ({ ...p, scheduledAt: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={interview.type} onValueChange={(v) => setInterview((p) => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video Call</SelectItem>
                    <SelectItem value="PHONE">Phone Call</SelectItem>
                    <SelectItem value="IN_PERSON">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input type="number" value={interview.duration} onChange={(e) => setInterview((p) => ({ ...p, duration: +e.target.value }))} />
              </div>
            </div>
            {interview.type === "VIDEO" && (
              <div className="space-y-2">
                <Label>Meeting Link</Label>
                <Input placeholder="https://meet.google.com/..." value={interview.meetingLink} onChange={(e) => setInterview((p) => ({ ...p, meetingLink: e.target.value }))} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Notes for Candidate</Label>
              <Textarea placeholder="Please have your nursing license ready..." className="h-20" value={interview.notes} onChange={(e) => setInterview((p) => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={scheduleInterview} loading={updating}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
