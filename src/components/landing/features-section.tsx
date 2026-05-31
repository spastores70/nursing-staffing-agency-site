"use client";

import { motion } from "framer-motion";
import {
  Search, FileText, Calendar, BarChart3, Shield, Bell, CreditCard, Users,
} from "lucide-react";

const nurseFeatures = [
  { icon: FileText, title: "Smart Profile", description: "Showcase your certifications, experience, and specializations with a professional profile." },
  { icon: Search, title: "Job Matching", description: "AI-powered job recommendations based on your skills, location, and preferences." },
  { icon: Bell, title: "Instant Alerts", description: "Get notified immediately when matching jobs are posted or your application updates." },
  { icon: Calendar, title: "Interview Scheduling", description: "Seamless interview scheduling with calendar integration and video call links." },
];

const facilityFeatures = [
  { icon: Users, title: "Nurse Search", description: "Filter thousands of verified nurses by specialty, location, experience, and availability." },
  { icon: BarChart3, title: "ATS Dashboard", description: "Full applicant tracking from application review to offer management." },
  { icon: CreditCard, title: "Flexible Plans", description: "Scale your hiring with plans designed for any facility size." },
  { icon: Shield, title: "Verified Credentials", description: "All nurse licenses and certifications are verified before they can apply." },
];

function FeatureCard({ icon: Icon, title, description }: { icon: React.ComponentType<{className?: string}>; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex gap-4 p-6 rounded-xl border bg-card card-hover"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
        <Icon className="h-5 w-5 text-brand-600" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Everything You Need
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Built for Healthcare Professionals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Whether you&apos;re a nurse looking for your next opportunity or a facility building your dream team, NurseConnect has the tools to make it happen.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Nurse Features */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold">For Nurses</h3>
            </div>
            <div className="space-y-4">
              {nurseFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>

          {/* Facility Features */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold">For Facilities</h3>
            </div>
            <div className="space-y-4">
              {facilityFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Building2({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
    </svg>
  );
}
