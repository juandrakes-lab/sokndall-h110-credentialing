import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { gatherOrgData } from "@/lib/notifications/data";
import { computeAlerts, computeDigest } from "@/lib/notifications/compute";
import { renderAlertEmail, renderDigestEmail } from "@/lib/notifications/email";
import { Card, PageHeader, buttonClass } from "@/components/app/ui";

const KINDS = {
  alert: { label: "Alert email", empty: "Nothing is at an alert point today, so no alert email would go out." },
  digest: { label: "Weekly digest", empty: "Nothing to report this week, so no digest would go out." },
};

// What the alert or digest email looks like with today's data, inside the
// app. Read through the owner's own session (RLS applies); nothing is sent.
export default async function EmailPreviewPage({ params }) {
  const { kind } = await params;
  if (!KINDS[kind]) notFound();

  // Emails cover every client, not only the one open in the app.
  const { supabaseAll: supabase, org, role } = await getAppContext();
  const back = (
    <Link href="/settings" className="hover:text-ink-900">
      ← Settings
    </Link>
  );

  if (role !== "owner") {
    return (
      <div>
        <PageHeader eyebrow={back} title="Email preview" />
        <p className="text-sm text-ink-500">Only the account owner can preview emails.</p>
      </div>
    );
  }

  // Links inside the preview open this app, not the live site.
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;

  const data = await gatherOrgData(supabase, org.id);
  let html = null;
  if (kind === "alert") {
    const items = computeAlerts(data, org.alert_days);
    if (items.length) html = renderAlertEmail(org.name, items, { baseUrl: origin }).html;
  } else {
    const digest = computeDigest(data);
    if (digest.queue.length || digest.stalled.length || digest.expirations.length) {
      html = renderDigestEmail(org.name, digest, { baseUrl: origin }).html;
    }
  }

  // Clicking a link in the email navigates the whole app, not the frame.
  const srcDoc = html?.replace("<html>", '<html><head><base target="_top"></head>');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={back}
        title="Email preview"
        description="Exactly what would be sent today, with your data. Nothing is sent from this page."
        actions={
          <div className="flex gap-2">
            {Object.entries(KINDS).map(([key, k]) => (
              <Link key={key} href={`/settings/email-preview/${key}`} className={buttonClass(key === kind ? "primary" : "secondary", "sm")}>
                {k.label}
              </Link>
            ))}
          </div>
        }
      />
      <Card className="overflow-hidden">
        {srcDoc ? (
          <iframe
            title={KINDS[kind].label}
            srcDoc={srcDoc}
            // No scripts ever run in the preview; links may navigate the app.
            sandbox="allow-same-origin allow-top-navigation"
            className="block h-[48rem] w-full border-0 bg-ink-50"
          />
        ) : (
          <p className="px-5 py-8 text-sm text-ink-500">{KINDS[kind].empty}</p>
        )}
      </Card>
    </div>
  );
}
