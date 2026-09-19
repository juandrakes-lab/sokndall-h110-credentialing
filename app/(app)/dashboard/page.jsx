import Link from "next/link";
import { Suspense } from "react";
import { getAppContext } from "@/lib/org";
import { BUCKETS, CREDENTIAL_TYPES, CREDENTIAL_TYPE_KEYS, bucketFor, daysUntil, formatDate } from "@/lib/credentials";
import {
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_LABELS,
  PAYER_SELECT,
  cellKey,
  parseCellKey,
  resolvePayer,
  sortPayers,
} from "@/lib/enrollments";
import { loadFollowUps } from "@/lib/follow-ups";
import { REVALIDATION, loadExpirations } from "@/lib/expirations";
import {
  Avatar,
  Badge,
  Card,
  CardHeader,
  EmptyState,
  ICONS,
  Icon,
  PIPELINE_ORDER,
  PageHeader,
  Ring,
  STATUS_FILL,
  SectionPill,
  SegmentBar,
  StatCard,
  StatRow,
  buttonClass,
} from "@/components/app/ui";
import ExpiryBadge from "@/components/app/ExpiryBadge";
import FollowUpList from "@/components/app/FollowUpList";
import EnrollmentPanel from "../enrollments/EnrollmentPanel";
import DashboardHeader from "./DashboardFilters";

const PREVIEW_ROWS = 5;
// Rows shown per expiration window before "show all" opens that window alone.
const BUCKET_ROWS = 6;
const FILTER_KEYS = ["provider", "payer", "type", "status"];
const URGENT_DAYS = 14;

