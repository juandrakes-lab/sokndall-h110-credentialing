import Heading from "./primitives/Heading";

/**
 * 3.2 ErrorList — H2 + errors, each with its consequence. Almost always
 * legal-name / NPI / TIN / address mismatches between the provider record
 * and the group record.
 * Image policy: prohibida.
 */
export default function ErrorList({ as = "h2", id, heading, items = [] }) {
  return (
    <section id={id} className="grid gap-6">
      {heading && <Heading as={as}>{heading}</Heading>}
      <ul className="grid max-w-2xl">
        {items.map((it, i) => (
          <li
            key={it.error}
            className={`grid gap-1 py-4 ${i > 0 ? "border-t u-hair" : ""}`}
          >
            <span className="t-small u-ink">{it.error}</span>
            <p className="t-body u-muted">{it.consequence}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
