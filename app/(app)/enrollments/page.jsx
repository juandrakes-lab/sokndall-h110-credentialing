import Link from "next/link";
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
import { Card, EmptyState, PageHeader, buttonClass } from "@/components/app/ui";
import EnrollmentPanel from "./EnrollmentPanel";

const CHIP = {
  not_started: "bg-white text-ink-500 border-dashed border-ink-200",
  submitted: "bg-brand-50 text-brand-700 border-brand-100",
  in_review: "bg-sky-50 text-sky-800 border-sky-200",
  info_requested: "bg-status-expiring-bg text-status-expiring border-status-expiring/30",
  approved: "bg-status-active-bg text-status-active border-status-active/30",
  denied: "bg-status-expired-bg text-status-expired border-status-expired/30",
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
        <>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page */}
          <a href="/export/enrollments" className={buttonClass("secondary")}>
            Export CSV
          </a>
          <Link href="/enrollments/payers" className={buttonClass("secondary")}>
            {payers.length ? "Edit payer list" : "Choose payers"}
          </Link>
        </>
      }
    />
  );

  if (!providers?.length || !payers.length) {
    return (
      <div>
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

  return (
    <div className="flex flex-col gap-4">
      {header}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 min-w-48 border-b border-r border-ink-100 bg-ink-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink-500">
                  Provider
                </th>
                {payers.map((payer) => (
                  <th key={payer.id} scope="col" className="min-w-36 max-w-44 border-b border-ink-100 bg-ink-50 px-3 py-3 text-left align-bottom">
                    <span className="line-clamp-2 text-xs font-semibold text-ink-900">{payer.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <th scope="row" className="sticky left-0 z-10 border-b border-r border-ink-100 bg-white px-4 py-2 text-left font-normal">
                    <Link href={`/providers/${provider.id}`} className="font-medium text-ink-900 hover:text-brand-600">
                      {provider.last_name}, {provider.first_name}
                    </Link>
                    {provider.specialty && <div className="truncate text-xs text-ink-500">{provider.specialty}</div>}
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
                          className={`flex items-center justify-between gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition hover:ring-2 hover:ring-brand-100 ${CHIP[status]}`}
                        >
                          <span className="truncate">{ENROLLMENT_STATUS_LABELS[status]}</span>
                          <span className="flex shrink-0 gap-1">
                            {due && <span className="h-2 w-2 rounded-full bg-status-expired" aria-label="Follow-up due" />}
                            {stalled && <span className="h-2 w-2 rounded-full bg-status-expiring" aria-label="Stalled" />}
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

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-expired" /> Follow-up due today or overdue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-expiring" /> Stalled: no status change in 30+ days
        </span>
      </div>

      {open && <EnrollmentPanel key={sp.open} providerId={open.providerId} payerId={open.payerId} closeHref="/enrollments" />}
    </div>
  );
}
