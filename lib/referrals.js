// The partners' monthly report (migration 20261110000000_cred_referrals).
// Admin client only: the cron route /api/cron/referrals-report, on the 1st of
// each month, emails it to Juan for the month that just ended.
//
// The rule (acuerdo with Shehzad, 2026-11-03): <percent>% of what each referred
// account paid for its plan, before tax and net of refunds, for <months>
// months counted from its first charge above zero. Each commission is rounded
// down to the cent. Cash goes out once the balance reaches $100.

export const PAYOUT_THRESHOLD_CENTS = 10000;
const PAID = new Set(["paid", "refunded", "partially_refunded"]);

const money = (c) => `$${(c / 100).toFixed(2)}`;
const day = (d) => new Date(d).toISOString().slice(0, 10);

function addMonths(date, n) {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d;
}

// "2026-11" → [start, end) in UTC. No argument: the month before today.
export function monthRange(month) {
  const now = new Date();
  const [y, m] = month ? month.split("-").map(Number) : [now.getUTCFullYear(), now.getUTCMonth()]; // getUTCMonth() is already "last month" 1-based
  const start = new Date(Date.UTC(y, m - 1, 1));
  return { label: start.toISOString().slice(0, 7), start, end: addMonths(start, 1) };
}

// Every order Polar has for the account's owner (the Polar customer's
// external id is the owner's user id, lib/billing-actions.js).
async function ordersFor(polar, ownerUserId) {
  const out = [];
  for await (const page of await polar.orders.list({ externalCustomerId: ownerUserId, limit: 100 })) {
    out.push(...(page.result?.items ?? []));
  }
  return out.filter((o) => PAID.has(o.status));
}

// What one order earns. The base is the plan's own price only — never extra
// users ($39 seats) or, later, extra providers (founder, 2026-11-11): the
// order's lines on a plan's fixed price, as a share of the order, applied to
// what was actually paid (net of discounts, before tax) minus refunds.
// Without the plan-price ids (or lines) the whole order counts.
export function commissionOf(order, percent, planPriceIds) {
  const paid = Math.max(0, (order.netAmount ?? 0) - (order.refundedAmount ?? 0));
  let base = paid;
  const items = order.items ?? [];
  if (planPriceIds?.size && items.length && (order.subtotalAmount ?? 0) > 0) {
    const planPart = items.filter((i) => planPriceIds.has(i.productPriceId)).reduce((s, i) => s + i.amount, 0);
    base = Math.floor((paid * Math.min(planPart, order.subtotalAmount)) / order.subtotalAmount);
  }
  return { base, commission: Math.floor((base * Number(percent)) / 100) };
}

// The fixed (plan) price of each plan's Polar product.
async function planPriceIdsOf(polar) {
  const { PLANS } = await import("@/lib/plans");
  const ids = new Set();
  for (const plan of Object.values(PLANS)) {
    if (!plan.polarProductId) continue;
    const product = await polar.products.get({ id: plan.polarProductId });
    for (const price of product.prices ?? []) if (price.amountType === "fixed") ids.add(price.id);
  }
  return ids;
}

