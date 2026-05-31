import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { BillingClient } from "./billing-client";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const facilityProfile = await prisma.facilityProfile.findUnique({ where: { userId: session.user.id } });
  if (!facilityProfile) redirect("/facility/settings");

  const subscription = await prisma.subscription.findUnique({
    where: { facilityProfileId: facilityProfile.id },
    include: { payments: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  const invoices = await prisma.invoice.findMany({
    where: { facilityId: facilityProfile.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return <BillingClient subscription={subscription as any} invoices={invoices as any} />;
}
