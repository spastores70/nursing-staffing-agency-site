import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createCheckoutSession, createStripeCustomer } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { priceId, plan } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Get or create Stripe customer
    const subscription = await prisma.subscription.findFirst({
      where: session.user.role === "FACILITY"
        ? { facilityProfile: { userId: session.user.id } }
        : { nurseProfile: { userId: session.user.id } },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await createStripeCustomer(session.user.email!, session.user.name || "");
      customerId = customer.id;

      // Create/update subscription record
      if (session.user.role === "FACILITY") {
        const fp = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
        if (fp) {
          await prisma.subscription.upsert({
            where: { facilityProfileId: fp.id },
            update: { stripeCustomerId: customerId },
            create: { facilityProfileId: fp.id, stripeCustomerId: customerId },
          });
        }
      } else {
        const np = await prisma.nurseProfile.findUnique({ where: { userId: session.user.id } });
        if (np) {
          await prisma.subscription.upsert({
            where: { nurseProfileId: np.id },
            update: { stripeCustomerId: customerId },
            create: { nurseProfileId: np.id, stripeCustomerId: customerId },
          });
        }
      }
    }

    const checkoutSession = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${appUrl}/${session.user.role.toLowerCase()}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/${session.user.role.toLowerCase()}/billing?canceled=true`,
      metadata: { userId: session.user.id, plan },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
