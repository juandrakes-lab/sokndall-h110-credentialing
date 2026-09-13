import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { formatDate } from "@/lib/credentials";

// Subscription → what the account may do (mirrors cred_org_writable in SQL,
// which is what actually enforces it).
export function accountAccess(org) {
  const status = org.subscription_status;
  const periodEnd = org.current_period_end ? new Date(org.current_period_end) : null;
  const date = (d) => (d ? formatDate(new Date(d).toISOString().slice(0, 10)) : null);

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

// After a downgrade the most recently added providers beyond the limit are
// read-only (alcance §4.5). Same rule as cred_provider_writable.
export function readOnlyProviderIds(providers, org) {
  const access = accountAccess(org);
  const ordered = [...providers].sort((a, b) =>
    a.created_at === b.created_at ? a.id.localeCompare(b.id) : a.created_at.localeCompare(b.created_at)
  );
  return new Set(ordered.filter((_, i) => !access.writable || i >= org.provider_limit).map((p) => p.id));
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
