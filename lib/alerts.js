import { CREDENTIAL_TYPE_LABELS, daysUntil } from "@/lib/credentials";

const ALERT_THRESHOLDS = [90, 60, 30, 7];

export async function fetchOrgAlertCredentials(admin, org) {
  const { data: providers } = await admin
    .from("providers")
    .select("id, first_name, last_name")
    .eq("org_id", org.id);

  const providerIds = (providers ?? []).map((p) => p.id);
  if (providerIds.length === 0) return [];

  const providerById = new Map((providers ?? []).map((p) => [p.id, p]));

  const { data: credentials } = await admin
    .from("credentials")
    .select("type, identifier, expiration_date, provider_id")
    .in("provider_id", providerIds)
    .not("expiration_date", "is", null);

  return (credentials ?? [])
    .map((c) => ({ ...c, daysLeft: daysUntil(c.expiration_date) }))
    .filter((c) => ALERT_THRESHOLDS.includes(c.daysLeft))
    .map((c) => {
      const p = providerById.get(c.provider_id);
      return {
        providerName: p ? `${p.first_name} ${p.last_name}` : "Unknown provider",
        typeLabel: CREDENTIAL_TYPE_LABELS[c.type] ?? c.type,
        identifier: c.identifier,
        expirationDate: c.expiration_date,
        daysLeft: c.daysLeft,
      };
    });
}

export function buildAlertEmail(org, credentials) {
  const rows = credentials
    .map(
      (c) =>
        `<tr><td>${c.providerName}</td><td>${c.typeLabel}${c.identifier ? ` — ${c.identifier}` : ""}</td><td>${c.expirationDate}</td><td>${c.daysLeft} days</td></tr>`
    )
    .join("");

  return {
    subject: `Sokndall expiration alert — ${org.name}`,
    html: `
      <h2>Expiration alert for ${org.name}</h2>
      <table cellpadding="6"><tr><th>Provider</th><th>Credential</th><th>Expires</th><th>Days left</th></tr>${rows}</table>
    `,
  };
}
