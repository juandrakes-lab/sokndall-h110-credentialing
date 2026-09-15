import Link from "next/link";
import { getAppContext, providerCount } from "@/lib/org";
import { practiceIssues } from "@/lib/consistency";
import { PLANS } from "@/lib/plans";
import { recheckPracticeNppes, savePractice } from "@/lib/practice-actions";
import { Card, CardHeader, PageHeader } from "@/components/app/ui";
import DataCheck from "@/components/app/DataCheck";
import PracticeForm from "@/components/app/PracticeForm";
import { updateAlertDays, updateOrganization, updateProfile } from "./actions";
import ProfileForm from "./ProfileForm";
import OrganizationForm from "./OrganizationForm";
import AlertDaysForm from "./AlertDaysForm";
import BillingCard from "./BillingCard";
import TeamCard from "./TeamCard";
import { DeleteAccountForm } from "./TeamForms";
import { deleteAccount } from "@/lib/billing-actions";
import { accountAccess } from "@/lib/billing";
import { pendingSeatChange } from "@/lib/seats";

function sentAt(iso) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
}

export default async function SettingsPage({ searchParams }) {
  const sp = await searchParams;
  const { supabase, user, org, role, practice, clients, multiClient } = await getAppContext();
  const owner = role === "owner";
  const [used, { data: log }, { data: directory }, { data: access }, { data: invitations }] = await Promise.all([
    providerCount(supabase, org.id),
    // RLS: only the owner can read the log and the invitations.
    supabase.from("cred_notification_log").select("*").eq("org_id", org.id).order("created_at", { ascending: false }).limit(40),
    supabase.rpc("cred_org_directory"),
    supabase.from("cred_org_members").select("user_id, client_ids").eq("org_id", org.id),
    supabase.from("cred_invitations").select("*").eq("org_id", org.id).order("created_at", { ascending: false }),
  ]);
  // Billing Co with extra users: a decrease may be scheduled for the renewal.
  const seatChange =
    owner && org.plan === "billing_co" && org.user_limit > 10 && org.polar_subscription_id
      ? await pendingSeatChange(org.polar_subscription_id).catch(() => null)
      : null;
  const clientIdsOf = new Map((access ?? []).map((m) => [m.user_id, m.client_ids]));
  const members = (directory ?? []).map((m) => ({ ...m, client_ids: clientIdsOf.get(m.user_id) ?? null }));
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
            title={clients.length > 1 ? `Practice · ${practice.legal_name}` : "Practice"}
            description={
              clients.length > 1
                ? "The practice of the client you have open. Legal name, group NPI, TIN and addresses — what every payer application asks for."
                : "Legal name, group NPI, TIN and addresses — what every payer application asks for."
            }
          />
          <div className="px-5 py-6">
            <PracticeForm key={practice.id} action={savePractice} practice={practice} submitLabel="Save practice" />
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
                ["Users", `${members.length} of ${org.user_limit}`],
                ...(multiClient ? [["Clients", String(clients.length)]] : []),
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

      {owner && <BillingCard org={org} providersUsed={used} requestedPlan={sp.plan_change} resubscribed={sp.resubscribed === "1"} />}

      {owner && (
        <TeamCard
          org={org}
          members={members}
          invitations={invitations ?? []}
          writable={accountAccess(org).writable}
          clients={multiClient ? clients.map((c) => ({ id: c.id, name: c.name })) : null}
          seatChange={seatChange}
        />
      )}

      <Card>
        <CardHeader title="Your name" description="How the rest of the team sees you — as responsible for an item, and in every history entry." />
        <div className="px-5 py-6">
          <ProfileForm
            action={updateProfile}
            firstName={user.user_metadata?.first_name ?? user.user_metadata?.full_name?.split(" ")[0] ?? ""}
            lastName={user.user_metadata?.last_name ?? user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ?? ""}
            email={user.email}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Account" />
        <div className="px-5 py-6">
          <OrganizationForm action={updateOrganization} org={org} canEdit={owner} />
        </div>
      </Card>

      {owner && (
        <Card className="border-status-expired/30">
          <CardHeader title="Delete account" />
          <div className="px-5 py-5">
            <DeleteAccountForm action={deleteAccount} orgName={org.name} />
          </div>
        </Card>
      )}
    </div>
  );
}
