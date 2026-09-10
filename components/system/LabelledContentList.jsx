import Heading from "./primitives/Heading";

/**
 * 3.2 LabelledContentList — H2 + N label / explanation pairs, label on the
 * left with a hairline separator between rows. NOT a grid of cards.
 * Image policy: prohibida (no image prop).
 */
export default function LabelledContentList({ as = "h2", id, heading, items = [] }) {
  return (
    <section id={id} className="grid gap-6">
      {heading && <Heading as={as}>{heading}</Heading>}
      <dl className="grid max-w-2xl">
        {items.map((it, i) => (
          <div
            key={it.label}
            className={`grid gap-2 md:grid-cols-3 md:gap-8 py-4 ${
              i > 0 ? "border-t u-hair" : ""
            }`}
          >
            <dt className="t-small u-ink md:col-span-1">{it.label}</dt>
            <dd className="t-body u-muted md:col-span-2">{it.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
