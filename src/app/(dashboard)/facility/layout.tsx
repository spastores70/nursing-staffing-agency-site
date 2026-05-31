"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import {
  LayoutDashboard, Briefcase, Users, FileText, Calendar, CreditCard, Bell, Settings, Building2,
} from "lucide-react";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/facility", icon: LayoutDashboard },
  { label: "Job Postings", href: "/facility/jobs", icon: Briefcase },
  { label: "Applications", href: "/facility/applications", icon: FileText },
  { label: "Search Nurses", href: "/facility/nurses", icon: Users },
  { label: "Interviews", href: "/facility/interviews", icon: Calendar },
  { label: "Billing", href: "/facility/billing", icon: CreditCard },
  { label: "Notifications", href: "/facility/notifications", icon: Bell },
  { label: "Settings", href: "/facility/settings", icon: Settings },
];

export default function FacilityLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
