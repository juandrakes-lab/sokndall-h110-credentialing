import { fontVars } from "@/components/app/fonts";
import ReportDocument from "@/components/app/ReportDocument";
import PrintButton from "@/components/app/PrintButton";
import { liveReport } from "@/lib/live-links";

export const metadata = { title: "Credentialing status", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// The live link a client keeps (pedido 2026-11-16, punto 2): the current
// status every time it is opened, no expiry, until the credentialing team
// turns it off. Read-only, one client, nothing else of the account.
export default async function LiveStatusPage({ params, searchParams }) {
  const { token } = await params;
  const fromDemo = (await searchParams)?.from === "demo";
  const data = await liveReport(token);

  if (!data) {
    return (
      <main className={`${fontVars} flex min-h-screen items-center justify-center bg-ink-50 px-5`}>
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-ink-900">This link no longer works</h1>
          <p className="mt-2 text-sm text-ink-500">It was turned off by your credentialing team. Ask them for the current link.</p>
        </div>
      </main>
    );
  }

  const now = new Date().toISOString();
  return (
    <div className={`${fontVars} min-h-screen bg-ink-50 print:bg-white`}>
      {fromDemo && data.demo && (
        <div className="bg-brand-700 px-5 py-3 text-sm text-white print:hidden">
          <div className="mx-auto flex max-w-[60rem] flex-wrap items-center justify-between gap-3">
            <p>
              <span className="font-semibold">This is what your client sees.</span> One link, no &ldquo;any update?&rdquo; emails.
            </p>
            <a href="/clients" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700">
              Back to the demo
            </a>
          </div>
        </div>
      )}
      <div className="mx-auto flex max-w-[60rem] flex-wrap items-center justify-between gap-3 px-8 py-4 print:hidden">
        <p className="text-xs text-ink-500">Live status · read-only · updates every time you open or reload this page</p>
        <PrintButton fileName={`Credentialing status - ${data.client_name} - ${data.as_of}`} />
      </div>
      <div className="pb-12 print:pb-0">
        <div className="mx-auto max-w-[60rem] rounded-2xl shadow-[0_1px_3px_rgba(14,42,46,0.08)] print:shadow-none">
          <ReportDocument data={data} generatedAt={now} shared live />
        </div>
      </div>
    </div>
  );
}
