// Status marks — the same six enrollment states and five credential states the
// authenticated app uses, restated in the neo skin. Each is colour + a distinct
// glyph silhouette + an optional tabular count, so the state still reads with
// the colours removed.

export const ENROLLMENT_STATES = {
  not_started:    { label: "Not started",   glyph: "○", tone: "calm" },
  submitted:      { label: "Submitted",     glyph: "◐", tone: "blue" },
  in_review:      { label: "In review",     glyph: "●", tone: "blue" },
  info_requested: { label: "Info requested",glyph: "▲", tone: "warn" },
  approved:       { label: "Approved",      glyph: "✓", tone: "ok" },
  denied:         { label: "Denied",        glyph: "✕", tone: "stop" },
};

export const CREDENTIAL_STATES = {
  active:   { label: "Active",   glyph: "●", tone: "ok" },
  expiring: { label: "Expiring", glyph: "◇", tone: "warn" },
  due:      { label: "Due now",  glyph: "◆", tone: "warn" },
  urgent:   { label: "Urgent",   glyph: "▲", tone: "stop" },
  expired:  { label: "Expired",  glyph: "✕", tone: "stop" },
};

/** state: a key from either map, or { label, glyph, tone }.
 *  count: the tabular figure after the divider, e.g. "41d". */
export default function Mark({ state, count, label }) {
  const s = typeof state === "string" ? ENROLLMENT_STATES[state] || CREDENTIAL_STATES[state] : state;
  if (!s) return null;
  return (
    <span className={`sk-mark sk-mark--${s.tone}`}>
      <span className="sk-mark__g" aria-hidden="true">{s.glyph}</span>
      {label || s.label}
      {count ? <span className="sk-mark__c">{count}</span> : null}
    </span>
  );
}
