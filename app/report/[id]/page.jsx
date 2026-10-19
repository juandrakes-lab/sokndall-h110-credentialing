import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { fontVars } from "@/components/app/fonts";
import { buttonClass } from "@/components/app/ui";
import ReportDocument from "@/components/app/ReportDocument";
import PrintButton from "@/components/app/PrintButton";

export const metadata = { title: "Status report — Sokndall", robots: { index: false, follow: false } };

// One generated report, outside the app frame so it prints as a clean
// document. Read through RLS: only someone who can reach the report's client
// gets it; anyone else gets a 404.
export default async function ReportPage({ params }) {
  const { id } = await params;
  const { supabaseAll, user } = await getAppContext();
  if (!user) redirect(`/login?next=/report/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: report } = await supabaseAll.from("cred_reports").select("id, generated_at, data").eq("id", id).maybeSingle();
  if (!report) notFound();

  return (
    <div className={`${fontVars} min-h-screen bg-ink-50 print:bg-white`}>
      <div className="mx-auto flex max-w-[60rem] flex-wrap items-center justify-between gap-3 px-8 py-4 print:hidden">
        <Link href="/reports" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back to reports
        </Link>
        <div className="flex gap-2">
          <Link href="/reports" className={buttonClass("secondary", "sm")}>
            Share a read-only link
          </Link>
          <PrintButton />
        </div>
      </div>
      <div className="pb-12 print:pb-0">
        <div className="mx-auto max-w-[60rem] rounded-2xl shadow-[0_1px_3px_rgba(14,42,46,0.08)] print:shadow-none">
          <ReportDocument data={report.data} generatedAt={report.generated_at} />
        </div>
      </div>
    </div>
  );
}
