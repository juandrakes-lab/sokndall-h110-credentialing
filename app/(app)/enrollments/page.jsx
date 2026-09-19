import Link from "next/link";
import HeaderActions from "@/components/app/HeaderActions";
import { getAppContext } from "@/lib/org";
import { daysUntil } from "@/lib/credentials";
import {
  ENROLLMENT_STATUS_LABELS,
  PAYER_SELECT,
  cellKey,
  parseCellKey,
  resolvePayer,
  sortPayers,
  stalledDays,
} from "@/lib/enrollments";
import { Avatar, Card, EmptyState, ICONS, Icon, PIPELINE_ORDER, PageHeader, STATUS_FILL, SectionPill, SegmentBar, buttonClass } from "@/components/app/ui";
import EnrollmentPanel from "./EnrollmentPanel";

// Cells read like the app's status badges: a soft fill and a small shadow, no
// outline — except an empty cell, which stays a dashed placeholder.
const CHIP = {
  not_started: "bg-transparent text-ink-500 border border-dashed border-ink-200",
  submitted: "bg-enroll-purple-bg text-enroll-purple shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  in_review: "bg-sky-50 text-sky-800 shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  info_requested: "bg-status-expiring-bg text-status-expiring shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  approved: "bg-status-active-bg text-status-active shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  denied: "bg-status-expired-bg text-status-expired shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
};

// The flagship screen (alcance §3.13): providers down, payers across, one
// status chip per cell. Clicking a cell opens the side panel on this page.
export default async function EnrollmentsPage({ searchParams }) {
  const sp = await searchParams;
  const open = parseCellKey(sp.open);
  const { supabase } = await getAppContext();

  const [{ data: providers }, { data: payerRows }, { data: enrollments }] = await Promise.all([
    supabase.from("cred_providers").select("id, first_name, last_name, specialty").eq("status", "active").order("last_name"),
    supabase.from("cred_payers_org").select(PAYER_SELECT),
    supabase.from("cred_enrollments").select("id, provider_id, payer_id, status, next_follow_up_date, status_changed_at"),
  ]);

  const payers = sortPayers((payerRows ?? []).map(resolvePayer));
  const byCell = new Map((enrollments ?? []).map((e) => [cellKey(e.provider_id, e.payer_id), e]));

  const header = (
    <PageHeader
      title="Enrollments"
      description="Every provider against every payer you work with. Click a cell to update it."
      actions={
        <HeaderActions
          secondary={[
            { label: "Export CSV", href: "/export/enrollments", download: true },
            { label: payers.length ? "Edit payer list" : "Choose payers", href: "/enrollments/payers" },
          ]}
        />
      }
    />
  );

  if (!providers?.length || !payers.length) {
    return (
      <div className="flex flex-col gap-8">
        {header}
        <Card>
          {!providers?.length ? (
            <EmptyState
              title="Add your providers first"
              description="The matrix has one row per provider."
              action={<Link href="/providers/new" className={buttonClass("primary")}>Add a provider</Link>}
            />
          ) : (
            <EmptyState
              title="Choose the payers you work with"
              description="Pick them from our list of U.S. payers, or add a regional one. Each becomes a column here."
              action={<Link href="/enrollments/payers" className={buttonClass("primary")}>Choose payers</Link>}
            />
          )}
        </Card>
      </div>
    );
  }

  const counts = Object.fromEntries(PIPELINE_ORDER.map((s) => [s, 0]));
  for (const e of enrollments ?? []) if (e.status in counts) counts[e.status] += 1;
  counts.not_started += Math.max(0, providers.length * payers.length - (enrollments ?? []).length);
  const total = PIPELINE_ORDER.reduce((n, s) => n + counts[s], 0);

  return (
    <div className="flex flex-col gap-6">
      {header}

      <Card className="px-5 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <SectionPill icon={ICONS.pulse} count={total}>
            Where every application stands
          </SectionPill>
          <p className="text-sm text-ink-500">
            {providers.length} provider{providers.length === 1 ? "" : "s"} × {payers.length} payer{payers.length === 1 ? "" : "s"}
          </p>
        </div>
        <SegmentBar
          height={14}
          segments={PIPELINE_ORDER.filter((s) => counts[s] > 0).map((s) => ({ key: s, label: ENROLLMENT_STATUS_LABELS[s], value: counts[s], color: STATUS_FILL[s] }))}
        />
        <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
          {PIPELINE_ORDER.map((s) => (
            <li key={s} className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STATUS_FILL[s] }} aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-lg font-semibold leading-none tabular-nums text-ink-900">{counts[s]}</span>
                <span className="block truncate text-xs text-ink-700">{ENROLLMENT_STATUS_LABELS[s]}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 min-w-48 border-b border-r border-ink-100 bg-white px-4 py-3 text-left text-xs font-medium text-ink-700">
                  Provider
                </th>
                {payers.map((payer) => (
                  <th key={payer.id} scope="col" className="min-w-36 max-w-44 border-b border-ink-100 bg-white px-3 py-3 text-left align-bottom">
                    <span className="line-clamp-2 text-xs font-semibold text-ink-900">{payer.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <th scope="row" className="sticky left-0 z-10 border-b border-r border-ink-100 bg-white px-4 py-2 text-left font-normal">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={`${provider.first_name} ${provider.last_name}`} size="sm" />
                      <div className="min-w-0">
                        <Link href={`/providers/${provider.id}`} className="font-semibold text-ink-900 hover:text-brand-600">
                          {provider.last_name}, {provider.first_name}
                        </Link>
                        {provider.specialty && <div className="truncate text-xs text-ink-500">{provider.specialty}</div>}
                      </div>
                    </div>
                  </th>
                  {payers.map((payer) => {
                    const key = cellKey(provider.id, payer.id);
                    const e = byCell.get(key);
                    const status = e?.status ?? "not_started";
                    const stalled = e ? stalledDays(e) : null;
                    const due = e?.next_follow_up_date && daysUntil(e.next_follow_up_date) <= 0;
                    const selected = open && cellKey(open.providerId, open.payerId) === key;
                    return (
                      <td key={payer.id} className={`border-b border-ink-100 px-2 py-2 ${selected ? "bg-brand-50" : ""}`}>
                        <Link
                          href={`/enrollments?open=${key}`}
                          scroll={false}
                          className={`flex items-center justify-between gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition hover:ring-2 hover:ring-brand-100 ${CHIP[status]}`}
                        >
                          <span className="truncate">{ENROLLMENT_STATUS_LABELS[status]}</span>
                          <span className="flex shrink-0 items-center gap-1">
                            {due && <span className="h-2 w-2 rounded-full bg-red-600" aria-label="Follow-up due" />}
                            {stalled && <Icon d={ICONS.pause} className="h-3.5 w-3.5 text-amber-600" strokeWidth={2.2} />}
                          </span>
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-700">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-600" aria-hidden="true" /> Follow-up due today or overdue
        </span>
        <span className="flex items-center gap-1.5">
          <Icon d={ICONS.pause} className="h-3.5 w-3.5 text-amber-600" strokeWidth={2.2} /> Stalled: no status change in 30+ days
        </span>
      </div>

      {open && <EnrollmentPanel key={sp.open} providerId={open.providerId} payerId={open.payerId} closeHref="/enrollments" />}
    </div>
  );
}