// Severity in steps of lightness as well as hue, so the four read apart even
// where red and orange don't: strong red, amber, pale yellow, grey.
const BUCKET_DOT = {
  expired: "bg-red-600",
  d30: "bg-amber-500",
  d60: "bg-amber-200",
  d90: "bg-slate-300",
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
function Bucket({ href, bucket, count, share, selected }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={selected}
      className={`flex flex-col gap-2.5 rounded-xl px-4 py-3.5 transition ${
        selected ? "bg-white shadow-[0_1px_2px_rgba(14,42,46,0.08),0_4px_14px_-4px_rgba(14,42,46,0.12)] ring-1 ring-brand-500/40" : "hover:bg-white/70"
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-ink-900">
        <span className={`h-2 w-2 rounded-full ${BUCKET_DOT[bucket.key]}`} aria-hidden="true" />
        {bucket.label}
      </span>
      <span className={`text-[1.75rem] font-semibold leading-none tracking-[-0.02em] tabular-nums ${count ? BUCKET_TONE[bucket.key] : "text-ink-500/60"}`}>{count}</span>
      <span className="h-1 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
        <span className={`block h-full rounded-full ${count ? BUCKET_DOT[bucket.key] : ""}`} style={{ width: `${share * 100}%` }} />
      </span>
    </Link>
  );
}

// The main screen (alcance §3.12). It opens with what needs a person this week,
// then the three lists it comes from: expirations, the follow-up queue and the
// applications that have gone quiet.
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

  const { supabase, practice, client, clients } = await getAppContext();

  let error = null;
  let pipelineQuery = supabase
    .from("cred_enrollments")
    .select("status, provider_id, payer_id, cred_providers!inner(status)")
    .eq("cred_providers.status", "active");
  if (filters.provider) pipelineQuery = pipelineQuery.eq("provider_id", filters.provider);
  if (filters.payer) pipelineQuery = pipelineQuery.eq("payer_id", filters.payer);

  const [expirations, followUps, { data: providers }, { data: payerRows }, { data: pipeline }, { data: credentialRows }] = await Promise.all([
    loadExpirations(supabase, filters).catch((e) => {
      error = e;
      return [];
    }),
    loadFollowUps(supabase, filters),
    supabase.from("cred_providers").select("id, first_name, last_name").eq("status", "active").order("last_name"),
    supabase.from("cred_payers_org").select(PAYER_SELECT),
    pipelineQuery,
    supabase.from("cred_credentials").select("provider_id, expiration_date, cred_providers!inner(status)").eq("cred_providers.status", "active"),
  ]);

  if (error) {
    return <p className="text-sm text-status-expired">Couldn&apos;t load the dashboard: {error.message}</p>;
  }

  if ((providers ?? []).length === 0) {
    return (
      <div className="flex flex-col gap-8">
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
  const bucketPeak = Math.max(1, ...BUCKETS.map((b) => grouped[b.key].length));

  const { queue, stalled, lastContact, directory } = followUps;
  const payers = sortPayers((payerRows ?? []).map(resolvePayer));

  // What needs a person this week: anything already expired or expiring inside
  // two weeks, every follow-up that is due or late, and every payer waiting on
  // us for information.
  const overdue = queue.filter((e) => daysUntil(e.next_follow_up_date) <= 0);
  const urgentExpirations = items.filter((i) => daysUntil(i.date) <= URGENT_DAYS).sort((a, b) => a.date.localeCompare(b.date));
  const infoRequested = (pipeline ?? []).filter((e) => e.status === "info_requested");
  const attention = urgentExpirations.length + overdue.length + infoRequested.length;

  // Start here: the expirations inside two weeks, then the late follow-ups,
  // most urgent first — five at most.
  const nextUp = [
    ...urgentExpirations.map((i) => ({
      key: i.id,
      title: i.who,
      detail: i.kind === "Payer revalidation" ? `Payer revalidation · ${i.detail}` : i.kind,
      badge: daysUntil(i.date) < 0 ? "Expired" : daysUntil(i.date) === 0 ? "Expires today" : daysUntil(i.date) === 1 ? "1 day left" : `${daysUntil(i.date)} days left`,
      tone: daysUntil(i.date) <= 7 ? "red" : "amber",
      href: i.href,
    })),
    ...overdue.map((e) => ({
      key: e.id,
      title: `${e.provider.first_name} ${e.provider.last_name}`,
      detail: `Follow up with ${e.payer.name}`,
      badge: daysUntil(e.next_follow_up_date) === 0 ? "Call today" : `${-daysUntil(e.next_follow_up_date)} days late`,
      tone: "amber",
      href: hrefWith(params, "open", cellKey(e.provider_id, e.payer_id)),
    })),
  ].slice(0, 5);

  // Credential health: a provider is current when they have credentials on file
  // and none of them is expired or inside 30 days.
  const byProvider = new Map((providers ?? []).map((p) => [p.id, { total: 0, worst: null }]));
  for (const row of credentialRows ?? []) {
    const entry = byProvider.get(row.provider_id);
    if (!entry) continue;
    entry.total += 1;
    const days = row.expiration_date ? daysUntil(row.expiration_date) : null;
    if (days !== null && (entry.worst === null || days < entry.worst)) entry.worst = days;
  }
  const providerRows = [...byProvider.values()];
  const current = providerRows.filter((p) => p.total > 0 && (p.worst === null || p.worst > 30)).length;
  const withExpired = providerRows.filter((p) => p.worst !== null && p.worst < 0).length;
  const dueSoon = providerRows.filter((p) => p.worst !== null && p.worst >= 0 && p.worst <= 30).length;
  const noFile = providerRows.filter((p) => p.total === 0).length;
  const health = providerRows.length ? current / providerRows.length : 0;

  const pipelineCounts = Object.fromEntries(PIPELINE_ORDER.map((s) => [s, 0]));
  for (const e of pipeline ?? []) if (e.status in pipelineCounts) pipelineCounts[e.status] += 1;
  // Cells nobody has opened yet are "not started" too.
  const cells = (providers ?? []).length * payers.length;
  if (!filters.provider && !filters.payer) pipelineCounts.not_started += Math.max(0, cells - (pipeline ?? []).length);
  const pipelineTotal = PIPELINE_ORDER.reduce((n, s) => n + pipelineCounts[s], 0);
  const segments = PIPELINE_ORDER.filter((s) => pipelineCounts[s] > 0).map((s) => ({
    key: s,
    label: ENROLLMENT_STATUS_LABELS[s],
    value: pipelineCounts[s],
    color: STATUS_FILL[s],
  }));

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

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const where = clients.length > 1 ? client?.name : practice.legal_name;

  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={<PageHeader title="Dashboard" description={`${today} · ${where}`} />}>
        <DashboardHeader
          title="Dashboard"
          description={`${today} · ${where}`}
          exportHref={`/export/expirations${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ""}`}
          selects={selects}
          filterKeys={FILTER_KEYS}
        />
      </Suspense>

      {/* This week at a glance: four numbers, each opening its list. */}
      <StatRow cols={4}>
        <StatCard accent label="Need you this week" value={attention} icon={ICONS.pulse} hint="Expiring soon, overdue and payer requests." />
        <StatCard
          label={`Expiring within ${URGENT_DAYS} days`}
          value={urgentExpirations.length}
          icon={ICONS.calendar}
          tone={urgentExpirations.length ? "red" : "green"}
          hint="Credentials and payer revalidations."
          href="#expirations"
          Link={Link}
        />
        <StatCard
          label="Follow-ups overdue"
          value={overdue.length}
          icon={ICONS.phone}
          tone={overdue.length ? "amber" : "green"}
          hint={`${queue.length} due this week in all.`}
          href="/follow-ups"
          Link={Link}
        />
        <StatCard
          label="Payer requests"
          value={infoRequested.length}
          icon={ICONS.alert}
          tone={infoRequested.length ? "amber" : "green"}
          hint="Applications waiting on you."
          href="/follow-ups#requests"
          Link={Link}
        />
      </StatRow>

      {/* Where to start, and how the roster stands. */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader icon={ICONS.arrowRight} title="Start here" description="The most urgent items first. Open one to act on it." />
          {nextUp.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-500">Nothing is overdue and nothing expires in the next two weeks.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {nextUp.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} scroll={false} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ink-50/70">
                    <Avatar name={item.title} photo={item.photo} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink-900">{item.title}</span>
                      <span className="block truncate text-xs text-ink-500">{item.detail}</span>
                    </span>
                    <Badge tone={item.tone}>{item.badge}</Badge>
                    <Icon d={ICONS.arrowRight} className="h-4 w-4 shrink-0 text-ink-500" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="flex flex-col">
          <CardHeader icon={ICONS.shield} title="Credentials current" description="Providers with nothing expired or due within 30 days." />
          <div className="flex flex-1 flex-col gap-5 px-5 py-5">
            <div className="flex items-center gap-4">
              <Ring value={health} size={84} tone={health > 0.8 ? "green" : health > 0.5 ? "amber" : "red"}>
                <span className="text-lg font-semibold tabular-nums text-ink-900">{Math.round(health * 100)}%</span>
              </Ring>
              <p className="text-sm text-ink-700">
                <span className="font-semibold text-ink-900">{current}</span> of {providerRows.length} providers are fully current.
              </p>
            </div>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                ["bg-red-600", "Something expired", withExpired],
                ["bg-amber-500", "Due within 30 days", dueSoon],
                ["bg-status-active", "Current", current],
                ["bg-slate-300", "No credentials on file", noFile],
              ].map(([dot, label, n]) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
                  <span className="flex-1 text-ink-700">{label}</span>
                  <span className="font-semibold tabular-nums text-ink-900">{n}</span>
                </li>
              ))}
            </ul>
            <Link href="/providers" className={`${buttonClass("link")} mt-auto self-start`}>
              See every provider
            </Link>
          </div>
        </Card>
      </div>

      {/* Where every application stands. */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionPill icon={ICONS.pulse} count={pipelineTotal}>
            Enrollment pipeline
          </SectionPill>
          <Link href="/enrollments" className={buttonClass("secondary", "sm")}>
            Open the matrix
          </Link>
        </div>
        <Card className="px-5 py-5">
          <SegmentBar segments={segments} height={14} />
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
            {PIPELINE_ORDER.map((s) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STATUS_FILL[s] }} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-lg font-semibold leading-none tabular-nums text-ink-900">{pipelineCounts[s]}</span>
                  <span className="block truncate text-xs text-ink-700">{ENROLLMENT_STATUS_LABELS[s]}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Expirations. */}
      <section id="expirations" className="flex scroll-mt-20 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionPill icon={ICONS.calendar} count={visibleCount}>
            Expirations
          </SectionPill>
          <p className="text-sm text-ink-500">Credentials and payer revalidations, next 90 days</p>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/70 p-1 ring-1 ring-inset ring-ink-900/[0.06] sm:grid-cols-4">
          {BUCKETS.map((b) => (
            <Bucket
              key={b.key}
              bucket={b}
              href={hrefWith(params, "bucket", filters.bucket === b.key ? "" : b.key)}
              count={grouped[b.key].length}
              share={grouped[b.key].length / bucketPeak}
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
                  <h3 className="flex items-center gap-2 px-5 pb-1 pt-4 text-xs font-medium text-ink-700">
                    <span className={`h-1.5 w-1.5 rounded-full ${BUCKET_DOT[b.key]}`} aria-hidden="true" />
                    {b.label} · {grouped[b.key].length}
                  </h3>
                  <ul className="px-2 pb-2">
                    {(filters.bucket ? grouped[b.key] : grouped[b.key].slice(0, BUCKET_ROWS)).map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          scroll={false}
                          className="flex flex-col gap-1 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-50 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar name={item.who} size="sm" />
                            <div className="min-w-0 truncate">
                            <span className="font-semibold text-ink-900">{item.who}</span>
                            <span className="text-sm text-ink-500">
                              {"  "}
                              {item.kind === "Payer revalidation" ? `Payer revalidation · ${item.detail}` : item.kind}
                            </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3 text-sm">
                            <span className="text-ink-500">{formatDate(item.date)}</span>
                            <ExpiryBadge date={item.date} />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {!filters.bucket && grouped[b.key].length > BUCKET_ROWS && (
                    <div className="px-5 pb-4">
                      <Link href={hrefWith(params, "bucket", b.key)} scroll={false} className={buttonClass("link")}>
                        Show all {grouped[b.key].length} in {b.label.toLowerCase()}
                      </Link>
                    </div>
                  )}
                </section>
              )
            )
          )}
        </Card>
      </section>

      {/* This week's calls, and what has gone quiet. */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-6">
        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex min-h-9 items-center justify-between gap-2">
            <SectionPill icon={ICONS.phone} count={queue.length}>
              Follow-ups this week
            </SectionPill>

          </div>
          <Card className="overflow-hidden">
            {queue.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-500">Nothing to chase this week.</p>
            ) : (
              <>
                <FollowUpList items={queue.slice(0, PREVIEW_ROWS)} lastContact={lastContact} directory={directory} basePath="/dashboard" params={params} />
                {queue.length > PREVIEW_ROWS && (
                  <div className="border-t border-ink-100 px-5 py-3">
                    <Link href="/follow-ups" className={buttonClass("link")}>
                      See all {queue.length} follow-ups
                    </Link>
                  </div>
                )}
              </>
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
              <>
                <FollowUpList items={stalled.slice(0, PREVIEW_ROWS)} lastContact={lastContact} directory={directory} basePath="/dashboard" params={params} mode="stalled" />
                {stalled.length > PREVIEW_ROWS && (
                  <div className="border-t border-ink-100 px-5 py-3">
                    <Link href="/follow-ups" className={buttonClass("link")}>
                      See all {stalled.length} stalled
                    </Link>
                  </div>
                )}
              </>
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
