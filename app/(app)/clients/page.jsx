import Link from "next/link";
import { forbidden } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { loadFollowUps } from "@/lib/follow-ups";
import { loadExpirations } from "@/lib/expirations";
import { addDays, todayISO } from "@/lib/credentials";
import { openClient } from "@/lib/client-actions";
import { Card, PageHeader, buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

export const metadata = { title: "Clients — Sokndall" };

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function Count({ value, tone }) {
  return <span className={`tabular-nums ${value ? tone : "text-ink-300"}`}>{value}</span>;
}

// Billing Co (alcance §4.4): the work of every client this person can reach,
// added up, one row per client — totals only, never one client's detail next
// to another's. Opening a row switches the whole app to that client.
export default async function ClientsPage() {
  const { supabaseAll, org, role, clients, client: active, multiClient } = await getAppContext();
  if (!multiClient) forbidden();

  const soon = addDays(todayISO(), 30);
  const [{ queue, stalled }, expirations, { data: providers }] = await Promise.all([
    loadFollowUps(supabaseAll),
    loadExpirations(supabaseAll),
    supabaseAll.from("cred_providers").select("client_org_id").eq("status", "active"),
  ]);

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
                    <form action={openClient}>
                      <input type="hidden" name="client" value={c.id} />
                      <input type="hidden" name="to" value="/dashboard" />
                      <SubmitButton className={buttonClass("secondary", "sm")}>Open</SubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-ink-500">
        {org.provider_limit} providers on your plan, shared by all clients. Opening a client switches every screen —
        dashboard, providers, enrollments, documents — to that client.
      </p>
    </div>
  );
}
