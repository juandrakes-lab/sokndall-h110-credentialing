import { PLANS } from "@/lib/plans";
import { monthlyPrice } from "@/lib/seats";
import { addDays, todayISO } from "@/lib/credentials";
import { gatherOrgData } from "@/lib/notifications/data";
import { computeDigest } from "@/lib/notifications/compute";
import { claimAndSend } from "@/lib/notifications/send";

// The trial emails (H110_CONVERSION_PEDIDO_DEV_1, D2; copy from
// H110_CONVERSION_EMAILS_v1.md §5 and §6, word for word). Plain text with the
// same minimal HTML as the template follow-ups, because Juan signs them.
// Service-role only: called from the Polar webhook and the daily alerts cron.
// Each one is claimed in cred_notification_log first, so a repeated webhook
// or a cron that runs twice never sends anything twice.

const FROM = "Juan from Sokndall <hello@sokndall.com>";
const HELLO = "hello@sokndall.com";

// The welcome's last paragraph offers to import an emailed spreadsheet. It is
// covered by the privacy policy's P2 paragraph, which ships with it.
const OFFER_EMAILED_IMPORT = true;

const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// paragraphs: string[][] — each inner array is one paragraph's lines.
function plainEmail(subject, paragraphs) {
  return {
    subject,
    text: paragraphs.map((lines) => lines.join("\n")).join("\n\n"),
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#0e2a2e;max-width:520px">
${paragraphs.map((lines) => `<p>${lines.map(escapeHtml).join("<br>")}</p>`).join("\n")}
</div>`,
  };
}

// "October 19", from a timestamp, in UTC like the rest of the trial dates.
const longDate = (iso) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(iso));

const planPrice = (org) => (org.plan === "billing_co" ? monthlyPrice(org.user_limit) : PLANS[org.plan]?.price);

async function ownerEmail(admin, userId) {
  const { data } = await admin.auth.admin.getUserById(userId);
  return data?.user?.email ?? null;
}

export function welcomeEmail(trialEnd) {
  const paragraphs = [
    ["Hi,"],
    ["Thanks for starting the trial. There's no sales team at Sokndall, so if you reply to this email, it comes to me."],
    ["Sokndall only shows what it can do once real data is in it. Here's where I'd start:"],
    [
      "1. Add your providers, or import them from a CSV under Import / Export. Each NPI gets checked against the NPI Registry as it comes in.",
      "2. Add the credentials that expire: license, DEA, malpractice, board certification, CAQH attestation. The alerts run off the dates you enter.",
      "3. Open the Enrollments matrix and set a status for each payer application you have going.",
    ],
    ["Monday morning you'll get your first weekly digest, with what needs a follow-up that week."],
    [`Your trial runs until ${longDate(trialEnd)}. Nothing is charged before then, and you can cancel from Settings whenever you want.`],
    ...(OFFER_EMAILED_IMPORT
      ? [["If you'd rather not type it all in, reply with your spreadsheet (provider data only, never patient information). I'll import it into your account myself and then delete the file."]]
      : []),
    ["Juan", "Sokndall"],
  ];
  return plainEmail("Your Sokndall trial: the first 10 minutes", paragraphs);
}

export function trialEndingEmail({ trialEnd, price, planLabel, counts }) {
  const date = longDate(trialEnd);
  const summary =
    counts.providers === 0
      ? [["Your account is still empty. If getting set up is what's in the way, reply and tell me what you're working from now, and I'll help you get it in before the trial ends."]]
      : [
          ["Here's what's in your account so far:"],
          [
            `- ${counts.providers} providers and ${counts.credentials} credentials`,
            `- ${counts.expiring90} credentials that expire in the next 90 days`,
            `- ${counts.followupsWeek} payer applications with a follow-up due this week`,
          ],
        ];
  return plainEmail(`Your trial ends on ${date}`, [
    ["Hi,"],
    [`Your Sokndall trial ends on ${date}. That day your card gets charged $${price} for the ${planLabel} plan, and then every month after.`],
    ...summary,
    [`If it's not for you, cancel from Settings before ${date} and you won't be charged. You can take everything out as CSV from Import / Export first.`],
    ["Juan", "Sokndall"],
  ]);
}

// The internal notice to hello@. Where the account came from, as recorded at
// sign-up (the org's own attribution columns) and, if the owner first asked
// for the free template, when.
async function newTrialNotice(admin, org, email) {
  const plan = PLANS[org.plan];
  const { data: lead } = await admin
    .from("template_leads")
    .select("created_at")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  const lines = [
    [`Plan: ${plan?.label ?? org.plan} ($${planPrice(org)}/month)`, `Trial ends: ${org.trial_ends_at ? longDate(org.trial_ends_at) : "(unknown)"}`, `Owner: ${email}`, `Account: ${org.name}`],
    [
      `utm_source: ${org.utm_source ?? "(none)"}`,
      `utm_campaign: ${org.utm_campaign ?? "(none)"}`,
      `landing_path: ${org.landing_path ?? "(none)"}`,
    ],
    ...(lead ? [[`Came from the free template (requested ${longDate(lead.created_at)})`]] : []),
  ];
  return plainEmail(`New trial: ${plan?.label ?? org.plan} · ${email}`, lines);
}

// After the webhook applied a subscription: if this is a trial that started
// in the last two days and hasn't been welcomed, send the welcome to the
// owner and the notice to hello@. Never throws — a failure here must not
// break the webhook.
export async function sendTrialStartEmails(admin, orgId) {
  try {
    const { data: org, error } = await admin
      .from("cred_organizations")
      .select("id, name, plan, user_limit, owner_user_id, subscription_status, trial_ends_at, created_at, utm_source, utm_campaign, landing_path")
      .eq("id", orgId)
      .single();
    if (error || !org) return { skipped: "no org" };
    if (org.subscription_status !== "trialing" || !org.trial_ends_at) return { skipped: "not a trial" };
    if (Date.now() - new Date(org.created_at).getTime() > 2 * 86400000) return { skipped: "not new" };

    const email = await ownerEmail(admin, org.owner_user_id);
    if (!email) return { skipped: "no owner email" };

    const welcome = await claimAndSend(admin, {
      orgId,
      kind: "trial_start",
      recipient: email,
      keys: [`welcome:${orgId}`],
      build: () => ({ ...welcomeEmail(org.trial_ends_at), from: FROM, replyTo: HELLO }),
    });
    const notice = await newTrialNotice(admin, org, email);
    const internal = await claimAndSend(admin, {
      orgId,
      kind: "trial_start",
      recipient: HELLO,
      keys: [`notice:${orgId}`],
      build: () => notice,
    });
    return { welcome, internal };
  } catch (err) {
    console.error(`trial start emails failed for ${orgId}: ${err.message}`);
    return { error: err.message };
  }
}

// The account summary in the pre-charge email, from the same data and
// functions the weekly digest uses.
async function accountCounts(admin, orgId) {
  const data = await gatherOrgData(admin, orgId);
  const activeIds = new Set([...data.providers.values()].filter((p) => p.status === "active").map((p) => p.id));
  const digest = computeDigest(data);
  const { count: credentials } = await admin
    .from("cred_credentials")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .in("provider_id", activeIds.size ? [...activeIds] : ["00000000-0000-0000-0000-000000000000"]);
  return {
    providers: activeIds.size,
    credentials: credentials ?? 0,
    expiring90: digest.expirations.filter((i) => i.kind === "credential").length,
    followupsWeek: digest.queue.length,
  };
}

// Daily (from the expiration-alerts cron): owners whose trial ends in 3 days,
// still trialing and not set to cancel. Once per org and trial end date.
export async function runTrialEndingNotices(admin, { orgIds } = {}) {
  const target = addDays(todayISO(), 3);
  let query = admin
    .from("cred_organizations")
    .select("id, plan, user_limit, owner_user_id, trial_ends_at")
    .eq("subscription_status", "trialing")
    .eq("cancel_at_period_end", false)
    .not("trial_ends_at", "is", null);
  if (orgIds) query = query.in("id", orgIds);
  const { data: orgs, error } = await query;
  if (error) throw new Error(error.message);

  const results = [];
  for (const org of orgs ?? []) {
    if (org.trial_ends_at.slice(0, 10) !== target) continue;
    try {
      const email = await ownerEmail(admin, org.owner_user_id);
      if (!email) continue;
      const counts = await accountCounts(admin, org.id);
      const result = await claimAndSend(admin, {
        orgId: org.id,
        kind: "trial_ending",
        recipient: email,
        keys: [`trial_ending:${org.id}:${org.trial_ends_at.slice(0, 10)}`],
        build: () => ({
          ...trialEndingEmail({ trialEnd: org.trial_ends_at, price: planPrice(org), planLabel: PLANS[org.plan]?.label ?? org.plan, counts }),
          from: FROM,
          replyTo: HELLO,
        }),
      });
      results.push({ org: org.id, ...result, counts });
    } catch (err) {
      results.push({ org: org.id, status: "failed", error: err.message });
    }
  }
  return results;
}
