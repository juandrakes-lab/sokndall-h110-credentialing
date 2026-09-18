import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { loadFollowUps } from "@/lib/follow-ups";
import { daysUntil, formatDate } from "@/lib/credentials";
import { parseCellKey, weekEndISO } from "@/lib/enrollments";
import { Card, EmptyState, ICONS, PageHeader, SectionPill, StatCard, StatRow, buttonClass } from "@/components/app/ui";
import FollowUpList from "@/components/app/FollowUpList";
import EnrollmentPanel from "../enrollments/EnrollmentPanel";

// The Monday-morning screen (alcance §3.6): what is late, what is due before
// Sunday, and what has gone quiet with the payer.
export default async function FollowUpsPage({ searchParams }) {
  const sp = await searchParams;
  const open = parseCellKey(sp.open);
  const { supabase } = await getAppContext();
  const { queue, stalled, lastContact, directory } = await loadFollowUps(supabase);

  const overdue = queue.filter((e) => daysUntil(e.next_follow_up_date) < 0);
  const today = queue.filter((e) => daysUntil(e.next_follow_up_date) === 0);
  const later = queue.filter((e) => daysUntil(e.next_follow_up_date) > 0);

  const groups = [
    { key: "overdue", title: "Overdue", tone: "red", icon: ICONS.alert, items: overdue, note: "Past their follow-up date." },
    { key: "today", title: "Due today", tone: "amber", icon: ICONS.phone, items: today, note: null },
    { key: "later", title: "Later this week", tone: "brand", icon: ICONS.calendar, items: later, note: `Through Sunday, ${formatDate(weekEndISO())}.` },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Follow-ups"
        description="Every application waiting on a payer, in the order you should call. Open one to log the call and set the next date."
        actions={
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
          <a href="/export/follow-ups" className={buttonClass("secondary")}>
            Export CSV
          </a>
        }
      />

      <StatRow>
        <StatCard label="Overdue" value={overdue.length} icon={ICONS.alert} tone={overdue.length ? "red" : "green"} hint={overdue.length ? "Call these first." : "Nothing is late."} />
        <StatCard label="Due this week" value={today.length + later.length} icon={ICONS.phone} tone="brand" hint={`Through Sunday, ${formatDate(weekEndISO())}.`} />
        <StatCard
          label="Stalled"
          value={stalled.length}
          icon={ICONS.pause}
          tone={stalled.length ? "amber" : "green"}
          hint="With the payer, no status change in 30+ days."
        />
      </StatRow>

      {queue.length === 0 ? (
        <Card>
          <EmptyState
            title="Nothing to chase this week"
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
              <FollowUpList items={g.items} lastContact={lastContact} directory={directory} basePath="/follow-ups" />
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
            <FollowUpList items={stalled} lastContact={lastContact} directory={directory} basePath="/follow-ups" mode="stalled" />
          )}
        </Card>
      </section>

      {open && <EnrollmentPanel key={sp.open} providerId={open.providerId} payerId={open.payerId} closeHref="/follow-ups" />}
    </div>
  );
}
