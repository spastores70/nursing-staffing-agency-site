"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson, RN",
    role: "ICU Nurse, New York",
    quote: "NurseConnect helped me find my dream ICU position within 2 weeks. The application tracking and interview scheduling features saved me so much time.",
    rating: 5,
    avatar: "SJ",
    color: "bg-teal-500",
  },
  {
    name: "Dr. Michael Roberts",
    role: "HR Director, City Medical Center",
    quote: "We filled 5 nursing positions in one month using NurseConnect. The quality of candidates and the ATS tools are far superior to other platforms.",
    rating: 5,
    avatar: "MR",
    color: "bg-brand-500",
  },
  {
    name: "Emily Chen, LPN",
    role: "Travel Nurse, California",
    quote: "As a travel nurse, I need to find new positions quickly. NurseConnect's job matching and quick-apply features are exactly what I needed.",
    rating: 5,
    avatar: "EC",
    color: "bg-purple-500",
  },
  {
    name: "Patricia Williams",
    role: "CNO, Sunshine Care Home",
    quote: "The nurse verification system gives us confidence that every candidate we interview has valid credentials. Excellent platform for long-term care facilities.",
    rating: 5,
    avatar: "PW",
    color: "bg-orange-500",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Success Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            Loved by Healthcare Professionals
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card p-6 card-hover"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-muted-foreground mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
