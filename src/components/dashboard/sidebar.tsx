"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
import type { NavItem } from "@/types";

interface SidebarProps {
  navItems: NavItem[];
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ navItems, mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-teal-600">
            <Heart className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-gradient">NurseConnect</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs text-white font-medium">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <aside className="relative w-64 bg-background h-full flex flex-col shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
