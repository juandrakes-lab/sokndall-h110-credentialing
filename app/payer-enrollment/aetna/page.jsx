import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import ArticleSidebar from "@/components/site/ArticleSidebar";
import MobileToc from "@/components/site/MobileToc";
import ExploreMore from "@/components/site/ExploreMore";
import Observed from "@/components/site/Observed";
import { CONTENTS, STEPS, COMBOS, PLAYBOOK, ERRORS } from "./data";
import { otherGuides } from "../clusterData";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Aetna provider enrollment: the process, the timeline, and the NPI mismatch — Sokndall",
  description:
    "How to submit to Aetna, what to do during the months of review, and the specific NPI and TIN error that has providers paid out-of-network for weeks without knowing why.",
  path: "/payer-enrollment/aetna",
  type: "article",
});

const RELATED = otherGuides("/payer-enrollment/aetna");

export default function AetnaGuidePage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-shell">
        <header className="lp-article-head lp-a-span">
          <div className="lp-head-text">
            <Link href="/payer-enrollment" className="lp-kicker">
              Payer enrollment
            </Link>
            <h1>Aetna provider enrollment: the process, the timeline, and the NPI mismatch that costs the most</h1>
            <p className="lp-standfirst">
              How to submit, what to do during the months of review, and the specific error that has providers paid
              out-of-network for weeks without knowing why.
            </p>
          </div>
          <hr className="lp-article-rule" />
        </header>

        <MobileToc items={CONTENTS} />

        <article className="lp-article-main">
          <section id="process" className="lp-anchor">
            <h2>The process, in order</h2>
            <p>Four things have to be true before Aetna will even start, and skipping any of them guarantees delay.</p>
            <ol className="lp-numbered">
              {STEPS.map((s) => (
                <li key={s.b}>
                  <strong>{s.b}</strong> {s.t}
                  {s.linkHref && (
                    <>
                      {" "}
                      <Link href={s.linkHref}>{s.linkText}</Link>
                    </>
                  )}
                </li>
              ))}
            </ol>
            <p>
              Availity is the portal you use afterward &mdash; for benefits verification, claims, and prior
              authorization &mdash; not the channel you submit the initial participation request through.
            </p>
          </section>

          <section id="documents" className="lp-anchor">
            <h2>What Aetna needs from you</h2>
            <p>
              Licensure, certifications, liability insurance, board certification where applicable, training and
              residency history, hospital privileges and DEA registration where relevant &mdash; all pulled through
              the CAQH profile once Aetna is authorized to view it.
            </p>
            <p>
              On the enrollment side specifically: the individual NPI (Type 1) and, for a group, the group NPI (Type 2)
              kept distinct and correctly matched, the exact legal name, and the TIN/EIN. Sole proprietors generally
              only need the Type 1 NPI; an LLC, PLLC or S-Corp structure typically needs both types on file, correctly
              linked.
            </p>
          </section>

          <section id="timelines" className="lp-anchor">
            <h2>Stated and observed</h2>
            <p>
              Aetna&rsquo;s own materials describe credentialing as commonly running <strong>60 to 90 days</strong>{" "}
              once a complete packet is received, on top of the up-to-45-day network-need review before that.
              Independent guides describing the full path &mdash; network review, contracting, credentialing,
              effective date &mdash; put the realistic total closer to <strong>90 to 180 days end to end</strong>,
              wider than the credentialing step alone suggests.
            </p>

            <Observed>
              <p>
                Correcting an error on Aetna&rsquo;s side, once something is wrong, has taken two months of sustained
                effort. One practice sent a written escalation to every fax number, email address, PO box and portal
                contact they could find before receiving confirmation the issue was fixed and claims could be
                backdated.
              </p>
            </Observed>

            <p>That part does not show up in any published timeline, because it is not part of the process on paper.</p>
          </section>

          <section id="npi-mismatch" className="lp-anchor">
            <h2>The NPI mismatch</h2>
            <p>
              This is the failure specific to Aetna that shows up most often, and it is worth understanding before you
              submit rather than after.
            </p>
            <p>
              A group practice enrolls, and the individual NPI (Type 1) ends up loaded where the group NPI (Type 2)
              belongs, or the record ties to the individual NPI and the EIN in a combination that does not reflect the
              group. On your side, everything looks approved. In the portal, benefits information only returns under
              one specific combination, which is the first visible symptom.
            </p>
            <p>
              The financial symptom comes later: claims process out-of-network. Providers in this situation have
              collected out-of-network payments and lost revenue for the entire period it took to correct &mdash; and
              correcting it means reaching a human at provider services, which has taken repeated attempts.
            </p>

            <h3>How to catch it in week one, not week eight</h3>
            <p>
              As soon as you have an effective date, check benefits in the portal using each NPI/TIN combination you
              would actually bill under. A record loaded wrong looks like this:
            </p>

            {/* A drawn schematic of the benefits-check panel, not a real
                screenshot — the mechanism, at the same low fidelity as every
                other diagram in this cluster. */}
            <div className="lp-portalcheck">
              <div className="lp-portalcheck-bar">
                <i /><i /><i />
                <span>Availity &mdash; Eligibility &amp; Benefits</span>
              </div>
              {COMBOS.map((c) => (
                <div key={c.cb} className="lp-portalcheck-row">
                  <span className="cb">{c.cb}</span>
                  <span className={"rs " + (c.result === "Benefits returned" ? "ok" : "no")}>{c.result}</span>
                </div>
              ))}
            </div>
            <p className="lp-a-caption">
              Only one combination returns anything, and it is not the one this group bills under.
            </p>

            <p>
              If only one combination returns anything, or the combination that returns is not the one you bill with,
              the record is loaded wrong. Raise it immediately, in writing, and keep the reference number.
            </p>
          </section>

          <section id="playbook" className="lp-anchor">
            <h2>What to do while it is in review</h2>
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
            <h2>Other things that stop an Aetna application</h2>
            <ul className="lp-list">
              {ERRORS.map((e) => (
                <li key={e.b}>
                  <b>{e.b}</b> {e.t}
                </li>
              ))}
            </ul>
          </section>

          <div className="lp-cta-block">
            <p>
              The check that catches the mismatch takes ten minutes, once you know to run it. What it needs is a place
              to record the answer &mdash; the reference number, the date, and who you spoke to.
            </p>
            <div className="lp-article-actions">
              <Link href="/credentialing-spreadsheet-template" className="lp-btn lp-btn--accent">
                Download the free template
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
