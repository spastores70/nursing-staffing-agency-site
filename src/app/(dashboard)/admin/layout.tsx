"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import {
  LayoutDashboard, Users, Building2, Briefcase, CreditCard, BarChart3, Settings, ShieldCheck, Bell,
} from "lucide-react";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Facilities", href: "/admin/facilities", icon: Building2 },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Revenue", href: "/admin/revenue", icon: CreditCard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Approvals", href: "/admin/approvals", icon: ShieldCheck },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
