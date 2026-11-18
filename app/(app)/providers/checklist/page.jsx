import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { checklistFor } from "@/lib/checklist";
import { Card, EmptyState, PageHeader, buttonClass } from "@/components/app/ui";

export const metadata = { title: "File checklist — Sokndall" };

const COLUMNS = [
  { key: "npi", label: "NPI" },
  { key: "caqh", label: "CAQH" },
  { key: "license", label: "License" },
  { key: "malpractice", label: "Malpractice" },
  { key: "w9", label: "W-9" },
  { key: "cv", label: "CV" },
];

// The new client's file at a glance (pedido 2026-11-17, C2): per provider,
// what's missing, worked out from what's already loaded (lib/checklist.js) —
// with a percentage per provider and for the client. Each row leads to the
// provider's page, where the upload link asks the provider for what's missing.
export default async function ChecklistPage() {
  const { supabase, client, clients } = await getAppContext();
  const { data: providers } = await supabase
    .from("cred_providers")
    .select("id, first_name, last_name, npi, nppes_data")
    .eq("status", "active")
    .order("last_name");
  const ids = (providers ?? []).map((p) => p.id);
  const [{ data: creds }, { data: docs }] = ids.length
    ? await Promise.all([
        supabase.from("cred_credentials").select("provider_id, type, expiration_date, renewed_at").in("provider_id", ids),
        supabase.from("cred_documents").select("provider_id, category, created_at").in("provider_id", ids),
      ])
    : [{ data: [] }, { data: [] }];

  const rows = (providers ?? []).map((p) => {
    const items = checklistFor(p, (creds ?? []).filter((c) => c.provider_id === p.id), (docs ?? []).filter((d) => d.provider_id === p.id));
    const byKey = Object.fromEntries(items.map((i) => [i.key, i]));
    const done = items.filter((i) => i.done).length;
    return { p, byKey, pct: items.length ? Math.round((100 * done) / items.length) : 0, missing: items.length - done };
  });
  const total = rows.length ? Math.round(rows.reduce((s, r) => s + r.pct, 0) / rows.length) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={<Link href="/providers" className="hover:text-ink-900">← Providers</Link>}
        title={clients.length > 1 ? `File checklist · ${client.name}` : "File checklist"}
        description={`What each provider's file still needs before applications go out. ${rows.length ? `This ${clients.length > 1 ? "client" : "practice"} is ${total}% complete.` : ""}`}
      />
      {rows.length === 0 ? (
        <Card>
          <EmptyState title="No providers yet" description="Add or import providers and their file shows up here." action={<Link href="/providers/new" className={buttonClass("primary")}>Add a provider</Link>} />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-100 text-xs font-medium text-ink-700">
                <tr>
                  <th className="px-5 py-3 font-medium">Provider</th>
                  {COLUMNS.map((c) => (
                    <th key={c.key} className="px-3 py-3 text-center font-medium">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-right font-medium">Complete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map(({ p, byKey, pct, missing }) => (
                  <tr key={p.id} className="hover:bg-ink-50/70">
                    <td className="px-5 py-3">
                      <Link href={`/providers/${p.id}`} className="font-medium text-ink-900 hover:text-brand-600">
                        {p.last_name}, {p.first_name}
                      </Link>
                      {missing > 0 && <span className="block text-xs text-ink-500">{missing} missing · request them from the provider page</span>}
                    </td>
                    {COLUMNS.map((c) => {
                      const it = byKey[c.key];
                      return (
                        <td key={c.key} className="px-3 py-3 text-center" title={it?.done ? "On file" : it?.todo}>
                          {it?.done ? (
                            <span className="text-status-active" aria-label="On file">✓</span>
                          ) : (
                            <span className={it?.warn ? "text-status-expired" : "text-ink-500"} aria-label={it?.warn ? "Needs attention" : "Missing"}>
                              {it?.warn ? "!" : "—"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-ink-900">{pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <p className="text-xs text-ink-500">✓ on file · — missing · ! on file but expired, overdue or an old copy. Hover a mark to see what to do.</p>
    </div>
  );
}
