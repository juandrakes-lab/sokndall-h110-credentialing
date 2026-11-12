// One-off: sets up extra providers in Polar (founder decision 2026-11-11).
//
//   Practice   a seat price on the Practice product: seats 1-15 at $0, 16-30
//              at $25 — the subscription's seats are the provider capacity.
//              Raising is charged prorated at once; lowering applies at renewal.
//   Billing Co a metered price on the Billing Co product: $15 per extra
//              provider, billed on the next invoice at the highest number the
//              account had that month (meter "max" over the period). Its seat
//              price stays for the $39 users — Polar allows one per product.
//
// Idempotent: run it again and it changes nothing. Existing prices keep their
// ids, so live subscriptions keep what they have.
//
//   node scripts/setup-extra-providers.mjs            (reads .env.local)
//
// Prints the meter id: set it as POLAR_METER_EXTRA_PROVIDERS.
import { readFileSync } from "node:fs";
import { Polar } from "@polar-sh/sdk";

const env = { ...Object.fromEntries(readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.trim().startsWith("#")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])), ...process.env };
const server = env.POLAR_SERVER === "production" ? "production" : "sandbox";
const polar = new Polar({ accessToken: env.POLAR_ACCESS_TOKEN, server });

const EVENT = "extra_providers";

async function meter() {
  for await (const page of await polar.meters.list({ query: "Extra providers", limit: 100 })) {
    const hit = page.result.items.find((m) => m.name === "Extra providers" && !m.archivedAt);
    if (hit) return hit;
  }
  return polar.meters.create({
    name: "Extra providers",
    filter: { conjunction: "and", clauses: [{ property: "name", operator: "eq", value: EVENT }] },
    aggregation: { func: "max", property: "quantity" },
  });
}

const keep = (prices) => prices.filter((p) => !p.isArchived).map((p) => ({ id: p.id }));

// .env.local holds the sandbox product ids; in production the products are
// found by their exact names (the Polar organization is shared with other
// projects, so nothing else is touched).
async function productId(envKey, name) {
  if (server !== "production" && env[envKey]) return env[envKey];
  const hits = [];
  for await (const page of await polar.products.list({ query: name, isArchived: false, limit: 100 })) {
    hits.push(...page.result.items.filter((p) => p.name === name));
  }
  if (hits.length !== 1) throw new Error(`expected one product named "${name}", found ${hits.length}`);
  return hits[0].id;
}

async function main() {
  console.log(`Polar ${server}`);
  env.POLAR_PRODUCT_PRACTICE = await productId("POLAR_PRODUCT_PRACTICE", "Sokndall Practice");
  env.POLAR_PRODUCT_BILLING_CO = await productId("POLAR_PRODUCT_BILLING_CO", "Sokndall Billing Co");
  console.log(`Practice ${env.POLAR_PRODUCT_PRACTICE}, Billing Co ${env.POLAR_PRODUCT_BILLING_CO}`);
  const m = await meter();
  console.log(`meter: ${m.id}`);

  const practice = await polar.products.get({ id: env.POLAR_PRODUCT_PRACTICE });
  if (practice.prices.some((p) => p.amountType === "seat_based" && !p.isArchived)) {
    console.log("Practice: seat price already there");
  } else {
    await polar.products.update({
      id: practice.id,
      productUpdate: {
        prices: [
          ...keep(practice.prices),
          {
            amountType: "seat_based",
            priceCurrency: "usd",
            seatTiers: {
              seatTierType: "graduated",
              minimumSeats: 15,
              maximumSeats: 30,
              tiers: [
                { minSeats: 1, maxSeats: 15, pricePerSeat: 0 },
                { minSeats: 16, maxSeats: null, pricePerSeat: 2500 },
              ],
            },
          },
        ],
      },
    });
    console.log("Practice: seat price added (16-30 at $25)");
  }

  const billing = await polar.products.get({ id: env.POLAR_PRODUCT_BILLING_CO });
  if (billing.prices.some((p) => p.amountType === "metered_unit" && !p.isArchived)) {
    console.log("Billing Co: metered price already there");
  } else {
    await polar.products.update({
      id: billing.id,
      productUpdate: { prices: [...keep(billing.prices), { amountType: "metered_unit", priceCurrency: "usd", meterId: m.id, unitAmount: 1500 }] },
    });
    console.log("Billing Co: metered price added ($15 per extra provider)");
  }
  console.log(`\nPOLAR_METER_EXTRA_PROVIDERS=${m.id}`);
}

await main();
