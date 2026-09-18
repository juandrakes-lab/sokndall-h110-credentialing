import { addDays, todayISO } from "@/lib/credentials";
import { IN_FLIGHT, PAYER_SELECT, STALLED_AFTER_DAYS, resolvePayer, weekEndISO } from "@/lib/enrollments";

const ENROLLMENT_SELECT = `id, provider_id, payer_id, status, next_follow_up_date, submitted_date,
  status_changed_at, assigned_user_id,
  cred_providers!inner(id, first_name, last_name, status, client_org_id, photo_url),
  cred_payers_org!inner(${PAYER_SELECT})`;

function shape(row) {
  return { ...row, provider: row.cred_providers, payer: resolvePayer(row.cred_payers_org) };
}

// The follow-up engine's two lists (alcance §3.6), through the user's session:
//   queue    follow-up date fell or falls this week, most overdue first
//   stalled  with the payer and no status change in 30+ days
// Filters: provider, payer, status (enrollment status).
export async function loadFollowUps(supabase, { provider, payer, status } = {}) {
  const narrow = (q) => {
    q = q.eq("cred_providers.status", "active");
    if (provider) q = q.eq("provider_id", provider);
    if (payer) q = q.eq("payer_id", payer);
    if (status) q = q.eq("status", status);
    return q;
  };

  const stalledBefore = new Date(Date.now() - STALLED_AFTER_DAYS * 86400000).toISOString();

  const [{ data: queueRows }, { data: stalledRows }, { data: directory }] = await Promise.all([
    narrow(
      supabase
        .from("cred_enrollments")
        .select(ENROLLMENT_SELECT)
        .not("next_follow_up_date", "is", null)
        .lte("next_follow_up_date", weekEndISO())
    )
      .order("next_follow_up_date", { ascending: true })
      .order("submitted_date", { ascending: true, nullsFirst: false }),
    narrow(
      supabase
        .from("cred_enrollments")
        .select(ENROLLMENT_SELECT)
        .in("status", IN_FLIGHT)
        .lt("status_changed_at", stalledBefore)
    ).order("status_changed_at", { ascending: true }),
    supabase.rpc("cred_org_directory"),
  ]);

  const queue = (queueRows ?? []).map(shape);
  const stalled = (stalledRows ?? []).map(shape);

  // Last logged contact per enrollment, for "where did we leave it".
  const ids = [...new Set([...queue, ...stalled].map((e) => e.id))];
  const lastContact = new Map();
  if (ids.length) {
    const { data: comms } = await supabase
      .from("cred_communications")
      .select("enrollment_id, contact_date, channel, reference_number, outcome, created_at")
      .in("enrollment_id", ids)
      .order("contact_date", { ascending: false })
      .order("created_at", { ascending: false });
    for (const c of comms ?? []) if (!lastContact.has(c.enrollment_id)) lastContact.set(c.enrollment_id, c);
  }

  return { queue, stalled, lastContact, directory: directory ?? [] };
}

// Approved enrollments whose revalidation falls in the next 90 days (or has
// passed) — shown next to credential expirations on the dashboard.
export async function loadRevalidations(supabase, { provider, payer } = {}) {
  let q = supabase
    .from("cred_enrollments")
    .select(`id, provider_id, payer_id, revalidation_due_date,
      cred_providers!inner(id, first_name, last_name, status, client_org_id, photo_url),
      cred_payers_org!inner(${PAYER_SELECT})`)
    .eq("status", "approved")
    .eq("cred_providers.status", "active")
    .not("revalidation_due_date", "is", null)
    .lte("revalidation_due_date", addDays(todayISO(), 90));
  if (provider) q = q.eq("provider_id", provider);
  if (payer) q = q.eq("payer_id", payer);
  const { data } = await q;
  return (data ?? []).map(shape);
}
