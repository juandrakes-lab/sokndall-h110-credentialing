import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { formatGeneratedAt, shareState } from "@/lib/reports";
import { Badge, Card, EmptyState, ICONS, PageHeader, SectionPill, buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { createShareLink, deleteReport, generateReport, revokeShareLink } from "./actions";
import ShareLinkForm from "./ShareLinkForm";

export const metadata = { title: "Reports — Sokndall" };

const STATE_BADGE = {
  active: { tone: "green", text: "Link active" },
  expired: { tone: "neutral", text: "Link expired" },
  revoked: { tone: "neutral", text: "Link revoked" },
};

// Client status reports (pedido 2026-10-19, función 1): generate a snapshot
// of the open client, print it or save it as a PDF, and optionally hand the
// client a read-only link to that one report. The same on every plan; on
// Billing Co it is per client because each client is its own book.
export default async function ReportsPage() {
  const { supabase, client, multiClient } = await getAppContext();
  const { data: reports } = await supabase
    .from("cred_reports")
    .select("id, generated_at, created_by, share_token_hash, share_created_at, share_expires_at, share_revoked_at, data->summary")
    .eq("client_org_id", client.id)
    .order("generated_at", { ascending: false })
    .limit(50);
  const { data: directory } = await supabase.rpc("cred_org_directory");
  const who = (id) => (directory ?? []).find((d) => d.user_id === id)?.name ?? "Former member";

  const list = reports ?? [];
  const live = list.filter((r) => shareState(r) === "active");

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Reports"
        description={`A status report for ${multiClient ? client.name : "your practice"}: every provider's payer applications, the last follow-up on each, and what expires in the next 90 days. Print it, save it as a PDF, or share a read-only link.`}
        actions={
          <form action={generateReport}>
            <SubmitButton className={buttonClass("primary")} pendingLabel="Generating…">
              Generate report
            </SubmitButton>
          </form>
        }
      />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionPill icon={ICONS.shield} tone={live.length ? "brand" : "neutral"} count={live.length}>
            Active read-only links
          </SectionPill>
          <p className="text-sm text-ink-500">Each one shows that one report, nothing else. Revoke to turn it off right away.</p>
        </div>
      <Card className="overflow-hidden">
        {live.length === 0 ? (
          <p className="px-5 py-5 text-sm text-ink-500">No active links.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {live.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                <span>
                  Report of <span className="font-medium text-ink-900">{formatGeneratedAt(r.generated_at)}</span>
                  <span className="text-ink-500"> · expires {formatGeneratedAt(r.share_expires_at)}</span>
                </span>
                <form action={revokeShareLink.bind(null, r.id)}>
                  <SubmitButton className={buttonClass("secondary", "sm")} pendingLabel="Revoking…">
                    Revoke link
                  </SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionPill icon={ICONS.file} tone="brand" count={list.length}>
            Generated reports
          </SectionPill>
          <p className="text-sm text-ink-500">Each one is frozen at the moment it was generated.</p>
        </div>
      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <EmptyState title="No reports yet" description="Generate one to see the current status of every application, ready to print or share." />
        ) : (
          <ul className="divide-y divide-ink-100">
            {list.map((r) => {
              const state = shareState(r);
              const s = r.summary ?? {};
              return (
                <li key={r.id} className="flex flex-col gap-3 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900">{formatGeneratedAt(r.generated_at)}</p>
                      <p className="text-xs text-ink-500">
                        {s.providers ?? 0} providers · {s.applications ?? 0} applications · {s.expiring ?? 0} expiring soon · by {who(r.created_by)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {STATE_BADGE[state] && <Badge tone={STATE_BADGE[state].tone}>{STATE_BADGE[state].text}</Badge>}
                      <Link href={`/report/${r.id}`} className={buttonClass("secondary", "sm")}>
                        Open / print
                      </Link>
                      <form action={deleteReport.bind(null, r.id)}>
                        <SubmitButton className={buttonClass("ghost", "sm")} pendingLabel="Deleting…">
                          Delete
                        </SubmitButton>
                      </form>
                    </div>
                  </div>
                  <ShareLinkForm action={createShareLink.bind(null, r.id)} replacing={state === "active"} />
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      </section>
    </div>
  );
}
