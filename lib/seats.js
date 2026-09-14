import { createPolarClient } from "@/lib/polar";
import { PLANS } from "@/lib/plans";

// Billing Co extra users (founder decision 2026-09-14): $39/month each beyond
// the 10 included, on the same Polar subscription as seats. The product's
// seat price is graduated — seats 1–10 at $0, 11+ at $39 — so a Billing Co
// subscription always carries seats = users on the plan, never below 10.
//
//   more users   seats go up at once and Polar invoices the prorated
//                difference now ("invoice")
//   fewer users  seats go down at the next renewal ("next_period"); until
//                then the paid seats stay usable
//
// Our user_limit follows the subscription's seats through the webhook (or
// /api/billing/sync) — never set from here.

export const INCLUDED_USERS = PLANS.billing_co.userLimit;
export const EXTRA_USER_PRICE = PLANS.billing_co.extraUserPrice;

// People who hold or have been offered a seat: members plus live invitations.
export function seatsInUse(members, invitations, now = new Date()) {
  return members.length + invitations.filter((i) => !i.accepted_at && new Date(i.expires_at) > now).length;
}

export const seatsFor = (used) => Math.max(INCLUDED_USERS, used);

export function monthlyPrice(seats) {
  return PLANS.billing_co.price + Math.max(0, seats - INCLUDED_USERS) * EXTRA_USER_PRICE;
}

// Daily (the alerts cron, service role): invitations that expired unanswered
// stop holding a paid seat — the plan goes back down at the next renewal.
export async function reconcileExpiredSeats(admin, { orgIds } = {}) {
  let q = admin
    .from("cred_organizations")
    .select("id, polar_subscription_id, user_limit")
    .eq("plan", "billing_co")
    .gt("user_limit", INCLUDED_USERS)
    .not("polar_subscription_id", "is", null);
  if (orgIds) q = q.in("id", orgIds);
  const { data: orgs } = await q;

  const results = [];
  for (const org of orgs ?? []) {
    const [{ data: members }, { data: invitations }] = await Promise.all([
      admin.from("cred_org_members").select("user_id").eq("org_id", org.id),
      admin.from("cred_invitations").select("accepted_at, expires_at").eq("org_id", org.id),
    ]);
    const target = seatsFor(seatsInUse(members ?? [], invitations ?? []));
    if (target >= org.user_limit) continue;
    try {
      const change = await setSeats(org.polar_subscription_id, target);
      results.push({ org: org.id, target, ...change });
    } catch (err) {
      results.push({ org: org.id, target, error: err.message });
    }
  }
  return results;
}

// What Polar has scheduled, for Settings: a decrease waiting for renewal.
export async function pendingSeatChange(subscriptionId) {
  const sub = await createPolarClient().subscriptions.get({ id: subscriptionId });
  const seats = sub.pendingUpdate?.seats ?? null;
  return seats === null ? null : { seats, at: sub.pendingUpdate.appliesAt, current: sub.seats };
}

// Moves the subscription to `target` seats. Returns what Polar now says:
// { seats, pendingSeats, pendingAt } (pending = a decrease waiting for renewal).
export async function setSeats(subscriptionId, target) {
  const polar = createPolarClient();
  let sub = await polar.subscriptions.get({ id: subscriptionId });
  const pending = sub.pendingUpdate?.seats ?? null;

  if (target > (sub.seats ?? 0)) {
    if (pending !== null) sub = await polar.subscriptions.update({ id: subscriptionId, subscriptionUpdate: { clearPendingUpdate: true } });
    sub = await polar.subscriptions.update({ id: subscriptionId, subscriptionUpdate: { seats: target, prorationBehavior: "invoice" } });
  } else if (target < (sub.seats ?? 0) && pending !== target) {
    sub = await polar.subscriptions.update({ id: subscriptionId, subscriptionUpdate: { seats: target, prorationBehavior: "next_period" } });
  } else if (target === sub.seats && pending !== null) {
    // Back to what's already paid for: drop the scheduled decrease.
    sub = await polar.subscriptions.update({ id: subscriptionId, subscriptionUpdate: { clearPendingUpdate: true } });
  }

  return { seats: sub.seats, pendingSeats: sub.pendingUpdate?.seats ?? null, pendingAt: sub.pendingUpdate?.appliesAt ?? null };
}
