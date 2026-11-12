import { createPolarClient } from "@/lib/polar";

// Extra providers (founder decision 2026-11-11; migration
// 20261112000000_cred_extra_providers).
//
//   Practice    $25/month each beyond 15, up to 30 in all. They are the Polar
//               subscription's seats: raising is charged at once, prorated to
//               the days left; lowering applies at the next renewal.
//   Billing Co  $15/month each beyond 50, no cap. Billed on the next invoice
//               at the highest number the account had in the billing period
//               (Polar meter "Extra providers", aggregation max). Set in the
//               database by the owner; every change, and once a day, the app
//               reports the current number to Polar as an event.

export { EXTRA, EXTRA_PROVIDERS_EVENT, PRACTICE_NUDGE_FROM, extraOf, proratedNow } from "@/lib/extra-providers-rules";
import { EXTRA } from "@/lib/extra-providers-rules";
import { EXTRA_PROVIDERS_EVENT } from "@/lib/extra-providers-rules";

// Reports the account's current number of extra providers to Polar's meter.
export async function reportExtraProviders(ownerUserId, quantity) {
  await createPolarClient().events.ingest({
    events: [{ name: EXTRA_PROVIDERS_EVENT, externalCustomerId: ownerUserId, metadata: { quantity } }],
  });
}

// Daily (the alerts cron, service role): every Billing Co account with extra
// providers reports again, so a period with no change is still billed.
export async function reportAllExtraProviders(admin, { orgIds } = {}) {
  let q = admin
    .from("cred_organizations")
    .select("id, owner_user_id, extra_providers")
    .eq("plan", "billing_co")
    .gt("extra_providers", 0)
    .not("polar_subscription_id", "is", null);
  if (orgIds) q = q.in("id", orgIds);
  const { data } = await q;
  const out = [];
  for (const org of data ?? []) {
    try {
      await reportExtraProviders(org.owner_user_id, org.extra_providers);
      out.push({ org: org.id, quantity: org.extra_providers });
    } catch (err) {
      out.push({ org: org.id, error: err.message });
    }
  }
  return out;
}

// Daily (the alerts cron, service role): Practice extra providers whose charge
// was refunded in Polar stop being usable. Polar's proration lines read
// "Sokndall Practice (15 → 18 seats) — From …"; a fully refunded one gives back
// those seats. They come off at the renewal in Polar (never billed again) and
// at once here (seat_cap). Founder decision 2026-11-12.
const SEAT_LINE = /\((\d+) → (\d+) seats\)/;

export async function reconcileRefundedSeats(admin, { orgIds } = {}) {
  let q = admin
    .from("cred_organizations")
    .select("id, owner_user_id, seats, seat_cap, polar_subscription_id, current_period_end")
    .eq("plan", "practice")
    .gt("seats", 15)
    .not("polar_subscription_id", "is", null);
  if (orgIds) q = q.in("id", orgIds);
  const { data } = await q;
  const polar = createPolarClient();
  const out = [];
  for (const org of data ?? []) {
    try {
      const sub = await polar.subscriptions.get({ id: org.polar_subscription_id });
      let refunded = 0;
      for await (const page of await polar.orders.list({ externalCustomerId: org.owner_user_id, limit: 100 })) {
        for (const o of page.result.items) {
          if (o.subscriptionId !== sub.id || o.status !== "refunded" || new Date(o.createdAt) < sub.currentPeriodStart) continue;
          for (const item of o.items ?? []) {
            const m = item.label?.match(SEAT_LINE);
            if (m && Number(m[2]) > Number(m[1])) refunded += Number(m[2]) - Number(m[1]);
          }
        }
      }
      if (!refunded) continue;
      const cap = Math.max(EXTRA.practice.included, (sub.seats ?? 15) - refunded);
      if (org.seat_cap === cap) continue;
      if ((sub.pendingUpdate?.seats ?? sub.seats) > cap) {
        await polar.subscriptions.update({ id: sub.id, subscriptionUpdate: { seats: cap, prorationBehavior: "next_period" } });
      }
      await admin.from("cred_organizations").update({ seat_cap: cap }).eq("id", org.id);
      out.push({ org: org.id, refunded, cap });
    } catch (err) {
      out.push({ org: org.id, error: err.message });
    }
  }
  return out;
}
