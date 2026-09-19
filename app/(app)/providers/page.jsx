import Link from "next/link";
import HeaderActions from "@/components/app/HeaderActions";
import { getAppContext, providerUsage } from "@/lib/org";
import { providerIssues } from "@/lib/consistency";
import { daysUntil } from "@/lib/credentials";
import { ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";
import {
  Avatar,
  Badge,
  Card,
  EmptyState,
  ICONS,
  PIPELINE_ORDER,
  PageHeader,
  STATUS_FILL,
  SegmentBar,
  StatCard,
  StatRow,
  buttonClass,
} from "@/components/app/ui";
import LimitNotice from "@/components/app/LimitNotice";
import { accountAccess } from "@/lib/billing";

// The provider's credentials in one word, with the colour of the worst one.
function standing(credentials) {
  const dated = credentials.filter((c) => c.expiration_date).map((c) => daysUntil(c.expiration_date));
  if (credentials.length === 0) return { tone: "neutral", label: "No credentials yet", rank: 1 };
  const expired = dated.filter((d) => d < 0).length;
  if (expired) return { tone: "red", label: `${expired} expired`, rank: 0 };
  const soon = dated.filter((d) => d >= 0 && d <= 30);
  if (soon.length) {
    const nearest = Math.min(...soon);
    return { tone: nearest <= 14 ? "red" : "amber", label: `${soon.length} due within 30 days`, rank: 0 };
  }
  return { tone: "green", label: "All current", rank: 3 };
}

function dataStanding(issues) {
  const errors = issues.filter((i) => i.severity === "error").length;
  if (errors) return <Badge tone="red" dot>{errors} mismatch{errors > 1 ? "es" : ""}</Badge>;
  if (issues.length) return <Badge tone="amber" dot>{issues.length} to review</Badge>;
  return <Badge tone="green">Matches NPPES</Badge>;
}

export default async function ProvidersPage() {
  const { supabase, org, practice, clients } = await getAppContext();

  const [{ data: providers, error }, usage, { data: enrollments }] = await Promise.all([
    supabase.from("cred_providers").select("*, cred_credentials(type, state, number, expiration_date)").order("last_name", { ascending: true }),
    providerUsage(supabase, org.id),
    supabase.from("cred_enrollments").select("provider_id, status"),
  ]);

  if (error) {
    return <p className="text-sm text-status-expired">Couldn&apos;t load providers: {error.message}</p>;
  }

  const atLimit = usage.count >= org.provider_limit;
  const writable = accountAccess(org).writable;
  const readOnly = writable ? usage.overLimit : new Set(providers.map((p) => p.id));

  const byProvider = new Map(providers.map((p) => [p.id, Object.fromEntries(PIPELINE_ORDER.map((s) => [s, 0]))]));
  for (const e of enrollments ?? []) {
    const row = byProvider.get(e.provider_id);
    if (row && e.status in row) row[e.status] += 1;
  }

  const rows = providers.map((p) => ({
    ...p,
    standing: standing(p.cred_credentials ?? []),
    issues: providerIssues(p, practice, providers, p.cred_credentials ?? []),
    pipeline: byProvider.get(p.id) ?? {},
  }));

  const allCurrent = rows.filter((r) => r.standing.rank === 3).length;
  const needWork = rows.filter((r) => r.standing.rank <= 1).length;
  const toReview = rows.filter((r) => r.issues.length > 0).length;
  const across = clients.length > 1 ? " for this client" : "";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Providers"
        description={`${providers.length} provider${providers.length === 1 ? "" : "s"}${across} — their credentials, paperwork and where each payer application stands.`}
        actions={
          <HeaderActions
            secondary={[
              { label: "Export CSV", href: "/export/providers", download: true },
              ...(writable ? [{ label: "Import CSV", href: "/import-export/providers", icon: ICONS.upload }] : []),
            ]}
            primary={
              writable &&
              !atLimit && (
                <Link href="/providers/new" className={buttonClass("primary")}>
                  New provider
                </Link>
              )
            }
          />
        }
      />

      {providers.length > 0 && (
        <StatRow>
          <StatCard
            label="On your plan"
            value={usage.count}
            suffix={`of ${org.provider_limit}`}
            icon={ICONS.providers}
            meter={usage.count / org.provider_limit}
            tone={atLimit ? "amber" : "brand"}
            hint={atLimit ? "Every seat on the plan is in use." : `${org.provider_limit - usage.count} still available.`}
          />
          <StatCard
            label="Everything current"
            value={allCurrent}
            suffix={`of ${rows.length}`}
            icon={ICONS.shield}
            tone="green"
            meter={rows.length ? allCurrent / rows.length : 0}
            hint={needWork ? `${needWork} need paperwork attention.` : "No expired or missing credentials."}
          />
          <StatCard
            label="Data checks to review"
            value={toReview}
            icon={ICONS.alert}
            tone={toReview ? "amber" : "green"}
            hint={toReview ? "Differences with the NPI Registry." : "Everything matches the NPI Registry."}
          />
        </StatRow>
      )}

      {writable && atLimit && <LimitNotice org={org} />}

      <Card className="overflow-hidden">
        {providers.length === 0 ? (
          <EmptyState
            title="No providers yet"
            description="Add each provider with their NPI — Sokndall checks it against the federal NPI Registry as you go."
            action={
              <Link href="/providers/new" className={buttonClass("primary")}>
                Add your first provider
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-100 text-xs font-medium text-ink-700">
                <tr>
                  <th className="px-5 py-3 font-medium">Provider</th>
                  <th className="px-5 py-3 font-medium">Credentials</th>
                  <th className="px-5 py-3 font-medium">Applications</th>
                  <th className="px-5 py-3 font-medium">Data check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((p) => {
                  const total = PIPELINE_ORDER.reduce((n, s) => n + (p.pipeline[s] ?? 0), 0);
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-ink-50/70">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${p.first_name} ${p.last_name}`} />
                          <div className="min-w-0">
                            <Link href={`/providers/${p.id}`} className="font-semibold text-ink-900 hover:text-brand-600">
                              {p.last_name}, {p.first_name}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                              <span>{p.specialty ?? "No specialty"}</span>
                              {p.status === "inactive" && <Badge tone="neutral">Inactive</Badge>}
                              {readOnly.has(p.id) && <Badge tone="amber">Read-only</Badge>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={p.standing.tone} dot={p.standing.tone !== "green"}>
                          {p.standing.label}
                        </Badge>
                      </td>
                      <td className="w-52 px-5 py-3.5">
                        {total === 0 ? (
                          <span className="text-xs text-ink-500">None yet</span>
                        ) : (
                          <>
                            <SegmentBar
                              height={8}
                              segments={PIPELINE_ORDER.filter((s) => p.pipeline[s] > 0).map((s) => ({
                                key: s,
                                label: ENROLLMENT_STATUS_LABELS[s],
                                value: p.pipeline[s],
                                color: STATUS_FILL[s],
                              }))}
                            />
                            <span className="mt-1.5 block text-xs text-ink-700">
                              {p.pipeline.approved} approved of {total}
                            </span>
                          </>
                        )}
                      </td>
                      <td className="px-5 py-3.5">{dataStanding(p.issues)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
