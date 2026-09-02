import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import ArticleSidebar from "@/components/site/ArticleSidebar";
import MobileToc from "@/components/site/MobileToc";
import ExploreMore from "@/components/site/ExploreMore";
import StageBarChart from "@/components/site/StageBarChart";
import Observed from "@/components/site/Observed";
import { CONTENTS, FORMS, TIMELINE_CHART, PLAYBOOK, ERRORS } from "./data";
import { otherGuides } from "../clusterData";

export const metadata = {
  title: "Medicare provider enrollment: PECOS, the forms, and revalidation — Sokndall",
  description:
    "How Medicare enrollment runs, which CMS-855 form applies to your situation, what revalidation does when it goes past due, and how to track a date CMS does not reliably remind you about.",
};

const RELATED = otherGuides("/payer-enrollment/medicare");

export default function MedicareGuidePage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-shell">
        <header className="lp-article-head lp-a-span">
          <div className="lp-head-text">
            <Link href="/payer-enrollment" className="lp-kicker">
              Payer enrollment
            </Link>
            <h1>Medicare provider enrollment: PECOS, the forms, and the revalidation that stops your payments</h1>
            <p className="lp-standfirst">
              How enrollment runs, which form applies to your situation, what revalidation does when it goes past due,
              and how to track a date CMS does not reliably remind you about.
            </p>
          </div>
          <hr className="lp-article-rule" />
        </header>

        <MobileToc items={CONTENTS} />

        <article className="lp-article-main">
          <section id="process" className="lp-anchor">
            <h2>The process, in order</h2>
            <p>Which form you file depends on what you are, and filing the wrong one restarts the clock.</p>

            {/* The four forms are a reference table — the reader wants the row
                that applies to them, not four paragraphs. */}
            <div className="lp-a-tablewrap lp-a-wide">
              <table className="lp-a-table lp-a-table--3">
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>Who files it</th>
                    <th>What it carries</th>
                  </tr>
                </thead>
                <tbody>
                  {FORMS.map((f) => (
                    <tr key={f.form}>
                      <td>{f.form}</td>
                      <td>{f.who}</td>
                      <td>{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Enrollment runs through PECOS (Provider Enrollment, Chain, and Ownership System), online or on paper,
              submitted to the Medicare Administrative Contractor (MAC) with jurisdiction over your state. Each MAC has
              its own jurisdiction-specific quirks.
            </p>
            <p>
              A first-time PECOS user needs I&amp;A (Identity &amp; Access) credentials set up before submitting
              anything. That setup step alone typically runs 7 to 14 days, so it belongs at the front of your timeline,
              not folded into it.
            </p>
          </section>

          <section id="documents" className="lp-anchor">
            <h2>What Medicare asks for</h2>
            <p>
              The individual NPI (Type 1) and, when enrolling under a group, the group&rsquo;s NPI (Type 2) &mdash; kept
              distinct on the form and cross-checked against each other. The exact legal name and TIN/EIN matching IRS
              records. Banking information for EFT via the CMS-588, since Medicare will not release payment without it
              on file.
            </p>
            <p>
              And, for the reassignment itself, an authorized or delegated official&rsquo;s signature from the group
              alongside the individual&rsquo;s. One signature without the other is one of the most common reasons a
              MAC sends the application back for development rather than approving it outright.
            </p>
          </section>

          <section id="timelines" className="lp-anchor">
            <h2>Stated timeline and observed timeline</h2>
            <p>
              Clean, fully correct applications through PECOS are commonly cited at <strong>45 to 65 days</strong> for
              the initial 855I/855B combination. Roughly 40% of applications need at least one correction round, which
              adds another 15 to 30 days &mdash; meaning the realistic range for a first-time enrollment is closer to{" "}
              <strong>60 to 95 days</strong> even when nothing is fundamentally wrong.
            </p>

            <StageBarChart rows={TIMELINE_CHART} />

            <p>
              The reassignment step, once the individual and group records are both already active, is the fast part
              of the family: typically 15 to 30 days, because it does not re-verify anything already verified.
            </p>
            <p>
              Those timelines assume the process runs cleanly. When it does not, the consequences arrive before the
              resolution does.
            </p>

            <Observed>
              <p>
                One practice went three months with Medicare payments held while a late revalidation cleared, and was
                still waiting on the held balance after approval.
              </p>
              <p>
                In another case, funds were released three days after the banking information for EFT was confirmed on
                a very late revalidation &mdash; meaning the last blocker was an administrative detail, not the review
                itself.
              </p>
            </Observed>
          </section>

          <section id="revalidation" className="lp-anchor">
            <h2>Revalidation is the one that costs money</h2>
            <p>
              Revalidation is a periodic re-confirmation of your enrollment record &mdash; not credentialing, not a
              renewal, just CMS asking you to prove the record on file is still accurate. The standard cycle is every{" "}
              <strong>5 years</strong> for most physicians and practitioners (3 years for DMEPOS suppliers), and it is
              a hard deadline: missing it deactivates enrollment and results in{" "}
              <strong>60 to 90 days of lost billing ability</strong>.
            </p>
            <p>
              What makes it dangerous is the failure mode. Miss it and billing privileges can be deactivated or
              suspended, payments stop, and claims start returning denial codes that do not obviously say
              &ldquo;revalidation.&rdquo; Practices have discovered they were disenrolled only from the denial pattern.
            </p>

            <Observed label="Observed">
              <p>
                It also fails in a way that feels unfair: providers have had billing privileges suspended over a
                missing document that was never requested of them.
              </p>
            </Observed>
          </section>

          <section id="finding-the-date" className="lp-anchor">
            <h2>Finding your revalidation date</h2>
            <p>
              CMS publishes revalidation due dates in a public lookup, and letters are sent to the address on file.
              Neither is a reliable alert system on its own &mdash; the letter goes to whatever address the record
              holds, and due dates for individual providers can go long stretches without being posted.
            </p>

            <Observed
              label="Observed"
              note="Credentialing staff describing how the date is actually tracked at organizations large enough to have credentialing staff."
            >
              <p>
                Check the CMS lookup at the start of every month, manually, because there is nothing that tells you.
                One team managing over four thousand providers does exactly that, and notes they cannot pull the
                information through PECOS for all of them because surrogacy is not in place for every provider.
              </p>
            </Observed>

            <p>
              If that is what a team with four thousand providers does, a practice with nine is not going to catch it
              by accident.
            </p>
          </section>

          <section id="playbook" className="lp-anchor">
            <h2>What to do while it is in process</h2>
            <ul className="lp-labelled">
              {PLAYBOOK.map((p) => (
                <li key={p.lb}>
                  <span className="lb">{p.lb}</span>
                  <div className="bd">
                    <b>{p.b}</b> {p.t}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="errors" className="lp-anchor">
            <h2>What sends you back to the start</h2>
            <ul className="lp-list">
              {ERRORS.map((e) => (
                <li key={e.b}>
                  <b>{e.b}</b> {e.t}
                  {e.linkHref && (
                    <>
                      {" "}
                      <Link href={e.linkHref}>{e.linkText}</Link>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <div className="lp-cta-block">
            <p>
              A revalidation date is only dangerous when nobody is holding it. The template tracks revalidation dates
              and PTANs alongside every application, in one place you can hand to whoever covers for you.
            </p>
            <div className="lp-article-actions">
              <Link href="/credentialing-spreadsheet-template" className="lp-btn lp-btn--accent">
                Download the free template
              </Link>
              <Link href="/credential-expiration-tracking" className="lp-underline">
                Or get an email before the revalidation date &rarr;
              </Link>
            </div>
          </div>

          <ExploreMore items={RELATED.slice(0, 3)} />
        </article>

        <ArticleSidebar items={CONTENTS} />
      </div>

      <SiteFooter variant="slim" />
    </div>
  );
}
