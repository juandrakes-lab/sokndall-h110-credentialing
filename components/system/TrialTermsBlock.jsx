import Heading from "./primitives/Heading";

/**
 * 3.5 TrialTermsBlock — 14 days / card up front / cancel self-serve from
 * Settings. Same visual weight as the price, pinned near the pay button. Not
 * a footnote: saying it in fine print is the behaviour the product criticises
 * (CATALOGO §3.5). So it renders at body size inside a plain 1px frame.
 * Image policy: prohibida.
 */
export default function TrialTermsBlock({
  as = "h2",
  id,
  heading = "How the trial works",
  items = [],
}) {
  return (
    <section id={id} className="grid gap-4 border u-hair rounded p-6">
      <Heading as={as} styleClass="t-h3">
        {heading}
      </Heading>
      <dl className="grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="grid gap-1">
            <dt className="t-body u-ink">{it.label}</dt>
            <dd className="t-body u-muted">{it.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
