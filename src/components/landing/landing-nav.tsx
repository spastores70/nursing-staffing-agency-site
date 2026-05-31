"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/nurses", label: "Find Nurses" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How It Works" },
];

export function LandingNav() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const dashboardHref =
    session?.user.role === "ADMIN"
      ? "/admin"
      : session?.user.role === "FACILITY"
      ? "/facility"
      : "/nurse";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b" : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-teal-600">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="text-gradient">NurseConnect</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Button asChild>
              <Link href={dashboardHref}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-brand-600 to-brand-700">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t">
                {session ? (
                  <Button asChild>
                    <Link href={dashboardHref}>Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Get Started Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
