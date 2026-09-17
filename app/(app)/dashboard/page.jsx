import Link from "next/link";
import { Suspense } from "react";
import { getAppContext } from "@/lib/org";
import { BUCKETS, CREDENTIAL_TYPES, CREDENTIAL_TYPE_KEYS, bucketFor, formatDate } from "@/lib/credentials";
import {
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_LABELS,
  PAYER_SELECT,
  parseCellKey,
  resolvePayer,
  sortPayers,
} from "@/lib/enrollments";
import { loadFollowUps } from "@/lib/follow-ups";
import { REVALIDATION, loadExpirations } from "@/lib/expirations";
import { Card, EmptyState, ICONS, PageHeader, SectionPill, buttonClass } from "@/components/app/ui";
import ExpiryBadge from "@/components/app/ExpiryBadge";
import FollowUpList from "@/components/app/FollowUpList";
import EnrollmentPanel from "../enrollments/EnrollmentPanel";
import DashboardHeader from "./DashboardFilters";

const PREVIEW_ROWS = 5;
const FILTER_KEYS = ["provider", "payer", "type", "status"];

const BUCKET_DOT = {
  expired: "bg-status-expired",
  d30: "bg-status-expiring",
  d60: "bg-accent-400",
  d90: "bg-ink-200",
};

const BUCKET_TONE = {
  expired: "text-status-expired",
  d30: "text-status-expiring",
  d60: "text-ink-900",
  d90: "text-ink-900",
};

function hrefWith(params, key, value) {
  const next = new URLSearchParams(params);
  if (value) next.set(key, value);
  else next.delete(key);
  const qs = next.toString();
  return qs ? `/dashboard?${qs}` : "/dashboard";
}

// One of the four expiration windows, as a segment of a single strip. Clicking
// it narrows the list below to that window; clicking it again clears it.
function Bucket({ href, bucket, count, selected }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={selected}
      className={`flex flex-col gap-2.5 rounded-xl px-4 py-3.5 transition-colors ${
        selected
          ? "bg-white shadow-[0_1px_2px_rgba(14,42,46,0.08),0_2px_10px_rgba(14,42,46,0.06)] ring-1 ring-brand-500/40"
          : "hover:bg-white/80"
      }`}
    >
      <span className="flex items-center gap-2 text-sm text-ink-500">
        <span className={`h-2 w-2 rounded-full ${BUCKET_DOT[bucket.key]}`} aria-hidden="true" />
        {bucket.label}
      </span>
      <span className={`text-[1.75rem] font-semibold leading-none tabular-nums ${count ? BUCKET_TONE[bucket.key] : "text-ink-500/60"}`}>
        {count}
      </span>
    </Link>
  );
}

