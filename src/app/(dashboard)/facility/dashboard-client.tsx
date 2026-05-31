"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, FileText, Calendar, Users, ArrowRight, Plus } from "lucide-react";
import { formatDate, getInitials, getStatusColor, timeAgo } from "@/lib/utils";

interface Props {
  facilityProfile: any;
  stats: { activeJobs: number; totalApplications: number; newApplications: number; scheduledInterviews: number };
  recentApplications: any[];
  user: any;
}

export function FacilityDashboardClient({ facilityProfile, stats, recentApplications, user }: Props) {
  return (
    <div className="space-y-6 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {facilityProfile.facilityName}! 🏥</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your staffing overview.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/facility/jobs/new"><Plus className="h-4 w-4" />Post a Job</Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Jobs" value={stats.activeJobs} icon={Briefcase} color="brand" />
        <StatsCard title="Total Applications" value={stats.totalApplications} icon={FileText} color="teal" />
        <StatsCard title="New Applications" value={stats.newApplications} description="Awaiting review" icon={Users} color="orange" />
        <StatsCard title="Upcoming Interviews" value={stats.scheduledInterviews} icon={Calendar} color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/facility/applications" className="text-brand-600 gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentApplications.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">No applications yet</p>
                <Button asChild size="sm" className="mt-4"><Link href="/facility/jobs/new">Post Your First Job</Link></Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentApplications.map((app) => (
                  <Link key={app.id} href={`/facility/applications?id=${app.id}`}>
                    <div className="flex items-center gap-3 px-6 py-4 hover:bg-muted/30 transition-colors">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-teal-50 text-teal-700 text-xs">
                          {getInitials(app.nurseProfile.user.name || "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{app.nurseProfile.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{app.job.title} · {timeAgo(app.appliedAt)}</p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>{app.status.replace(/_/g, " ")}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Post New Job", href: "/facility/jobs/new", icon: Plus, color: "text-brand-600 bg-brand-50" },
              { label: "Search Nurses", href: "/facility/nurses", icon: Users, color: "text-teal-600 bg-teal-50" },
              { label: "View Applications", href: "/facility/applications", icon: FileText, color: "text-orange-600 bg-orange-50" },
              { label: "Manage Interviews", href: "/facility/interviews", icon: Calendar, color: "text-purple-600 bg-purple-50" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
