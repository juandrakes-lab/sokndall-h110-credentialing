import { addDays, todayISO } from "@/lib/credentials";
import { sendEmail } from "@/lib/resend";
import { gatherOrgData } from "./data";
import { computeAlerts, computeDigest } from "./compute";
import { renderAlertEmail, renderDigestEmail } from "./email";

// Sending, for the cron routes only (they pass the service-role client).
// Every email is claimed in cred_notification_log before it goes out, so a
// cron that fires twice sends nothing twice, and a failed send is retried on
// the next run.

async function membersWithEmail(admin, orgId) {
  const { data: members, error } = await admin
    .from("cred_org_members")
    .select("user_id, role, client_ids")
    .eq("org_id", orgId);
  if (error) throw new Error(error.message);

  const out = [];
  for (const m of members ?? []) {
    const { data } = await admin.auth.admin.getUserById(m.user_id);
    if (data?.user?.email) out.push({ ...m, email: data.user.email });
  }
  return out;
}

async function claimAndSend(admin, { orgId, kind, recipient, cc, keys, build }) {
  const rows = keys.map((subject_key) => ({ org_id: orgId, kind, subject_key, recipient, cc }));
  const { data: claimed, error } = await admin.rpc("cred_claim_notifications", { p_rows: rows });
  if (error) throw new Error(error.message);

  const claimedKeys = new Set((claimed ?? []).map((r) => (typeof r === "string" ? r : r.cred_claim_notifications)));
  if (claimedKeys.size === 0) return { skipped: true };

  const email = build(claimedKeys);
  let status = "sent";
  let errorText = null;
  try {
    await sendEmail({ to: recipient, cc, ...email });
  } catch (err) {
    status = "failed";
    errorText = err.message.slice(0, 500);
  }

  await admin
    .from("cred_notification_log")
    .update({ status, error: errorText })
    .eq("kind", kind)
    .eq("recipient", recipient)
    .in("subject_key", [...claimedKeys]);

  return { status, count: claimedKeys.size, error: errorText };
}

// Daily: every item that reached a new rung of the org's alert ladder goes to
// its responsible person, with the owner in copy of everything (alcance §3.11).
export async function runAlerts(admin, { orgIds } = {}) {
  let q = admin.from("cred_organizations").select("id, name, owner_user_id, alert_days");
  if (orgIds) q = q.in("id", orgIds);
  const { data: orgs, error } = await q;
  if (error) throw new Error(error.message);

  const results = [];
  for (const org of orgs ?? []) {
    const items = computeAlerts(await gatherOrgData(admin, org.id), org.alert_days);
    if (items.length === 0) continue;

    const members = await membersWithEmail(admin, org.id);
    const owner = members.find((m) => m.user_id === org.owner_user_id);
    if (!owner) continue;

    // Unassigned (or assigned to someone who left) → the owner.
    const groups = new Map();
    for (const item of items) {
      const assignee = members.find((m) => m.user_id === item.assignee) ?? owner;
      if (!groups.has(assignee.user_id)) groups.set(assignee.user_id, { person: assignee, items: [] });
      groups.get(assignee.user_id).items.push(item);
    }

    for (const { person, items: group } of groups.values()) {
      const outcome = await claimAndSend(admin, {
        orgId: org.id,
        kind: "alert",
        recipient: person.email,
        cc: person.user_id === owner.user_id ? null : owner.email,
        keys: group.map((i) => i.subjectKey),
        build: (keys) => renderAlertEmail(org.name, group.filter((i) => keys.has(i.subjectKey))),
      });
      results.push({ org: org.id, to: person.email, ...outcome });
    }
  }
  return results;
}

// Monday of the current week (US Eastern): the digest's once-a-week key.
export function weekStartISO() {
  const today = todayISO();
  const [y, m, d] = today.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday
  return addDays(today, weekday === 0 ? -6 : 1 - weekday);
}

// Weekly: each person on the account gets the digest for the clients they can
// see. Nothing to report → no email.
export async function runDigest(admin, { orgIds } = {}) {
  let q = admin.from("cred_organizations").select("id, name");
  if (orgIds) q = q.in("id", orgIds);
  const { data: orgs, error } = await q;
  if (error) throw new Error(error.message);

  const week = weekStartISO();
  const results = [];
  for (const org of orgs ?? []) {
    const data = await gatherOrgData(admin, org.id);
    const members = await membersWithEmail(admin, org.id);

    for (const person of members) {
      const canSee = (clientId) => person.role === "owner" || !person.client_ids || person.client_ids.includes(clientId);
      const digest = computeDigest(data, canSee);
      if (!digest.queue.length && !digest.stalled.length && !digest.expirations.length) continue;

      const outcome = await claimAndSend(admin, {
        orgId: org.id,
        kind: "digest",
        recipient: person.email,
        cc: null,
        keys: [`digest:${week}`],
        build: () => renderDigestEmail(org.name, digest),
      });
      results.push({ org: org.id, to: person.email, ...outcome });
    }
  }
  return results;
}
