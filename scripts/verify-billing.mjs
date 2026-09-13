// Verification script, not part of the app runtime: the Polar side of billing.
//
//   1. Creates a real checkout in Polar (sandbox) for each plan, the way the app
//      does, and checks price, trial and the link to our user.
//   2. Sends correctly signed subscription webhooks to the local route and
//      checks the account is created, kept in sync, deduplicated, and that
//      unsigned or unknown events change nothing.
//
// Usage: node scripts/verify-billing.mjs [base-url]   (dev server running; default http://localhost:3100)

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { Polar } from "@polar-sh/sdk";
import { Webhook } from "standardwebhooks";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const BASE = process.argv[2] ?? "http://localhost:3100";
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const polar = new Polar({ accessToken: env.POLAR_ACCESS_TOKEN, server: env.POLAR_SERVER === "production" ? "production" : "sandbox" });
const run = Date.now();
const results = [];
let userId;

function check(name, ok, detail = "") {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
}

const PRODUCTS = { solo: env.POLAR_PRODUCT_SOLO, practice: env.POLAR_PRODUCT_PRACTICE, billing_co: env.POLAR_PRODUCT_BILLING_CO };
const PRICES = { solo: 7900, practice: 29900, billing_co: 69900 };

// A subscription object in Polar's wire format (what validateEvent parses).
function subscription({ plan, status = "trialing", modifiedAt, cancelAtPeriodEnd = false, productId }) {
  const now = new Date().toISOString();
  const end = new Date(Date.now() + 14 * 86400000).toISOString();
  const customer = {
    id: `cus_${run}`, created_at: now, modified_at: null, metadata: {}, external_id: userId,
    email: `delivered+billing-${run}@resend.dev`, email_verified: true, type: "individual", name: "Verify Billing Clinic",
    billing_name: null, billing_address: null, tax_id: null, organization_id: "org_test", deleted_at: null, avatar_url: null,
  };
  const product = {
    id: productId ?? PRODUCTS[plan], created_at: now, modified_at: null, trial_interval: "day", trial_interval_count: 14,
    name: `Sokndall ${plan}`, description: null, visibility: "public", recurring_interval: "month", recurring_interval_count: 1,
    meter_interval: null, meter_interval_count: null, is_recurring: true, is_archived: false, organization_id: "org_test",
    metadata: {}, prices: [], benefits: [], medias: [], attached_custom_fields: [],
  };
  return {
    created_at: now, modified_at: modifiedAt, id: `sub_${run}`, amount: PRICES[plan] ?? 0, currency: "usd",
    recurring_interval: "month", recurring_interval_count: 1, status, current_period_start: now, current_period_end: end,
    current_meter_period_start: null, current_meter_period_end: null, trial_start: now, trial_end: end,
    cancel_at_period_end: cancelAtPeriodEnd, canceled_at: null, started_at: now, ends_at: null, ended_at: null,
    pause_at_period_end: false, paused_at: null, resumes_at: null, customer_id: customer.id, product_id: product.id,
    discount_id: null, checkout_id: null, customer_cancellation_reason: null, customer_cancellation_comment: null,
    metadata: {}, customer, product, discount: null, prices: [], meters: [], pending_update: null,
  };
}

// Polar's SDK keys the HMAC with the secret's raw UTF-8 bytes (see README).
const signer = new Webhook(Buffer.from(env.POLAR_WEBHOOK_SECRET, "utf-8"), { format: "raw" });

