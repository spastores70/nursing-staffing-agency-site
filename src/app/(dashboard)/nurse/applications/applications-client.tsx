"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, formatDateTime, getInitials, getStatusColor, formatJobType, formatSalaryRange } from "@/lib/utils";
import { MapPin, Calendar, Building2, Clock, Eye, Video } from "lucide-react";

const STATUS_GROUPS: Record<string, string[]> = {
  active: ["PENDING", "REVIEWED", "SHORTLISTED", "INTERVIEW_SCHEDULED"],
  offered: ["OFFERED", "ACCEPTED"],
  closed: ["REJECTED", "WITHDRAWN"],
};

export function ApplicationsClient({ applications }: { applications: any[] }) {
  const [selected, setSelected] = useState<any>(null);
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? applications : applications.filter((a) => STATUS_GROUPS[tab]?.includes(a.status));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-muted-foreground mt-1">{applications.length} total applications</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({applications.filter((a) => STATUS_GROUPS.active.includes(a.status)).length})</TabsTrigger>
          <TabsTrigger value="offered">Offers ({applications.filter((a) => STATUS_GROUPS.offered.includes(a.status)).length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({applications.filter((a) => STATUS_GROUPS.closed.includes(a.status)).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="space-y-3">
            {filtered.map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="card-hover cursor-pointer" onClick={() => setSelected(app)}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-brand-50 text-brand-700 text-sm">
                          {getInitials(app.job.facility.facilityName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">{app.job.title}</p>
                            <p className="text-sm text-muted-foreground">{app.job.facility.facilityName}</p>
                          </div>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.job.city}, {app.job.state}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Applied {formatDate(app.appliedAt)}</span>
                          {app.interviews.length > 0 && (
                            <span className="flex items-center gap-1 text-brand-600 font-medium">
                              <Calendar className="h-3 w-3" />
                              Interview: {formatDateTime(app.interviews[0].scheduledAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">No applications in this category</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.job.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {selected.job.facility.facilityName}
                  </div>
                  <Badge className={getStatusColor(selected.status)}>
                    {selected.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Applied</p>
                    <p className="font-medium">{formatDate(selected.appliedAt)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Job Type</p>
                    <p className="font-medium">{formatJobType(selected.job.jobType)}</p>
                  </div>
                </div>

                {selected.coverLetter && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Cover Letter</p>
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">{selected.coverLetter}</p>
                  </div>
                )}

                {selected.facilityNotes && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Facility Notes</p>
                    <p className="text-sm text-blue-800">{selected.facilityNotes}</p>
                  </div>
                )}

                {selected.interviews.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Scheduled Interviews</p>
                    {selected.interviews.map((interview: any) => (
                      <div key={interview.id} className="border rounded-lg p-3 space-y-2">
                        <p className="text-sm font-medium">{interview.type} Interview</p>
                        <p className="text-sm text-muted-foreground">{formatDateTime(interview.scheduledAt)} · {interview.duration} min</p>
                        {interview.meetingLink && (
                          <Button size="sm" className="gap-2 w-full" asChild>
                            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4" /> Join Meeting
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
