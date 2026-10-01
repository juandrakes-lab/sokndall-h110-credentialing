import { sendEmail } from "@/lib/resend";
import { NURTURE_STEPS, renderNurtureEmail, thirdStepFor } from "@/lib/nurture-emails";

// The template follow-up sequence, run daily by app/api/cron/template-nurture
// with the service-role client (the only caller).
//
//   - At most one email per lead per run. A lead that is behind (the leads
//     from before this shipped) gets its next pending step, never several.
//   - A step is due on its day counted from delivered_at, and at least 3 days
//     after the previous one actually went out.
//   - The row in template_lead_emails is claimed before sending (primary key
//     lead_id + step), so a second run — or two runs at once — can't send the
//     same step twice. A failed send releases the claim for the next run.
//   - unsubscribed_at is re-read right before each send, not at the start.

const DAY = 24 * 60 * 60 * 1000;
const MIN_GAP_DAYS = 3;
const REPLY_TO = "hello@sokndall.com";
const SITE = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sokndall.com").replace(/\/$/, "");

// The four steps for this lead, the third chosen by email domain.
function sequenceFor(email) {
  const third = thirdStepFor(email);
  return NURTURE_STEPS.filter((s) => s.step !== (third === "e3" ? "e3b" : "e3"));
}

export function nextStep(lead, sent, now = Date.now()) {
  const done = new Set(sent.map((s) => s.step));
  const pending = sequenceFor(lead.email).find((s) => !done.has(s.step));
  if (!pending) return null;
  const dueAt = new Date(lead.delivered_at).getTime() + pending.day * DAY;
  if (now < dueAt) return null;
  const lastSent = Math.max(0, ...sent.map((s) => new Date(s.sent_at).getTime()));
  if (lastSent && now < lastSent + MIN_GAP_DAYS * DAY) return null;
  return pending.step;
}

export async function runNurture(admin, { leadIds } = {}) {
  let query = admin
    .from("template_leads")
    .select("id, email, delivered_at, unsubscribe_token")
    .not("delivered_at", "is", null)
    .is("unsubscribed_at", null);
  if (leadIds) query = query.in("id", leadIds);
  const { data: leads, error } = await query;
  if (error) throw new Error(error.message);
  if (!leads.length) return [];

  const { data: sentRows, error: sentError } = await admin
    .from("template_lead_emails")
    .select("lead_id, step, sent_at")
    .in("lead_id", leads.map((l) => l.id));
  if (sentError) throw new Error(sentError.message);

  const results = [];
  for (const lead of leads) {
    const step = nextStep(lead, sentRows.filter((r) => r.lead_id === lead.id));
    if (!step) continue;

    // Unsubscribes land at any moment: check this lead right now.
    const { data: fresh } = await admin.from("template_leads").select("unsubscribed_at").eq("id", lead.id).single();
    if (!fresh || fresh.unsubscribed_at) {
      results.push({ lead: lead.id, step, status: "skipped_unsubscribed" });
      continue;
    }

    const { error: claimError } = await admin.from("template_lead_emails").insert({ lead_id: lead.id, step });
    if (claimError) {
      // 23505: another run already has this step.
      results.push({ lead: lead.id, step, status: claimError.code === "23505" ? "already_sent" : "error", error: claimError.message });
      continue;
    }

    const unsubscribeUrl = `${SITE()}/unsubscribe?t=${lead.unsubscribe_token}`;
    const { subject, text, html } = renderNurtureEmail(step, unsubscribeUrl);
    try {
      const sent = await sendEmail({
        to: lead.email,
        subject,
        text,
        html,
        replyTo: REPLY_TO,
        headers: {
          "List-Unsubscribe": `<${SITE()}/api/unsubscribe?t=${lead.unsubscribe_token}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      const now = new Date().toISOString();
      await admin.from("template_lead_emails").update({ resend_id: sent?.id ?? null, sent_at: now }).eq("lead_id", lead.id).eq("step", step);
      await admin.from("template_leads").update({ last_sent_at: now }).eq("id", lead.id);
      results.push({ lead: lead.id, step, status: "sent" });
    } catch (err) {
      await admin.from("template_lead_emails").delete().eq("lead_id", lead.id).eq("step", step);
      results.push({ lead: lead.id, step, status: "failed", error: err.message });
    }
  }
  return results;
}
