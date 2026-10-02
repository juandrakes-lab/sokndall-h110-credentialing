import { sendEmail } from "@/lib/resend";
import { NURTURE_STEPS, renderNurtureEmail, thirdStepFor } from "@/lib/nurture-emails";

// The template follow-up sequence, run daily by app/api/cron/template-nurture
// with the service-role client (the only caller).
//
//   - At most one email per lead per run. A lead that is behind (the leads
//     from before this shipped) gets its next pending step, never several.
//   - A step is due on its day counted from delivered_at, and at least 3 days
//     after the previous one actually went out (calendar days, see below).
//   - The row in template_lead_emails is claimed before sending (primary key
//     lead_id + step), so a second run — or two runs at once — can't send the
//     same step twice. A failed send releases the claim for the next run.
//   - unsubscribed_at is re-read right before each send, not at the start.

const DAY = 24 * 60 * 60 * 1000;
const MIN_GAP_DAYS = 3;
// Signed by Juan, so sent as Juan, from the mailbox the replies go to.
const FROM = "Juan from Sokndall <hello@sokndall.com>";
const REPLY_TO = "hello@sokndall.com";
const SITE = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sokndall.com").replace(/\/$/, "");

// The four steps for this lead, the third chosen by email domain.
function sequenceFor(email) {
  const third = thirdStepFor(email);
  return NURTURE_STEPS.filter((s) => s.step !== (third === "e3" ? "e3b" : "e3"));
}

// Days are calendar days (UTC), not 24-hour blocks: the cron runs once a day,
// so counting hours would push anyone who signed up later in the day than the
// run's hour to the following day (a lead from Sep 30 10:04 missed Oct 2's
// 09:42 run by 22 minutes). Signed up on the 30th → e1 in the run on the 2nd.
const dayNumber = (t) => Math.floor(new Date(t).getTime() / DAY);

export function nextStep(lead, sent, now = Date.now()) {
  const done = new Set(sent.map((s) => s.step));
  const pending = sequenceFor(lead.email).find((s) => !done.has(s.step));
  if (!pending) return null;
  const today = dayNumber(now);
  if (today < dayNumber(lead.delivered_at) + pending.day) return null;
  const lastSent = sent.length ? Math.max(...sent.map((s) => dayNumber(s.sent_at))) : null;
  if (lastSent !== null && today < lastSent + MIN_GAP_DAYS) return null;
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
        from: FROM,
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
