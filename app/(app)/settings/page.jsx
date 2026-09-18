import Link from "next/link";
import { getAppContext, providerCount } from "@/lib/org";
import { practiceIssues } from "@/lib/consistency";
import { PLANS } from "@/lib/plans";
import { recheckPracticeNppes, savePractice } from "@/lib/practice-actions";
import { Card, CardHeader, ICONS, PageHeader, StatCard, StatRow, Tabs } from "@/components/app/ui";
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

// One setting group: what it is on the left, the controls on the right, so a
// long page reads as a few separate subjects instead of one strip of forms.
function Section({ title, description, children }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-8">
      <div className="lg:pt-1">
        <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-900">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-ink-500">{description}</p>}
      </div>
      <div className="flex min-w-0 flex-col gap-5">{children}</div>
    </section>
  );
}

export default async function SettingsPage({ searchParams }) {
  const sp = await searchParams;
  const { supabase, user, org, role, practice, clients, multiClient } = await getAppContext();
  const owner = role === "owner";

  const TABS = [
    { key: "practice", label: "Practice" },
    ...(owner ? [{ key: "team", label: "Team" }] : []),
    ...(owner ? [{ key: "billing", label: "Plan & billing" }] : []),
    { key: "alerts", label: "Email alerts" },
    { key: "you", label: "You & account" },
  ];
  const wanted = sp.plan_change || sp.resubscribed === "1" ? "billing" : sp.tab;
  const tab = TABS.some((t) => t.key === wanted) ? wanted : "practice";

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
    <div className="flex flex-col gap-2">
      <PageHeader title="Settings" description="Your practice, your team, your plan and what Sokndall emails you." />

      <Tabs tabs={TABS.map((t) => ({ ...t, href: t.key === "practice" ? "/settings" : `/settings?tab=${t.key}` }))} active={tab} Link={Link} />

      {tab === "practice" && (
        <div className="flex flex-col gap-10">
          <Section
            title={clients.length > 1 ? `Practice · ${practice.legal_name}` : "Practice"}
            description={
              clients.length > 1
                ? "The practice of the client you have open. Legal name, group NPI, TIN and addresses — what every payer application asks for."
                : "Legal name, group NPI, TIN and addresses — what every payer application asks for."
            }
          >
            <Card>
              <div className="px-5 py-6">
                <PracticeForm key={practice.id} action={savePractice} practice={practice} submitLabel="Save practice" />
              </div>
            </Card>
          </Section>

          {!owner && (
            <Section title="Plan" description="What this account's plan covers. Only the owner can change it.">
              <StatRow>
                <StatCard label="Plan" value={plan.label} suffix={`$${plan.price}/mo`} icon={ICONS.card} />
                <StatCard label="Providers" value={used} suffix={`of ${org.provider_limit}`} icon={ICONS.providers} meter={used / org.provider_limit} />
                <StatCard label="Document storage" value={plan.storageLabel} icon={ICONS.documents} />
              </StatRow>
            </Section>
          )}

          <Section title="Data check" description="What the NPI Registry says about this practice, next to what you have on file.">
            <DataCheck
              issues={practiceIssues(practice)}
              checkedAt={practice.nppes_checked_at}
              recheckAction={practice.group_npi ? recheckPracticeNppes : null}
              subject="the practice"
            />
          </Section>
        </div>
      )}

      {tab === "team" && owner && (
        <Section title="Team" description="Who can sign in, and — on Billing Co — which clients each person can open.">
          <TeamCard
            org={org}
            members={members}
            invitations={invitations ?? []}
            writable={accountAccess(org).writable}
            clients={multiClient ? clients.map((c) => ({ id: c.id, name: c.name })) : null}
            seatChange={seatChange}
          />
        </Section>
      )}

      {tab === "billing" && owner && (
        <div className="flex flex-col gap-10">
          <Section title="What you're using" description="Your plan's limits and how much of each you have in use today.">
            <StatRow>
              <StatCard label="Plan" value={plan.label} suffix={`$${plan.price}/mo`} icon={ICONS.card} />
              <StatCard label="Providers" value={used} suffix={`of ${org.provider_limit}`} icon={ICONS.providers} meter={used / org.provider_limit} />
              <StatCard
                label="Users"
                value={members.length}
                suffix={`of ${org.user_limit}`}
                icon={ICONS.team}
                meter={members.length / org.user_limit}
                hint={multiClient ? `${clients.length} client${clients.length === 1 ? "" : "s"} · ${plan.storageLabel} of storage` : `${plan.storageLabel} of storage`}
              />
            </StatRow>
          </Section>

          <Section title="Plan & billing" description="Change plan, update the card or cancel. Invoices live in the Polar portal.">
            <BillingCard org={org} providersUsed={used} requestedPlan={sp.plan_change} resubscribed={sp.resubscribed === "1"} />
          </Section>
        </div>
      )}

      {tab === "alerts" && (
        <div className="flex flex-col gap-10">
          <Section
            title="Email alerts"
            description="Deadline alerts go to whoever is responsible for the item, with the account owner copied on all of them. A digest of the week goes out every Monday."
          >
            <Card>
              <div className="flex flex-col gap-5 px-5 py-6">
                <AlertDaysForm action={updateAlertDays} initial={org.alert_days.join(", ")} canEdit={owner} />
                {owner && (
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
            </Card>
          </Section>

          {owner && (
            <Section title="Recently sent" description="The last emails Sokndall sent for this account.">
              <Card>
                {emails.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-ink-500">No emails sent yet. Alerts go out each morning when something reaches one of your alert days.</p>
                ) : (
                  <ul className="divide-y divide-ink-100">
                    {emails.slice(0, 10).map((e) => (
                      <li key={e.id} className="flex items-start justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink-900">
                            {e.kind === "digest" ? "Weekly digest" : `Alert · ${e.items} item${e.items === 1 ? "" : "s"}`}
                          </p>
                          <p className="truncate text-xs text-ink-700">
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
              </Card>
            </Section>
          )}
        </div>
      )}

      {tab === "you" && (
        <div className="flex flex-col gap-10">
          <Section title="Your name" description="How the rest of the team sees you — as responsible for an item, and in every history entry. If you sign in with Google, your Google photo appears next to it.">
            <Card>
              <div className="px-5 py-6">
                <ProfileForm
                  action={updateProfile}
                  firstName={user.user_metadata?.first_name ?? user.user_metadata?.full_name?.split(" ")[0] ?? ""}
                  lastName={user.user_metadata?.last_name ?? user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ?? ""}
                  email={user.email}
                />
              </div>
            </Card>
          </Section>

          <Section title="Account" description="The account name on invoices and emails.">
            <Card>
              <div className="px-5 py-6">
                <OrganizationForm action={updateOrganization} org={org} canEdit={owner} />
              </div>
            </Card>
          </Section>

          {owner && (
            <Section title="Delete account" description="Closes the subscription and erases everything. There is no undo.">
              <Card className="ring-status-expired/25">
                <CardHeader title="Delete account" icon={ICONS.alert} divider={false} />
                <div className="px-5 pb-6">
                  <DeleteAccountForm action={deleteAccount} orgName={org.name} />
                </div>
              </Card>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}
