import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-pages.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import StatusBadge from "@/components/site/StatusBadge";
import { TRIAL_HREF } from "@/components/site/siteData";
import { CADENCE, CYCLES, DERIVED_ROWS, LADDER, DIGEST_LINES, MULTI_STATE } from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Credential expiration tracking — Sokndall",
  description:
    "Licenses, DEA, malpractice, board certification, CAQH attestation, Medicare and Medicaid revalidation in one place. Status calculates itself. Alerts at 90, 60, 30, 14 and 7 days. From $79 a month.",
  path: "/credential-expiration-tracking",
});

export default function CredentialExpirationTrackingPage() {
  return (
    <div className="sokndall-landing">
      <SiteNav />

      {/* 1 — HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            maxWidth: "var(--maxw)",
            margin: "0 auto",
            position: "relative",
            "--bleed-w": "440px",
            "--bleed-gap": "48px",
            "--bleed-top": "80px",
          }}
        >
          <div className="lp-bleed-content">
            <div className="lp-eyebrow" style={{ marginBottom: 20 }}>
              Credential Expiration Tracking
            </div>
            <h1 className="lp-h1" style={{ marginBottom: 24 }}>
              Every expiration date in one place, and an email before each one
            </h1>
            <p className="lp-lead" style={{ maxWidth: 580, margin: "0 0 32px" }}>
              Licenses, DEA, malpractice, board certification, CAQH attestation, Medicare and Medicaid revalidation.
              Status calculates itself. Alerts at 90, 60, 30, 14 and 7 days. From $79 a month.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
              <Link href={TRIAL_HREF} className="lp-btn">
                Start 14-day trial
              </Link>
              <Link href="/pricing" className="lp-underline">
                See pricing →
              </Link>
            </div>
          </div>
          <div className="lp-img-bleed">
            <img
              className="lp-img"
              src="/pages/expiration-hero.png"
              alt="A practice administrator standing with a stack of tabbed credential files, checking a renewal date on the top folder"
            />
          </div>
        </div>
      </section>

      {/* 2 — IT IS EVERY MONTH, FOREVER */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          {/* The clearest case of the old 284px void: a section of nothing but
              text, left-aligned. Headline left, body right — with the closing
              line as the body's last paragraph rather than a rule-and-statement
              device that exists nowhere else in the system. */}
          <div className="lp-head2 lp-head2--frombadge" style={{ marginBottom: 56 }}>
            <div className="lp-eyebrow">The Real Cadence</div>
              <h2 className="lp-h2">
                It is never one renewal. <em>It is every month, forever.</em>
              </h2>
            <div className="bd">
              <p className="lp-body">
                Ten providers is not ten dates. It is state licenses on their own cycles, DEA every three years,
                malpractice annually, board certs on multi-year cycles, CAQH every 120 days, and Medicare revalidation on
                top of it all.
              </p>
              <p className="lp-body">
                Every month something is coming due, and the reminder emails meant to catch it go to an inbox someone
                stopped reading.
              </p>
              <p className="lp-body" style={{ color: "var(--ink)", fontWeight: 500 }}>
                The near miss is the normal outcome. The miss is the one that costs money.
              </p>
            </div>
          </div>

          {/* "Ten providers is not ten dates" is the section's claim, so the
              section draws it: one mark per date falling due across a year. */}
          <div className="lp-cadence">
            <div className="lp-cadence-scroll">
              <div className="lp-cadence-grid">
                {CADENCE.map((c) => (
                  <div key={c.m} className="lp-cad-month">
                    <div className="lp-cad-stack">
                      {Array.from({ length: c.fixed }, (_, i) => (
                        <span key={"f" + i} className="lp-cad-mark" />
                      ))}
                      {Array.from({ length: c.caqh }, (_, i) => (
                        <span key={"c" + i} className="lp-cad-mark lp-cad-mark--caqh" />
                      ))}
                    </div>
                    <span className="lp-cad-m">{c.m}</span>
                    <span className="lp-cad-n">{c.fixed + c.caqh}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-cadence-foot">
              <span className="lp-cad-key">
                <i style={{ background: "rgba(47,93,63,0.62)" }} />
                Licenses, DEA, malpractice, board — 25
              </span>
              <span className="lp-cad-key">
                <i style={{ background: "var(--gold)" }} />
                CAQH attestations — 30
              </span>
              <span>Ten providers. Fifty-five dates in one year, and no month without one.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — THE FIVE CYCLES */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        <div className="lp-eyebrow" style={{ marginBottom: 18 }}>
          The Cycles
        </div>
        <h2 className="lp-h2" style={{ maxWidth: 720, marginBottom: 44 }}>
          The five cycles you are actually tracking
        </h2>
        {/* Cards rather than a list — a grid represents "cycles" better than a
            stack does. 3 + 2, with the last two spanning wider so neither row
            leaves a gap. */}
        <div className="lp-cycles-grid">
          {CYCLES.map((c) => (
            <div key={c.name} className="lp-card">
              <span className="cy">{c.cycle}</span>
              <h3>{c.name}</h3>
              <p>{c.body}</p>
              {c.linkHref && <Link href={c.linkHref}>{c.linkLabel} →</Link>}
            </div>
          ))}
        </div>
      </section>

      {/* 4 — STATUS DERIVES ITSELF. One input, five derived states — which is
          also the whole credential badge system in one view. */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          {/* D-3: one paragraph, not two — the claim is that this takes one
              action, and one paragraph enacts that. */}
          <div className="lp-head2 lp-head2--frombadge" style={{ marginBottom: 44 }}>
            <div className="lp-eyebrow">Auto-Calculated</div>
              <h2 className="lp-h2">You enter a date. Everything else is calculated.</h2>
            <div className="bd">
              <p className="lp-body">
                Enter the expiration date and Sokndall derives the status — active, expiring, or expired, with days
                remaining — automatically. Nothing to update by hand, no conditional formatting to maintain, and when
                someone renews, you change one date and every view updates with it.
              </p>
            </div>
          </div>

          <div className="lp-derive">
            <div className="lp-derive-in">
              <span className="lb">What you enter</span>
              <div className="fld">09 / 21 / 2026</div>
              <p className="hint">That is the whole form. One date per credential, per provider.</p>
            </div>
            <div className="lp-derive-out">
              {DERIVED_ROWS.map((r) => (
                <div key={r.name} className="lp-derive-row">
                  <span className="nm">{r.name}</span>
                  <span className="dtx">{r.date}</span>
                  <StatusBadge state={r.state} count={r.count} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 — THE ALERT LADDER */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        {/* D-4: the lede moved up beside the headline. The copywriter corrected
            my suggested reason — the ladder starts at 90 because timelines are
            unpredictable, not because renewals are uniformly slow, which is not
            a claim they can source. */}
        <div className="lp-head2 lp-head2--frombadge" style={{ marginBottom: 44 }}>
            <div className="lp-eyebrow">The Alert Ladder</div>
            <h2 className="lp-h2">90, 60, 30, 14, 7</h2>
            <div className="bd">
            <p className="lp-body">
              Each credential has a responsible person, and alerts go to them — not to a shared inbox nobody owns. The
              ladder starts at 90 days because renewal timelines are not predictable: some clear in days, some sit in
              review for weeks with no way to speed them up.
            </p>
          </div>
        </div>
        <div className="lp-ladder">
          {LADDER.map((r) => (
            <div key={r.num} className="lp-rung">
              <span className="tone" style={{ background: r.tone }} />
              <span className="num">
                {r.num} <small>{r.unit}</small>
              </span>
              <p>{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 — THE WEEKLY DIGEST. The email itself, on the dark band. */}
      <section className="lp-forest">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          {/* No --top here: the copy is shorter than the digest card and no
              amount of writing closes that gap honestly, so the text block is
              centred against the card instead of hanging from its top edge. */}
          <div className="lp-split lp-split--wide-left">
            <div>
              <h2 className="lp-h2" style={{ marginBottom: 26 }}>
                One email on Monday morning
              </h2>
              {/* D-5: the old first paragraph listed the five categories the
                  digest card beside it already renders, with counts. This says
                  what the diagram cannot show — when it lands and who it goes to. */}
              <p className="lp-forest-body" style={{ fontSize: 16, lineHeight: 1.65, margin: "0 0 18px" }}>
                The digest lands Monday morning, addressed to whoever owns each item — not a general inbox. Nobody has to
                remember to check five different screens; one email says what needs a look before the week gets going.
              </p>
              <p className="lp-forest-body" style={{ fontSize: 16, lineHeight: 1.65, margin: 0 }}>
                The point of the digest is that you do not have to remember to open anything. That is the single
                difference between this and a very good spreadsheet.
              </p>
            </div>
            <div className="lp-digest">
              <div className="lp-digest-head">
                <span className="sb">Sokndall — your week, Monday 6:00 am</span>
                <span className="mt">14 providers · 9 payers</span>
              </div>
              {DIGEST_LINES.map((l) => (
                <div key={l.tx} className={"lp-digest-line" + (l.hot ? " is-hot" : "")}>
                  <span className="tx">{l.tx}</span>
                  <span className="ct">{l.ct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7 — MULTI-STATE */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        <div className="lp-split lp-split--wide-left lp-split--top">
          <div>
            <div className="lp-eyebrow" style={{ marginBottom: 18 }}>
              Multi-state
            </div>
            <h2 className="lp-h2" style={{ marginBottom: 24 }}>
              Telehealth panels break spreadsheets first
            </h2>
            <p className="lp-body" style={{ margin: "0 0 18px" }}>
              A provider licensed in six states has six license rows, six renewal cycles, and six chances to miss one.
            </p>
            <p className="lp-body" style={{ margin: "0 0 18px" }}>
              Each state is its own row with its own date and its own alerts, and the provider view shows all of them
              together.
            </p>
            {/* D-6: the headline promised "how a spreadsheet breaks" and the copy
                never said it. This is the missing beat. */}
            <p className="lp-body" style={{ margin: 0 }}>
              This is where a spreadsheet usually breaks first — not because the data does not fit, but because nobody
              re-sorts six tabs every time a renewal comes up. It just goes stale in the one nobody opened that week.
            </p>
          </div>
          <div className="lp-states">
            <div className="lp-states-head">
              <span>Provider 07 — state licenses</span>
              <span style={{ fontWeight: 400, fontSize: 12.5, color: "var(--ink-soft)" }}>6 rows</span>
            </div>
            {MULTI_STATE.map((r) => (
              <div key={r.st} className="lp-state-row">
                <span className="st">{r.st}</span>
                <span className="dt">{r.date}</span>
                <StatusBadge state={r.state} count={r.count} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — HONESTY + CTA */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          <div className="lp-center" style={{ gap: 24 }}>
            <div className="lp-eyebrow">Scope</div>
            <h2 className="lp-h2">What it does not do</h2>
            <p className="lp-body" style={{ maxWidth: 720, margin: "0 0 8px" }}>
              It does not check with the state board for you. There is no primary source verification here. You verify,
              and Sokndall records what you verified and when — which is the part that matters when someone asks six
              months later.
            </p>
            <div className="lp-ctarow">
              <Link href="/pricing" className="lp-btn">
                See pricing →
              </Link>
              <Link href={TRIAL_HREF} className="lp-underline">
                Start 14-day trial →
              </Link>
            </div>
            <p className="lp-note">From $79 a month. Card required, cancel self-serve.</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
