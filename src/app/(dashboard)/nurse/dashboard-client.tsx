"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText, Briefcase, Heart, Bell, Calendar, ArrowRight, CheckCircle, AlertCircle, Clock,
} from "lucide-react";
import { formatDate, formatDateTime, getInitials, getStatusColor } from "@/lib/utils";

interface Props {
  user: any;
  nurseProfile: any;
  recentApplications: any[];
  upcomingInterviews: any[];
  stats: {
    totalApplications: number;
    activeApplications: number;
    offersReceived: number;
    savedJobs: number;
    unreadNotifications: number;
  };
}

export function NurseDashboardClient({ user, nurseProfile, recentApplications, upcomingInterviews, stats }: Props) {
  const profileCompleteness = nurseProfile?.profileComplete
    ? 100
    : nurseProfile
    ? Math.round(
        ((nurseProfile.bio ? 1 : 0) +
          (nurseProfile.specializations?.length ? 1 : 0) +
          (nurseProfile.yearsOfExperience ? 1 : 0) +
          (nurseProfile.certifications?.length ? 1 : 0) +
          (nurseProfile.workExperiences?.length ? 1 : 0)) *
          20
      )
    : 0;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Welcome back, {user.name?.split(" ")[0]}! 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your job search.</p>
      </motion.div>

      {/* Profile completion alert */}
      {profileCompleteness < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200"
        >
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-yellow-900">Complete your profile ({profileCompleteness}%)</p>
            <p className="text-sm text-yellow-700 mt-0.5">
              A complete profile gets 5x more visibility to facilities.
            </p>
          </div>
          <Button size="sm" asChild variant="outline" className="border-yellow-400 text-yellow-800">
            <Link href="/nurse/profile">Complete Now</Link>
          </Button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Applications" value={stats.totalApplications} icon={FileText} color="brand" />
        <StatsCard title="Active Applications" value={stats.activeApplications} icon={Clock} color="teal" />
        <StatsCard title="Offers Received" value={stats.offersReceived} icon={CheckCircle} color="green" />
        <StatsCard title="Saved Jobs" value={stats.savedJobs} icon={Heart} color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/nurse/applications" className="text-brand-600 gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <Briefcase className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-medium text-muted-foreground">No applications yet</p>
                <p className="text-sm text-muted-foreground mt-1">Browse jobs and start applying</p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/nurse/jobs">Find Jobs</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center gap-3 px-6 py-4 hover:bg-muted/30 transition-colors">
                    <Avatar className="h-9 w-9 bg-brand-100">
                      <AvatarFallback className="bg-brand-50 text-brand-700 text-xs">
                        {getInitials(app.job.facility.facilityName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{app.job.title}</p>
                      <p className="text-xs text-muted-foreground">{app.job.facility.facilityName} · {formatDate(app.appliedAt)}</p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-600" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No interviews scheduled</p>
              </div>
            ) : (
              upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-3 rounded-lg bg-brand-50 border border-brand-100">
                  <p className="font-medium text-sm">{interview.application.job.title}</p>
                  <p className="text-xs text-muted-foreground">{interview.application.job.facility.facilityName}</p>
                  <p className="text-xs text-brand-700 font-medium mt-2">
                    {formatDateTime(interview.scheduledAt)}
                  </p>
                  {interview.meetingLink && (
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" asChild>
                      <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                        Join Meeting
                      </a>
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
