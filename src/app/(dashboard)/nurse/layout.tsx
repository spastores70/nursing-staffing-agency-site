"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import {
  LayoutDashboard, User, FileText, Briefcase, Heart, Bell, Settings, Award,
} from "lucide-react";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/nurse", icon: LayoutDashboard },
  { label: "My Profile", href: "/nurse/profile", icon: User },
  { label: "Certifications", href: "/nurse/certifications", icon: Award },
  { label: "Find Jobs", href: "/nurse/jobs", icon: Briefcase },
  { label: "My Applications", href: "/nurse/applications", icon: FileText },
  { label: "Saved Jobs", href: "/nurse/saved", icon: Heart },
  { label: "Notifications", href: "/nurse/notifications", icon: Bell },
  { label: "Settings", href: "/nurse/settings", icon: Settings },
];

export default function NurseLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        navItems={navItems}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
