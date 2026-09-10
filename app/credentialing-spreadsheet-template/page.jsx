import Link from "next/link";

import Shell from "@/components/neo/Shell";
import Article, { ArticleCta } from "@/components/neo/Article";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Free credentialing spreadsheet template — Sokndall",
  description:
    "A free Google Sheets template for tracking provider credentials and expiration dates. Copy it, no email required.",
  path: "/credentialing-spreadsheet-template",
});

const SHEET_URL = process.env.NEXT_PUBLIC_TEMPLATE_SHEET_URL;

// A give-away page, so it is an article rather than a landing: the offer is
// the first thing on it and there is nothing to argue.
export default function SpreadsheetTemplatePage() {
  return (
    <Shell>
      <Article
        variant="solo"
        align="left"
        kicker="Free template"
        title="Free credentialing &amp; expiration tracking spreadsheet"
        standfirst="A Google Sheet for tracking provider credentials — licenses, DEA registrations, malpractice insurance, board certifications — and when they expire. Make a copy and it is yours. No email, no signup."
        after={
          <ArticleCta
            body="A spreadsheet works until someone forgets to update a formula, or you need more than one person keeping it current. Sokndall does the same tracking — plus payer enrollment status, CSV import for your existing roster, and email alerts before something expires."
            primary={{ href: "/pricing", label: "See pricing" }}
            secondary={{ href: "/login", label: "Start 14-day trial" }}
          />
        }
      >
        <section id="copy">
          <p>
            {SHEET_URL ? (
              <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" className="sk-btn sk-btn--primary">
                Make a copy &rarr;
              </a>
            ) : (
              <span className="sk-small">Template link coming soon.</span>
            )}
          </p>
        </section>

        <section id="whats-in-it">
          <h2>What is in it</h2>
          <ul className="sk-list">
            <li>One row per credential: provider, type, state, issue date, expiration date.</li>
            <li>Automatic days-until-expiration and colour-coded status — active, expiring, expired.</li>
            <li>A dashboard tab summarizing what is due in the next 30, 60 and 90 days.</li>
          </ul>
        </section>

        <section id="outgrow">
          <h2>When you outgrow a spreadsheet</h2>
          <p>
            Below roughly 40 provider-payer pairs, a sheet is genuinely enough. Past that it stops being a tracker and
            becomes something you have to remember to read — and the thing that fails is never the formula, it is the
            Monday nobody opened it.
          </p>
          <p>
            The other limit is people. A sheet has one owner in practice, whatever the sharing settings say. When two
            coordinators are both updating it, the question stops being what the dates are and becomes whose copy is
            current.{" "}
            <Link href="/pricing" className="sk-link">
              What the product costs, and what it tracks
            </Link>
            .
          </p>
        </section>
      </Article>
    </Shell>
  );
}
