// The status badge system: six enrollment states, five credential states.
// Each state is colour + shape + an optional monospace day count, so the badge
// still reads correctly in greyscale or with the colours desaturated.
//
// The mark glyphs are deliberately all distinct silhouettes — hollow, solid,
// half, diamond, triangle, check, cross — never colour alone.

export const ENROLLMENT_STATES = {
  not_started: { label: "Not started", mark: "○", tone: "neutral" },
  submitted: { label: "Submitted", mark: "◐", tone: "sage" },
  in_review: { label: "In review", mark: "●", tone: "forest" },
  info_requested: { label: "Info requested", mark: "▲", tone: "amber" },
  approved: { label: "Approved", mark: "✓", tone: "forest" },
  denied: { label: "Denied / Withdrawn", mark: "✕", tone: "deep" },
};

export const CREDENTIAL_STATES = {
  active: { label: "Active", mark: "●", tone: "forest" },
  expiring: { label: "Expiring", mark: "◇", tone: "gold" },
  due: { label: "Due now", mark: "◆", tone: "amber" },
  urgent: { label: "Urgent", mark: "▲", tone: "rust" },
  expired: { label: "Expired", mark: "✕", tone: "deep" },
};

/** state: a key from either map, or an object { label, mark, tone }.
 *  count: the monospace figure shown after the divider, e.g. "41d". */
export default function StatusBadge({ state, count, label }) {
  const s =
    typeof state === "string"
      ? ENROLLMENT_STATES[state] || CREDENTIAL_STATES[state]
      : state;
  if (!s) return null;

  return (
    <span className={`lp-badge lp-badge--${s.tone}`}>
      <span className="mk" aria-hidden="true">
        {s.mark}
      </span>
      {label || s.label}
      {count ? <span className="ct">{count}</span> : null}
    </span>
  );
}
