"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-600 to-teal-600">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Staffing?
          </h2>
          <p className="text-brand-100 text-lg mb-10">
            Join thousands of nurses and facilities already using NurseConnect. Start your 14-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-brand-900 hover:bg-brand-50 h-12 px-8">
              <Link href="/register?role=NURSE">
                I&apos;m a Nurse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/40 text-white hover:bg-white/10 h-12 px-8">
              <Link href="/register?role=FACILITY">
                I&apos;m a Facility
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
