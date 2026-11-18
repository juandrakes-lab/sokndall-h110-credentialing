import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { accountAccess } from "@/lib/billing";
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
  const { supabase, supabaseAll, user, role, org, clients, client, multiClient } = await getAppContext();
  const writable = accountAccess(org).writable;
  // "All clients" (pedido 2026-11-17, A1): the same lists across every client
  // this person can reach, each row naming its client.
  const canAll = multiClient && clients.length > 1;
  const all = canAll && sp.scope === "all";
  const data = await loadFollowUps(all ? supabaseAll : supabase);
  const { lastContact, directory } = data;
  const owner = role === "owner";
  // "Team member" (A2), for the owner: one person's work, or what nobody has.
  const member = owner && sp.member && (sp.member === "unassigned" || directory.some((d) => d.user_id === sp.member)) ? sp.member : null;

  // An application with nobody assigned belongs to the account owner (§3.5).
  const isMine = (e) => e.assigned_user_id === user.id || (!e.assigned_user_id && role === "owner");
  const isMember = (e) => (member === "unassigned" ? !e.assigned_user_id : e.assigned_user_id === member);
  const only = (list) => (member ? list.filter(isMember) : mine ? list.filter(isMine) : list);
  const queue = only(data.queue);
  const stalled = only(data.stalled);
  const requests = only(data.requests);

  const overdue = queue.filter((e) => daysUntil(e.next_follow_up_date) < 0);
  const today = queue.filter((e) => daysUntil(e.next_follow_up_date) === 0);
  const later = queue.filter((e) => daysUntil(e.next_follow_up_date) > 0);
  const listParams = { ...(all ? { scope: "all" } : {}), ...(member ? { member } : mine ? { mine: "1" } : {}) };
  const qs = new URLSearchParams(listParams).toString();
  const basePath = qs ? `/follow-ups?${qs}` : "/follow-ups";
  const listPath = "/follow-ups";
  const clientName = all ? (e) => clients.find((c) => c.id === e.provider.client_org_id)?.name ?? "" : undefined;
  const hrefFor = all
    ? (e) => `/follow-ups/open?${new URLSearchParams({ client: e.provider.client_org_id, open: `${e.provider_id}.${e.payer_id}`, ...(member ? { member } : {}) })}`
    : undefined;

  // Per person, across what's on screen: how much is late and due this week.
  const summary = owner && directory.length > 1
    ? [...directory.map((d) => ({ id: d.user_id, name: d.name })), { id: "unassigned", name: "Unassigned" }]
        .map((p) => {
          const theirs = (e) => (p.id === "unassigned" ? !e.assigned_user_id : e.assigned_user_id === p.id);
          const q = data.queue.filter(theirs);
          return { ...p, overdue: q.filter((e) => daysUntil(e.next_follow_up_date) < 0).length, week: q.length };
        })
        .filter((p) => p.week > 0 || p.id !== "unassigned")
    : [];

  const groups = [
    { key: "overdue", title: "Overdue", tone: "red", icon: ICONS.alert, items: overdue, note: "Past their follow-up date." },
    { key: "today", title: "Due today", tone: "amber", icon: ICONS.phone, items: today, note: null },
    { key: "later", title: "Later this week", tone: "brand", icon: ICONS.calendar, items: later, note: `Through Sunday, ${formatDate(weekEndISO())}.` },
  ].filter((g) => g.items.length > 0);

  const team = directory.length > 1;
  const renderGroup = (g) => (
    <section key={g.key} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionPill icon={g.icon} tone={g.tone} count={g.items.length}>
          {g.title}
        </SectionPill>
        {g.note && <p className="text-sm text-ink-500">{g.note}</p>}
      </div>
      <Card className="overflow-hidden">
        <FollowUpList items={g.items} lastContact={lastContact} directory={directory} basePath={listPath} params={listParams} quickLog={writable && !all} clientName={clientName} hrefFor={hrefFor} />
      </Card>
    </section>
  );

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

      {canAll && (
        <Tabs
          Link={Link}
          active={all ? "all" : "one"}
          tabs={[
            { key: "all", label: "All clients", href: `/follow-ups?scope=all${member ? `&member=${member}` : ""}` },
            { key: "one", label: client?.name ?? "This client", href: `/follow-ups${member ? `?member=${member}` : ""}` },
          ]}
        />
      )}

      {team && !owner && (
        <Tabs
          Link={Link}
          active={mine ? "mine" : "all"}
          tabs={[
            { key: "all", label: "Everyone", href: all ? "/follow-ups?scope=all" : "/follow-ups" },
            { key: "mine", label: "Assigned to me", href: all ? "/follow-ups?scope=all&mine=1" : "/follow-ups?mine=1" },
          ]}
        />
      )}

      {summary.length > 0 && (
        <div className="flex flex-col gap-2">
          <form className="flex flex-wrap items-center gap-2 text-sm" action="/follow-ups">
            {all && <input type="hidden" name="scope" value="all" />}
            <label htmlFor="fu-member" className="text-ink-700">
              Team member
            </label>
            <select id="fu-member" name="member" defaultValue={member ?? ""} className="rounded-md border border-ink-200 bg-white px-2 py-1.5 text-sm">
              <option value="">Everyone</option>
              {directory.map((d) => (
                <option key={d.user_id} value={d.user_id}>
                  {d.name}
                </option>
              ))}
              <option value="unassigned">Unassigned</option>
            </select>
            <button type="submit" className={buttonClass("secondary", "sm")}>
              Show
            </button>
          </form>
          <ul className="flex flex-wrap gap-2 text-xs">
            {summary.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/follow-ups?${new URLSearchParams({ ...(all ? { scope: "all" } : {}), member: p.id })}`}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ring-1 ring-inset ${member === p.id ? "bg-brand-50 ring-brand-700/30 text-brand-700" : "bg-white ring-ink-200 text-ink-700 hover:bg-ink-50"}`}
                >
                  <span className="font-medium text-ink-900">{p.id === "unassigned" ? p.name : p.name.split(/[\s@]/)[0]}:</span>
                  <span className={p.overdue ? "text-status-expired" : ""}>{p.overdue} overdue</span>,
                  <span>{p.week} due this week</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <StatRow>
        <StatCard label="Payer requests" value={requests.length} icon={ICONS.alert} tone={requests.length ? "amber" : "green"} hint={requests.length ? "Payers waiting on you." : "No payer is waiting on you."} />
        <StatCard label="Overdue" value={overdue.length} icon={ICONS.phone} tone={overdue.length ? "red" : "green"} hint={overdue.length ? "Call these first." : "Nothing is late."} />
        <StatCard label="Stalled" value={stalled.length} icon={ICONS.pause} tone={stalled.length ? "amber" : "green"} hint="With the payer past its stalled threshold (30 days unless you set another per payer)." />
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
            <FollowUpList items={requests} lastContact={lastContact} directory={directory} basePath={listPath} params={listParams} mode="requests" clientName={clientName} hrefFor={hrefFor} />
          </Card>
        </section>
      )}

      {queue.length === 0 && (
        <Card>
          <EmptyState
            title={mine || member ? "Nothing to chase this week for this person" : "Nothing to chase this week"}
            description="When you submit an application or log a call, its next follow-up date lands here the week it's due."
            action={
              <Link href="/enrollments" className={buttonClass("primary")}>
                Open the matrix
              </Link>
            }
          />
        </Card>
      )}

      {/* The order to work it (pedido 2026-11-17): payer requests, overdue,
          due today, stalled, then the rest of the week. */}
      {groups.filter((g) => g.key !== "later").map(renderGroup)}

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionPill icon={ICONS.pause} tone={stalled.length ? "amber" : "neutral"} count={stalled.length}>
            Stalled
          </SectionPill>
          <p className="text-sm text-ink-500">With the payer and no status change past that payer&apos;s threshold.</p>
        </div>
        <Card className="overflow-hidden">
          {stalled.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-500">No stalled applications.</p>
          ) : (
            <FollowUpList items={stalled} lastContact={lastContact} directory={directory} basePath={listPath} params={listParams} mode="stalled" clientName={clientName} hrefFor={hrefFor} />
          )}
        </Card>
      </section>

      {groups.filter((g) => g.key === "later").map(renderGroup)}

      {open && <EnrollmentPanel key={sp.open} providerId={open.providerId} payerId={open.payerId} closeHref={basePath} />}
    </div>
  );
}
