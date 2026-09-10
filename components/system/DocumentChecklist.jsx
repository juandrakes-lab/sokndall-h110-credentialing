import Heading from "./primitives/Heading";

/**
 * 3.2 DocumentChecklist — H2 + required documents, each with a note on
 * format or on what it has to match.
 * Image policy: prohibida.
 */
export default function DocumentChecklist({ as = "h2", id, heading, items = [] }) {
  return (
    <section id={id} className="grid gap-6">
      {heading && <Heading as={as}>{heading}</Heading>}
      <ul className="grid max-w-2xl">
        {items.map((it, i) => (
          <li
            key={it.doc}
            className={`grid gap-1 md:grid-cols-3 md:gap-8 py-3 ${
              i > 0 ? "border-t u-hair" : ""
            }`}
          >
            <span className="t-small u-ink md:col-span-1">{it.doc}</span>
            <span className="t-body u-muted md:col-span-2">{it.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
