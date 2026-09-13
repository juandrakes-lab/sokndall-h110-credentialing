import Link from "next/link";
import { Card, CardHeader, PageHeader, buttonClass } from "@/components/app/ui";

const EXPORTS = [
  ["providers", "Providers", "Every provider with NPI, CAQH ID, specialty and data-check result."],
  ["credentials", "Credentials", "Every license, DEA, policy, board certification and CAQH attestation, with dates."],
  ["expirations", "Expirations", "What's due in the next 90 days, credentials and payer revalidations."],
  ["enrollments", "Enrollments", "Every provider × payer application with status and dates."],
  ["follow-ups", "Follow-ups", "This week's queue and stalled applications, with the last contact."],
  ["communications", "Call and portal log", "Every contact with a payer, with reference numbers."],
  ["documents", "Documents", "The list of stored documents (not the files themselves)."],
  ["payers", "Payers", "The payers on your list and their revalidation cycles."],
];

export default function ImportExportPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Import / Export" description="Bring your spreadsheet in, or take any list out as CSV." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader title="Import providers" description="One row per provider. Each NPI is checked against the NPI Registry." />
          <div className="mt-auto px-5 py-4">
            <Link href="/import-export/providers" className={buttonClass("primary")}>
              Import providers
            </Link>
          </div>
        </Card>
        <Card className="flex flex-col">
          <CardHeader title="Import credentials" description="One row per license, DEA, policy, board certification or CAQH attestation. Import providers first." />
          <div className="mt-auto px-5 py-4">
            <Link href="/import-export/credentials" className={buttonClass("primary")}>
              Import credentials
            </Link>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Export" description="CSV files open in Excel or Google Sheets. Exporting is never limited by your plan." />
        <ul className="divide-y divide-ink-100">
          {EXPORTS.map(([view, title, description]) => (
            <li key={view} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-ink-900">{title}</p>
                <p className="text-xs text-ink-500">{description}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page */}
              <a href={`/export/${view}`} className={`${buttonClass("secondary", "sm")} shrink-0`}>
                Download CSV
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
