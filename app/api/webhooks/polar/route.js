import { NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS } from "@/lib/plans";

function planKeyForProduct(productId) {
  return Object.keys(PLANS).find((key) => PLANS[key].polarProductId === productId) ?? null;
}

export async function POST(request) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers);

  let event;
  try {
    event = validateEvent(body, headers, process.env.POLAR_WEBHOOK_SECRET);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    throw err;
  }

  const admin = createAdminClient();

  // subscription.created fires before the first payment is confirmed, so
  // status may still be "incomplete" — .updated is what carries it to
  // "trialing"/"active" and every state change after. Syncing on both keeps
  // plan/provider_limit current regardless of which one lands first.
  if (event.type === "subscription.created" || event.type === "subscription.updated") {
    const sub = event.data;
    const orgId = sub.customer?.externalId;

    if (orgId) {
      const planKey = planKeyForProduct(sub.productId);
      const plan = planKey ? PLANS[planKey] : null;

      await admin
        .from("organizations")
        .update({
          polar_customer_id: sub.customerId,
          polar_subscription_id: sub.id,
          subscription_status: sub.status,
          trial_ends_at: sub.trialEnd,
          ...(plan ? { plan: planKey, provider_limit: plan.providerLimit } : {}),
        })
        .eq("id", orgId);
    }
  }

  // Access actually ends here (unlike .canceled, which can still be within
  // a paid period via cancel_at_period_end) — drop back to the floor limit
  // rather than leaving a stale higher one in place.
  if (event.type === "subscription.revoked") {
    const sub = event.data;
    const orgId = sub.customer?.externalId;

    if (orgId) {
      await admin
        .from("organizations")
        .update({ subscription_status: sub.status, plan: "trial", provider_limit: 3 })
        .eq("id", orgId);
    }
  }

  return NextResponse.json({ received: true });
}
