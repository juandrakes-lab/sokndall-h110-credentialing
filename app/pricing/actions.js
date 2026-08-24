"use server";

import { redirect } from "next/navigation";
import { getCurrentOrg } from "@/lib/org";
import { PLANS } from "@/lib/plans";
import { createPolarClient } from "@/lib/polar";

export async function startCheckout(planKey) {
  const org = await getCurrentOrg();
  if (!org) redirect("/onboarding");

  const plan = PLANS[planKey];
  if (!plan) throw new Error("Unknown plan.");
  if (!plan.polarProductId) throw new Error("Checkout isn't configured for this plan yet.");

  const polar = createPolarClient();
  const checkout = await polar.checkouts.create({
    products: [plan.polarProductId],
    customerExternalId: org.id,
    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?checkout=success`,
  });

  redirect(checkout.url);
}

export async function openBillingPortal() {
  const org = await getCurrentOrg();
  if (!org) redirect("/onboarding");

  const polar = createPolarClient();
  const session = await polar.customerSessions.create({
    customerExternalId: org.id,
  });

  redirect(session.customerPortalUrl);
}
