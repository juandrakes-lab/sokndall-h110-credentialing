// One-off: registers the production webhook endpoint with Polar and prints
// the secret Polar generates (only shown once) so it can be pasted into
// POLAR_WEBHOOK_SECRET. Not part of the app runtime.
//
// Usage: POLAR_ACCESS_TOKEN=... node scripts/register-webhook.mjs <site-url>

import { Polar } from "@polar-sh/sdk";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
const siteUrl = process.argv[2];
if (!accessToken || !siteUrl) {
  console.error("Usage: POLAR_ACCESS_TOKEN=... node scripts/register-webhook.mjs <site-url>");
  process.exit(1);
}

const polar = new Polar({
  accessToken,
  server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
});

const endpoint = await polar.webhooks.createWebhookEndpoint({
  url: `${siteUrl}/api/webhooks/polar`,
  name: "Sokndall production",
  format: "raw",
  events: ["subscription.created", "subscription.updated", "subscription.revoked"],
});

console.log("id:", endpoint.id);
console.log("secret:", endpoint.secret);
