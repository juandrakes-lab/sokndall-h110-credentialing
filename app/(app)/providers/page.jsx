import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { providerIssues } from "@/lib/consistency";
import { daysUntil } from "@/lib/credentials";
import { Badge, Card, EmptyState, PageHeader, buttonClass } from "@/components/app/ui";
import LimitNotice from "@/components/app/LimitNotice";

function credentialStanding(credentials) {
  if (credentials.length === 0) return <Badge tone="neutral">None yet</Badge>;
  const dated = credentials.filter((c) => c.expiration_date).map((c) => daysUntil(c.expiration_date));
  const expired = dated.filter((d) => d < 0).length;
  const soon = dated.filter((d) => d >= 0 && d <= 90).length;
  if (expired) return <Badge tone="red">{expired} expired</Badge>;
  if (soon) {
    const nearest = Math.min(...dated.filter((d) => d >= 0));
    return <Badge tone={nearest <= 14 ? "red" : nearest <= 30 ? "amber" : "neutral"}>{soon} expiring soon</Badge>;
  }
  return <Badge tone="green">All current</Badge>;
}

function dataStanding(issues) {
  const errors = issues.filter((i) => i.severity === "error").length;
  if (errors) return <Badge tone="red">{errors} mismatch{errors > 1 ? "es" : ""}</Badge>;
  if (issues.length) return <Badge tone="amber">{issues.length} to review</Badge>;
  return <Badge tone="green">Matches NPPES</Badge>;
}

export default async function ProvidersPage() {
  const { supabase, org, practice } = await getAppContext();

  const { data: providers, error } = await supabase
    .from("cred_providers")
    .select("*, cred_credentials(expiration_date)")
    .order("last_name", { ascending: true });

  if (error) {
    return <p className="text-sm text-status-expired">Couldn&apos;t load providers: {error.message}</p>;
  }

  const atLimit = providers.length >= org.provider_limit;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Providers"
        description={`${providers.length} of ${org.provider_limit} providers on your plan.`}
        actions={
          !atLimit && (
            <Link href="/providers/new" className={buttonClass("primary")}>
              New provider
            </Link>
          )
        }
      />

      {atLimit && <LimitNotice org={org} />}

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
              <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Provider</th>
                  <th className="px-5 py-3 font-medium">NPI</th>
                  <th className="px-5 py-3 font-medium">Credentials</th>
                  <th className="px-5 py-3 font-medium">Data check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-ink-50/70">
                    <td className="px-5 py-3">
                      <Link href={`/providers/${p.id}`} className="font-medium text-ink-900 hover:text-brand-600">
                        {p.last_name}, {p.first_name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-ink-500">
                        {p.specialty ?? "No specialty"}
                        {p.status === "inactive" && <Badge tone="neutral">Inactive</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-700">{p.npi ?? "—"}</td>
                    <td className="px-5 py-3">{credentialStanding(p.cred_credentials ?? [])}</td>
                    <td className="px-5 py-3">{dataStanding(providerIssues(p, practice, providers))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
