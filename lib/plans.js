// Pricing per spec section 4. Anchor: buyer already budgets $1,200-6,000/yr
// for credentialing software; below $49 reads as a toy.
export const PLANS = {
  solo: {
    key: "solo",
    label: "Solo",
    price: 49,
    providerLimit: 3,
    description: "Up to 3 providers",
    polarProductId: process.env.POLAR_PRODUCT_SOLO,
  },
  practice: {
    key: "practice",
    label: "Practice",
    price: 99,
    providerLimit: 15,
    description: "Up to 15 providers",
    polarProductId: process.env.POLAR_PRODUCT_PRACTICE,
  },
  billing_co: {
    key: "billing_co",
    label: "Billing Co",
    price: 199,
    providerLimit: 50,
    description: "Up to 50 providers",
    polarProductId: process.env.POLAR_PRODUCT_BILLING_CO,
  },
};

export const PLAN_ORDER = ["solo", "practice", "billing_co"];
