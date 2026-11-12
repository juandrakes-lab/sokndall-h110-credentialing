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
    multiClient: false,
    storageLabel: "1 GB",
    polarProductId: process.env.POLAR_PRODUCT_SOLO,
  },
  practice: {
    key: "practice",
    label: "Practice",
    price: 299,
    perProvider: "19.93",
    providerLimit: 15,
    // Extra providers at $25/month each, up to 30 in all (lib/extra-providers.js).
    maxProviders: 30,
    userLimit: 3,
    // Several clients since 2026-11-11: the same structure as Billing Co,
    // only the capacity differs.
    multiClient: true,
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
    multiClient: true,
    // Beyond the 10 included, each user is $39/month on the same Polar
    // subscription (seats; founder decision 2026-09-14). Solo and Practice
    // stop at their limit instead.
    extraUserPrice: 39,
    storageLabel: "20 GB",
    polarProductId: process.env.POLAR_PRODUCT_BILLING_CO,
  },
};

// Several clients: separate data, client switcher, the joint view, people
// limited to some clients, reports per client. The database enforces the
// same rule (cred_enforce_single_client, cred_check_client_subset).
export const isMultiClient = (planKey) => Boolean(PLANS[planKey]?.multiClient);

export const PLAN_ORDER = ["solo", "practice", "billing_co"];

export function nextPlan(planKey) {
  const i = PLAN_ORDER.indexOf(planKey);
  return i >= 0 && i < PLAN_ORDER.length - 1 ? PLANS[PLAN_ORDER[i + 1]] : null;
}

// What has to go before an account can move to a smaller plan. Nothing is
// ever deleted or turned read-only by a plan change: the owner reduces first,
// and the change is refused until they have (founder decision 2026-11-11).
// `usage` = { providers, users, clients } — active providers, people with a
// seat or a live invitation, active clients.
export function downgradeBlockers(planKey, usage) {
  const plan = PLANS[planKey];
  if (!plan) return [];
  const out = [];
  const over = (n, limit) => Math.max(0, n - limit);
  // Practice can hold up to 30 with extra providers ($25 each beyond 15).
  const room = plan.maxProviders ?? plan.providerLimit;
  const p = over(usage.providers, room);
  if (p) out.push(`Mark ${p} provider${p === 1 ? "" : "s"} inactive (you have ${usage.providers}; ${plan.label} holds ${room}${plan.maxProviders ? " with extra providers" : ""}).`);
  if (!plan.extraUserPrice) {
    const u = over(usage.users, plan.userLimit);
    if (u) out.push(`Remove ${u} user${u === 1 ? "" : "s"} or invitation${u === 1 ? "" : "s"} from Team (you have ${usage.users}; ${plan.label} holds ${plan.userLimit}).`);
  }
  if (!plan.multiClient) {
    const c = over(usage.clients, 1);
    if (c) out.push(`Archive ${c} client${c === 1 ? "" : "s"} (you have ${usage.clients}; ${plan.label} holds one practice).`);
  }
  return out;
}
