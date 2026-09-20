import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NurseConnect | Healthcare Staffing, Without the Guesswork",
  description: "Connect qualified nurses with healthcare facilities, search transparent opportunities, and manage the staffing process in one place.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
