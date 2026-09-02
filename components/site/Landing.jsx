import Link from "next/link";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Faq from "@/components/site/Faq";
import ImgSlot from "@/components/site/ImgSlot";
import EnrollmentMatrix, { MatrixLegend } from "@/components/site/EnrollmentMatrix";
import { TRIAL_HREF } from "@/components/site/siteData";
import { PROBLEMS, LAYERS, SCOPE_ITEMS, SCOPE_CLOSING, PLANS, FAQ_DATA } from "./landingData";

export default function Landing() {
  return (
    <div className="sokndall-landing">
      <SiteNav />

      {/* SECTION 1 — HERO
          Image: cut-out anchored to the seam with §2; top starts at the content
          margin, level with the eyebrow. */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative", "--bleed-w": "520px", "--bleed-gap": "48px" }}
        >
          <div className="lp-bleed-content">
            <div className="lp-eyebrow" style={{ marginBottom: 20 }}>Credentialing &amp; Payer Enrollment Tracking</div>
            <h1 className="lp-h1" style={{ marginBottom: 24 }}>
              The credentialing tracker that tells you which applications went quiet. No demo call to find out what it costs.
            </h1>
            <p className="lp-lead" style={{ maxWidth: 560, margin: "0 0 32px" }}>
              Sokndall tracks the credentials that expire and the payer applications that go quiet, for practices and billing companies with 1 to 50 providers.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", marginBottom: 16 }}>
              <Link href={TRIAL_HREF} className="lp-btn">Start 14-day trial</Link>
              <Link href="/pricing" className="lp-underline">See all three plans →</Link>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, fontFamily: "var(--mono)", letterSpacing: "0.01em" }}>
              No sales call. No quote request. No onboarding fee.
            </p>
          </div>
          <div className="lp-img-bleed">
            <img
              className="lp-img"
              src="/landing/hero-photo.png"
              alt="A credentialing specialist reviewing a printed provider roster, a laptop tucked under her arm"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2 — POSITIONING */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "88px var(--pad-x)", display: "flex", gap: 64, flexWrap: "wrap-reverse", alignItems: "center" }}>
          <div style={{ flex: "1 1 420px", minWidth: 280, maxWidth: 520 }}>
            <div className="lp-img-framed">
              <img
                className="lp-img"
                src="/landing/positioning.png"
                alt="A front-office lead at a small medical practice reviewing a tabbed provider folder at her desk, laptop and payer paperwork beside her"
              />
            </div>
          </div>
          <div style={{ flex: "1 1 480px", minWidth: 320 }}>
            <div className="lp-eyebrow" style={{ marginBottom: 18 }}>Who It Is For</div>
            <h2 className="lp-h2" style={{ fontSize: "clamp(1.8rem,2.8vw,2.35rem)", lineHeight: 1.22, marginBottom: 24 }}>
              Healthcare credentialing software for practices that never had a credentialing department
            </h2>
            <p className="lp-body" style={{ margin: "0 0 18px" }}>
              The platforms built for health systems assume a credentialing committee, delegated authority, and someone whose entire job this is. You have a front-office lead who also handles this, a spreadsheet someone rebuilt last year, and a reminder that may or may not still be set.
            </p>
            <p className="lp-body" style={{ margin: 0 }}>
              Sokndall is built for that. One provider or fifty. One person, or a small team, keeping track of what expires and what is still sitting at a payer.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE PROBLEM
          obs 1: section keeps its normal bottom rhythm for the text.
          obs 3: the image is a full-height "bleed" — it spans from the section's
          top edge down to flush with the dark band, on the right, transparent. */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", position: "relative", "--bleed-w": "480px", "--bleed-gap": "48px" }}>
          <div className="lp-bleed-content" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 700, marginBottom: 56 }}>
              <div className="lp-eyebrow" style={{ marginBottom: 18 }}>The Actual Problem</div>
              <h2 className="lp-h2">
                The renewals are not the hard part. <em>The waiting is.</em>
              </h2>
              <p className="lp-body" style={{ margin: "20px 0 0" }}>The failures in this work are quiet ones.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ borderTop: "1px solid var(--line)" }} />
              {PROBLEMS.map((p) => (
                <div key={p.num} style={{ display: "flex", gap: 24, padding: "28px 0", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--accent)", fontWeight: 600, flex: "0 0 32px" }}>{p.num}</div>
                  <div>
                    <h3 className="lp-h3" style={{ marginBottom: 8 }}>{p.title}</h3>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink-soft)" }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-img-bleed lp-img-bleed--contain">
            <img
              className="lp-img"
              src="/landing/problem-figure.png"
              alt="A practice administrator on the phone, holding a folder, following up on an application"
            />
          </div>
        </div>
      </section>

      {/* dark band after the problem */}
      <section className="lp-dark">
        <div className="lp-center" style={{ maxWidth: 900, margin: "0 auto", padding: "80px var(--pad-x)" }}>
          <p style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: "clamp(1.3rem,2.4vw,1.7rem)", lineHeight: 1.5, color: "var(--bg)", margin: "0 0 22px" }}>
            None of those are complicated. They are the same problem: a date nobody was watching, or an application nobody followed up on.
          </p>
          <p style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: "clamp(1.3rem,2.4vw,1.7rem)", lineHeight: 1.5, color: "var(--bg)", margin: 0 }}>
            The visits already happened. The work was already done. The money is stuck behind a form.
          </p>
        </div>
      </section>

      {/* SECTION 4 — THREE LAYERS — the one forest-green editorial section.
          Images use the tile treatment (contained, centered, opaque). */}
      <section className="lp-forest" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--pad-x)" }}>
          <h2 className="lp-h2" style={{ fontSize: "clamp(1.8rem,2.8vw,2.35rem)", margin: "0 0 56px", maxWidth: 700 }}>
            Three things, tracked in one place
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 44 }}>
            {LAYERS.map((layer) => (
              <div key={layer.slotId} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <ImgSlot id={layer.slotId} treatment="tile" ar="1 / 1" caption={layer.iconDesc} />
                <h3 className="lp-h3">{layer.title}</h3>
                <p className="lp-forest-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>{layer.body1}</p>
                <p className="lp-forest-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>{layer.body2}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — THE MATRIX */}
      <section className="lp-panel" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--pad-x)" }}>
          {/* The grid renders at its natural ~830px; left-aligned under a
              headline it left ~350px of white beside it. Copy and legend take
              that column instead. */}
          <div className="lp-matrix-layout">
            <div className="lp-matrix-copy">
              <div className="lp-eyebrow">The Enrollment Grid</div>
              <h2 className="lp-h2">
                The screen this is <em>really about</em>
              </h2>
              <p className="lp-body">Providers down the side. Payers across the top. One cell per pair, colored by status, showing days since last follow-up.</p>
              <p className="lp-body">Fifteen providers across twelve payers is 180 cells. The six that are stuck are visible in one look.</p>
              <p className="lp-body">A spreadsheet can hold that data. It cannot show it to you this way — and it will never tell you which cell went quiet.</p>
            </div>
            <div className="lp-matrix-figure">
              {/* 12 columns beside a copy column: 56px cells and a 118px label
                  gutter keep the whole grid visible without horizontal scroll. */}
              <EnrollmentMatrix rows={15} cols={12} stuckCount={6} cellWidth={55} labelWidth={112} legend={false} />
              <MatrixLegend />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — PRICING (Fix 1: support copy is full-width, left-aligned, stacked) */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        {/* The support copy is far taller than the headline block, so neither
            alignment works beside it — the section is centred instead, and the
            copy sits under the cards where "that is $26, $20 and $14" has the
            price list to refer back to. */}
        <div className="lp-center" style={{ gap: 18, marginBottom: 48 }}>
          <div className="lp-eyebrow">Pricing</div>
          <h2 className="lp-h2">The whole price list</h2>
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "stretch", marginBottom: 48 }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="lp-price-card"
              style={{
                flex: "1 1 280px",
                minWidth: 260,
                border: "1px solid " + (plan.highlighted ? "var(--accent)" : "var(--line)"),
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                background: "#fff",
              }}
            >
              <div>
                <h3 style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: "var(--ink)" }}>{plan.name}</h3>
                {plan.highlighted && (
                  <div style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
                    Most complete for a group practice
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "var(--display)", fontSize: 36, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", fontFamily: "var(--sans)", fontVariantNumeric: "tabular-nums" }}>Providers: {plan.providers}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-soft)", margin: 0, flex: "1 1 auto" }}>{plan.desc}</p>
              <Link href="/pricing" className="lp-btn" style={{ textAlign: "center", padding: 13, fontSize: 14 }}>Select plan</Link>
            </div>
          ))}
        </div>
        <div className="lp-center" style={{ gap: 18, marginTop: 48 }}>
          <p className="lp-body" style={{ maxWidth: 760, margin: 0 }}>That is $26, $20 and $14 per provider per month.</p>
          <p className="lp-body" style={{ maxWidth: 760, margin: 0 }}>
            Outsourced credentialing maintenance — someone else handling reattestation, recredentialing and renewals — runs $50 to $200 a month per provider. Sokndall does not do that work. It tracks it. That is the whole reason the price is lower: you are not paying for a person on the other end.
          </p>
          <Link href="/pricing" className="lp-underline" style={{ marginTop: 8 }}>Full plan details and trial terms →</Link>
        </div>
      </section>

      {/* SECTION 7 — SCOPE
          No image. Full-width heading, then a 2×2 card grid so this carries the
          same visual weight as §4 (the brief calls it a differentiator, not fine
          print). No leading "–" marker: the titles already state the negation,
          and a dash reads as a warning. Closing line centered below. */}
      <section className="lp-panel" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--pad-x)" }}>
          {/* Centred, like the two sections that follow it: the lede and the
              closing line are both far shorter than the headline block, so a
              two-column head would leave a hole either way. */}
          <div className="lp-center" style={{ gap: 18 }}>
            <div className="lp-eyebrow">Scope</div>
            <h2 className="lp-h2" style={{ fontSize: "clamp(1.8rem,2.8vw,2.35rem)" }}>What Sokndall does not do</h2>
            <p className="lp-body" style={{ margin: 0 }}>Being clear now saves you a trial you were going to cancel.</p>
          </div>
          <div className="lp-scope-grid">
            {SCOPE_ITEMS.map((item) => (
              <div key={item.title} className="lp-scope-card">
                <h3 className="lp-h3" style={{ fontSize: 18 }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-soft)" }}>{item.body}</p>
                {item.linkHref && (
                  <Link href={item.linkHref} style={{ display: "inline-block", marginTop: 2, fontSize: 13.5, color: "var(--ink)", borderBottom: "1px solid var(--ink)", alignSelf: "flex-start" }}>
                    {item.linkHref} →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="lp-center" style={{ maxWidth: 760, margin: "56px auto 0" }}>
            <p style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: 18, lineHeight: 1.6, margin: 0, color: "var(--ink)" }}>
              {SCOPE_CLOSING}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FAQ */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        <div className="lp-center" style={{ gap: 18, marginBottom: 44 }}>
          <div className="lp-eyebrow">FAQ</div>
          <h2 className="lp-h2" style={{ maxWidth: 720 }}>Before you type your card number</h2>
        </div>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <Faq items={FAQ_DATA} />
        </div>
      </section>

      {/* SECTION 9 — CLOSING CTA */}
      <section className="lp-dark" style={{ padding: "80px var(--pad-x)", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <Link href={TRIAL_HREF} className="lp-btn lp-btn--accent">Start 14-day trial</Link>
          <p style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(246,245,241,0.6)", margin: 0 }}>
            No sales call. No quote request. No onboarding fee.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