export async function buildReferralReport(admin, polar, { month } = {}) {
  const range = monthRange(month);
  const { data: partners, error } = await admin.from("cred_partners").select("*").order("created_at");
  if (error) throw new Error(error.message);
  const { data: demos } = await admin.from("cred_demos").select("org_id");
  const demoIds = new Set((demos ?? []).map((d) => d.org_id));

  const planPriceIds = await planPriceIdsOf(polar);
  const report = { month: range.label, partners: [] };
  for (const partner of partners ?? []) {
    const { data: orgs } = await admin
      .from("cred_organizations")
      .select("id, name, plan, owner_user_id, created_at, referred_at, subscription_status")
      .eq("partner_id", partner.id)
      .order("created_at");
    const { data: payouts } = await admin.from("cred_partner_payouts").select("amount_cents, paid_on").eq("partner_id", partner.id);

    const accounts = [];
    for (const org of (orgs ?? []).filter((o) => !demoIds.has(o.id))) {
      const orders = (await ordersFor(polar, org.owner_user_id)).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const first = orders.find((o) => (o.netAmount ?? 0) > 0);
      const windowEnd = first ? addMonths(first.createdAt, partner.months) : null;
      const eligible = first ? orders.filter((o) => new Date(o.createdAt) >= new Date(first.createdAt) && new Date(o.createdAt) < windowEnd) : [];
      const lines = eligible.map((o) => ({ date: day(o.createdAt), id: o.id, status: o.status, ...commissionOf(o, partner.percent, planPriceIds) }));
      const inMonth = lines.filter((l) => l.date >= day(range.start) && l.date < day(range.end));
      // Month n of 6 at the end of the reported month.
      let monthsUsed = 0;
      if (first) {
        while (monthsUsed < partner.months && addMonths(first.createdAt, monthsUsed) < range.end) monthsUsed += 1;
      }
      accounts.push({
        name: org.name,
        plan: org.plan,
        status: org.subscription_status,
        signedUp: day(org.created_at),
        firstCharge: first ? day(first.createdAt) : null,
        monthsUsed,
        months: partner.months,
        monthLines: inMonth,
        monthCents: inMonth.reduce((s, l) => s + l.commission, 0),
        // Up to the end of the reported month, so a late run never counts the next one.
        earnedCents: lines.filter((l) => l.date < day(range.end)).reduce((s, l) => s + l.commission, 0),
      });
    }
    const earned = accounts.reduce((s, a) => s + a.earnedCents, 0);
    const paid = (payouts ?? []).reduce((s, p) => s + p.amount_cents, 0);
    report.partners.push({
      name: partner.name,
      code: partner.code,
      percent: Number(partner.percent),
      months: partner.months,
      accounts,
      monthCents: accounts.reduce((s, a) => s + a.monthCents, 0),
      earnedCents: earned,
      paidCents: paid,
      balanceCents: earned - paid,
      due: earned - paid >= PAYOUT_THRESHOLD_CENTS,
    });
  }

  // Sign-ups that answered "Did someone recommend Sokndall?" without a link:
  // Juan confirms them by hand. Only the ones still without a partner.
  const { data: notes } = await admin
    .from("cred_organizations")
    .select("id, name, created_at, referral_note")
    .is("partner_id", null)
    .not("referral_note", "is", null)
    .order("created_at", { ascending: false });
  report.unconfirmed = (notes ?? []).filter((n) => !demoIds.has(n.id)).map((n) => ({ name: n.name, signedUp: day(n.created_at), note: n.referral_note }));
  return report;
}

// Plain lines: Juan forwards the per-account detail as it is.
export function referralReportEmail(report) {
  const out = [`Referral report for ${report.month}`];
  for (const p of report.partners) {
    out.push(`${p.name} — link sokndall.com/?ref=${p.code} — ${p.percent}% for ${p.months} months`);
    if (!p.accounts.length) out.push("No referred accounts yet.");
    for (const a of p.accounts) {
      const head = `• ${a.name} (${a.plan}, ${a.status ?? "no subscription"}) — signed up ${a.signedUp}; ${a.firstCharge ? `first charge ${a.firstCharge}, month ${a.monthsUsed} of ${a.months}` : "no charge above $0 yet"}`;
      const rows = a.monthLines.map((l) => `   ${l.date}  plan price ${money(l.base)} before tax → ${p.percent}% = ${money(l.commission)}${l.status !== "paid" ? ` (${l.status.replace("_", " ")})` : ""}`);
      out.push([head, ...(rows.length ? rows : ["   No charges this month."])].join("\n"));
    }
    out.push(
      [
        `This month: ${money(p.monthCents)}`,
        `Earned to date: ${money(p.earnedCents)}`,
        `Paid to date: ${money(p.paidCents)}`,
        `Balance: ${money(p.balanceCents)} — ${p.due ? "over $100, due for payment" : `under $100 (${money(Math.max(0, PAYOUT_THRESHOLD_CENTS - p.balanceCents))} to go)`}`,
      ].join("\n")
    );
  }
  if (report.unconfirmed.length) {
    out.push(
      ["Answered \"Did someone recommend Sokndall?\" (no partner assigned — confirm by hand):", ...report.unconfirmed.map((u) => `• ${u.name}, signed up ${u.signedUp}: "${u.note}"`)].join("\n")
    );
  }
  out.push("Amounts are the plan price only (no additional users or providers), before tax and net of refunds. Disputed charges are not deducted automatically: check Polar → Sales if any.");
  return out;
}
