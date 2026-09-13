import Link from "next/link";
import { Suspense } from "react";
import { getAppContext } from "@/lib/org";
import {
  BUCKETS,
  CREDENTIAL_TYPES,
  CREDENTIAL_TYPE_KEYS,
  addDays,
  bucketFor,
  credentialLabel,
  credentialSummary,
  formatDate,
  todayISO,
} from "@/lib/credentials";
import {
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_LABELS,
  PAYER_SELECT,
  cellKey,
  parseCellKey,
  resolvePayer,
  sortPayers,
} from "@/lib/enrollments";
import { loadFollowUps, loadRevalidations } from "@/lib/follow-ups";
import { Card, CardHeader, EmptyState, PageHeader, buttonClass } from "@/components/app/ui";
import ExpiryBadge from "@/components/app/ExpiryBadge";
import FollowUpList from "@/components/app/FollowUpList";
import EnrollmentPanel from "../enrollments/EnrollmentPanel";
import DashboardFilters from "./DashboardFilters";

const REVALIDATION = "revalidation";
const PREVIEW_ROWS = 5;

const TILE_TONE = {
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

function Tile({ href, label, count, tone, selected }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={selected}
      className={`rounded-xl border bg-white px-5 py-4 shadow-sm transition hover:border-brand-500 ${
        selected ? "border-brand-600 ring-2 ring-brand-100" : "border-ink-200"
      }`}
    >
      <div className="text-sm text-ink-500">{label}</div>
      <div className={`mt-1 text-3xl font-semibold tabular-nums ${count ? tone : "text-ink-900"}`}>{count}</div>
    </Link>
  );
}

