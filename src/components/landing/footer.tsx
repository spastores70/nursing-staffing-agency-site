import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Find Jobs", href: "/jobs" },
    { label: "Find Nurses", href: "/nurses" },
    { label: "Pricing", href: "/#pricing" },
    { label: "How It Works", href: "/#how-it-works" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "HIPAA Compliance", href: "/hipaa" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "For Nurses", href: "/help/nurses" },
    { label: "For Facilities", href: "/help/facilities" },
    { label: "Status", href: "/status" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-teal-600">
                <Heart className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-gradient">NurseConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The leading healthcare staffing platform connecting skilled nurses with top facilities.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NurseConnect. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            HIPAA Compliant · SOC 2 Type II · 256-bit SSL
          </p>
        </div>
      </div>
    </footer>
  );
}
