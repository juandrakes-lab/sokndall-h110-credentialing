"use client";

import { useId, useState } from "react";

/**
 * CaqhCalculator — the 120-day reattestation calculator on /caqh-reattestation.
 *
 * Everything happens in this component: no fetch, no Server Action, no
 * analytics event, no cookie, no storage. The optional name only labels the
 * calendar file the visitor downloads. Placed by `tool: "caqh-calculator"` on
 * a section (editorialRender.jsx). No CTA inside the block: the page's own
 * close carries it.
 *
 * Dates are plain calendar days in UTC (Date.UTC + whole days), so a daylight
 * saving change can never move a result by one.
 */

const CYCLE = 120;
const DAY = 86400000;

function parseDay(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!m) return null;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(t);
  return d.getUTCMonth() === +m[2] - 1 ? t : null;
}
function todayUTC() {
  const n = new Date();
  return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
}
const iso = (t) => new Date(t).toISOString().slice(0, 10);
const long = (t) => new Date(t).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" });

export function nextDue(lastISO) {
  const last = parseDay(lastISO);
  return last === null ? null : iso(last + CYCLE * DAY);
}

function icsFile(due, name) {
  const who = name ? ` — ${name}` : "";
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const ymd = (t) => iso(t).replace(/-/g, "");
  const esc = (s) => s.replace(/[\\;,]/g, (c) => `\\${c}`);
  const desc = esc("Attest in the CAQH Provider Data Portal. Calculated at sokndall.com/caqh-reattestation.");
  const event = (t, summary, n) => [
    "BEGIN:VEVENT",
    `UID:caqh-${ymd(due)}-${n}-${Math.random().toString(36).slice(2)}@sokndall.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(t)}`,
    `DTEND;VALUE=DATE:${ymd(t + DAY)}`,
    `SUMMARY:${esc(summary + who)}`,
    `DESCRIPTION:${desc}`,
    "END:VEVENT",
  ];
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sokndall//CAQH reattestation calculator//EN",
    "CALSCALE:GREGORIAN",
    ...event(due - 14 * DAY, "CAQH reattestation due in 14 days", 1),
    ...event(due, "CAQH reattestation due today", 2),
    "END:VCALENDAR",
  ].join("\r\n") + "\r\n";
}

export default function CaqhCalculator() {
  const uid = useId();
  const [last, setLast] = useState("");
  const [name, setName] = useState("");

  const lastT = parseDay(last);
  const today = todayUTC();
  const future = lastT !== null && lastT > today;
  const due = lastT !== null && !future ? lastT + CYCLE * DAY : null;
  const days = due === null ? null : Math.round((due - today) / DAY);
  const status = days === null ? null : days < 0 ? "Overdue" : days <= 30 ? "Due soon" : "Active";
  const old = lastT !== null && !future && today - lastT > 3 * 365 * DAY;

  function download() {
    const blob = new Blob([icsFile(due, name.trim())], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `caqh-reattestation-${iso(due)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="sk-calc">
      <div className="sk-calc__f">
        <div className="sk-calc__fld">
          <label className="sk-small sk-calc__lb" htmlFor={`${uid}-last`}>
            Date of your last attestation
          </label>
          <input id={`${uid}-last`} className="sk-ec__in sk-calc__in" type="date" required value={last} onChange={(e) => setLast(e.target.value)} />
        </div>
        <div className="sk-calc__fld">
          <label className="sk-small sk-calc__lb" htmlFor={`${uid}-name`}>
            Name for the calendar reminder (optional)
          </label>
          <input id={`${uid}-name`} className="sk-ec__in sk-calc__in" type="text" maxLength={60} placeholder="e.g. Dr. Rivera" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>

      <div aria-live="polite" className="sk-calc__out">
        {future && <p className="sk-calc__err">That date is in the future. Enter the date you last attested.</p>}
        {due !== null && (
          <>
            <p className="sk-calc__due">
              Next reattestation due: <strong>{long(due)}</strong>
            </p>
            <p className="sk-calc__left">
              <span className={`sk-calc__mark sk-calc__mark--${status === "Active" ? "ok" : status === "Due soon" ? "warn" : "stop"}`}>{status}</span>{" "}
              {days > 0 ? `${days} days from today` : days === 0 ? "Due today" : `${Math.abs(days)} days overdue`}
            </p>
            {old && <p className="sk-calc__err">That attestation is more than three years old; the profile has almost certainly expired.</p>}
            <p className="sk-small">The three cycles after that, if you attest on each due date:</p>
            <ul className="sk-list sk-calc__next">
              {[1, 2, 3].map((k) => (
                <li key={k}>{long(due + k * CYCLE * DAY)}</li>
              ))}
            </ul>
            <button type="button" className="sk-btn sk-btn--ghost sk-btn--sm sk-calc__ics" onClick={download}>
              Download calendar reminder (.ics)
            </button>
          </>
        )}
      </div>

      <p className="sk-small sk-calc__note">
        Calculated in your browser. Nothing you enter is sent or stored. This counts the 120-day credentialing cycle only; the separate 90-day
        directory verification required by the Consolidated Appropriations Act runs on its own clock.
      </p>
    </div>
  );
}
