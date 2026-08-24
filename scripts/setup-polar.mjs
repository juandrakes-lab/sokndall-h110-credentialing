// One-off script: creates the 3 H110 products in Polar (sandbox or
// production, per --server) with a 14-day trial and prints the product IDs
// to paste into .env.local. Not part of the app runtime.
//
// Usage: POLAR_ACCESS_TOKEN=... node scripts/setup-polar.mjs [--server production]

import { Polar } from "@polar-sh/sdk";

const server = process.argv.includes("--server")
  ? process.argv[process.argv.indexOf("--server") + 1]
  : "sandbox";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
if (!accessToken) {
  console.error("Set POLAR_ACCESS_TOKEN in the environment before running this.");
  process.exit(1);
}

const polar = new Polar({ accessToken, server });

const PLANS = [
  { key: "SOLO", name: "H110 Solo", description: "Up to 3 providers", priceAmount: 4900 },
  { key: "PRACTICE", name: "H110 Practice", description: "Up to 15 providers", priceAmount: 9900 },
  { key: "BILLING_CO", name: "H110 Billing Co", description: "Up to 50 providers", priceAmount: 19900 },
];

for (const plan of PLANS) {
  const product = await polar.products.create({
    name: plan.name,
    description: plan.description,
    recurringInterval: "month",
    trialInterval: "day",
    trialIntervalCount: 14,
    prices: [{ amountType: "fixed", priceAmount: plan.priceAmount, priceCurrency: "usd" }],
  });

  console.log(`POLAR_PRODUCT_${plan.key}=${product.id}`);
}
