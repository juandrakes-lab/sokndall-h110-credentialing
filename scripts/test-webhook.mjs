// One-off script: builds a schema-valid, correctly-signed fake Polar
// "subscription.created" event and POSTs it to the local webhook route, to
// verify the route's business logic (product -> plan mapping, org update)
// without needing a real Polar-triggered call. Not part of the app runtime.
//
// Usage: node scripts/test-webhook.mjs
// Reads POLAR_WEBHOOK_SECRET, POLAR_PRODUCT_SOLO from .env.local by hand
// (no dotenv dep) and posts to http://localhost:3000.

import { readFileSync } from "node:fs";
import { Webhook } from "standardwebhooks";

const envText = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const orgId = process.argv[2];
const eventType = process.argv[3] ?? "subscription.created";
if (!orgId) {
  console.error("Usage: node scripts/test-webhook.mjs <org-id> [event-type]");
  process.exit(1);
}

const now = new Date().toISOString();
const trialEnd = new Date(Date.now() + 14 * 86400000).toISOString();

const customer = {
  id: "test_customer_id",
  created_at: now,
  modified_at: null,
  metadata: {},
  external_id: orgId,
  email: "test@example.com",
  email_verified: true,
  type: "individual",
  name: null,
  billing_name: null,
  billing_address: null,
  tax_id: null,
  organization_id: "test_org_id",
  deleted_at: null,
  avatar_url: null,
};

const product = {
  id: env.POLAR_PRODUCT_SOLO,
  created_at: now,
  modified_at: null,
  trial_interval: "day",
  trial_interval_count: 14,
  name: "Sokndall Solo",
  description: "Up to 3 providers",
  visibility: "public",
  recurring_interval: "month",
  recurring_interval_count: 1,
  meter_interval: null,
  meter_interval_count: null,
  is_recurring: true,
  is_archived: false,
  organization_id: "test_org_id",
  metadata: {},
  prices: [],
  benefits: [],
  medias: [],
  attached_custom_fields: [],
};

const subscription = {
  created_at: now,
  modified_at: null,
  id: "test_subscription_id",
  amount: 4900,
  currency: "usd",
  recurring_interval: "month",
  recurring_interval_count: 1,
  status: eventType === "subscription.revoked" ? "canceled" : "trialing",
  current_period_start: now,
  current_period_end: trialEnd,
  current_meter_period_start: null,
  current_meter_period_end: null,
  trial_start: now,
  trial_end: trialEnd,
  cancel_at_period_end: false,
  canceled_at: null,
  started_at: now,
  ends_at: null,
  ended_at: null,
  pause_at_period_end: false,
  paused_at: null,
  resumes_at: null,
  customer_id: customer.id,
  product_id: product.id,
  discount_id: null,
  checkout_id: null,
  customer_cancellation_reason: null,
  customer_cancellation_comment: null,
  metadata: {},
  customer,
  product,
  discount: null,
  prices: [],
  meters: [],
  pending_update: null,
};

const payload = JSON.stringify({
  type: eventType,
  timestamp: now,
  data: subscription,
});

// @polar-sh/sdk's validateEvent base64-encodes the raw secret string before
// handing it to `Webhook`, which then base64-decodes it back — a no-op that
// makes the effective HMAC key just the secret's raw UTF-8 bytes. Match
// that here via the `raw` format instead of passing the string directly
// (which would strip a "whsec_" prefix and base64-decode the rest instead).
const wh = new Webhook(Buffer.from(env.POLAR_WEBHOOK_SECRET, "utf-8"), { format: "raw" });
const msgId = `msg_${Date.now()}`;
const timestamp = new Date();
const signature = wh.sign(msgId, timestamp, payload);

const baseUrl = process.env.TEST_WEBHOOK_BASE_URL ?? "http://localhost:3000";
const res = await fetch(`${baseUrl}/api/webhooks/polar`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "webhook-id": msgId,
    "webhook-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
    "webhook-signature": signature,
  },
  body: payload,
});

console.log(res.status, await res.text());
