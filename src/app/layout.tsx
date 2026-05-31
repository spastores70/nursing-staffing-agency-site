import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NurseConnect — Healthcare Staffing Platform",
    template: "%s | NurseConnect",
  },
  description:
    "Connect skilled nurses with top healthcare facilities. Find nursing jobs, post openings, and streamline your healthcare staffing process.",
  keywords: ["nursing jobs", "healthcare staffing", "nurse recruitment", "hospital jobs", "RN jobs"],
  authors: [{ name: "NurseConnect" }],
  creator: "NurseConnect",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "NurseConnect",
    title: "NurseConnect — Healthcare Staffing Platform",
    description: "Connect skilled nurses with top healthcare facilities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NurseConnect",
    description: "Connect skilled nurses with top healthcare facilities.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
