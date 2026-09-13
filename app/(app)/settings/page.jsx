import Link from "next/link";
import { getAppContext, providerCount } from "@/lib/org";
import { practiceIssues } from "@/lib/consistency";
import { PLANS } from "@/lib/plans";
import { recheckPracticeNppes, savePractice } from "@/lib/practice-actions";
import { Card, CardHeader, PageHeader } from "@/components/app/ui";
import DataCheck from "@/components/app/DataCheck";
import PracticeForm from "@/components/app/PracticeForm";
import { updateAlertDays, updateOrganization } from "./actions";
import OrganizationForm from "./OrganizationForm";
import AlertDaysForm from "./AlertDaysForm";

function sentAt(iso) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
}

export default async function SettingsPage() {
  const { supabase, org, role, practice } = await getAppContext();
  const [used, { data: log }] = await Promise.all([
    providerCount(supabase, org.id),
    // RLS: only the owner can read the log.
    supabase.from("cred_notification_log").select("*").eq("org_id", org.id).order("created_at", { ascending: false }).limit(40),
  ]);
  // One email covers several items (several log rows); show each email once.
  const emails = [];
  for (const row of log ?? []) {
    const last = emails[emails.length - 1];
    if (last && last.kind === row.kind && last.recipient === row.recipient && last.status === row.status && Math.abs(new Date(last.created_at) - new Date(row.created_at)) < 60000) {
      last.items += 1;
    } else {
      emails.push({ ...row, items: 1 });
    }
  }
  const plan = PLANS[org.plan];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" />

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Practice"
            description="Legal name, group NPI, TIN and addresses — what every payer application asks for."
          />
          <div className="px-5 py-6">
            <PracticeForm action={savePractice} practice={practice} submitLabel="Save practice" />
          </div>
        </Card>

        <div className="flex flex-col gap-8">
          <DataCheck
            issues={practiceIssues(practice)}
            checkedAt={practice.nppes_checked_at}
            recheckAction={practice.group_npi ? recheckPracticeNppes : null}
            subject="the practice"
          />

          <Card>
            <CardHeader title="Plan" />
            <dl className="divide-y divide-ink-100 text-sm">
              {[
                ["Plan", `${plan.label} · $${plan.price}/month`],
                ["Providers", `${used} of ${org.provider_limit} in use`],
                ["Users", `${org.user_limit}`],
                ["Document storage", plan.storageLabel],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-ink-500">{label}</dt>
                  <dd className="text-right font-medium text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Email alerts"
          description="Deadline alerts go to whoever is responsible for the item, with the account owner copied on all of them. A digest of the week goes out every Monday."
        />
        <div className="grid gap-8 px-5 py-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <AlertDaysForm action={updateAlertDays} initial={org.alert_days.join(", ")} canEdit={role === "owner"} />
            {role === "owner" && (
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <Link href="/settings/email-preview/alert" className="font-medium text-brand-600 hover:underline">
                  Preview today&apos;s alert email
                </Link>
                <Link href="/settings/email-preview/digest" className="font-medium text-brand-600 hover:underline">
                  Preview this week&apos;s digest
                </Link>
              </div>
            )}
          </div>
          {role === "owner" && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink-900">Recently sent</h3>
              {emails.length === 0 ? (
                <p className="text-sm text-ink-500">No emails sent yet. Alerts go out each morning when something reaches one of your alert days.</p>
              ) : (
                <ul className="divide-y divide-ink-100 rounded-lg border border-ink-200 text-sm">
                  {emails.slice(0, 10).map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-3 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-ink-900">
                          {e.kind === "digest" ? "Weekly digest" : `Alert · ${e.items} item${e.items === 1 ? "" : "s"}`}
                        </p>
                        <p className="truncate text-xs text-ink-500">
                          To {e.recipient}
                          {e.cc && ` · copy to ${e.cc}`}
                        </p>
                        {e.status === "failed" && <p className="text-xs text-status-expired">Not delivered — will retry tomorrow.</p>}
                      </div>
                      <span className="shrink-0 text-xs text-ink-500">{sentAt(e.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Account" />
        <div className="px-5 py-6">
          <OrganizationForm action={updateOrganization} org={org} canEdit={role === "owner"} />
        </div>
      </Card>
    </div>
  );
}
