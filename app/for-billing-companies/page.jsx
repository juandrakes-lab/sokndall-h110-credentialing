import Link from "next/link";

import Shell from "@/components/neo/Shell";
import HeroPanel from "@/components/neo/HeroPanel";
import Footer from "@/components/neo/Footer";
import HeroArt from "@/components/neo/HeroArt";
import Mark from "@/components/neo/Mark";
import { IconUsers, IconGrid, IconShield, IconMail } from "@/components/neo/icons";
import { TRIAL_HREF } from "@/components/neo/neoData";
import { CLIENTS, STRUCTURE, REPORT_LINES } from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Credentialing software for billing companies — $699/mo, published — Sokndall",
  description:
    "Separate client organizations, isolated data, one login, one weekly view across all of them. $699 a month for up to 50 providers across your entire book.",
  path: "/for-billing-companies",
});

function Head({ pill, title, paras }) {
  return (
    <div className="sk-head">
      <p className="sk-head__pill">
        <span className="sk-pill">{pill}</span>
      </p>
      <div className="sk-head__row sk-head__row--top">
        <h2 className="sk-h2">{title}</h2>
        <div className="sk-head__aside sk-stack">
          {paras.map((p) => (
            <p className="sk-body sk-body--lg" key={p}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ForBillingCompaniesPage() {
  const totalProviders = CLIENTS.reduce((n, c) => n + c.providers, 0);
  const totalOpen = CLIENTS.reduce((n, c) => n + c.open, 0);
  const totalQuiet = CLIENTS.reduce((n, c) => n + c.quiet, 0);

  return (
    <Shell>
      <HeroPanel
        current="/for-billing-companies"
        eyebrow="For billing companies"
        title={["Credentialing for six", "clients, without six", "spreadsheets"]}
        sub="Separate client organizations, isolated data, one login, one weekly view across all of them. $699 a month for up to 50 providers across your entire book."
        primary={{ href: TRIAL_HREF, label: "Start 14-day trial" }}
        secondary={{ href: "/pricing", label: "Full pricing" }}
      >
        <ul className="sk-strip">
          {[
            [IconUsers, "Separate client orgs"],
            [IconShield, "Scoped user access"],
            [IconGrid, "One aggregate view"],
            [IconMail, "Per-client digest"],
          ].map(([Icon, label]) => (
            <li className="sk-strip__item" key={label}>
              <span className="sk-strip__ico"><Icon /></span>
              {label}
            </li>
          ))}
        </ul>

        <div className="sk-hero__cards">
          <div className="sk-card sk-hcard">
            <p className="sk-micro">Across the whole book</p>
            <p className="sk-kpi sk-kpi--lg sk-num">{totalProviders}</p>
            <p className="sk-small">providers, across {CLIENTS.length} client organizations</p>
          </div>
          <div className="sk-card sk-hcard">
            <p className="sk-micro">Open applications</p>
            <p className="sk-kpi sk-kpi--lg sk-num">{totalOpen}</p>
            <p className="sk-small">{totalQuiet} with no contact in over 30 days</p>
          </div>
          <div className="sk-card sk-hcard">
            <p className="sk-micro">Per provider, at capacity</p>
            <p className="sk-kpi sk-kpi--lg sk-num">$13.98</p>
            <p className="sk-small">$699 ÷ 50 providers. The plan price does not move.</p>
          </div>
        </div>
      </HeroPanel>

      {/* 2 — the problem */}
      <section className="sk-sec">
        <Head
          pill="The problem"
          title="The problem is not volume. It is that nothing adds up."
          paras={[
            "Each client has their own file, their own naming, their own way of recording a follow-up. Answering “what needs attention this week” means opening six things and holding the answer in your head. Answering it for a client on the phone means opening theirs while they wait.",
            "And when a staff member leaves, whatever they knew about where each application stood leaves with them.",
          ]}
        />
      </section>

      {/* 3 — the structure */}
      <section className="sk-sec sk-sec--tight">
        <Head
          pill="The structure"
          title="How the structure works"
          paras={[
            "Four mechanisms, and none of them is a permissions matrix you have to configure. The multi-client structure is the plan — it is a different architecture, not a bigger number.",
          ]}
        />

        <div className="sk-bento sk-bento--2">
          {STRUCTURE.map((s) => (
            <article className="sk-card sk-card--soft sk-card--pad sk-stack" key={s.title}>
              <h3 className="sk-h4">{s.title}</h3>
              <p className="sk-body">{s.body}</p>
            </article>
          ))}
        </div>

        <div className="sk-bento sk-bento--split sk-closing-block">
          <div className="sk-card sk-card--line sk-card--pad">
            <div className="sk-hcard__head">
              <p className="sk-micro">One aggregate view</p>
              <span className="sk-small sk-num">{CLIENTS.length} clients</span>
            </div>
            <div className="sk-note">
              {CLIENTS.map((c) => (
                <div className="sk-staterow" key={c.name}>
                  <span className="st">{c.name}</span>
                  <span className="dt">{c.providers} providers</span>
                  {c.quiet ? (
                    <Mark state={{ label: "Gone quiet", glyph: "▲", tone: "warn" }} count={String(c.quiet)} />
                  ) : (
                    <Mark state={{ label: "Open", glyph: "◐", tone: "blue" }} count={String(c.open)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="sk-card sk-card--blue sk-card--pad sk-stack">
            <p className="sk-micro">The rollup</p>
            <p className="sk-h4">
              {totalOpen} open across the book, {totalQuiet} of them quiet
            </p>
            <p className="sk-small">
              That number is the one you cannot get from six spreadsheets without opening all six. It is on the screen
              before anyone asks for it.
            </p>
          </div>
        </div>
      </section>

      {/* 4 — the report */}
      <section className="sk-sec sk-sec--tight">
        <Head
          pill="The report"
          title="The report you can send without building it"
          paras={[
            "When a client asks where their enrollments stand, the answer is a list with dates, statuses and the last follow-up on each one. Not a recollection, and not an afternoon of assembling.",
            "That is also the report that justifies your invoice, which is a different conversation than the one where you explain that the payer is slow.",
          ]}
        />

        <div className="sk-digest">
          <div className="sk-digest__head">
            <span className="sk-micro">Client report · Meridian Family Practice</span>
            <span className="sk-micro">Generated on request, not assembled from memory</span>
          </div>
          {REPORT_LINES.map((l) => (
            <div key={l.tx} className={`sk-digest__line${l.hot ? " is-hot" : ""}`}>
              <span className="tx">{l.tx}</span>
              <span className="sk-digest__ct">{l.ct}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5 — cost context */}
      <section className="sk-sec sk-sec--tight">
        <div className="sk-panel sk-on-blue">
          <HeroArt />
          <div className="sk-panel__in">
            <p className="sk-head__pill">
              <span className="sk-pill">Cost context</span>
            </p>
            <div className="sk-head__row">
              <h2 className="sk-h2">$13.98 a provider is not the number your clients are used to</h2>
              <p className="sk-lead sk-head__aside">
                Billing companies that manage credentialing for their clients typically charge somewhere in the $150 to
                $400 per provider per month range for that work — the actual attestation, the recredentialing, the
                renewals. At 50 providers across your book, that is $7,500 to $20,000 a month of revenue on the service
                itself.
              </p>
            </div>

            <div className="sk-bento sk-bento--2 sk-figures">
              <div className="sk-fig">
                <p className="sk-fig__v sk-num">3 – 9%</p>
                <p className="sk-micro">of the credentialing line</p>
                <p className="sk-fig__l">Sokndall is not that service</p>
                <p className="sk-small">
                  It does not compete with it. It is the system that makes running that service across six clients
                  possible without losing track of any one of them — priced to be beneath the conversation with a
                  client, not part of it.
                </p>
              </div>
              <div className="sk-fig">
                <p className="sk-fig__v sk-num">$699</p>
                <p className="sk-micro">per month, flat</p>
                <p className="sk-fig__l">Up to 50 providers across all clients</p>
                <p className="sk-small">
                  Every feature in the smaller plans is here. The difference is the multi-client structure, and it is
                  not available on Solo or Practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — closing */}
      <section className="sk-sec sk-sec--tight">
        <div className="sk-cta sk-on-blue">
          <HeroArt />
          <div className="sk-cta__inner">
            <h2 className="sk-h2">$699 a month, up to 50 providers across all clients</h2>
            <p className="sk-lead sk-cta__b">
              A line item you can put in front of a client without flinching, next to what you already bill them for
              handling this.
            </p>
            <div className="sk-cta__btns">
              <Link href={TRIAL_HREF} className="sk-btn sk-btn--primary">
                Start 14-day trial
              </Link>
              <Link href="/pricing" className="sk-btn sk-btn--ghost">
                Full pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Shell>
  );
}
