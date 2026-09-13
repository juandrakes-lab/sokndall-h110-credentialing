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
import { Card, EmptyState, PageHeader, buttonClass } from "@/components/app/ui";
import ExpiryBadge from "@/components/app/ExpiryBadge";
import DashboardFilters from "./DashboardFilters";

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

export default async function DashboardPage({ searchParams }) {
  const sp = await searchParams;
  const filters = {
    provider: typeof sp.provider === "string" ? sp.provider : "",
    type: CREDENTIAL_TYPES[sp.type] ? sp.type : "",
    bucket: BUCKETS.some((b) => b.key === sp.bucket) ? sp.bucket : "",
  };
  const currentParams = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));

  const { supabase } = await getAppContext();

  let query = supabase
    .from("cred_credentials")
    .select("id, type, state, number, issuer, coverage, expiration_date, provider_id, cred_providers!inner(id, first_name, last_name, status)")
    // Providers marked inactive have left the practice; their renewals aren't work.
    .eq("cred_providers.status", "active")
    .not("expiration_date", "is", null)
    .lte("expiration_date", addDays(todayISO(), 90))
    .order("expiration_date", { ascending: true });
  if (filters.provider) query = query.eq("provider_id", filters.provider);
  if (filters.type) query = query.eq("type", filters.type);

  const [{ data: credentials, error }, { data: providers }] = await Promise.all([
    query,
    supabase.from("cred_providers").select("id, first_name, last_name").eq("status", "active").order("last_name"),
  ]);

  if (error) {
    return <p className="text-sm text-status-expired">Couldn&apos;t load the dashboard: {error.message}</p>;
  }

  const grouped = Object.fromEntries(BUCKETS.map((b) => [b.key, []]));
  for (const c of credentials ?? []) {
    const bucket = bucketFor(c.expiration_date);
    if (bucket) grouped[bucket].push(c);
  }
  const visibleBuckets = BUCKETS.filter((b) => !filters.bucket || b.key === filters.bucket);
  const visibleCount = visibleBuckets.reduce((n, b) => n + grouped[b.key].length, 0);

  if ((providers ?? []).length === 0) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Everything that expires in the next 90 days." />
        <Card>
          <EmptyState
            title="Start with your providers"
            description="Add each provider and their licenses, DEA, malpractice, board certifications and CAQH attestation. Anything expiring in the next 90 days shows up here."
            action={
              <Link href="/providers/new" className={buttonClass("primary")}>
                Add a provider
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Everything that expires in the next 90 days." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {BUCKETS.map((b) => {
          const selected = filters.bucket === b.key;
          return (
            <Link
              key={b.key}
              href={hrefWith(currentParams, "bucket", selected ? "" : b.key)}
              scroll={false}
              aria-pressed={selected}
              className={`rounded-xl border bg-white px-5 py-4 shadow-sm transition hover:border-brand-500 ${
                selected ? "border-brand-600 ring-2 ring-brand-100" : "border-ink-200"
              }`}
            >
              <div className="text-sm text-ink-500">{b.label}</div>
              <div className={`mt-1 text-3xl font-semibold tabular-nums ${grouped[b.key].length ? TILE_TONE[b.key] : "text-ink-900"}`}>
                {grouped[b.key].length}
              </div>
            </Link>
          );
        })}
      </div>

      <Suspense>
        <DashboardFilters
          providers={providers ?? []}
          types={CREDENTIAL_TYPE_KEYS.map((k) => [k, CREDENTIAL_TYPES[k].label])}
        />
      </Suspense>

      <Card className="overflow-hidden">
        {visibleCount === 0 ? (
          <EmptyState
            title="Nothing to renew here"
            description={
              Object.keys(currentParams).length
                ? "No credential matches these filters in the next 90 days."
                : "No credential expires in the next 90 days."
            }
          />
        ) : (
          visibleBuckets.map((b) =>
            grouped[b.key].length === 0 ? null : (
              <section key={b.key}>
                <h2 className="border-b border-ink-100 bg-ink-50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {b.label} · {grouped[b.key].length}
                </h2>
                <ul className="divide-y divide-ink-100">
                  {grouped[b.key].map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/providers/${c.provider_id}`}
                        className="flex flex-col gap-1 px-5 py-3 hover:bg-ink-50/70 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <span className="font-medium text-ink-900">
                            {c.cred_providers?.first_name} {c.cred_providers?.last_name}
                          </span>
                          <span className="text-ink-500">
                            {" · "}
                            {credentialLabel(c.type)}
                            {credentialSummary(c) && ` · ${credentialSummary(c)}`}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 text-sm">
                          <span className="text-ink-500">{formatDate(c.expiration_date)}</span>
                          <ExpiryBadge date={c.expiration_date} />
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
    </div>
  );
}
