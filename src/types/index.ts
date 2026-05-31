import { UserRole, UserStatus } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      status: UserStatus;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    status: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    status: UserStatus;
    lastRefresh?: number;
  }
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Dashboard Analytics ──────────────────────────────────────────────────────

export interface AdminAnalytics {
  totalUsers: number;
  totalNurses: number;
  totalFacilities: number;
  pendingApprovals: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  userGrowthData: ChartDataPoint[];
  revenueData: ChartDataPoint[];
  topFacilities: { name: string; jobs: number }[];
}

export interface NurseAnalytics {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  profileViews: number;
  savedJobs: number;
  applicationsByStatus: { status: string; count: number }[];
}

export interface FacilityAnalytics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
  scheduledInterviews: number;
  hiredNurses: number;
  applicationsByJob: { jobTitle: string; count: number }[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

// ─── Search / Filter Types ────────────────────────────────────────────────────

export interface JobSearchParams {
  search?: string;
  city?: string;
  state?: string;
  jobType?: string;
  shiftType?: string;
  specialization?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  pageSize?: number;
}

export interface NurseSearchParams {
  search?: string;
  specialization?: string;
  city?: string;
  state?: string;
  yearsMin?: number;
  yearsMax?: number;
  available?: boolean;
  page?: number;
  pageSize?: number;
}

// ─── UI Component Types ───────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}