// The main screen (alcance §3.12): expiration buckets, this week's follow-up
// queue and stalled applications, filterable by provider, payer, credential
// type and enrollment status. Three blocks, each named once; the filters stay
// folded behind a button until they're used.
export default async function DashboardPage({ searchParams }) {
  const sp = await searchParams;
  const str = (v) => (typeof v === "string" ? v : "");
  const filters = {
    provider: str(sp.provider),
    payer: str(sp.payer),
    type: CREDENTIAL_TYPES[sp.type] || sp.type === REVALIDATION ? sp.type : "",
    status: ENROLLMENT_STATUSES.includes(sp.status) ? sp.status : "",
    bucket: BUCKETS.some((b) => b.key === sp.bucket) ? sp.bucket : "",
  };
  const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
  const open = parseCellKey(sp.open);

  const { supabase } = await getAppContext();

  let error = null;
  const [expirations, followUps, { data: providers }, { data: payerRows }] = await Promise.all([
    loadExpirations(supabase, filters).catch((e) => {
      error = e;
      return [];
    }),
    loadFollowUps(supabase, filters),
    supabase.from("cred_providers").select("id, first_name, last_name").eq("status", "active").order("last_name"),
    supabase.from("cred_payers_org").select(PAYER_SELECT),
  ]);

  if (error) {
    return <p className="text-sm text-status-expired">Couldn&apos;t load the dashboard: {error.message}</p>;
  }

  if ((providers ?? []).length === 0) {
    return (
      <div>
        <PageHeader title="Dashboard" description="What expires, and what to chase this week." />
        <Card>
          <EmptyState
            title="Start with your providers"
            description="Add each provider and their licenses, DEA, malpractice, board certifications and CAQH attestation. Anything expiring in the next 90 days shows up here."
            action={<Link href="/providers/new" className={buttonClass("primary")}>Add a provider</Link>}
          />
        </Card>
      </div>
    );
  }

  const items = expirations.map((item) => ({
    ...item,
    href: item.href ?? hrefWith(params, "open", item.cell),
  }));

  const grouped = Object.fromEntries(BUCKETS.map((b) => [b.key, []]));
  for (const item of items) {
    const bucket = bucketFor(item.date);
    if (bucket) grouped[bucket].push(item);
  }
  const visibleBuckets = BUCKETS.filter((b) => !filters.bucket || b.key === filters.bucket);
  const visibleCount = visibleBuckets.reduce((n, b) => n + grouped[b.key].length, 0);

  const { queue, stalled, lastContact, directory } = followUps;
  const payers = sortPayers((payerRows ?? []).map(resolvePayer));

  const selects = [
    { key: "provider", label: "Provider", all: "All providers", options: (providers ?? []).map((p) => [p.id, `${p.last_name}, ${p.first_name}`]) },
    { key: "payer", label: "Payer", all: "All payers", options: payers.map((p) => [p.id, p.name]) },
    {
      key: "type",
      label: "Credential type",
      all: "All credential types",
      options: [...CREDENTIAL_TYPE_KEYS.map((k) => [k, CREDENTIAL_TYPES[k].label]), [REVALIDATION, "Payer revalidation"]],
    },
    { key: "status", label: "Enrollment status", all: "All enrollment statuses", options: ENROLLMENT_STATUSES.map((s) => [s, ENROLLMENT_STATUS_LABELS[s]]) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={<PageHeader title="Dashboard" description="What expires in the next 90 days, and what to chase this week." />}>
        <DashboardHeader
          title="Dashboard"
          description="What expires in the next 90 days, and what to chase this week."
          exportHref={`/export/expirations${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ""}`}
          selects={selects}
          filterKeys={FILTER_KEYS}
        />
      </Suspense>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionPill icon={ICONS.calendar} count={visibleCount}>
            Expirations
          </SectionPill>
          <p className="text-sm text-ink-500">Credentials and payer revalidations, next 90 days</p>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-ink-50 p-1 ring-1 ring-inset ring-ink-100 sm:grid-cols-4">
          {BUCKETS.map((b) => (
            <Bucket
              key={b.key}
              bucket={b}
              href={hrefWith(params, "bucket", filters.bucket === b.key ? "" : b.key)}
              count={grouped[b.key].length}
              selected={filters.bucket === b.key}
            />
          ))}
        </div>

        <Card className="overflow-hidden">
          {visibleCount === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-500">
              {Object.keys(params).length ? "Nothing matches these filters in the next 90 days." : "Nothing expires in the next 90 days."}
            </p>
          ) : (
            visibleBuckets.map((b) =>
              grouped[b.key].length === 0 ? null : (
                <section key={b.key} className="border-t border-ink-100 first:border-t-0">
                  <h3 className="flex items-center gap-2 px-5 pb-1 pt-4 text-xs font-medium text-ink-500">
                    <span className={`h-1.5 w-1.5 rounded-full ${BUCKET_DOT[b.key]}`} aria-hidden="true" />
                    {b.label} · {grouped[b.key].length}
                  </h3>
                  <ul className="px-2 pb-2">
                    {grouped[b.key].map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          scroll={false}
                          className="flex flex-col gap-1 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-50 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <span className="font-medium text-ink-900">{item.who}</span>
                            <span className="text-ink-500"> · {item.what}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-3 text-sm">
                            <span className="text-ink-500">{formatDate(item.date)}</span>
                            <ExpiryBadge date={item.date} />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            )
          )}
        </Card>
      </section>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-6">
        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex min-h-9 items-center justify-between gap-2">
            <SectionPill icon={ICONS.phone} count={queue.length}>
              Follow-ups this week
            </SectionPill>
            {queue.length > 0 && (
              <Link href="/follow-ups" className={buttonClass("link")}>
                See all
              </Link>
            )}
          </div>
          <Card className="overflow-hidden">
            {queue.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-500">Nothing to chase this week.</p>
            ) : (
              <FollowUpList items={queue.slice(0, PREVIEW_ROWS)} lastContact={lastContact} directory={directory} basePath="/dashboard" params={params} />
            )}
          </Card>
        </section>
        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex min-h-9 items-center justify-between gap-2">
            <SectionPill icon={ICONS.pause} tone={stalled.length ? "amber" : "neutral"} count={stalled.length}>
              Stalled
            </SectionPill>
            <span className="text-sm text-ink-500">No status change in 30+ days</span>
          </div>
          <Card className="overflow-hidden">
            {stalled.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-500">No stalled applications.</p>
            ) : (
              <FollowUpList items={stalled.slice(0, PREVIEW_ROWS)} lastContact={lastContact} directory={directory} basePath="/dashboard" params={params} mode="stalled" />
            )}
          </Card>
        </section>
      </div>

      {open && (
        <EnrollmentPanel key={sp.open} providerId={open.providerId} payerId={open.payerId} closeHref={hrefWith(params, "open", "")} />
      )}
    </div>
  );
}
