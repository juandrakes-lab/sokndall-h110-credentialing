import { planForProduct, statusFromPolar } from "@/lib/billing";
import { createPolarClient } from "@/lib/polar";

// Server-only, and only for the two route handlers that may use the
// service-role client (the Polar webhook and /api/billing/sync).

// A Polar subscription (as the SDK parses it) → cred_sync_subscription.
export async function applySubscription(admin, sub, eventType = "subscription.updated") {
  const userId = sub.customer?.externalId ?? sub.metadata?.user_id;
  const plan = planForProduct(sub.productId) ?? sub.product?.metadata?.plan ?? sub.metadata?.plan;
  if (!userId) throw new Error("subscription has no external customer id");
  if (!plan) throw new Error(`unknown product ${sub.productId}`);

  const { data, error } = await admin.rpc("cred_sync_subscription", {
    p_user_id: userId,
    p_account_name: sub.customer?.name || sub.customer?.email?.split("@")[0] || null,
    p_customer_id: sub.customerId,
    p_subscription_id: sub.id,
    p_plan: plan,
    p_status: statusFromPolar(eventType, sub.status),
    p_trial_ends_at: sub.trialEnd ?? null,
    p_current_period_end: sub.currentPeriodEnd ?? null,
    p_cancel_at_period_end: Boolean(sub.cancelAtPeriodEnd),
    p_modified_at: sub.modifiedAt ?? sub.createdAt ?? null,
  });
  if (error) throw new Error(error.message);
  return data;
}

// The fallback when a webhook is late or lost: ask Polar directly for this
// user's live subscription and apply it. Polar is the source — nothing the
// browser sends is trusted — and the ordering guard in cred_sync_subscription
// makes it safe to race with the webhook.
export async function syncFromPolar(admin, userId) {
  const polar = createPolarClient();
  const live = [];
  for await (const page of await polar.subscriptions.list({ externalCustomerId: userId, active: true })) {
    live.push(...page.result.items);
  }
  const sub = live
    .filter((s) => planForProduct(s.productId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  return sub ? applySubscription(admin, sub) : null;
}
