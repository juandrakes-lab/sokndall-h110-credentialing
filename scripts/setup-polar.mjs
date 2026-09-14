// One-off script: creates the 3 Sokndall plans in Polar (alcance v3 §2:
// $79 / $299 / $699 a month, 14-day trial) and prints the product IDs to put
// in POLAR_PRODUCT_* (.env.local and Vercel). Not part of the app runtime.
//
// Billing Co is $699 fixed plus a graduated seat price on the same product:
// seats 1–10 at $0, 11 and up at $39 (founder decision 2026-09-14). A Billing
// Co subscription always has seats = users on the plan (min 10), so Polar
// bills $699 + $39 × (seats − 10).
//
// --only KEY[,KEY]  create just those plans (e.g. --only BILLING_CO)
// --archive-old     archive the products whose IDs are currently in
//                   POLAR_PRODUCT_* once the new ones exist. Archiving is
//                   reversible in the Polar dashboard; existing subscriptions
//                   on an archived product keep working.
//
// Usage: node scripts/setup-polar.mjs [--server production] [--only BILLING_CO] [--archive-old]
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

const arg = (name) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : null);
const server = arg("--server") ?? "sandbox";
const only = arg("--only")?.split(",");
const polar = new Polar({ accessToken: env.POLAR_ACCESS_TOKEN, server });

const INCLUDED_USERS = 10;
const EXTRA_USER_CENTS = 3900;

const PLANS = [
  { key: "SOLO", name: "Sokndall Solo", description: "Up to 3 providers · 1 user", priceAmount: 7900 },
  { key: "PRACTICE", name: "Sokndall Practice", description: "Up to 15 providers · up to 3 users", priceAmount: 29900 },
  {
    key: "BILLING_CO",
    name: "Sokndall Billing Co",
    description: "Up to 50 providers across your clients · 10 users included, $39/month for each additional user",
    priceAmount: 69900,
    seats: true,
  },
];

const created = [];
for (const plan of PLANS.filter((p) => !only || only.includes(p.key))) {
  const prices = [{ amountType: "fixed", priceAmount: plan.priceAmount, priceCurrency: "usd" }];
  if (plan.seats) {
    prices.push({
      amountType: "seat_based",
      priceCurrency: "usd",
      seatTiers: {
        seatTierType: "graduated",
        tiers: [
          { minSeats: 1, maxSeats: INCLUDED_USERS, pricePerSeat: 0 },
          { minSeats: INCLUDED_USERS + 1, pricePerSeat: EXTRA_USER_CENTS },
        ],
      },
    });
  }
  const product = await polar.products.create({
    name: plan.name,
    description: plan.description,
    recurringInterval: "month",
    trialInterval: "day",
    trialIntervalCount: 14,
    prices,
    metadata: { plan: plan.key.toLowerCase(), version: "v3" },
  });
  created.push(plan.key);
  console.log(`POLAR_PRODUCT_${plan.key}=${product.id}`);
}

if (process.argv.includes("--archive-old")) {
  for (const key of created) {
    const id = env[`POLAR_PRODUCT_${key}`];
    if (!id) continue;
    await polar.products.update({ id, productUpdate: { isArchived: true } });
    console.log(`archived old POLAR_PRODUCT_${key} (${id})`);
  }
}
