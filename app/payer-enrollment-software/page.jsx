import Link from "next/link";

import Shell from "@/components/neo/Shell";
import HeroPanel from "@/components/neo/HeroPanel";
import Footer from "@/components/neo/Footer";
import Matrix, { MatrixLegend } from "@/components/neo/Matrix";
import Mark from "@/components/neo/Mark";
import { IconDoc, IconClock, IconGrid, IconMail } from "@/components/neo/icons";
import { TRIAL_HREF } from "@/components/neo/neoData";
import { STATUSES, TIMELINE_DAYS, TIMELINE_NODES, LOG_ROWS, CLOSING_POINTS } from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Payer enrollment software with published pricing — Sokndall",
  description:
    "One record per provider per payer, from submitted to effective date. Status, confirmation number, who you talked to last, and how long it has been since anyone checked. $79 to $699 a month, no demo call.",
  path: "/payer-enrollment-software",
});

function Head({ pill, title, paras, wide }) {
  return (
    <div className="sk-head">
      <p className="sk-head__pill">
        <span className="sk-pill">{pill}</span>
      </p>
      <div className={`sk-head__row${wide ? "" : " sk-head__row--top"}`}>
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

export default function PayerEnrollmentSoftwarePage() {
  return (
    <Shell>
      <HeroPanel
        current="/payer-enrollment-software"
        eyebrow="Payer enrollment software"
        title={["Software that tracks", "the waiting, not just", "the paperwork"]}
        sub="One record per provider per payer, from submitted to effective date. Status, confirmation number, who you talked to last, and how long it has been since anyone checked. $79 to $699 a month, published, no demo call."
        primary={{ href: TRIAL_HREF, label: "Start 14-day trial" }}
        secondary={{ href: "/pricing", label: "See pricing" }}
      >
        <ul className="sk-strip">
          {[
            [IconDoc, "One record per pair"],
            [IconClock, "Days since last contact"],
            [IconGrid, "Six enrollment statuses"],
            [IconMail, "Monday digest"],
          ].map(([Icon, label]) => (
            <li className="sk-strip__item" key={label}>
              <span className="sk-strip__ico"><Icon /></span>
              {label}
            </li>
          ))}
        </ul>

        <div className="sk-hero__figure">
          <div className="sk-hero__figure-cards">
            <div className="sk-card sk-hcard">
              <div className="sk-hcard__head">
                <p className="sk-micro">Provider 04 · Payer C</p>
                <Mark state="info_requested" count="41d" />
              </div>
              <p className="sk-small">
                Last contact 41 days ago. The payer has been waiting on a W-9 since December and never said so.
              </p>
            </div>
            <div className="sk-card sk-hcard">
              <p className="sk-micro">Submitted → effective date</p>
              <p className="sk-kpi sk-num">182 days</p>
              <p className="sk-small">One application, submitted in October, effective the following April.</p>
            </div>
          </div>

          <figure className="sk-hero__cut">
            <img
              src="/pages/enrollment-hero.png"
              width={938}
              height={1395}
              alt="A provider-enrollment specialist standing with a phone to his ear and an open application folder, mid follow-up call"
            />
          </figure>
        </div>
      </HeroPanel>

      {/* 2 — the waiting is the job */}
      <section className="sk-sec">
        <Head
          pill="The wait"
          title="Submitting takes an afternoon. The next four months are the job."
          paras={[
            "Enrollment runs 60 to 120 days per provider per payer on a good day, and much longer when something goes sideways. One application submitted in October was approved the following April. One payer’s own auto-reply quoted a range of 60 to 190 days before anything happens at all.",
            "Nothing about that is unusual. What makes it expensive is that the waiting is unstructured. There is no shared queue, no ticket number that means anything to you, and no notification when the payer needs something. Applications do not usually get denied. They sit.",
          ]}
        />

        <div className="sk-card sk-card--soft sk-card--pad sk-timeline">
          <div className="sk-timeline__track">
            <div className="sk-timeline__fill" style={{ width: `${(120 / TIMELINE_DAYS) * 100}%` }} />
            {TIMELINE_NODES.map((n) => (
              <div
                key={n.day}
                className={
                  "sk-timeline__node" +
                  (n.on ? " is-on" : "") +
                  (n.end ? " is-end" : "") +
                  (n.align ? ` ${n.align}` : "")
                }
                style={{ left: `${(n.day / TIMELINE_DAYS) * 100}%` }}
              >
                <span className="cap">{n.cap}</span>
                <span className="dot" />
                <span className="lb">{n.lb}</span>
              </div>
            ))}
          </div>
          <div className="sk-timeline__foot">
            <span className="sk-small">One application, submitted in October, effective the following April.</span>
            <span className="sk-small">Payer&rsquo;s quoted range: 60 – 190 days</span>
          </div>
        </div>
      </section>

      {/* 3 — the six statuses */}
      <section className="sk-sec sk-sec--tight">
        <Head
          pill="Statuses"
          title="Six statuses, and only one of them is your problem right now"
          paras={[
            "Info requested is the status that costs money, and it is the one most likely to be invisible. Payers often do not say what they need — the application just sits.",
          ]}
        />

        <div className="sk-tablewrap">
          <table className="sk-table">
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
                    <Mark state={s.state} />
                  </td>
                  <td>{s.means}</td>
                  <td>{s.doThis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="sk-body sk-body--lg sk-note">
          Sokndall puts every application in one of six states and flags info-requested ones first in the Monday digest,
          because that is the one where the clock is running against you, not the payer.
        </p>
      </section>

      {/* 4 — the follow-up log */}
      <section className="sk-sec sk-sec--tight">
        <Head
          pill="The follow-up log"
          title="The reference number, the name, and the date you actually called"
          paras={[
            "Every follow-up gets a line: date, who you reached, what they said, what reference number they gave you. When someone at the payer says the application was never received, the log is what settles it.",
            "Sokndall calculates days since last follow-up and the next date one is due. Anything past 30 days without contact gets flagged — that is where applications die.",
          ]}
        />

        <div className="sk-log">
          <div className="sk-log__head">
            <p className="sk-micro">Provider 04 · Payer C — follow-up log</p>
            <Mark state="info_requested" count="41d" />
          </div>
          {LOG_ROWS.map((row) => (
            <div key={row.date} className="sk-log__row">
              <span className="dt">{row.date}</span>
              <span className="bd">
                {row.lead} <b>{row.who}</b> {row.tail}
              </span>
              <span className="rf">{row.ref}</span>
            </div>
          ))}
          <div className="sk-log__foot">
            <span>
              Days since last follow-up <b className="sk-num">41</b>
            </span>
            <span>Flagged in Monday&rsquo;s digest</span>
          </div>
        </div>
      </section>

      {/* 5 — the enrollment grid */}
      <section className="sk-sec sk-sec--tight">
        <Head
          pill="The enrollment grid"
          title="Every provider, every payer, one screen"
          paras={[
            "Providers down the side, payers across the top, one cell per pair. Colour by status, number is days since last follow-up.",
            "Twelve providers and ten payers is 120 possible pairs — most of the grid should be calm, and the few cells that are not are the only ones that need a decision today.",
          ]}
        />

        <div className="sk-card sk-card--soft sk-card--pad">
          <Matrix rows={10} cols={10} stuckCount={7} slowCount={10} />
          <MatrixLegend />
        </div>
      </section>

      {/* 6 — closing */}
      <section className="sk-sec sk-sec--tight">
        <div className="sk-head">
          <div className="sk-center">
            <p className="sk-head__pill">
              <span className="sk-pill">Scope</span>
            </p>
            <h2 className="sk-h2">What it does not do</h2>
          </div>
        </div>

        <div className="sk-bento">
          {CLOSING_POINTS.map((p) => (
            <article className="sk-card sk-card--soft sk-card--pad" key={p.title}>
              <h3 className="sk-h4">{p.title}</h3>
              <p className="sk-body sk-note">{p.body}</p>
            </article>
          ))}
        </div>

        <div className="sk-center sk-closing-block">
          <p className="sk-body sk-body--lg">
            You still work in CAQH (DataSpring), PECOS and the payer portals. It holds what those systems will not hold
            for you: the timeline, the log, and the list of what needs a phone call this week.
          </p>
          <div className="sk-center__btns">
            <Link href="/pricing" className="sk-btn sk-btn--primary">
              See pricing
            </Link>
          </div>
          <p className="sk-small sk-note">
            $79 to $699 a month. 14-day trial, card required, cancel self-serve.
          </p>
        </div>
      </section>

      <Footer />
    </Shell>
  );
}
