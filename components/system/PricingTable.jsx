import Heading from "./primitives/Heading";
import Cta from "./primitives/Cta";

/**
 * 3.5 PricingTable — a vertical list of 3 rows, NOT separated cards. The
 * middle row (Practice) is emphasised with a surface change and carries the
 * exact label "Most complete for a group practice" — never another label,
 * never "Most popular" (CATALOGO §3.5, hard rules). Prices render on the
 * server. The price column is mono because the three prices stack and are
 * read against each other.
 * Image policy: prohibida.
 */
const MIDDLE_LABEL = "Most complete for a group practice";

export default function PricingTable({ as = "h2", id, heading, rows = [], cta }) {
  return (
    <section id={id} className="grid gap-4 max-w-2xl">
      {heading && <Heading as={as}>{heading}</Heading>}
      <ul className="grid border u-hair rounded">
        {rows.map((r, i) => (
          <li
            key={r.name}
            className={`grid gap-1 md:grid-cols-3 md:items-baseline md:gap-6 p-4 ${
              i > 0 ? "border-t u-hair" : ""
            } ${r.middle ? "bg-paper" : ""}`}
          >
            <div className="md:col-span-1 grid gap-1">
              <span className="t-small u-ink">{r.name}</span>
              {r.middle && <span className="t-small u-muted">{MIDDLE_LABEL}</span>}
            </div>
            <div className="md:col-span-1">
              <span className="mono-data u-ink">{r.price}</span>{" "}
              <span className="t-small u-muted">{r.period}</span>
            </div>
            <div className="md:col-span-1 t-small u-muted">{r.providers}</div>
          </li>
        ))}
      </ul>
      {cta && (
        <Cta href={cta.href} tone="primary">
          {cta.label}
        </Cta>
      )}
    </section>
  );
}
