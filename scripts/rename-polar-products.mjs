// One-off: renames the already-created H110-named sandbox products to their
// correct public name, Sokndall. Not part of the app runtime.
//
// Usage: POLAR_ACCESS_TOKEN=... node scripts/rename-polar-products.mjs

import { Polar } from "@polar-sh/sdk";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
if (!accessToken) {
  console.error("Set POLAR_ACCESS_TOKEN in the environment before running this.");
  process.exit(1);
}

const polar = new Polar({ accessToken, server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox" });

const RENAMES = {
  [process.env.POLAR_PRODUCT_SOLO]: "Sokndall Solo",
  [process.env.POLAR_PRODUCT_PRACTICE]: "Sokndall Practice",
  [process.env.POLAR_PRODUCT_BILLING_CO]: "Sokndall Billing Co",
};

for (const [id, name] of Object.entries(RENAMES)) {
  if (!id || id === "undefined") continue;
  const product = await polar.products.update({ id, productUpdate: { name } });
  console.log(`${id} -> ${product.name}`);
}
