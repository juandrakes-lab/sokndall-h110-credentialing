import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-pages.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import StatusBadge from "@/components/site/StatusBadge";
import EnrollmentMatrix, { MatrixLegend } from "@/components/site/EnrollmentMatrix";
import { TRIAL_HREF } from "@/components/site/siteData";
import { STATUSES, TIMELINE_DAYS, TIMELINE_NODES, LOG_ROWS, CLOSING_POINTS } from "./data";

export const metadata = {
  title: "Payer enrollment software that tracks the waiting — Sokndall",
  description:
    "One record per provider per payer, from submitted to effective date. Status, confirmation number, who you talked to last, and how long it has been since anyone checked. $79 to $699 a month, published, no demo call.",
};

export default function PayerEnrollmentSoftwarePage() {
  return (
    <div className="sokndall-landing">
      <SiteNav />

      {/* 1 — HERO. Same bleed mechanics as the home hero: the figure stands on
          the seam with the section below. */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            maxWidth: "var(--maxw)",
            margin: "0 auto",
            position: "relative",
            "--bleed-w": "460px",
            "--bleed-gap": "48px",
            "--bleed-top": "80px",
          }}
        >
          <div className="lp-bleed-content">
            <div className="lp-eyebrow" style={{ marginBottom: 20 }}>
              Payer Enrollment Software
            </div>
            <h1 className="lp-h1" style={{ marginBottom: 24 }}>
              Payer enrollment software that tracks the waiting, not just the paperwork
            </h1>
            <p className="lp-lead" style={{ maxWidth: 580, margin: "0 0 32px" }}>
              One record per provider per payer, from submitted to effective date. Status, confirmation number, who you
              talked to last, and how long it has been since anyone checked. $79 to $699 a month, published, no demo
              call.
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
              src="/pages/enrollment-hero.png"
              alt="A provider-enrollment specialist standing with a phone to his ear and an open application folder, mid follow-up call"
            />
          </div>
        </div>
      </section>

      {/* 2 — THE WAITING IS THE JOB. The timeline is the section's evidence, so
          it runs full width under the copy rather than sitting beside it. */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          <div className="lp-head2 lp-head2--frombadge" style={{ marginBottom: 48 }}>
            <div className="lp-eyebrow">The Wait</div>
              <h2 className="lp-h2">
                Submitting the application takes an afternoon. <em>The next four months are the job.</em>
              </h2>
            <div className="bd">
              <p className="lp-body">
                Enrollment runs 60 to 120 days per provider per payer on a good day, and much longer when something goes
                sideways. One application submitted in October was approved the following April. One payer&rsquo;s own
                auto-reply quoted a range of 60 to 190 days before anything happens at all.
              </p>
              <p className="lp-body">
                Nothing about that is unusual. What makes it expensive is that the waiting is unstructured. There is no
                shared queue, no ticket number that means anything to you, and no notification when the payer needs
                something. Applications do not usually get denied. They sit.
              </p>
            </div>
          </div>

          <div className="lp-timeline">
            <div className="lp-timeline-track">
              <div className="lp-timeline-fill" style={{ width: (120 / TIMELINE_DAYS) * 100 + "%" }} />
              {TIMELINE_NODES.map((n) => (
                <div
                  key={n.day}
                  className={
                    "lp-timeline-node" +
                    (n.on ? " is-on" : "") +
                    (n.end ? " is-end" : "") +
                    (n.align ? " " + n.align : "")
                  }
                  style={{ left: (n.day / TIMELINE_DAYS) * 100 + "%" }}
                >
                  <span className="cap">{n.cap}</span>
                  <span className="dot" />
                  <span className="lb">{n.lb}</span>
                </div>
              ))}
            </div>
            <div className="lp-timeline-foot">
              <span>One application, submitted in October, effective the following April.</span>
              <span>Payer&rsquo;s quoted range: 60 – 190 days</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — THE SIX STATUSES */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        <div className="lp-eyebrow" style={{ marginBottom: 18 }}>
          Statuses
        </div>
        <h2 className="lp-h2" style={{ maxWidth: 780, marginBottom: 40 }}>
          Six statuses, and only one of them is your problem right now
        </h2>

        <div className="lp-table-wrap" style={{ marginBottom: 36 }}>
          <table className="lp-table">
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">What it means</th>
                <th scope="col">What you do</th>
              </tr>
            </thead>
            <tbody>
              {STATUSES.map((s) => (
                <tr key={s.state} className={s.hot ? "is-hot" : undefined}>
                  <td>
                    <StatusBadge state={s.state} />
                  </td>
                  <td>{s.means}</td>
                  <td>{s.doThis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* C-1: 32 and 35 words, so the pair reads as columns rather than a
            paragraph with a fragment under it. */}
        <div className="lp-cols2">
          <p className="lp-body">
            Info requested is the status that costs money, and it is the one most likely to be invisible. Payers often do
            not say what they need — the application just sits.
          </p>
          <p className="lp-body">
            Sokndall puts every application in one of six states and flags info-requested ones first in the Monday
            digest, because that is the one where the clock is running against you, not the payer.
          </p>
        </div>
      </section>

      {/* 4 — THE FOLLOW-UP LOG. Show the artifact, not a description of it. */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          <div className="lp-head2 lp-head2--frombadge" style={{ marginBottom: 44 }}>
            <div className="lp-eyebrow">The Follow-Up Log</div>
              <h2 className="lp-h2">The reference number, the name, and the date you actually called</h2>
            <div className="bd">
              <p className="lp-body">
                Every follow-up gets a line: date, who you reached, what they said, what reference number they gave you.
                When someone at the payer says the application was never received, the log is what settles it.
              </p>
              <p className="lp-body">
                Sokndall calculates days since last follow-up and the next date one is due. Anything past 30 days without
                contact gets flagged — that is where applications die.
              </p>
            </div>
          </div>

          <div className="lp-log">
            <div className="lp-log-head">
              <p className="ti">Provider 04 · Payer C — follow-up log</p>
              <StatusBadge state="info_requested" count="41d" />
            </div>
            {LOG_ROWS.map((row) => (
              <div key={row.date} className="lp-log-row">
                <span className="dt">{row.date}</span>
                <span className="bd">
                  {row.lead} <b>{row.who}</b> {row.tail}
                </span>
                <span className="rf">{row.ref}</span>
              </div>
            ))}
            <div className="lp-log-foot">
              <span>
                Days since last follow-up <b>41</b>
              </span>
              <span>
                Next follow-up due <b>overdue</b>
              </span>
              <span>
                Submitted <b>Oct 02</b>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — THE 30-DAY FLAG. One idea, so it gets the dark band and nothing else. */}
      <section className="lp-dark">
        <div className="lp-center" style={{ maxWidth: 900, margin: "0 auto", padding: "88px var(--pad-x)" }}>
          <h2
            className="lp-h2"
            style={{ color: "var(--text-on-dark)", marginBottom: 28 }}
          >
            The 30-day flag
          </h2>
          <p
            style={{
              fontFamily: "var(--display)",
              fontWeight: 500,
              fontSize: "clamp(1.2rem,2.2vw,1.55rem)",
              lineHeight: 1.5,
              color: "var(--text-on-dark)",
              margin: "0 0 22px",
            }}
          >
            An application with no contact in 30 days is not progressing. It might be fine. It might be sitting behind a
            document nobody asked you for, a name that does not match the group record, or a network the payer says is
            closed when it is not.
          </p>
          <p
            style={{
              fontFamily: "var(--display)",
              fontWeight: 500,
              fontSize: "clamp(1.2rem,2.2vw,1.55rem)",
              lineHeight: 1.5,
              color: "var(--gold)",
              margin: 0,
            }}
          >
            You cannot tell the difference without calling. The flag exists so that the call happens.
          </p>
        </div>
      </section>

      {/* 6 — THE MATRIX, at 12 x 10.
          The grid renders at its natural ~750px. Left-aligned under a headline
          it left over 400px of white beside it — the worst void on the three
          pages. The copy and legend now occupy that column instead. */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        <div className="lp-matrix-layout">
          <div className="lp-matrix-copy">
            <div className="lp-eyebrow">The Enrollment Grid</div>
            <h2 className="lp-h2">Every provider, every payer, one screen</h2>
            <p className="lp-body">
              Providers down the side, payers across the top, one cell per pair. Color by status, number is days since
              last follow-up.
            </p>
            {/* C-2 as delivered opens on the same clause as the paragraph it was
                meant to follow ("twelve providers … ten payers … 120"), so it
                replaces that paragraph instead of stacking on it — it says
                everything the old one said and adds where to look first. */}
            <p className="lp-body">
              Twelve providers and ten payers is 120 possible pairs — most of the grid should be green, and the few cells
              that are not are the only ones that need a decision today.
            </p>
          </div>
          <div className="lp-matrix-figure">
            <EnrollmentMatrix rows={12} cols={10} stuckCount={7} cellWidth={62} legend={false} />
            <MatrixLegend />
          </div>
        </div>
      </section>

      {/* 7 — CLOSING */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          {/* Centered: a closing section's CTA belongs under it, not beside the
              headline at the same height. */}
          <div className="lp-center" style={{ marginBottom: 44 }}>
            <div className="lp-eyebrow" style={{ marginBottom: 18 }}>
              Scope
            </div>
            <h2 className="lp-h2">What it does not do</h2>
          </div>

          <div className="lp-cardgrid lp-cardgrid--3" style={{ marginBottom: 44 }}>
            {CLOSING_POINTS.map((p) => (
              <div key={p.title} className="lp-card">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>

          <div className="lp-center" style={{ gap: 28 }}>
            <p className="lp-body" style={{ maxWidth: 720, margin: 0 }}>
              You still work in CAQH (DataSpring), PECOS and the payer portals. It holds what those systems will not hold
              for you: the timeline, the log, and the list of what needs a phone call this week.
            </p>
            <div className="lp-ctarow">
              <Link href="/pricing" className="lp-btn">
                See pricing →
              </Link>
              <Link href="/payer-enrollment/" className="lp-underline">
                How payer enrollment works →
              </Link>
            </div>
            <p className="lp-note">$79 to $699 a month. 14-day trial, card required, cancel self-serve.</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
