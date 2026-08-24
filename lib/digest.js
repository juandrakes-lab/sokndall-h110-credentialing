import { CREDENTIAL_TYPE_LABELS, daysUntil } from "@/lib/credentials";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const STALE_DAYS = 30;

export async function fetchOrgDigestData(admin, org) {
  const { data: providers } = await admin
    .from("providers")
    .select("id, first_name, last_name")
    .eq("org_id", org.id);

  const providerIds = (providers ?? []).map((p) => p.id);
  const providerById = new Map((providers ?? []).map((p) => [p.id, p]));

  let expiringCredentials = [];
  if (providerIds.length > 0) {
    const { data: credentials } = await admin
      .from("credentials")
      .select("type, identifier, expiration_date, provider_id")
      .in("provider_id", providerIds)
      .not("expiration_date", "is", null);

    expiringCredentials = (credentials ?? [])
      .map((c) => ({ ...c, daysLeft: daysUntil(c.expiration_date) }))
      .filter((c) => c.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }

  const { data: payers } = await admin.from("payers").select("id, name").eq("org_id", org.id);
  const payerById = new Map((payers ?? []).map((p) => [p.id, p]));

  let staleEnrollments = [];
  if (providerIds.length > 0) {
    const { data: enrollments } = await admin
      .from("enrollments")
      .select("id, provider_id, payer_id, status")
      .in("provider_id", providerIds);

    if (enrollments?.length > 0) {
      const enrollmentIds = enrollments.map((e) => e.id);
      const { data: events } = await admin
        .from("enrollment_events")
        .select("enrollment_id, created_at")
        .in("enrollment_id", enrollmentIds);

      const lastEventByEnrollment = new Map();
      for (const ev of events ?? []) {
        const current = lastEventByEnrollment.get(ev.enrollment_id);
        if (!current || ev.created_at > current) {
          lastEventByEnrollment.set(ev.enrollment_id, ev.created_at);
        }
      }

      const now = Date.now();
      staleEnrollments = enrollments.filter((e) => {
        const last = lastEventByEnrollment.get(e.id);
        if (!last) return false;
        const daysSince = (now - new Date(last).getTime()) / 86400000;
        return daysSince >= STALE_DAYS;
      });
    }
  }

  return {
    expiringCredentials: expiringCredentials.map((c) => ({
      providerName: providerNameOf(providerById, c.provider_id),
      typeLabel: CREDENTIAL_TYPE_LABELS[c.type] ?? c.type,
      identifier: c.identifier,
      expirationDate: c.expiration_date,
      daysLeft: c.daysLeft,
    })),
    staleEnrollments: staleEnrollments.map((e) => ({
      providerName: providerNameOf(providerById, e.provider_id),
      payerName: payerById.get(e.payer_id)?.name ?? "Unknown payer",
      status: e.status,
    })),
  };
}

function providerNameOf(providerById, providerId) {
  const p = providerById.get(providerId);
  return p ? `${p.first_name} ${p.last_name}` : "Unknown provider";
}

export function buildDigestEmail(org, { expiringCredentials, staleEnrollments }) {
  const expiringRows = expiringCredentials
    .map(
      (c) =>
        `<tr><td>${c.providerName}</td><td>${c.typeLabel}${c.identifier ? ` — ${c.identifier}` : ""}</td><td>${c.expirationDate}</td><td>${c.daysLeft < 0 ? `${Math.abs(c.daysLeft)}d overdue` : `${c.daysLeft}d left`}</td></tr>`
    )
    .join("");

  const staleRows = staleEnrollments
    .map((e) => `<tr><td>${e.providerName}</td><td>${e.payerName}</td><td>${e.status}</td></tr>`)
    .join("");

  return {
    subject: `H110 weekly digest — ${org.name}`,
    html: `
      <h2>Weekly digest for ${org.name}</h2>
      <h3>Expiring credentials (next 30 days)</h3>
      ${
        expiringRows
          ? `<table cellpadding="6"><tr><th>Provider</th><th>Credential</th><th>Expires</th><th>Status</th></tr>${expiringRows}</table>`
          : "<p>Nothing expiring in the next 30 days.</p>"
      }
      <h3>Enrollments with no movement in 30+ days</h3>
      ${
        staleRows
          ? `<table cellpadding="6"><tr><th>Provider</th><th>Payer</th><th>Status</th></tr>${staleRows}</table>`
          : "<p>Nothing stale.</p>"
      }
      <p><a href="${SITE_URL}/dashboard">Open dashboard</a> · <a href="${SITE_URL}/enrollments">Open enrollments</a></p>
    `,
  };
}
