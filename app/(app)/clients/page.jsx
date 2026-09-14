import Link from "next/link";
import { forbidden } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { loadFollowUps } from "@/lib/follow-ups";
import { loadExpirations } from "@/lib/expirations";
import { addDays, formatDate, todayISO } from "@/lib/credentials";
import { archiveClient, deleteClient, openClient, restoreClient } from "@/lib/client-actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, PageHeader, buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import ExportClientButton from "@/components/app/ExportClientButton";
import { DeleteClientForm, RestoreClientForm } from "./ClientLifecycleForms";

export const metadata = { title: "Clients — Sokndall" };

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function Count({ value, tone }) {
  return <span className={`tabular-nums ${value ? tone : "text-ink-300"}`}>{value}</span>;
}

// Billing Co (alcance §4.4): the work of every client this person can reach,
// added up, one row per client — totals only, never one client's detail next
// to another's. Opening a row switches the whole app to that client.
export default async function ClientsPage({ searchParams }) {
  const { supabaseAll, org, role, clients, archivedClients, client: active, multiClient } = await getAppContext();
  if (!multiClient) forbidden();
  const sp = await searchParams;
  const owner = role === "owner";

  const soon = addDays(todayISO(), 30);
  // supabaseAll never reads archived clients (RLS), so neither do these totals.
  const [{ queue, stalled }, expirations, { data: providers }, { data: deletions }, archivedCounts] = await Promise.all([
    loadFollowUps(supabaseAll),
    loadExpirations(supabaseAll),
    supabaseAll.from("cred_providers").select("client_org_id").eq("status", "active"),
    owner
      ? supabaseAll.from("cred_client_deletions").select("client_name, deleted_at, deleted_by").order("deleted_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    // An archived client's providers, read by naming it (owner only).
    Promise.all(
      archivedClients.map(async (c) => {
        const scoped = await createClient({ clientOrgId: c.id });
        const { count } = await scoped.from("cred_providers").select("id", { count: "exact", head: true }).eq("client_org_id", c.id);
        return [c.id, count ?? 0];
      })
    ).then((pairs) => new Map(pairs)),
  ]);
  const { data: directory } = owner && deletions?.length ? await supabaseAll.rpc("cred_org_directory") : { data: [] };
  const emailOf = (id) => (directory ?? []).find((d) => d.user_id === id)?.email ?? "a former member";

  const tally = (rows, clientOf) => {
    const m = new Map();
    for (const r of rows) m.set(clientOf(r), (m.get(clientOf(r)) ?? 0) + 1);
    return m;
  };
  const byClient = {
    providers: tally(providers ?? [], (p) => p.client_org_id),
    followUps: tally(queue, (e) => e.provider.client_org_id),
    stalled: tally(stalled, (e) => e.provider.client_org_id),
    expired: tally(expirations.filter((x) => x.date < todayISO()), (x) => x.provider.client_org_id),
    expiring: tally(expirations.filter((x) => x.date >= todayISO() && x.date <= soon), (x) => x.provider.client_org_id),
  };
  const withWork = new Set(queue.map((e) => e.provider.client_org_id)).size;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clients"
        description={
          queue.length
            ? `${plural(queue.length, "application needs", "applications need")} follow-up this week across ${plural(withWork, "client", "clients")}.`
            : `No follow-ups due this week across your ${plural(clients.length, "client", "clients")}.`
        }
        actions={
          role === "owner" && (
            <Link href="/clients/new" className={buttonClass("primary")}>
              Add client
            </Link>
          )
        }
      />

      {sp?.archived && (
        <p role="status" className="rounded-lg border border-status-active/30 bg-status-active-bg px-4 py-3 text-sm text-ink-900">
          Client archived. Its data is kept below under Archived; restore it any time.
        </p>
      )}
      {sp?.deleted && (
        <p role="status" className="rounded-lg border border-status-active/30 bg-status-active-bg px-4 py-3 text-sm text-ink-900">
          Client deleted, with all of its data and files.
        </p>
      )}
      {sp?.problem && (
        <p role="alert" className="rounded-lg border border-status-expired/30 bg-status-expired-bg px-4 py-3 text-sm text-status-expired">
          {sp.problem}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Follow-ups this week", queue.length, "text-brand-700"],
          ["Stalled 30+ days", stalled.length, "text-status-expiring"],
          ["Expiring in 30 days", [...byClient.expiring.values()].reduce((a, b) => a + b, 0), "text-status-expiring"],
          ["Expired", [...byClient.expired.values()].reduce((a, b) => a + b, 0), "text-status-expired"],
        ].map(([label, value, tone]) => (
          <div key={label} className="rounded-xl border border-ink-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-sm text-ink-500">{label}</div>
            <div className={`mt-1 text-3xl font-semibold tabular-nums ${value ? tone : "text-ink-900"}`}>{value}</div>
          </div>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 text-right font-medium">Providers</th>
                <th className="px-5 py-3 text-right font-medium">Follow-ups this week</th>
                <th className="px-5 py-3 text-right font-medium">Stalled</th>
                <th className="px-5 py-3 text-right font-medium">Expiring (30 days)</th>
                <th className="px-5 py-3 text-right font-medium">Expired</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-ink-50/70">
                  <td className="px-5 py-3 font-medium text-ink-900">
                    {c.name}
                    {c.id === active?.id && <span className="ml-2 text-xs font-normal text-ink-500">Open now</span>}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-ink-700">{byClient.providers.get(c.id) ?? 0}</td>
                  <td className="px-5 py-3 text-right">
                    <Count value={byClient.followUps.get(c.id) ?? 0} tone="font-semibold text-brand-700" />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Count value={byClient.stalled.get(c.id) ?? 0} tone="font-semibold text-status-expiring" />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Count value={byClient.expiring.get(c.id) ?? 0} tone="font-semibold text-status-expiring" />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Count value={byClient.expired.get(c.id) ?? 0} tone="font-semibold text-status-expired" />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <form action={openClient}>
                        <input type="hidden" name="client" value={c.id} />
                        <input type="hidden" name="to" value="/dashboard" />
                        <SubmitButton className={buttonClass("secondary", "sm")}>Open</SubmitButton>
                      </form>
                      {owner && clients.length > 1 && (
                        <details className="relative text-left text-xs">
                          <summary className="cursor-pointer list-none text-ink-500 hover:text-ink-900 [&::-webkit-details-marker]:hidden">
                            Archive
                          </summary>
                          <form
                            action={archiveClient}
                            className="absolute right-0 z-10 mt-1 w-72 rounded-lg border border-ink-200 bg-white p-3 text-sm shadow-lg"
                          >
                            <input type="hidden" name="client" value={c.id} />
                            <p className="text-ink-700">
                              {c.name} leaves the selector and this panel, its providers stop counting toward your {org.provider_limit},
                              and members lose access. Nothing is deleted; restore it any time.
                            </p>
                            <SubmitButton className={`${buttonClass("secondary", "sm")} mt-2`}>Archive {c.name}</SubmitButton>
                          </form>
                        </details>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-ink-500">
        {org.provider_limit} providers on your plan, shared by all active clients. Opening a client switches every screen —
        dashboard, providers, enrollments, documents — to that client.
      </p>

      {owner && archivedClients.length > 0 && (
        <Card>
          <CardHeader
            title="Archived"
            description="Kept exactly as they were, out of every screen and every member's reach. They don't count toward your providers or storage. Restore one, or export it and delete it for good."
          />
          <ul className="divide-y divide-ink-100">
            {archivedClients.map((c) => (
              <li key={c.id} className="flex flex-col gap-3 px-5 py-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-500">
                      Archived {formatDate(c.archived_at.slice(0, 10))} · {plural(archivedCounts.get(c.id) ?? 0, "provider", "providers")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-start gap-2">
                    <RestoreClientForm action={restoreClient} clientId={c.id} />
                    <ExportClientButton clientId={c.id} />
                  </div>
                </div>
                <details>
                  <summary className="cursor-pointer text-xs font-medium text-status-expired hover:underline">Delete for good…</summary>
                  <div className="mt-2">
                    <DeleteClientForm action={deleteClient} clientId={c.id} clientName={c.name} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {owner && deletions?.length > 0 && (
        <div className="text-xs text-ink-500">
          <p className="font-medium text-ink-700">Deleted clients</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {deletions.map((d) => (
              <li key={`${d.client_name}-${d.deleted_at}`}>
                {d.client_name} — deleted {formatDate(d.deleted_at.slice(0, 10))} by {emailOf(d.deleted_by)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
