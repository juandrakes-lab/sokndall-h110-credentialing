import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import ArticleSidebar from "@/components/site/ArticleSidebar";
import MobileToc from "@/components/site/MobileToc";
import ExploreMore from "@/components/site/ExploreMore";
import StageBarChart from "@/components/site/StageBarChart";
import { CONTENTS, STAGES, STAGE_CHART, ERRORS, GUIDES } from "./data";
import { otherGuides } from "./clusterData";

export const metadata = {
  title: "Payer enrollment: how the process actually runs, payer by payer — Sokndall",
  description:
    "What enrollment is, why being credentialed does not mean you can bill, how long each stage really takes, and what to do during the months when nothing appears to be happening.",
};

const RELATED = otherGuides("/payer-enrollment");

export default function PayerEnrollmentHubPage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-shell">
        <header className="lp-article-head lp-a-span">
          <div className="lp-head-text">
            <span className="lp-kicker">Guide</span>
            <h1>Payer enrollment: how the process actually runs, payer by payer</h1>
            <p className="lp-standfirst">
              What enrollment is, why being credentialed does not mean you can bill, how long each stage really takes,
              and what to do during the months when nothing appears to be happening.
            </p>
          </div>
          <div className="lp-article-lead-img">
            <div className="lp-img-framed">
              <img
                className="lp-img"
                src="/pages/hub-hero.png"
                alt="An office administrator at her desk reviewing a printed provider enrollment file, a closed laptop beside her"
              />
            </div>
          </div>
          <hr className="lp-article-rule" />
        </header>

        <MobileToc items={CONTENTS} />

        <article className="lp-article-main">
          <section id="difference" className="lp-anchor">
            <h2>Credentialing and enrollment are not the same thing</h2>
            <p>
              Credentialing is the payer checking that you are who you say you are. License, education, work history,
              malpractice coverage, sanctions history. It is a verification process, and it ends with the payer
              satisfied that your qualifications are real.
            </p>
            <p>
              Enrollment is the administrative and contractual half. It puts you into the payer&rsquo;s system as a
              participating provider, attached to a specific tax ID, at a specific service location, with an effective
              date from which your claims will pay at in-network rates.
            </p>
            <p>
              Two different departments usually own these two things, and they do not always talk to each other. That is
              the part worth internalizing, because it explains the single most common confusing outcome in this whole
              process: you get a letter saying you have been approved, you start seeing patients, and the claims reject
              anyway.
            </p>
            <p>
              When that happens, the usual cause is that credentialing finished and enrollment did not. Your file
              cleared verification, but nobody linked it to the group&rsquo;s tax ID, or the effective date has not been
              loaded into the claims system yet, or the contract was never countersigned. The approval letter is real.
              It just does not mean what people assume it means.
            </p>
            <p>
              There is a practical consequence. When you call to check status, &ldquo;is my application
              approved&rdquo; is a question that can get you a yes while you are still unable to bill. The question
              that gets you a useful answer is closer to: what is my effective date, under which tax ID, and is the
              record loaded on your end.
            </p>
          </section>

          <section id="stages" className="lp-anchor">
            <h2>The stages, and where the time goes</h2>
            <p>
              Six stages, and they are wildly uneven. Two of them take an afternoon. One of them takes three months and
              shows you nothing while it happens.
            </p>
            <ol className="lp-numbered">
              {STAGES.map((s) => (
                <li key={s.b}>
                  <strong>{s.b}</strong> {s.t}
                </li>
              ))}
            </ol>

            <StageBarChart
              rows={STAGE_CHART}
              caption="Illustrative, not measured — the bars encode which stage the copy above says dominates, not a precise day count."
            />

            <p>
              Sixty to a hundred and twenty days is the honest range for most commercial payers. The real distribution
              runs wider in both directions, and later in this guide there are four payer-specific pages with observed
              timelines that go well past that.
            </p>
          </section>

          <section id="seeing-patients" className="lp-anchor">
            <h2>Can you see patients while you wait?</h2>
            <p>This is the question people actually need answered, and most guides skip it.</p>
            <p>
              You can see them. Whether you get paid for those visits is a different question, and the answer depends
              on the payer and on the effective date you eventually receive.
            </p>
            <p>
              Some payers backdate the effective date to your application date or your start date, which means visits
              you held can be billed once you are loaded. Some set the effective date at the approval date, and
              everything before it is out-of-network, permanently. You generally do not find out which kind you are
              dealing with until the end.
            </p>
            <p>
              Three ways practices handle the gap. Holding the claims and billing them once the effective date lands is
              the cleanest, but it means carrying the receivable and watching timely-filing windows, which do not pause
              because you are waiting on enrollment. Billing under a credentialed supervising provider works in some
              arrangements and is fraud in others, and the line depends on the payer&rsquo;s policy and your
              state&rsquo;s rules, so it is worth confirming in writing rather than assuming. Scheduling the patient as
              self-pay and refunding later is transparent but rarely popular with patients.
            </p>
            <p>
              The thing to avoid is billing normally and hoping. Those claims reject, and reprocessing them after the
              fact is possible but slow, and if the effective date lands after the dates of service, they are not
              reprocessable at all.
            </p>
            <p>
              Ask two things when you finally get an approval. What is my effective date, and can I bill for dates of
              service before it. Get the answer with a reference number attached.
            </p>
          </section>

          <section id="your-job" className="lp-anchor">
            <h2>The part that is actually your job</h2>
            <p>
              Stage four is where applications die. It is also the only stage where what you do changes the outcome,
              and not by making the payer faster, which you cannot do.
            </p>
            <p>
              Here is the mechanism that kills applications. Payers frequently do not notify you when they need
              something. The reviewer opens your file, finds a gap, flags it internally, and moves to the next one.
              Your application is now waiting on you, and nothing on your end says so. Weeks later you call and find
              out it has been sitting behind a document nobody asked you for.
            </p>
            <p>The prevention is dull and it works.</p>
            <p>
              Call two weeks after submitting to confirm receipt. Not to check on progress, which nobody will have.
              Just to confirm it exists in their system and to get a reference number. Write the number down along
              with the date and the name of the person who gave it to you.
            </p>
            <p>
              After that, call every three or four weeks. The question is not &ldquo;has it been approved.&rdquo;
              That question gets you &ldquo;it is in process&rdquo; every time, which is not information. The question
              is: is anything outstanding on your side, and is anything outstanding on mine. Those are two different
              queues at most payers and a rep will often check only the first unless you ask about both.
            </p>
            <p>
              Log every call. Date, name, reference number, what they said, what they asked for. This log does two
              things. It is the only continuity you have when a four-month process outlasts the rep you have been
              talking to, which happens often. And when someone tells you the application was never received, it is
              the thing that settles the conversation.
            </p>
            <p>
              Anything with no contact in thirty days needs a call now. Not because thirty days is meaningful to the
              payer, but because it is the point past which a stalled application stops being distinguishable from a
              lost one.
            </p>
          </section>

          <section id="errors" className="lp-anchor">
            <h2>The errors that restart the whole thing</h2>
            <p>
              Five data problems cause most restarts, and they all share a shape. The payer&rsquo;s system is matching
              your application against records it already has, and any mismatch stops it.
            </p>
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
              Before submitting anything, put those five records side by side and read them against each other. It
              takes twenty minutes and saves the six weeks that a restart costs.
            </p>
          </section>

          <section id="guides" className="lp-anchor">
            <h2>Payer-specific guides</h2>
            <p>
              The stages above are the same everywhere. What differs is the form, the portal, the failure mode, and how
              long the silence lasts.
            </p>
            <ul className="lp-list">
              {GUIDES.map((g) => (
                <li key={g.href}>
                  <Link href={g.href}>
                    <b>{g.name}.</b>
                  </Link>{" "}
                  {g.hook}
                </li>
              ))}
            </ul>
          </section>

          <div className="lp-cta-block">
            <p>
              Whatever payer you are enrolling with, the part you control is the record of your own follow-up. The
              date, the name, the reference number, and how long it has been since anyone checked. Payers will not
              keep that for you, and the portals do not either.
            </p>
            <div className="lp-article-actions">
              <Link href="/credentialing-spreadsheet-template" className="lp-btn lp-btn--accent">
                Download the free tracking template
              </Link>
              <Link href="/payer-enrollment-software" className="lp-underline">
                Or track every application automatically &rarr;
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
