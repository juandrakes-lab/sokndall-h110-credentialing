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

// `note` defaults to the pre-v3.1 line so any page still rendering the table
// on its own keeps it; the comparison tail passes `note={null}`, because the
// v3.1 price paragraph already says the same thing in approved words.
const PRICE_NOTE =
  "Published, monthly, cancel any time, 14-day trial with a card. No demo required to see any of it.";

// Drawn as the /pricing plan matrix (2026-09-21, the founder): the three plans
// are the columns, under the ink head, with Practice lifted as it is there. The
// plans as rows read as a list; as columns they read as what they are, three
// plans compared. The same `.sk-pfm` classes, so it also gets the /pricing phone
// treatment — one card per row, each under its own ink bar.
const PLAN_HI = 1;
const PRICE_MATRIX = [
  { label: "Price", key: "price" },
  { label: "Providers", key: "providers" },
  { label: "Per provider", key: "per" },
];

export function PriceTable({ note = PRICE_NOTE }) {
  return (
    <>
      <div className="sk-pfm sk-pfm--article">
        <table className="sk-pfm__table">
          <thead>
            <tr>
              <td className="sk-pfm__corner" />
              {PRICE_ROWS.map((r, i) => (
                <th scope="col" key={r.name} className={i === PLAN_HI ? "is-hi" : undefined}>
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRICE_MATRIX.map((m) => (
              <tr key={m.key}>
                <th scope="row">{m.label}</th>
                {PRICE_ROWS.map((r, i) => (
                  <td key={r.name} data-label={r.name} className={i === PLAN_HI ? "is-hi" : undefined}>
                    <span className={m.key === "providers" && !/^\d+$/.test(r[m.key]) ? "sk-pfm__w" : "sk-pfm__v"}>{r[m.key]}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p>{note}</p> : null}
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
