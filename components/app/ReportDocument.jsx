import { formatDate } from "@/lib/credentials";
import { formatGeneratedAt } from "@/lib/reports";

// The client status report as a document (pedido 2026-10-19, función 1):
// the same markup for the signed-in view, the print/PDF view and the shared
// read-only link. Plain and printable: white page, no app chrome, the
// generation time at the top of every copy. Reads only the frozen snapshot.

const TONE = {
  approved: "text-status-active",
  denied: "text-status-expired",
  info_requested: "text-status-expiring",
  in_review: "text-sky-800",
  submitted: "text-enroll-purple",
  not_started: "text-ink-500",
};

const th = "border-b border-ink-200 px-3 py-2 text-left text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-500";
const td = "border-b border-ink-100 px-3 py-2 align-top";

export default function ReportDocument({ data, generatedAt, shared = false }) {
  const s = data.summary;
  return (
    <article className="report-doc mx-auto w-full max-w-[60rem] bg-white px-8 py-10 text-[0.875rem] text-ink-900 print:max-w-none print:px-0 print:py-0">
      <header className="border-b-2 border-brand-700 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">Credentialing status report</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{data.client_name}</h1>
        {data.practice_name && data.practice_name !== data.client_name && <p className="text-sm text-ink-500">{data.practice_name}</p>}
        <p className="mt-3 inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-700 print:bg-transparent print:px-0">
          Generated {formatGeneratedAt(generatedAt)}
        </p>
        <p className="mt-2 text-xs text-ink-500">
          {shared
            ? "A snapshot taken at the time above. It does not update: ask your credentialing team for a new one to see the current status."
            : "A snapshot of this moment. It does not change when the data changes; generate a new one for the current status."}
        </p>
      </header>

      <section className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 print:grid-cols-6">
        <Stat label="Providers" value={s.providers} />
        <Stat label="Applications" value={s.applications} />
        {s.by_status
          .filter((b) => ["approved", "in_review", "submitted", "info_requested"].includes(b.status))
          .map((b) => (
            <Stat key={b.status} label={b.label} value={b.count} />
          ))}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold">Payer enrollment by provider</h2>
        {data.providers.length === 0 && <p className="mt-2 text-ink-500">No active providers.</p>}
        {data.providers.map((p) => (
          <div key={p.name + (p.npi ?? "")} className="mt-5 break-inside-avoid">
            <p className="font-semibold">
              {p.name}
              <span className="font-normal text-ink-500">
                {p.specialty ? ` · ${p.specialty}` : ""}
                {p.npi ? ` · NPI ${p.npi}` : ""}
              </span>
            </p>
            {p.applications.length === 0 ? (
              <p className="mt-1 text-ink-500">No payer applications yet.</p>
            ) : (
              <table className="mt-2 w-full table-fixed border-collapse">
                <colgroup>
                  <col className="w-[22%]" />
                  <col className="w-[16%]" />
                  <col className="w-[12%]" />
                  <col className="w-[12%]" />
                  <col className="w-[24%]" />
                  <col className="w-[14%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className={th}>Payer</th>
                    <th className={th}>Status</th>
                    <th className={th}>Submitted</th>
                    <th className={th}>Effective</th>
                    <th className={th}>Last follow-up</th>
                    <th className={th}>Next follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {p.applications.map((a) => (
                    <tr key={a.payer}>
                      <td className={td}>{a.payer}</td>
                      <td className={`${td} font-semibold ${TONE[a.status] ?? ""}`}>
                        {a.status_label}
                        {a.payer_request && <span className="block text-xs font-normal text-ink-700">Payer asked for: {a.payer_request}</span>}
                      </td>
                      <td className={`${td} tabular-nums`}>{formatDate(a.submitted)}</td>
                      <td className={`${td} tabular-nums`}>{formatDate(a.effective)}</td>
                      <td className={td}>
                        {a.last_follow_up ? (
                          <>
                            <span className="tabular-nums">{formatDate(a.last_follow_up.date)}</span> · {a.last_follow_up.channel}
                            {a.last_follow_up.outcome && <span className="block text-xs text-ink-700">{a.last_follow_up.outcome}</span>}
                          </>
                        ) : (
                          <span className="text-ink-500">None logged</span>
                        )}
                      </td>
                      <td className={`${td} tabular-nums`}>{formatDate(a.next_follow_up)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </section>

      <section className="mt-10 break-inside-avoid">
        <h2 className="text-base font-semibold">Credentials expiring in the next 90 days</h2>
        {data.expirations.length === 0 ? (
          <p className="mt-2 text-ink-500">Nothing expires in the next 90 days.</p>
        ) : (
          <table className="mt-2 w-full border-collapse">
            <thead>
              <tr>
                <th className={th}>Provider</th>
                <th className={th}>Credential</th>
                <th className={th}>Expires</th>
                <th className={th}>Days left</th>
              </tr>
            </thead>
            <tbody>
              {data.expirations.map((e, i) => (
                <tr key={i}>
                  <td className={td}>{e.provider}</td>
                  <td className={td}>{e.credential}</td>
                  <td className={`${td} tabular-nums`}>{formatDate(e.expires)}</td>
                  <td className={`${td} tabular-nums font-semibold ${e.days < 0 ? "text-status-expired" : e.days <= 30 ? "text-status-expiring" : ""}`}>
                    {e.days < 0 ? `Expired ${Math.abs(e.days)} days before this report` : e.days}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer className="mt-10 border-t border-ink-100 pt-4 text-xs text-ink-500">
        Prepared with Sokndall · Generated {formatGeneratedAt(generatedAt)} · Days are counted from the report date ({formatDate(data.as_of)}).
      </footer>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-ink-100 px-3 py-2.5">
      <p className="text-xl font-semibold tabular-nums leading-none">{value}</p>
      <p className="mt-1 text-xs text-ink-500">{label}</p>
    </div>
  );
}
