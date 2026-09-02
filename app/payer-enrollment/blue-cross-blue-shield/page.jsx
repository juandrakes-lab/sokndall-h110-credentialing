import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import ArticleSidebar from "@/components/site/ArticleSidebar";
import MobileToc from "@/components/site/MobileToc";
import ExploreMore from "@/components/site/ExploreMore";
import Observed from "@/components/site/Observed";
import { CONTENTS, STEPS, ERRORS } from "./data";
import { otherGuides } from "../clusterData";

export const metadata = {
  title: "BCBS provider enrollment: it is not one payer — Sokndall",
  description:
    "Which Blue plan you are enrolling with, how the process differs by state, and why an approval in one state tells you nothing about the next.",
};

const RELATED = otherGuides("/payer-enrollment/blue-cross-blue-shield");

export default function BcbsGuidePage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-shell">
        <header className="lp-article-head lp-a-span">
          <div className="lp-head-text">
            <Link href="/payer-enrollment" className="lp-kicker">
              Payer enrollment
            </Link>
            <h1>BCBS provider enrollment: it is not one payer, and that changes everything</h1>
            <p className="lp-standfirst">
              Which Blue plan you are enrolling with, how the process differs by state, and why an approval in one
              state tells you nothing about the next.
            </p>
          </div>
          <hr className="lp-article-rule" />
        </header>

        <MobileToc items={CONTENTS} />

        <article className="lp-article-main">
          <section id="structure" className="lp-anchor">
            <h2>&ldquo;Blue Cross Blue Shield&rdquo; is a federation, not a company</h2>
            <p>
              Independent Blue plans operate by state or region &mdash; 33 to 34 of them, depending on the count used
              &mdash; coordinated but not owned by the Blue Cross Blue Shield Association. Each is its own company: its
              own leadership, its own provider network, its own credentialing department, its own portal. A few, like
              Elevance Health, operate several Blue licenses as one public company, but each licensed plan still runs
              enrollment separately.
            </p>
            <p>
              The practical consequences: being credentialed with the Blue plan in one state does not credential you in
              another, even under the same corporate parent. Multi-state and telehealth providers run a genuinely
              separate process per state.
            </p>
            <p>
              And advice you find online about &ldquo;BCBS credentialing&rdquo; may describe a plan you are not
              applying to &mdash; the fastest way to tell is the three-letter prefix on a member&rsquo;s card, which
              identifies the specific licensee and should be the reference point for anything you look up, not the
              Blue Cross Blue Shield logo.
            </p>
            <p>
              The structure exists for historical reasons: Blue Cross and Blue Shield started as separate regional
              nonprofit plans in the 1930s and 40s, and the national association that licenses the name today
              coordinates branding and some shared services without merging the plans themselves into one company.
              That history is why the fragmentation persists even now that several plans operate under shared
              corporate ownership.
            </p>
          </section>

          <section id="process" className="lp-anchor">
            <h2>The process, in order</h2>
            <p>The sequence is consistent across Blue plans even though the specifics vary:</p>
            <ol className="lp-numbered">
              {STEPS.map((s) => (
                <li key={s.b}>
                  <strong>{s.b}</strong> {s.t}
                </li>
              ))}
            </ol>
            <p>
              Because each plan is independent, this sequence has to be repeated in full for every Blue plan you enroll
              with &mdash; there is no shortcut for having done it once elsewhere.
            </p>
          </section>

          <section id="timelines" className="lp-anchor">
            <h2>Stated and observed</h2>
            <p>
              Published estimates for BCBS credentialing commonly cite <strong>45 to 90 days</strong> once a complete
              application is received, with some sources citing a wider <strong>45 to 120+ days</strong> depending on
              the specific plan &mdash; consistent with each licensee running its own review independently rather than
              to a single national timeline.
            </p>
            <p>
              One thing the published ranges do not tell you: the contract&rsquo;s arrival is not a progress signal.
              Some Blue plans send a contract near the beginning of the process and some near the end, so receiving
              one tells you less than it appears to.
            </p>

            <Observed label="Observed · the harder case">
              <p>
                A provider who used a third-party platform to handle enrollment with one Blue plan waited nearly a year
                for clarity, and eventually discovered on their own that their network participation had been
                terminated months earlier. Nobody had told them.
              </p>
            </Observed>
          </section>

          <section id="playbook" className="lp-anchor">
            <h2>What to do while it is in review</h2>
            <p>
              Confirm receipt with the specific Blue plan during week two, not with a general BCBS number &mdash;
              record whatever reference they give you. From week three through twelve, contact every three to four
              weeks and ask specifically what is outstanding.
            </p>
            <p>
              Verify independently rather than relying solely on a status relayed by a third party handling enrollment
              on your behalf. Terminations and status changes have gone uncommunicated for months in documented cases,
              so check the plan&rsquo;s own provider lookup periodically on your own. Log every contact, including
              which plan and which representative &mdash; with a federation of licensees, the same question asked at
              two different numbers can produce two different answers.
            </p>
            <p>
              On approval, confirm both the effective date and which specific products and networks it covers.
              Approval for one Blue product does not mean approval for all of them.
            </p>
          </section>

          <section id="errors" className="lp-anchor">
            <h2>What sends you back</h2>
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
            <p>
              The third one is not a mistake you can avoid by being careful. It is a disagreement about what kind of
              practice you are, and it can outlast every document you send to settle it.
            </p>

            <Observed label="Observed · a categorization dispute">
              <p>
                One provider credentialed for years was never reimbursed because the plan&rsquo;s representative
                classified them as a &ldquo;mobile provider&rdquo; on the basis that they traveled between locations,
                and letters from each facility confirming in-person encounters did not immediately resolve it.
              </p>
            </Observed>
          </section>

          <div className="lp-cta-block">
            <p>
              Every Blue plan is its own row: its own reference number, its own effective date, its own
              last-contacted date. That is the difference between knowing where four applications stand and
              remembering three of them.
            </p>
            <div className="lp-article-actions">
              <Link href="/credentialing-spreadsheet-template" className="lp-btn lp-btn--accent">
                Download the free template
              </Link>
              <Link href="/payer-enrollment-software" className="lp-underline">
                Track applications across every Blue plan &rarr;
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
