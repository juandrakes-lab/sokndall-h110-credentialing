import { CHANNEL_LABELS, ENROLLMENT_STATUSES, ENROLLMENT_STATUS_LABELS, PAYER_SELECT, PAYER_TYPE_LABELS, resolvePayer, sortPayers } from "@/lib/enrollments";
import { credentialLabel, daysUntil, todayISO } from "@/lib/credentials";

// Client status report (pedido 2026-10-19, función 1): one client's providers,
// where each payer application stands, the last follow-up on each, and the
// credentials that expire soon. Built with the signed-in user's own
// RLS-scoped client, then frozen as a snapshot in cred_reports — so the
// report, and any link shared to it, only ever holds what that user could see
// at that moment.

export const REPORT_EXPIRY_WINDOW_DAYS = 90;
export const SHARE_DAYS = [7, 14, 30];
export const SHARE_DEFAULT_DAYS = 14;

const name = (p) => `${p.first_name} ${p.last_name}`;

export async function buildReportSnapshot(supabase, { client, practice }) {
  const [{ data: providers }, { data: payerRows }, { data: enrollments }, { data: credentials }] = await Promise.all([
    supabase.from("cred_providers").select("id, first_name, last_name, specialty, npi").eq("status", "active").order("last_name"),
    supabase.from("cred_payers_org").select(PAYER_SELECT),
    supabase.from("cred_enrollments").select("id, provider_id, payer_id, status, submitted_date, effective_date, next_follow_up_date, pending_request"),
    supabase.from("cred_credentials").select("provider_id, type, custom_name, state, expiration_date, status"),
  ]);

  const enrollmentIds = (enrollments ?? []).map((e) => e.id);
  const { data: comms } = enrollmentIds.length
    ? await supabase
        .from("cred_communications")
        .select("enrollment_id, contact_date, channel, outcome, created_at")
        .in("enrollment_id", enrollmentIds)
        .order("contact_date", { ascending: false })
        .order("created_at", { ascending: false })
    : { data: [] };
  const lastContact = new Map();
  for (const c of comms ?? []) if (!lastContact.has(c.enrollment_id)) lastContact.set(c.enrollment_id, c);

  const payers = sortPayers((payerRows ?? []).map(resolvePayer));
  const active = new Set((providers ?? []).map((p) => p.id));
  const payerById = new Map(payers.map((p) => [p.id, p]));

  const counts = Object.fromEntries(ENROLLMENT_STATUSES.map((s) => [s, 0]));
  const rows = (providers ?? []).map((p) => {
    const apps = (enrollments ?? [])
      .filter((e) => e.provider_id === p.id && payerById.has(e.payer_id))
      .map((e) => {
        counts[e.status] = (counts[e.status] ?? 0) + 1;
        const last = lastContact.get(e.id);
        const payer = payerById.get(e.payer_id);
        return {
          payer: payer.name,
          payer_type: PAYER_TYPE_LABELS[payer.payer_type] ?? null,
          status: e.status,
          status_label: ENROLLMENT_STATUS_LABELS[e.status],
          submitted: e.submitted_date,
          effective: e.effective_date,
          next_follow_up: e.next_follow_up_date,
          payer_request: e.pending_request ?? null,
          last_follow_up: last ? { date: last.contact_date, channel: CHANNEL_LABELS[last.channel] ?? last.channel, outcome: last.outcome ?? null } : null,
        };
      })
      .sort((a, b) => payers.findIndex((x) => x.name === a.payer) - payers.findIndex((x) => x.name === b.payer));
    return { name: name(p), specialty: p.specialty ?? null, npi: p.npi ?? null, applications: apps };
  });

  const providerName = new Map((providers ?? []).map((p) => [p.id, name(p)]));
  const expirations = (credentials ?? [])
    .filter((c) => active.has(c.provider_id) && c.expiration_date && daysUntil(c.expiration_date) <= REPORT_EXPIRY_WINDOW_DAYS)
    .map((c) => ({
      provider: providerName.get(c.provider_id),
      credential: credentialLabel(c.type, c) + (c.state ? ` (${c.state})` : ""),
      expires: c.expiration_date,
      days: daysUntil(c.expiration_date),
    }))
    .sort((a, b) => a.expires.localeCompare(b.expires));

  return {
    version: 1,
    client_name: client?.name ?? practice?.legal_name ?? "Practice",
    practice_name: practice?.legal_name ?? null,
    as_of: todayISO(),
    summary: {
      providers: rows.length,
      payers: payers.length,
      applications: (enrollments ?? []).filter((e) => active.has(e.provider_id)).length,
      by_status: ENROLLMENT_STATUSES.map((s) => ({ status: s, label: ENROLLMENT_STATUS_LABELS[s], count: counts[s] ?? 0 })),
      expiring: expirations.length,
    },
    providers: rows,
    expirations,
  };
}

// "Oct 19, 2026, 10:42 AM ET" — the moment a report was generated, always shown.
export function formatGeneratedAt(iso) {
  return (
    new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }) + " ET"
  );
}

export function shareState(report) {
  if (!report.share_token_hash) return "none";
  if (report.share_revoked_at) return "revoked";
  if (new Date(report.share_expires_at) <= new Date()) return "expired";
  return "active";
}
