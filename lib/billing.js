import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { formatDate } from "@/lib/credentials";

// Subscription → what the account may do (mirrors cred_org_writable in SQL,
// which is what actually enforces it).
export function accountAccess(org) {
  const status = org.subscription_status;
  const periodEnd = org.current_period_end ? new Date(org.current_period_end) : null;
  const date = (d) => (d ? formatDate(new Date(d).toISOString().slice(0, 10)) : null);

  // A card-free trial granted by hand (cred_start_cardless_trial): no
  // subscription yet. Read-only once it ends, until a card is added.
  if (!org.polar_subscription_id && org.trial_ends_at) {
    const left = Math.ceil((new Date(org.trial_ends_at) - Date.now()) / 86400000);
    const price = PLANS[org.plan]?.price;
    if (left <= 0) {
      return {
        writable: false,
        state: "cardless_ended",
        message: `Your free trial ended on ${date(org.trial_ends_at)}. Everything is read-only — you can still view and export all of it. Add a card in Settings → Billing to pick up where you left off ($${price}/month).`,
      };
    }
    return {
      writable: true,
      state: "cardless_trial",
      message: `Free trial, no card needed: ${left} day${left === 1 ? "" : "s"} left. To keep going, add a card in Settings → Billing before ${date(org.trial_ends_at)} — the first charge of $${price} is that day. Without a card the account turns read-only then, and nothing is charged.`,
    };
  }
  if (status === "revoked" || (status === "canceled" && (!periodEnd || periodEnd <= new Date()))) {
    return { writable: false, state: "ended", message: "Your subscription has ended. Everything is read-only — you can still view and export all of it." };
  }
  if (status === "incomplete") {
    return { writable: false, state: "incomplete", message: "Your payment hasn't gone through yet. Until it does, everything is read-only." };
  }
  if (status === "canceled" || org.cancel_at_period_end) {
    return { writable: true, state: "canceling", message: `Your subscription is canceled. Everything keeps working until ${date(org.current_period_end) ?? "the end of the period"}.` };
  }
  if (status === "past_due") {
    return { writable: true, state: "past_due", message: "Your last payment didn't go through. Update your card in Billing to keep your account active." };
  }
  if (status === "trialing") {
    return { writable: true, state: "trial", message: org.trial_ends_at ? `Free trial — your first charge is on ${date(org.trial_ends_at)}.` : "Free trial." };
  }
  return { writable: true, state: "active", message: null };
}

export function planForProduct(productId) {
  return PLAN_ORDER.find((key) => PLANS[key].polarProductId === productId) ?? null;
}

// Polar's subscription status → ours. Anything that means "no longer paying"
// becomes revoked (read-only); unknown values wait as incomplete.
export function statusFromPolar(eventType, polarStatus) {
  if (eventType === "subscription.revoked") return "revoked";
  switch (polarStatus) {
    case "trialing":
    case "active":
    case "past_due":
    case "canceled":
    case "incomplete":
      return polarStatus;
    case "incomplete_expired":
    case "unpaid":
      return "revoked";
    default:
      return "incomplete";
  }
}

// Turns a database refusal into something a person can act on.
export function friendlyWriteError(error) {
  const msg = error?.message ?? "";
  if (msg.includes("row-level security") || msg.includes("permission denied")) {
    return "This can't be changed: the account is read-only, or this provider is over your plan's limit.";
  }
  return null;
}
