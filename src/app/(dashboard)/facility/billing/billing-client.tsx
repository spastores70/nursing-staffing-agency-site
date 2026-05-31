"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { CreditCard, CheckCircle, Calendar, Download, ExternalLink } from "lucide-react";
import { PLANS } from "@/lib/stripe";

const PRICING = [
  { key: "FACILITY_BASIC", name: "Facility Basic", price: 299, features: ["10 active jobs", "Nurse search", "Basic ATS", "Email support"] },
  { key: "FACILITY_PRO", name: "Facility Pro", price: 599, features: ["Unlimited jobs", "Advanced search", "Full ATS", "Priority support", "Analytics"], popular: true },
];

export function BillingClient({ subscription, invoices }: { subscription: any; invoices: any[] }) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(plan: string) {
    setLoading(true);
    try {
      const priceId = plan === "FACILITY_PRO"
        ? process.env.NEXT_PUBLIC_STRIPE_FACILITY_PRO_PRICE_ID || "price_demo"
        : process.env.NEXT_PUBLIC_STRIPE_FACILITY_BASIC_PRICE_ID || "price_demo";

      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast({ title: "Error starting checkout", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleManageBilling() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  const isSubscribed = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your plan and payment history</p>
      </div>

      {/* Current Plan */}
      {isSubscribed ? (
        <Card className="border-brand-200 bg-brand-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-lg">
                    {subscription.plan.replace(/_/g, " ")} Plan
                  </h3>
                  <Badge variant="success">{subscription.status}</Badge>
                </div>
                {subscription.currentPeriodEnd && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Renews on {formatDate(subscription.currentPeriodEnd)}
                    {subscription.cancelAtPeriodEnd && " (cancels at end of period)"}
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={handleManageBilling} loading={loading}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Pricing plans */
        <div>
          <h2 className="text-lg font-semibold mb-4">Choose a Plan</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PRICING.map((plan) => (
              <motion.div key={plan.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={plan.popular ? "border-brand-500 shadow-lg" : ""}>
                  <CardContent className="p-6">
                    {plan.popular && <Badge className="mb-3 bg-brand-600">Most Popular</Badge>}
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-3xl font-bold my-3">${plan.price}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500" />{f}</li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"} onClick={() => handleSubscribe(plan.key)} loading={loading}>
                      Start 14-Day Free Trial
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      {subscription?.payments?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-muted-foreground">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscription.payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="px-6 py-3">{formatDate(p.createdAt)}</td>
                    <td className="px-6 py-3 font-medium">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-3"><Badge className={getStatusColor(p.status)}>{p.status}</Badge></td>
                    <td className="px-6 py-3 text-right">
                      {p.receiptUrl && (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
