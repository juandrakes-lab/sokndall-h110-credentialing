// One-off script: creates the 3 Sokndall plans in Polar (alcance v3 §2:
// $79 / $299 / $699 a month, 14-day trial) and prints the product IDs to put
// in POLAR_PRODUCT_* (.env.local and Vercel). Not part of the app runtime.
//
// --archive-old archives the products whose IDs are currently in
// POLAR_PRODUCT_* (the pre-v3 $49/$99/$199 ones) once the new ones exist.
// Archiving is reversible in the Polar dashboard; existing subscriptions on an
// archived product keep working.
//
// Usage: node scripts/setup-polar.mjs [--server production] [--archive-old]
// Reads POLAR_ACCESS_TOKEN (and POLAR_PRODUCT_* for --archive-old) from .env.local.

import { readFileSync } from "node:fs";
import { Polar } from "@polar-sh/sdk";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const server = process.argv.includes("--server") ? process.argv[process.argv.indexOf("--server") + 1] : "sandbox";
const polar = new Polar({ accessToken: env.POLAR_ACCESS_TOKEN, server });

const PLANS = [
  { key: "SOLO", name: "Sokndall Solo", description: "Up to 3 providers · 1 user", priceAmount: 7900 },
  { key: "PRACTICE", name: "Sokndall Practice", description: "Up to 15 providers · up to 3 users", priceAmount: 29900 },
  { key: "BILLING_CO", name: "Sokndall Billing Co", description: "Up to 50 providers across your clients · 10 users", priceAmount: 69900 },
];

const created = [];
for (const plan of PLANS) {
  const product = await polar.products.create({
    name: plan.name,
    description: plan.description,
    recurringInterval: "month",
    trialInterval: "day",
    trialIntervalCount: 14,
    prices: [{ amountType: "fixed", priceAmount: plan.priceAmount, priceCurrency: "usd" }],
    metadata: { plan: plan.key.toLowerCase(), version: "v3" },
  });
  created.push(product.id);
  console.log(`POLAR_PRODUCT_${plan.key}=${product.id}`);
}

if (process.argv.includes("--archive-old")) {
  for (const key of ["POLAR_PRODUCT_SOLO", "POLAR_PRODUCT_PRACTICE", "POLAR_PRODUCT_BILLING_CO"]) {
    const id = env[key];
    if (!id || created.includes(id)) continue;
    await polar.products.update({ id, productUpdate: { isArchived: true } });
    console.log(`archived old ${key} (${id})`);
  }
}