// The main screen (alcance §3.12): expiration buckets, this week's follow-up
// queue and stalled applications, filterable by provider, payer, credential
// type and enrollment status.
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

  // Credentials belong to no payer or enrollment, so a payer or enrollment
  // status filter shows only matching payer revalidations (which exist only
  // for approved enrollments); a credential-type filter hides revalidations.
  const wantCredentials = !filters.payer && !filters.status && filters.type !== REVALIDATION;
  const wantRevalidations =
    (!filters.type || filters.type === REVALIDATION) && (!filters.status || filters.status === "approved");

  let credQuery = supabase
    .from("cred_credentials")
    .select("id, type, state, number, issuer, coverage, expiration_date, provider_id, cred_providers!inner(id, first_name, last_name, status)")
    // Providers marked inactive have left the practice; their renewals aren't work.
    .eq("cred_providers.status", "active")
    .not("expiration_date", "is", null)
    .lte("expiration_date", addDays(todayISO(), 90));
  if (filters.provider) credQuery = credQuery.eq("provider_id", filters.provider);
  if (filters.type && filters.type !== REVALIDATION) credQuery = credQuery.eq("type", filters.type);

  const [{ data: credentials, error }, revalidations, followUps, { data: providers }, { data: payerRows }] = await Promise.all([
    wantCredentials ? credQuery : Promise.resolve({ data: [] }),
    wantRevalidations ? loadRevalidations(supabase, filters) : Promise.resolve([]),
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

  const items = [
    ...(credentials ?? []).map((c) => ({
      id: `c-${c.id}`,
      date: c.expiration_date,
      who: `${c.cred_providers.first_name} ${c.cred_providers.last_name}`,
      what: [credentialLabel(c.type), credentialSummary(c)].filter(Boolean).join(" · "),
      href: `/providers/${c.provider_id}`,
    })),
    ...revalidations.map((e) => ({
      id: `r-${e.id}`,
      date: e.revalidation_due_date,
      who: `${e.provider.first_name} ${e.provider.last_name}`,
      what: `Payer revalidation · ${e.payer.name}`,
      href: hrefWith(params, "open", cellKey(e.provider_id, e.payer_id)),
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const grouped = Object.fromEntries(BUCKETS.map((b) => [b.key, []]));
  for (const item of items) {
    const bucket = bucketFor(item.date);
    if (bucket) grouped[bucket].push(item);
  }
  const visibleBuckets = BUCKETS.filter((b) => !filters.bucket || b.key === filters.bucket);
  const visibleCount = visibleBuckets.reduce((n, b) => n + grouped[b.key].length, 0);

  const { queue, stalled, lastContact, directory } = followUps;
  const payers = sortPayers((payerRows ?? []).map(resolvePayer));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="What expires in the next 90 days, and what to chase this week." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Expirations</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BUCKETS.map((b) => (
              <Tile
                key={b.key}
                href={hrefWith(params, "bucket", filters.bucket === b.key ? "" : b.key)}
                label={b.label}
                count={grouped[b.key].length}
                tone={TILE_TONE[b.key]}
                selected={filters.bucket === b.key}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Applications</h2>
          <div className="grid grid-cols-2 gap-3">
            <Tile href="/follow-ups" label="Follow-ups this week" count={queue.length} tone="text-brand-700" />
            <Tile href="/follow-ups" label="Stalled" count={stalled.length} tone="text-status-expiring" />
          </div>
        </div>
      </div>

      <Suspense>
        <DashboardFilters
          selects={[
            { key: "provider", label: "Provider", all: "All providers", options: (providers ?? []).map((p) => [p.id, `${p.last_name}, ${p.first_name}`]) },
            { key: "payer", label: "Payer", all: "All payers", options: payers.map((p) => [p.id, p.name]) },
            {
              key: "type",
              label: "Credential type",
              all: "All credential types",
              options: [...CREDENTIAL_TYPE_KEYS.map((k) => [k, CREDENTIAL_TYPES[k].label]), [REVALIDATION, "Payer revalidation"]],
            },
            { key: "status", label: "Enrollment status", all: "All enrollment statuses", options: ENROLLMENT_STATUSES.map((s) => [s, ENROLLMENT_STATUS_LABELS[s]]) },
          ]}
        />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader
            title={`Follow-ups this week · ${queue.length}`}
            actions={queue.length > 0 && <Link href="/follow-ups" className={buttonClass("link")}>See all</Link>}
          />
          {queue.length === 0 ? (
            <p className="px-5 py-5 text-sm text-ink-500">Nothing to chase this week.</p>
          ) : (
            <FollowUpList items={queue.slice(0, PREVIEW_ROWS)} lastContact={lastContact} directory={directory} basePath="/dashboard" params={params} />
          )}
        </Card>
        <Card className="overflow-hidden">
          <CardHeader title={`Stalled · ${stalled.length}`} description="No status change in 30+ days." />
          {stalled.length === 0 ? (
            <p className="px-5 py-5 text-sm text-ink-500">No stalled applications.</p>
          ) : (
            <FollowUpList items={stalled.slice(0, PREVIEW_ROWS)} lastContact={lastContact} directory={directory} basePath="/dashboard" params={params} mode="stalled" />
          )}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="Expirations" description="Credentials and payer revalidations due in the next 90 days." />
        {visibleCount === 0 ? (
          <p className="px-5 py-5 text-sm text-ink-500">
            {Object.keys(params).length ? "Nothing matches these filters in the next 90 days." : "Nothing expires in the next 90 days."}
          </p>
        ) : (
          visibleBuckets.map((b) =>
            grouped[b.key].length === 0 ? null : (
              <section key={b.key}>
                <h3 className="border-y border-ink-100 bg-ink-50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {b.label} · {grouped[b.key].length}
                </h3>
                <ul className="divide-y divide-ink-100">
                  {grouped[b.key].map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        scroll={false}
                        className="flex flex-col gap-1 px-5 py-3 hover:bg-ink-50/70 sm:flex-row sm:items-center sm:justify-between"
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

      {open && (
        <EnrollmentPanel key={sp.open} providerId={open.providerId} payerId={open.payerId} closeHref={hrefWith(params, "open", "")} />
      )}
    </div>
  );
}
