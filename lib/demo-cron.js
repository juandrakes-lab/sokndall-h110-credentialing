import { sendEmail } from "@/lib/resend";
import { DEMO_EVENTS, DEMO_KEEP_DAYS, DEMO_UNOPENED_DAYS, JUAN_EMAIL, demoEmail, demoSummary } from "@/lib/demo";

// Daily (rides on the expiration-alerts cron), admin client only: the demo
// accounts' lifecycle. Live demos get their prepared moments even if nobody
// opens a page; an ended demo sends Juan its summary once; demos past their
// keep window — or never opened within 7 days, plus the same 7 — are deleted
// with their user (everything under the organization cascades; demos can't
// hold files).
export async function runDemoLifecycle(admin) {
  const { data: demos, error } = await admin.from("cred_demos").select("*");
  if (error) throw new Error(error.message);
  const now = Date.now();
  const DAY = 86400000;
  const out = { ticked: 0, summaries: 0, deleted: 0 };

  for (const demo of demos ?? []) {
    const ends = demo.expires_at ? new Date(demo.expires_at).getTime() : null;
    const deadline = ends ? ends + DEMO_KEEP_DAYS * DAY : new Date(demo.created_at).getTime() + (DEMO_UNOPENED_DAYS + DEMO_KEEP_DAYS) * DAY;

    if (now > deadline) {
      const { data: org } = await admin.from("cred_organizations").select("owner_user_id").eq("id", demo.org_id).maybeSingle();
      if (org) await admin.auth.admin.deleteUser(org.owner_user_id);
      out.deleted++;
      continue;
    }

    if (ends && ends > now && !demo.revoked_at) {
      const { data: due } = await admin.rpc("cred_demo_tick", { p_org: demo.org_id });
      if (due?.length) {
        out.ticked++;
        if (demo.contact_email) {
          for (const key of due) {
            const e = DEMO_EVENTS[key];
            if (e) await sendEmail({ to: demo.contact_email, ...demoEmail(`Sokndall demo: ${e.title.toLowerCase()}`, [e.body, "Open the demo from the link you were sent to see it.", "Juan", "Sokndall"]) }).catch(() => {});
          }
        }
      }
    }

    if (ends && ends <= now && !demo.summary_sent_at) {
      const lines = await demoSummary(admin, demo);
      await sendEmail({ to: JUAN_EMAIL, ...demoEmail(`${demo.firm}'s demo ended — what they used`, [`${demo.lead_name ?? "The lead"} (${demo.firm})`, lines.join("\n"), `Sample data is deleted on ${new Date(deadline).toUTCString()}.`]) }).catch(() => {});
      await admin.from("cred_demos").update({ summary_sent_at: new Date().toISOString() }).eq("org_id", demo.org_id);
      out.summaries++;
    }
  }
  return out;
}

// The organizations that are demos: kept out of every real-customer job
// (alerts, digest, trial emails).
export async function demoOrgIds(admin) {
  const { data } = await admin.from("cred_demos").select("org_id");
  return new Set((data ?? []).map((d) => d.org_id));
}
