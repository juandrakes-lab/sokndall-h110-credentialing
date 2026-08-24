// One-off: deletes an old webhook endpoint and registers a fresh one
// against a new URL. Not part of the app runtime.
// Usage: POLAR_ACCESS_TOKEN=... node scripts/reregister-webhook.mjs <old-endpoint-id> <site-url>
import { Polar } from "@polar-sh/sdk";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
const oldId = process.argv[2];
const siteUrl = process.argv[3];

const polar = new Polar({
  accessToken,
  server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
});

if (oldId && oldId !== "-") {
  await polar.webhooks.deleteWebhookEndpoint({ id: oldId });
  console.log("deleted:", oldId);
}

const endpoint = await polar.webhooks.createWebhookEndpoint({
  url: `${siteUrl}/api/webhooks/polar`,
  name: "Sokndall production",
  format: "raw",
  events: ["subscription.created", "subscription.updated", "subscription.revoked"],
});

console.log("id:", endpoint.id);
console.log("secret:", endpoint.secret);
