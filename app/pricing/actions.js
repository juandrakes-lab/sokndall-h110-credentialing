"use server";

import { redirect } from "next/navigation";
import { getCurrentOrg } from "@/lib/org";
import { PLANS } from "@/lib/plans";

export async function startCheckout(planKey) {
  const org = await getCurrentOrg();
  if (!org) redirect("/onboarding");

  const plan = PLANS[planKey];
  if (!plan) throw new Error("Unknown plan.");

  if (!process.env.POLAR_ACCESS_TOKEN) {
    throw new Error("Checkout isn't configured yet.");
  }

  // Filled in once Polar product IDs exist — see lib/polar.js.
  throw new Error("Checkout not yet implemented.");
}
