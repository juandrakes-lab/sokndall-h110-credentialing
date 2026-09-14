// Plans per alcance v3 §2 / §4.2. Prices and per-provider figures are the
// exact published numbers — never round them differently anywhere else.
// Provider/user/storage limits are enforced by the database
// (cred_apply_plan_limits); these copies are for display only.
export const PLANS = {
  solo: {
    key: "solo",
    label: "Solo",
    price: 79,
    perProvider: "26.33",
    providerLimit: 3,
    userLimit: 1,
    storageLabel: "1 GB",
    polarProductId: process.env.POLAR_PRODUCT_SOLO,
  },
  practice: {
    key: "practice",
    label: "Practice",
    price: 299,
    perProvider: "19.93",
    providerLimit: 15,
    userLimit: 3,
    storageLabel: "5 GB",
    polarProductId: process.env.POLAR_PRODUCT_PRACTICE,
  },
  billing_co: {
    key: "billing_co",
    label: "Billing Co",
    price: 699,
    perProvider: "13.98",
    providerLimit: 50,
    userLimit: 10,
    // Beyond the 10 included, each user is $39/month on the same Polar
    // subscription (seats; founder decision 2026-09-14). Solo and Practice
    // stop at their limit instead.
    extraUserPrice: 39,
    storageLabel: "20 GB",
    polarProductId: process.env.POLAR_PRODUCT_BILLING_CO,
  },
};

export const PLAN_ORDER = ["solo", "practice", "billing_co"];

export function nextPlan(planKey) {
  const i = PLAN_ORDER.indexOf(planKey);
  return i >= 0 && i < PLAN_ORDER.length - 1 ? PLANS[PLAN_ORDER[i + 1]] : null;
}