async function deliver(type, data, { id = `msg_${run}_${Math.random().toString(36).slice(2)}`, badSignature = false } = {}) {
  const payload = JSON.stringify({ type, timestamp: new Date().toISOString(), data });
  const ts = new Date();
  const signature = badSignature ? "v1,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" : signer.sign(id, ts, payload);
  const res = await fetch(`${BASE}/api/webhooks/polar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "webhook-id": id,
      "webhook-timestamp": String(Math.floor(ts.getTime() / 1000)),
      "webhook-signature": signature,
    },
    body: payload,
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

const org = async () =>
  (await admin.from("cred_organizations").select("*").eq("owner_user_id", userId).maybeSingle()).data;

async function main() {
  const { data: u, error } = await admin.auth.admin.createUser({ email: `delivered+billing-${run}@resend.dev`, password: `B-${run}-xx9`, email_confirm: true });
  if (error) throw new Error(error.message);
  userId = u.user.id;

  // --- 1. Real checkouts in Polar -------------------------------------------
  for (const [plan, productId] of Object.entries(PRODUCTS)) {
    const checkout = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: userId,
      customerEmail: `delivered+billing-${run}@resend.dev`,
      metadata: { plan, user_id: userId },
      successUrl: `${BASE}/welcome?checkout_id={CHECKOUT_ID}`,
    });
    const amount = checkout.productPrice?.priceAmount ?? checkout.amount;
    check(
      `Polar checkout for ${plan}: $${PRICES[plan] / 100}/month, 14-day trial, linked to the user`,
      checkout.url?.startsWith("https://") && amount === PRICES[plan] && checkout.activeTrialIntervalCount === 14 && checkout.externalCustomerId === userId,
      `amount ${amount}, trial ${checkout.activeTrialIntervalCount} ${checkout.activeTrialInterval}, url ${checkout.url?.slice(0, 40)}…`
    );
  }

  // --- 2. Webhooks -----------------------------------------------------------
  const bad = await deliver("subscription.created", subscription({ plan: "practice", modifiedAt: new Date().toISOString() }), { badSignature: true });
  check("A webhook with a bad signature is refused", bad.status === 403 && !(await org()));

  const createdId = `msg_created_${run}`;
  const created = await deliver("subscription.created", subscription({ plan: "practice", modifiedAt: new Date(run).toISOString() }), { id: createdId });
  const o1 = await org();
  check("subscription.created creates the account (owner, plan, limits, trial)", created.status === 200 && o1?.plan === "practice" && o1.provider_limit === 15 && o1.subscription_status === "trialing" && !!o1.trial_ends_at, JSON.stringify(created.body));
  const { data: members } = await admin.from("cred_org_members").select("role").eq("org_id", o1?.id);
  const { data: clients } = await admin.from("cred_client_orgs").select("id").eq("org_id", o1?.id);
  check("…with the buyer as owner and one client ready for onboarding", members?.length === 1 && members[0].role === "owner" && clients?.length === 1);

  const dup = await deliver("subscription.created", subscription({ plan: "practice", modifiedAt: new Date(run).toISOString() }), { id: createdId });
  check("The same delivery twice is processed once", dup.status === 200 && dup.body.duplicate === true);

  await deliver("subscription.active", subscription({ plan: "practice", status: "active", modifiedAt: new Date(run + 1000).toISOString() }));
  check("subscription.active marks the account paid", (await org()).subscription_status === "active");

  await deliver("subscription.updated", subscription({ plan: "billing_co", status: "active", modifiedAt: new Date(run + 2000).toISOString() }));
  const o2 = await org();
  check("subscription.updated applies an upgrade's limits", o2.plan === "billing_co" && o2.provider_limit === 50 && o2.user_limit === 10 && o2.storage_limit_mb === 20480);

  await deliver("subscription.canceled", subscription({ plan: "billing_co", status: "active", cancelAtPeriodEnd: true, modifiedAt: new Date(run + 3000).toISOString() }));
  const o3 = await org();
  check("subscription.canceled keeps access to the end of the period", o3.cancel_at_period_end === true && o3.subscription_status === "active");

  await deliver("subscription.revoked", subscription({ plan: "billing_co", status: "canceled", modifiedAt: new Date(run + 4000).toISOString() }));
  check("subscription.revoked makes the account read-only", (await org()).subscription_status === "revoked");

  await deliver("subscription.updated", subscription({ plan: "billing_co", status: "active", modifiedAt: new Date(run + 2500).toISOString() }));
  check("A late, older event doesn't revive a revoked account", (await org()).subscription_status === "revoked");

  const unknownId = `msg_unknown_${run}`;
  const unknown = await deliver("subscription.updated", subscription({ plan: "solo", productId: "prod_not_ours", modifiedAt: new Date(run + 5000).toISOString() }), { id: unknownId });
  const { data: kept } = await admin.from("cred_polar_events").select("id").eq("id", unknownId);
  check("An event for a product we don't sell fails without changing anything, and stays retryable", unknown.status === 500 && (await org()).plan === "billing_co" && kept.length === 0);

  const other = await deliver("checkout.created", { id: "chk_1" });
  check("Non-subscription events are acknowledged and ignored", other.status === 202, String(other.status));
}

try {
  await main();
} catch (err) {
  check("script ran to completion", false, err.message);
} finally {
  if (userId) {
    const o = await org();
    if (o) await admin.from("cred_organizations").delete().eq("id", o.id);
    await admin.auth.admin.deleteUser(userId);
  }
  await admin.from("cred_polar_events").delete().like("id", `msg_%${run}%`);
  const failed = results.filter((r) => !r).length;
  console.log(`\ncleanup done\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}
