import { addDays, credentialLabel, credentialSummary, daysUntil, todayISO } from "@/lib/credentials";
import { IN_FLIGHT, STALLED_AFTER_DAYS, weekEndISO } from "@/lib/enrollments";

// The alert ladder (alcance §3.11): which rung an item sits on today.
// Expired is its own rung and always alerts once; otherwise it's the smallest
// configured number of days the item is within.
export function levelFor(days, ladder) {
  if (days < 0) return "expired";
  const hits = ladder.filter((t) => days <= t);
  return hits.length ? Math.min(...hits) : null;
}

// 90/60 neutral, 30 amber, 14/7/expired red — whatever days the org chose.
export function severityForLevel(level) {
  if (level === "expired" || level <= 14) return "red";
  if (level <= 30) return "amber";
  return "neutral";
}

const activeProvider = (data, id) => {
  const p = data.providers.get(id);
  return p && p.status === "active" ? p : null;
};

const clientLabel = (data, clientId) => (data.clients.size > 1 ? data.clients.get(clientId) : null);

// Everything with a deadline in reach: credential expirations and approved
// enrollments' payer revalidations.
function deadlines(data, horizonDays) {
  const horizon = addDays(todayISO(), horizonDays);
  const items = [];

  for (const c of data.credentials) {
    const provider = activeProvider(data, c.provider_id);
    if (!provider || c.expiration_date > horizon) continue;
    items.push({
      key: `credential:${c.id}:${c.expiration_date}`,
      kind: "credential",
      who: `${provider.first_name} ${provider.last_name}`,
      what: [credentialLabel(c.type), credentialSummary(c)].filter(Boolean).join(" · "),
      date: c.expiration_date,
      assignee: c.assigned_user_id,
      client: clientLabel(data, c.client_org_id),
      clientId: c.client_org_id,
      path: `/providers/${c.provider_id}`,
    });
  }

  for (const e of data.enrollments) {
    const provider = activeProvider(data, e.provider_id);
    if (!provider || e.status !== "approved" || !e.revalidation_due_date || e.revalidation_due_date > horizon) continue;
    items.push({
      key: `revalidation:${e.id}:${e.revalidation_due_date}`,
      kind: "revalidation",
      who: `${provider.first_name} ${provider.last_name}`,
      what: `Payer revalidation · ${data.payers.get(e.payer_id)?.name ?? "Payer"}`,
      date: e.revalidation_due_date,
      assignee: e.assigned_user_id,
      client: clientLabel(data, e.client_org_id),
      clientId: e.client_org_id,
      path: `/enrollments?open=${e.provider_id}.${e.payer_id}`,
    });
  }

  return items.map((i) => ({ ...i, days: daysUntil(i.date) })).sort((a, b) => a.date.localeCompare(b.date));
}

// Items on a rung today, each keyed by item + due date + rung so a rung is
// announced once, and a renewed credential (new date) starts over.
export function computeAlerts(data, ladder) {
  const top = Math.max(...ladder);
  return deadlines(data, top)
    .map((item) => {
      const level = levelFor(item.days, ladder);
      return level === null
        ? null
        : { ...item, level, severity: severityForLevel(level), subjectKey: `${item.key}:${level}` };
    })
    .filter(Boolean);
}

// The weekly digest (alcance §3.11): this week's follow-ups, stalled
// applications and what expires in the next 90 days — limited to the clients
// the recipient can see.
export function computeDigest(data, canSee = () => true) {
  const weekEnd = weekEndISO();
  const stalledBefore = Date.now() - STALLED_AFTER_DAYS * 86400000;

  const enrollmentRow = (e) => {
    const provider = activeProvider(data, e.provider_id);
    if (!provider || !canSee(e.client_org_id)) return null;
    const last = data.lastContact.get(e.id);
    return {
      who: `${provider.first_name} ${provider.last_name}`,
      payer: data.payers.get(e.payer_id)?.name ?? "Payer",
      status: e.status,
      next: e.next_follow_up_date,
      changedAt: e.status_changed_at,
      lastRef: last?.reference_number ?? null,
      lastDate: last?.contact_date ?? null,
      client: clientLabel(data, e.client_org_id),
      path: `/enrollments?open=${e.provider_id}.${e.payer_id}`,
    };
  };

  const queue = data.enrollments
    .filter((e) => e.next_follow_up_date && e.next_follow_up_date <= weekEnd)
    .sort((a, b) => a.next_follow_up_date.localeCompare(b.next_follow_up_date))
    .map(enrollmentRow)
    .filter(Boolean);

  const stalled = data.enrollments
    .filter((e) => IN_FLIGHT.includes(e.status) && new Date(e.status_changed_at).getTime() < stalledBefore)
    .sort((a, b) => a.status_changed_at.localeCompare(b.status_changed_at))
    .map(enrollmentRow)
    .filter(Boolean);

  const expirations = deadlines(data, 90).filter((i) => canSee(i.clientId));

  return { queue, stalled, expirations };
}
