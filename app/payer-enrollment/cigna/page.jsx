import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import ArticleSidebar from "@/components/site/ArticleSidebar";
import MobileToc from "@/components/site/MobileToc";
import ExploreMore from "@/components/site/ExploreMore";
import Observed from "@/components/site/Observed";
import { CONTENTS, MEDICAL_STAGES, EVERNORTH_STEPS } from "./data";
import { otherGuides } from "../clusterData";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Cigna provider enrollment: the widest timeline of any major payer — Sokndall",
  description:
    "The Evernorth path for behavioral health, what the observed waits actually look like, and what to do when you are told the network is closed.",
  path: "/payer-enrollment/cigna",
  type: "article",
});

const RELATED = otherGuides("/payer-enrollment/cigna");

export default function CignaGuidePage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-shell">
        <header className="lp-article-head lp-a-span">
          <div className="lp-head-text">
            <Link href="/payer-enrollment" className="lp-kicker">
              Payer enrollment
            </Link>
            <h1>Cigna provider enrollment: the widest timeline of any major payer, and how to survive it</h1>
            <p className="lp-standfirst">
              The Evernorth path for behavioral health, what the observed waits actually look like, and what to do
              when you are told the network is closed.
            </p>
          </div>
          <hr className="lp-article-rule" />
        </header>

        <MobileToc items={CONTENTS} />

        <article className="lp-article-main">
          <section id="process" className="lp-anchor">
            <h2>The process, in order</h2>
            <p>
              Medical and behavioral health run on genuinely separate tracks. Medical and dental credentialing goes
              through the standard Cigna path, in four distinct stages people often stop tracking after the first one
              clears:
            </p>
            <ol className="lp-numbered">
              {MEDICAL_STAGES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>

            <h3>Behavioral health, through Evernorth</h3>
            <p>
              Behavioral health runs through Evernorth Behavioral Health, Cigna&rsquo;s dedicated subsidiary, and needs
              its own form &mdash; the Evernorth Behavioral Health Provider Information Form, not the general Cigna
              medical application. The sequence:
            </p>
            <ol className="lp-numbered">
              {EVERNORTH_STEPS.map((s) => (
                <li key={s.b}>
                  <strong>{s.b}</strong> {s.t}
                </li>
              ))}
            </ol>
            <p>
              You cannot bill as in-network, and cannot see Cigna/Evernorth clients under that status, until the
              effective date is confirmed. Billing before then risks denial and recoupment.
            </p>
          </section>

          <section id="timelines" className="lp-anchor">
            <h2>Stated and observed</h2>
            <p>
              Cigna&rsquo;s own materials for the standard medical/dental path cite <strong>45 to 90 days</strong>. For
              behavioral health through Evernorth, the figure most consistently published &mdash; including directly
              from Evernorth&rsquo;s own resource page &mdash; is <strong>up to 90 days</strong> for the complete
              process, with some guides citing 60 to 120 days once network adequacy and volume are factored in.
            </p>
            <p>
              There is a live reason to expect the slow end of that range right now. Cigna has been restructuring its
              commercial behavioral health networks through Evernorth, including periods where the enrollment portal
              itself has been paused for new applications in some markets &mdash; with guidance that, once reopened,
              providers should expect a 90 to 120 day credentialing timeline from that point, not from whenever they
              originally tried to apply.
            </p>

            <Observed>
              <p>
                One provider who applied at the end of February heard nothing for a month, emailed to confirm the
                application had even been received, and got an automated reply stating a window of sixty to a hundred
                and ninety days before any determination.
              </p>
              <p>
                Another applied in October and was approved the following April &mdash; six months. The same provider
                in the first case had already been approved by two other payers in the interim, which is the useful
                detail: a long Cigna wait does not mean something is wrong with your application.
              </p>
            </Observed>

            <p>Plan for six months. Be pleasantly surprised at three.</p>
          </section>

          <section id="closed" className="lp-anchor">
            <h2>When you are told the network is closed</h2>
            <p>
              Providers report calling credentialing and being told the network is closed to new participation, then
              being told for months that their email is under review &mdash; two statements that cannot both be the
              operative one.
            </p>
            <p>
              Here is what makes this genuinely ambiguous right now, not just a runaround: Cigna&rsquo;s active
              restructuring of its commercial networks through Evernorth means some markets really have had enrollment
              paused, with a real reopening timeline attached. A closed network is a real thing. If a call to
              Evernorth gets you that answer, this restructuring is a current reason it might be accurate.
            </p>
            <p>
              It is worth asking through the official Evernorth channel &mdash; <strong>1-800-926-2273</strong> or{" "}
              <strong>BehavioralProviderRecruitment@evernorth.com</strong> &mdash; specifically whether the closure
              applies to your taxonomy and your county, and whether it is the restructuring pause or a standing
              network-adequacy decision. Those have different reopening prospects, and the difference is worth
              getting in writing.
            </p>
            <p>
              The practical move: get the answer in writing, with the network, geography, and reason it applies, plus
              a date if one exists. Then you have something to reapply against instead of a phone conversation you
              cannot cite.
            </p>
          </section>

          <section id="playbook" className="lp-anchor">
            <h2>What to do during the wait</h2>
            <p>
              Email or call during week two to confirm the application was received &mdash; do not assume it was. In
              documented cases, the auto-reply to that confirmation email was the only information a provider got for
              months.
            </p>
            <p>
              Whatever window they quote you is not a commitment, but it is a reference point worth recording for
              when you eventually escalate. From week four through week twenty-four, contact monthly and ask what is
              outstanding.
            </p>
            <p>
              Keep enrolling with other payers in parallel during this wait &mdash; a long Cigna timeline is not a
              signal that something is wrong with your application, and providers routinely get approved elsewhere
              while Cigna is still reviewing. Log every contact. With a wait this long, the log is the only
              continuity you have, and staff turnover on both sides of the conversation is likely across six months.
            </p>
          </section>

          <section id="errors" className="lp-anchor">
            <h2>What sends you back</h2>
            <p>
              CAQH not attested, or Evernorth and Cigna not authorized on the profile, is the most common one &mdash;
              worth noting the attestation window is 120 days in most states and 180 in Illinois specifically. A
              taxonomy code that does not match the license type causes a rejection that looks like a credentialing
              failure but is not. Name, NPI or TIN inconsistencies between the individual and group records behave the
              same way here as with every other payer &mdash;{" "}
              <Link href="/payer-enrollment/aetna">Aetna&rsquo;s guide covers the specific failure mode in the most
              depth</Link>. A service location that does not match the CAQH profile stalls things quietly.
            </p>
            <p>
              One failure specific to Cigna is worth flagging on its own: missed re-credentialing. Cigna
              re-credentials on roughly a 36-month cycle, and it arrives as an email asking you to re-verify and
              re-sign your CAQH information, with up to three reminders sent before the deadline. Missing all three
              does not trigger a grace period &mdash; it results in termination from the network, the same as never
              having enrolled.
            </p>
          </section>

          <div className="lp-cta-block">
            <p>
              Six months is longer than anyone remembers an application for. The date you last called, the name of
              who answered and the window they quoted have to be written down the day they happen, because in April
              nobody remembers February.
            </p>
            <div className="lp-article-actions">
              <Link href="/credentialing-spreadsheet-template" className="lp-btn lp-btn--accent">
                Download the free template
              </Link>
              <Link href="/payer-enrollment-software" className="lp-underline">
                Track a six-month application without losing the thread &rarr;
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
