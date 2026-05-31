"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Building2, Briefcase, CreditCard, ShieldCheck, ArrowRight, DollarSign, BarChart3 } from "lucide-react";
import { formatCurrency, formatDate, getInitials, getStatusColor, timeAgo } from "@/lib/utils";

interface Props {
  stats: {
    totalUsers: number;
    totalNurses: number;
    totalFacilities: number;
    pendingApprovals: number;
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    monthlyRevenue: number;
  };
  recentUsers: any[];
  recentPayments: any[];
}

export function AdminDashboardClient({ stats, recentUsers, recentPayments }: Props) {
  return (
    <div className="space-y-6 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </motion.div>

      {/* Pending Approvals Alert */}
      {stats.pendingApprovals > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">{stats.pendingApprovals} accounts awaiting approval</p>
              <p className="text-sm text-yellow-700">Review and approve new user registrations</p>
            </div>
          </div>
          <Button size="sm" asChild className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <Link href="/admin/approvals">Review Now</Link>
          </Button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} color="brand" trend={12} />
        <StatsCard title="Total Nurses" value={stats.totalNurses} icon={Users} color="teal" trend={8} />
        <StatsCard title="Facilities" value={stats.totalFacilities} icon={Building2} color="purple" trend={5} />
        <StatsCard title="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={DollarSign} color="green" trend={18} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Jobs" value={stats.activeJobs} icon={Briefcase} color="brand" />
        <StatsCard title="Total Jobs" value={stats.totalJobs} icon={Briefcase} color="orange" />
        <StatsCard title="Applications" value={stats.totalApplications} icon={BarChart3} color="teal" />
        <StatsCard title="Pending Approvals" value={stats.pendingApprovals} icon={ShieldCheck} color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Recent Registrations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users" className="text-brand-600 gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-6 py-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-brand-50 text-brand-700 text-xs">
                      {getInitials(user.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.role} · {timeAgo(user.createdAt)}</p>
                  </div>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Recent Payments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/revenue" className="text-brand-600 gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentPayments.length === 0 ? (
              <div className="text-center py-10">
                <CreditCard className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No payments yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium">{payment.description || "Subscription Payment"}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(payment.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                      <Badge className={getStatusColor(payment.status)} variant="outline">{payment.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
