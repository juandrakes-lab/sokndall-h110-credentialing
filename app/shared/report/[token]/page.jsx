import { createClient } from "@/lib/supabase/server";
import { fontVars } from "@/components/app/fonts";
import ReportDocument from "@/components/app/ReportDocument";
import PrintButton from "@/components/app/PrintButton";
import { formatGeneratedAt } from "@/lib/reports";

export const metadata = { title: "Credentialing status report", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// The read-only link a client is sent (pedido 2026-10-19, función 1). No
// account: the token is the permission, and cred_shared_report() returns that
// one frozen report while the link is live — never the account, another
// report or another client. A revoked or expired link says so and shows nothing.
export default async function SharedReportPage({ params }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data: rows } = await supabase.rpc("cred_shared_report", { p_token: token });
  const report = rows?.[0];

  if (!report) {
    return (
      <main className={`${fontVars} flex min-h-screen items-center justify-center bg-ink-50 px-5`}>
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-ink-900">This link no longer works</h1>
          <p className="mt-2 text-sm text-ink-500">
            It has expired or was turned off. Ask your credentialing team for a new report link.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className={`${fontVars} min-h-screen bg-ink-50 print:bg-white`}>
      <div className="mx-auto flex max-w-[60rem] flex-wrap items-center justify-between gap-3 px-8 py-4 print:hidden">
        <p className="text-xs text-ink-500">Read-only link · available until {formatGeneratedAt(report.expires_at)}</p>
        <PrintButton />
      </div>
      <div className="pb-12 print:pb-0">
        <div className="mx-auto max-w-[60rem] rounded-2xl shadow-[0_1px_3px_rgba(14,42,46,0.08)] print:shadow-none">
          <ReportDocument data={report.data} generatedAt={report.generated_at} shared />
        </div>
      </div>
    </div>
  );
}
