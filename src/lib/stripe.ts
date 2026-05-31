import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

export const PLANS = {
  FACILITY_BASIC: {
    name: "Facility Basic",
    monthlyPriceId: process.env.STRIPE_FACILITY_MONTHLY_PRICE_ID!,
    annualPriceId: process.env.STRIPE_FACILITY_ANNUAL_PRICE_ID!,
    monthlyPrice: 299,
    annualPrice: 2990,
    features: [
      "Up to 10 active job postings",
      "Search nurse profiles",
      "Basic applicant tracking",
      "Email support",
    ],
    jobPostLimit: 10,
  },
  FACILITY_PRO: {
    name: "Facility Pro",
    monthlyPriceId: process.env.STRIPE_FACILITY_MONTHLY_PRICE_ID!,
    annualPriceId: process.env.STRIPE_FACILITY_ANNUAL_PRICE_ID!,
    monthlyPrice: 599,
    annualPrice: 5990,
    features: [
      "Unlimited job postings",
      "Advanced nurse search with filters",
      "ATS with scheduling",
      "Analytics dashboard",
      "Priority support",
      "Invoice management",
    ],
    jobPostLimit: -1,
  },
  NURSE_PRO: {
    name: "Nurse Pro",
    monthlyPriceId: process.env.STRIPE_NURSE_PRO_MONTHLY_PRICE_ID!,
    monthlyPrice: 29,
    annualPrice: 290,
    features: [
      "Featured profile listing",
      "Advanced job alerts",
      "Application analytics",
      "Resume builder",
      "Priority visibility",
    ],
  },
} as const;

export async function createStripeCustomer(email: string, name: string) {
  return stripe.customers.create({ email, name });
}

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata,
}: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    subscription_data: {
      trial_period_days: 14,
      metadata,
    },
  });
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

export async function constructWebhookEvent(body: string, signature: string) {
  return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
}
