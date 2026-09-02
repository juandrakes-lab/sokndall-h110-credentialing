import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-pages.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { TRIAL_HREF } from "@/components/site/siteData";
import { CLIENTS, STRUCTURE, REPORT_LINES } from "./data";

export const metadata = {
  title: "Credentialing for billing companies: six clients, one login — Sokndall",
  description:
    "Separate client organizations, isolated data, one login, one weekly view across all of them. $699 a month for up to 50 providers across your entire book.",
};

export default function ForBillingCompaniesPage() {
  return (
    <div className="sokndall-landing">
      <SiteNav />

      {/* 1 — HERO. Price is part of the promise here, not held back for a
          later section, so it sits in the subhead next to the CTA. */}
      <header className="lp-page-head">
        <div className="lp-head2">
          <div className="lp-eyebrow">For Billing Companies</div>
          <h1 className="lp-h1">Credentialing for six clients, without six spreadsheets</h1>
          <div className="bd">
            <p className="lp-lead">
              Separate client organizations, isolated data, one login, one weekly view across all of them. $699 a
              month for up to 50 providers across your entire book.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href={TRIAL_HREF} className="lp-btn">
                Start 14-day trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2 — THE PROBLEM. Short and plain — the point is made in two
          sentences, so the body column stays short rather than padded out. */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--pad-x) 96px" }}>
        <div className="lp-head2">
          <div className="lp-eyebrow">The Problem</div>
          <h2 className="lp-h2">The problem is not volume. It is that nothing adds up.</h2>
          <div className="bd">
            <p className="lp-lead">
              Each client has their own file, their own naming, their own way of recording a follow-up. Answering
              &ldquo;what needs attention this week&rdquo; means opening six things and holding the answer in your
              head. Answering it for a client on the phone means opening theirs while they wait.
            </p>
            <p className="lp-body" style={{ margin: 0 }}>
              And when a staff member leaves, whatever they knew about where each application stood leaves with them.
            </p>
          </div>
        </div>
      </section>

      {/* 3 — THE STRUCTURE. Four parallel mechanisms as cards; the fifth
          point ("one aggregate view") is stronger shown than said, so it
          gets the actual client-grid + rollup schematic below rather than a
          fifth card saying the same thing in words. */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          <div className="lp-head2" style={{ marginBottom: 48 }}>
            <div className="lp-eyebrow">The Structure</div>
            <h2 className="lp-h2">How the structure works</h2>
          </div>

          <div className="lp-scope-grid" style={{ marginTop: 0, marginBottom: 56 }}>
            {STRUCTURE.map((s) => (
              <div key={s.title} className="lp-scope-card">
                <h3 className="lp-h3">{s.title}</h3>
                <p className="lp-body" style={{ margin: 0 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="lp-h3" style={{ marginBottom: 10 }}>
            One aggregate view
          </div>
          <p className="lp-body" style={{ maxWidth: 640, margin: "0 0 32px" }}>
            Across every client at once — not six logins held together in your head.
          </p>
          <div className="lp-clients" style={{ maxWidth: 760 }}>
            <div className="lp-client-grid">
              {CLIENTS.map((c) => (
                <div key={c.name} className="lp-client">
                  <div className="nm">{c.name}</div>
                  <div className="rw">
                    <span>Providers</span>
                    <b>{c.providers}</b>
                  </div>
                  <div className="rw">
                    <span>Open applications</span>
                    <b>{c.open}</b>
                  </div>
                  <div className="bar">
                    <i style={{ width: Math.round((c.quiet / c.open) * 100) + "%" }} />
                  </div>
                  <div className="rw">
                    <span>Quiet 30+ days</span>
                    <b>{c.quiet}</b>
                  </div>
                </div>
              ))}
            </div>
            <div className="lp-rollup">
              <span className="lb">Monday digest &middot; across all clients</span>
              <span className="tx">
                23 applications need follow-up this week across your 6 clients, 4 of them have been quiet for over 30
                days.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — THE REPORT. Text left, the digest schematic right — reusing the
          same forest-tile digest component /payer-enrollment-software uses
          for its Monday view, populated here as "the report you'd send." */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        <div className="lp-split lp-split--wide-left lp-split--top">
          <div>
            <div className="lp-eyebrow" style={{ marginBottom: 18 }}>
              The Report
            </div>
            <h2 className="lp-h2" style={{ marginBottom: 24 }}>
              The report you can send without building it
            </h2>
            <p className="lp-body" style={{ margin: "0 0 18px" }}>
              When a client asks where their enrollments stand, the answer is a list with dates, statuses and the
              last follow-up on each one. Not a recollection, and not an afternoon of assembling.
            </p>
            <p className="lp-body" style={{ margin: 0 }}>
              That is also the report that justifies your invoice, which is a different conversation than the one
              where you explain that the payer is slow.
            </p>
          </div>

          <div className="lp-digest">
            <div className="lp-digest-head">
              <span className="sb">Client report &middot; Meridian Family Practice</span>
              <span className="mt">Generated on request, not assembled from memory</span>
            </div>
            {REPORT_LINES.map((l) => (
              <div key={l.tx} className={"lp-digest-line" + (l.hot ? " is-hot" : "")}>
                <span className="tx">{l.tx}</span>
                <span className="ct">{l.ct}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — COST CONTEXT. Callout, then the dark-band payoff line — same
          device /pricing uses for its own cost-per-provider argument. */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          <div className="lp-head2" style={{ marginBottom: 48 }}>
            <div className="lp-eyebrow">Cost Context</div>
            <h2 className="lp-h2">$14 a provider is not the number your clients are used to</h2>
            <div className="bd">
              <p className="lp-lead">
                Billing companies that manage credentialing for their clients typically charge somewhere in the $150
                to $400 per provider per month range for that work — the actual attestation, the recredentialing, the
                renewals. At 50 providers across your book, that is $7,500 to $20,000 a month of revenue on the
                service itself.
              </p>
            </div>
          </div>
          <div className="lp-callout" style={{ maxWidth: 640 }}>
            <h3>Sokndall is not that service</h3>
            <span className="fig">3 – 9%</span>
            <p>
              It does not compete with it. It is the system that makes running that service across six clients
              possible without losing track of any one of them. $699 a month is 3 to 9 percent of what the
              credentialing line alone is worth to you — priced to be beneath the conversation with a client, not
              part of it.
            </p>
          </div>
        </div>
      </section>

      {/* 6 — PRICE. Forest band, the way /pricing gives its trial terms the
          same visual weight as the price itself. */}
      <section className="lp-forest">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "88px var(--pad-x)" }}>
          <div className="lp-center">
            <div className="lp-eyebrow" style={{ marginBottom: 20 }}>
              Billing Co
            </div>
            <h2 className="lp-h2" style={{ maxWidth: 640, marginBottom: 16 }}>
              $699 a month, up to 50 providers across all clients
            </h2>
            <p className="lp-lead lp-forest-body" style={{ maxWidth: 620, marginBottom: 40 }}>
              That is $14 per provider per month at capacity — a line item you can put in front of a client without
              flinching, next to what you already bill them for handling this. Every feature in the smaller plans is
              here. The difference is the multi-client structure, and it is not available on Solo or Practice — it is
              a different architecture, not a bigger number.
            </p>
            <div className="lp-ctarow">
              <Link href={TRIAL_HREF} className="lp-btn lp-btn--accent">
                Start 14-day trial
              </Link>
              <Link href="/pricing" className="lp-underline" style={{ color: "var(--text-on-dark)" }}>
                Full pricing &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
