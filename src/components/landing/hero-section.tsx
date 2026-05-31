"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

const trustPoints = [
  "10,000+ verified nurses",
  "500+ healthcare facilities",
  "HIPAA compliant",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-teal-900 pt-16 pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-brand-700/50 text-brand-200 border-brand-600 px-4 py-1.5 text-sm">
              <Star className="h-3.5 w-3.5 mr-1.5 fill-yellow-400 text-yellow-400" />
              Trusted by 500+ Healthcare Facilities
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            The Smarter Way to{" "}
            <span className="bg-gradient-to-r from-teal-300 to-brand-300 bg-clip-text text-transparent">
              Staff Nurses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-brand-200 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Connect qualified nurses with top healthcare facilities. Post jobs, search profiles,
            schedule interviews, and manage your entire staffing process in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              asChild
              className="bg-white text-brand-900 hover:bg-brand-50 text-base px-8 h-12"
            >
              <Link href="/register?role=NURSE">
                I&apos;m a Nurse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10 text-base px-8 h-12"
            >
              <Link href="/register?role=FACILITY">
                I&apos;m a Facility
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2 text-brand-200 text-sm">
                <CheckCircle className="h-4 w-4 text-teal-400 flex-shrink-0" />
                {point}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero image placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Active Jobs", value: "2,400+", color: "bg-brand-500" },
                { label: "Nurses Hired", value: "8,900+", color: "bg-teal-500" },
                { label: "Avg Time to Hire", value: "4.2 days", color: "bg-purple-500" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className={`w-2 h-2 rounded-full ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-brand-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
