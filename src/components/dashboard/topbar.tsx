"use client";

import { useSession } from "next-auth/react";
import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

interface TopbarProps {
  title?: string;
  onMenuClick?: () => void;
  notificationCount?: number;
}

export function Topbar({ title, onMenuClick, notificationCount = 0 }: TopbarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const settingsHref =
    user?.role === "NURSE"
      ? "/nurse/settings"
      : user?.role === "FACILITY"
      ? "/facility/settings"
      : "/admin/settings";

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center gap-4 px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {title && (
          <h1 className="text-lg font-semibold hidden md:block">{title}</h1>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <Link href={`${settingsHref.replace("/settings", "")}/notifications`}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-brand-600 text-[10px] text-white flex items-center justify-center font-medium">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href={settingsHref}>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.image || undefined} alt={user?.name || ""} />
              <AvatarFallback className="bg-brand-100 text-brand-700 text-xs font-semibold">
                {getInitials(user?.name || user?.email || "?")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
