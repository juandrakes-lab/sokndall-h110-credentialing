import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { loadFollowUps } from "@/lib/follow-ups";
import { daysUntil, formatDate } from "@/lib/credentials";
import { parseCellKey, weekEndISO } from "@/lib/enrollments";
import { Card, EmptyState, ICONS, PageHeader, SectionPill, StatCard, StatRow, Tabs, buttonClass } from "@/components/app/ui";
import FollowUpList from "@/components/app/FollowUpList";
import EnrollmentPanel from "../enrollments/EnrollmentPanel";

// The Monday-morning screen (alcance §3.6): what the payers are waiting on,
// what is late, what is due before Sunday, and what has gone quiet. Each
// person can narrow it to what's theirs (rev. 2026-09-18).
export default async function FollowUpsPage({ searchParams }) {
  const sp = await searchParams;
  const open = parseCellKey(sp.open);
  const mine = sp.mine === "1";
  const { supabase, user, role } = await getAppContext();
  const data = await loadFollowUps(supabase);
  const { lastContact, directory } = data;

  // An application with nobody assigned belongs to the account owner (§3.5).
  const isMine = (e) => e.assigned_user_id === user.id || (!e.assigned_user_id && role === "owner");
  const only = (list) => (mine ? list.filter(isMine) : list);
  const queue = only(data.queue);
  const stalled = only(data.stalled);
  const requests = only(data.requests);

  const overdue = queue.filter((e) => daysUntil(e.next_follow_up_date) < 0);
  const today = queue.filter((e) => daysUntil(e.next_follow_up_date) === 0);
  const later = queue.filter((e) => daysUntil(e.next_follow_up_date) > 0);
  const basePath = mine ? "/follow-ups?mine=1" : "/follow-ups";
  const listPath = "/follow-ups";
  const listParams = mine ? { mine: "1" } : {};

  const groups = [
    { key: "overdue", title: "Overdue", tone: "red", icon: ICONS.alert, items: overdue, note: "Past their follow-up date." },
    { key: "today", title: "Due today", tone: "amber", icon: ICONS.phone, items: today, note: null },
    { key: "later", title: "Later this week", tone: "brand", icon: ICONS.calendar, items: later, note: `Through Sunday, ${formatDate(weekEndISO())}.` },
  ].filter((g) => g.items.length > 0);

  const team = directory.length > 1;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Follow-ups"
        description="Every application waiting on a payer — or a payer waiting on you — in the order to work it. Open one to log the call and set the next date."
        actions={
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
          <a href="/export/follow-ups" className={buttonClass("secondary")}>
            Export CSV
          </a>
        }
      />

      {team && (
        <Tabs
          Link={Link}
          active={mine ? "mine" : "all"}
          tabs={[
            { key: "all", label: "Everyone", href: "/follow-ups" },
            { key: "mine", label: "Assigned to me", href: "/follow-ups?mine=1" },
          ]}
        />
      )}

      <StatRow>
        <StatCard label="Payer requests" value={requests.length} icon={ICONS.alert} tone={requests.length ? "amber" : "green"} hint={requests.length ? "Payers waiting on you." : "No payer is waiting on you."} />
        <StatCard label="Overdue" value={overdue.length} icon={ICONS.phone} tone={overdue.length ? "red" : "green"} hint={overdue.length ? "Call these first." : "Nothing is late."} />
        <StatCard label="Stalled" value={stalled.length} icon={ICONS.pause} tone={stalled.length ? "amber" : "green"} hint="With the payer, no status change in 30+ days." />
      </StatRow>

      {requests.length > 0 && (
        <section id="requests" className="flex scroll-mt-20 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionPill icon={ICONS.alert} tone="amber" count={requests.length}>
              Payer requests
            </SectionPill>
            <p className="text-sm text-ink-500">The payer asked for something. Until it&apos;s sent, the application doesn&apos;t move.</p>
          </div>
          <Card className="overflow-hidden">
            <FollowUpList items={requests} lastContact={lastContact} directory={directory} basePath={listPath} params={listParams} mode="requests" />
          </Card>
        </section>
      )}

      {queue.length === 0 ? (
        <Card>
          <EmptyState
            title={mine ? "Nothing of yours to chase this week" : "Nothing to chase this week"}
            description="When you submit an application or log a call, its next follow-up date lands here the week it's due."
            action={
              <Link href="/enrollments" className={buttonClass("primary")}>
                Open the matrix
              </Link>
            }
          />
        </Card>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SectionPill icon={g.icon} tone={g.tone} count={g.items.length}>
                {g.title}
              </SectionPill>
              {g.note && <p className="text-sm text-ink-500">{g.note}</p>}
            </div>
            <Card className="overflow-hidden">
              <FollowUpList items={g.items} lastContact={lastContact} directory={directory} basePath={listPath} params={listParams} />
            </Card>
          </section>
        ))
      )}

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionPill icon={ICONS.pause} tone={stalled.length ? "amber" : "neutral"} count={stalled.length}>
            Stalled
          </SectionPill>
          <p className="text-sm text-ink-500">With the payer and no status change in more than 30 days.</p>
        </div>
        <Card className="overflow-hidden">
          {stalled.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-500">No stalled applications.</p>
          ) : (
            <FollowUpList items={stalled} lastContact={lastContact} directory={directory} basePath={listPath} params={listParams} mode="stalled" />
          )}
        </Card>
      </section>

      {open && <EnrollmentPanel key={sp.open} providerId={open.providerId} payerId={open.payerId} closeHref={basePath} />}
    </div>
  );
}
