"use client";

import { motion } from "framer-motion";
import { Users, Building2, Briefcase, Star } from "lucide-react";

const stats = [
  { icon: Users, label: "Registered Nurses", value: "10,000+", description: "Verified profiles" },
  { icon: Building2, label: "Healthcare Facilities", value: "500+", description: "Across 50 states" },
  { icon: Briefcase, label: "Jobs Posted", value: "25,000+", description: "Every month" },
  { icon: Star, label: "Satisfaction Rate", value: "98%", description: "From both sides" },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-white border-b">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-xl bg-brand-50">
                  <stat.icon className="h-6 w-6 text-brand-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="font-medium text-sm text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
