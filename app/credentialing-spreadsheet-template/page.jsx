import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Free Credentialing Spreadsheet Template — Sokndall",
  description:
    "A free Google Sheets template for tracking provider credentials and expiration dates. Copy it, no email required.",
  path: "/credentialing-spreadsheet-template",
});

const SHEET_URL = process.env.NEXT_PUBLIC_TEMPLATE_SHEET_URL;

export default function SpreadsheetTemplatePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold text-ink-900">
          Free credentialing &amp; expiration tracking spreadsheet
        </h1>
        <p className="mt-3 text-ink-500">
          A Google Sheet for tracking provider credentials — licenses, DEA
          registrations, malpractice insurance, board certifications — and
          when they expire. Make a copy and it&apos;s yours. No email, no
          signup.
        </p>
      </div>

      {SHEET_URL ? (
        <a
          href={SHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded-md bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
        >
          Make a copy →
        </a>
      ) : (
        <p className="w-fit rounded-md border border-ink-200 bg-ink-50 px-4 py-2 text-sm text-ink-500">
          Template link coming soon.
        </p>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink-900">What&apos;s in it</h2>
        <ul className="list-inside list-disc text-ink-700">
          <li>One row per credential: provider, type, state, issue date, expiration date</li>
          <li>Automatic days-until-expiration and color-coded status (active / expiring / expired)</li>
          <li>A dashboard tab summarizing what&apos;s due in the next 30/60/90 days</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink-900">When you outgrow a spreadsheet</h2>
        <p className="text-ink-700">
          A spreadsheet works until someone forgets to update a formula, or
          you need more than one person keeping it current. Sokndall does the
          same tracking — plus payer enrollment status, CSV import for your
          existing roster, and email alerts before something expires —
          without the spreadsheet.
        </p>
        <div className="flex gap-3">
          <Link
            href="/pricing"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            See pricing
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Get started
          </Link>
        </div>
      </section>
    </main>
  );
}
