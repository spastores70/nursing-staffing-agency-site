"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Nurse Free",
    price: 0,
    period: "forever",
    description: "For nurses just starting out",
    features: [
      "Create professional profile",
      "Upload certifications",
      "Apply to unlimited jobs",
      "Track applications",
      "Basic job alerts",
    ],
    cta: "Sign Up Free",
    href: "/register?role=NURSE",
    popular: false,
    color: "border-border",
  },
  {
    name: "Nurse Pro",
    price: 29,
    period: "month",
    description: "For nurses serious about their career",
    features: [
      "Everything in Free",
      "Featured profile listing",
      "Advanced job matching",
      "Priority in search results",
      "Application analytics",
      "Resume builder tool",
      "Salary insights",
    ],
    cta: "Start Free Trial",
    href: "/register?role=NURSE&plan=pro",
    popular: false,
    color: "border-teal-500",
  },
  {
    name: "Facility Basic",
    price: 299,
    period: "month",
    description: "For growing healthcare facilities",
    features: [
      "Up to 10 active jobs",
      "Search nurse profiles",
      "Basic ATS",
      "Interview scheduling",
      "Email support",
      "14-day free trial",
    ],
    cta: "Start Free Trial",
    href: "/register?role=FACILITY&plan=basic",
    popular: false,
    color: "border-border",
  },
  {
    name: "Facility Pro",
    price: 599,
    period: "month",
    description: "For high-volume hiring teams",
    features: [
      "Unlimited job postings",
      "Advanced nurse search",
      "Full ATS with pipeline",
      "Analytics dashboard",
      "Invoice management",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    cta: "Start Free Trial",
    href: "/register?role=FACILITY&plan=pro",
    popular: true,
    color: "border-brand-500",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Transparent Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Plans for Every Stage
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground"
          >
            All plans include a 14-day free trial. No credit card required.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl bg-white border-2 p-6 flex flex-col",
                plan.color,
                plan.popular && "shadow-xl"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  "w-full",
                  plan.popular
                    ? "bg-brand-600 hover:bg-brand-700 text-white"
                    : "variant-outline"
                )}
                variant={plan.popular ? "default" : "outline"}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
