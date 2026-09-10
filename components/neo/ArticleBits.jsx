import Link from "next/link";

/** The observed case: a documented outcome set against the timeline a payer
 *  publishes. It has to read as a different *category* of content at a glance,
 *  not just as an indented paragraph — hence the tint and the label. */
export function Observed({ label = "Observed", note, children }) {
  return (
    <blockquote className="sk-observed">
      <span className="sk-micro sk-observed__lb">{label}</span>
      {children}
      {note ? <span className="sk-small sk-observed__src">{note}</span> : null}
    </blockquote>
  );
}

/** A qualitative duration chart. The bars encode which stage the copy says
 *  dominates — they are illustrative, never a measured day count, and the
 *  caption says so on every instance. */
export function StageBar({ rows, caption }) {
  return (
    <figure className="sk-bars">
      {rows.map((r) => (
        <div className={`sk-bars__row${r.tiny ? " is-tiny" : ""}`} key={r.label}>
          <span className="sk-bars__lb">{r.label}</span>
          <div className="sk-bars__track">
            <div
              className={`sk-bars__fill${r.long ? " is-long" : ""}`}
              style={{ width: `${Math.max(r.weight, 0.08) * 100}%` }}
            >
              <span>{r.range}</span>
            </div>
          </div>
        </div>
      ))}
      {caption ? <figcaption className="sk-small sk-bars__cap">{caption}</figcaption> : null}
    </figure>
  );
}

/** End-of-cluster interlinking. Not another pitch — a title, a one-line hook
 *  and an arrow. There is no second "related guides" list anywhere on an
 *  article page; this is the only one. */
export function ExploreMore({ items, heading = "Explore more guides", category = "Guide" }) {
  if (!items?.length) return null;
  return (
    <div className="sk-explore">
      <p className="sk-micro">{heading}</p>
      <div className="sk-explore__grid">
        {items.map((g) => (
          <Link key={g.href} href={g.href} className="sk-explore__card">
            <span className="sk-micro">{category}</span>
            <h3 className="sk-h4">{g.name}</h3>
            <p className="sk-small">{g.hook}</p>
            <span className="sk-explore__go">Read the guide &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Sokndall's own price table, reused identically on all three competitor
 *  pages — the brief requires it to appear the same way every time. Figures
 *  match app/pricing/data.js; if the published prices change, update both. */
const PRICE_ROWS = [
  { name: "Solo", price: "$79/mo", providers: "3", per: "$26.33" },
  { name: "Practice", price: "$299/mo", providers: "15", per: "$19.93" },
  { name: "Billing Co", price: "$699/mo", providers: "50 across clients", per: "$13.98" },
];

export function PriceTable() {
  return (
    <>
      <div className="sk-tablewrap">
        <table className="sk-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
              <th>Providers</th>
              <th>Per provider</th>
            </tr>
          </thead>
          <tbody>
            {PRICE_ROWS.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td className="sk-num">{r.price}</td>
                <td className="sk-num">{r.providers}</td>
                <td className="sk-num">{r.per}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Published, monthly, cancel any time, 14-day trial with a card. No demo required to see any of it.</p>
    </>
  );
}

/** Label left, content right — a two-column definition grid, not a stacked
 *  label. Used where an article lists parallel explanations rather than a
 *  sequence. */
export function Labelled({ items }) {
  return (
    <div className="sk-def sk-def--prose">
      {items.map((i) => (
        <div className="sk-def__row" key={i.b}>
          <p className="sk-def__b">{i.b}</p>
          <p>{i.t}</p>
        </div>
      ))}
    </div>
  );
}
