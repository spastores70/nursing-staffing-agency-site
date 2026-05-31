"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, FileCheck, Handshake } from "lucide-react";

const nurseSteps = [
  { icon: UserPlus, step: "01", title: "Create Your Profile", description: "Sign up and build a comprehensive nursing profile with your licenses, certifications, and experience." },
  { icon: Search, step: "02", title: "Browse & Apply", description: "Search thousands of job postings filtered by location, specialty, and shift type. Apply in one click." },
  { icon: FileCheck, step: "03", title: "Track Progress", description: "Monitor your applications, get status updates, and manage interview schedules." },
  { icon: Handshake, step: "04", title: "Get Hired", description: "Receive and accept offers directly through the platform. Start your new role with confidence." },
];

const facilitySteps = [
  { icon: UserPlus, step: "01", title: "Register & Verify", description: "Create your facility account and get verified by our team within 24 hours." },
  { icon: FileCheck, step: "02", title: "Post Jobs", description: "Create detailed job listings with requirements, shifts, salary, and benefits." },
  { icon: Search, step: "03", title: "Find Nurses", description: "Search our verified nurse database or let matching candidates come to you." },
  { icon: Handshake, step: "04", title: "Hire with Ease", description: "Schedule interviews, extend offers, and onboard your new nursing staff seamlessly." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Simple Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How NurseConnect Works
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-xl font-bold text-teal-700 mb-8 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">N</span>
              For Nurses
            </h3>
            <div className="space-y-6">
              {nurseSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-teal-600">{step.step}</span>
                      <h4 className="font-semibold">{step.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-brand-700 mb-8 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">F</span>
              For Facilities
            </h3>
            <div className="space-y-6">
              {facilitySteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-brand-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-brand-600">{step.step}</span>
                      <h4 className="font-semibold">{step.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
