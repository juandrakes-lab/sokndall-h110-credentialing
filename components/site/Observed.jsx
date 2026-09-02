// The "observed" case — a documented, real-world outcome set against the
// timeline a payer publishes.
//
// Every guide in the payer-enrollment cluster makes this distinction, and the
// observed half is usually the more valuable one, so it has to read as
// clearly different at a glance, not just on close reading. A left-rule
// alone wasn't enough to do that once tested — the display and body type are
// the same face (Poppins throughout), so the only difference was a couple of
// points of size. It carries a background tint now, growing off the accent
// spine like a card, which is what actually makes it register as a distinct
// category of content.
//
// `note` is an optional line of attribution or qualification under the quote.

export default function Observed({ label = "Observed", note, children }) {
  return (
    <blockquote className="lp-observed">
      <span className="lb">{label}</span>
      {children}
      {note && <span className="src">{note}</span>}
    </blockquote>
  );
}
