import Heading from "./primitives/Heading";

/**
 * 3.2 NegationList — H2 + negative-claim items + explanation + closing. The
 * "what we do not do" section. Decision already taken (CATALOGO §3.2): no
 * image — a diagram here would compete with the benefit sections and the
 * content is too abstract to illustrate without filler.
 * Image policy: prohibida (no image prop).
 */
export default function NegationList({ as = "h2", id, heading, intro, items = [], closing }) {
  return (
    <section id={id} className="grid gap-6">
      {heading && <Heading as={as}>{heading}</Heading>}
      {intro && <p className="t-body u-muted max-w-2xl">{intro}</p>}
      <ul className="grid max-w-2xl">
        {items.map((it, i) => (
          <li
            key={it.claim}
            className={`grid gap-1 py-4 ${i > 0 ? "border-t u-hair" : ""}`}
          >
            <span className="t-small u-ink">{it.claim}</span>
            <p className="t-body u-muted">{it.explanation}</p>
          </li>
        ))}
      </ul>
      {closing && <p className="t-body u-ink max-w-2xl">{closing}</p>}
    </section>
  );
}
