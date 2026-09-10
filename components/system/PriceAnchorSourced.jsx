import Link from "next/link";
import Heading from "./primitives/Heading";

/**
 * 3.3 PriceAnchorSourced — the cost of the alternative, with its source and
 * the unit it measures declared explicitly (providers vs seats). Presenting
 * different units as equivalent is the error that got the previous anchor
 * scrapped, so `unit` is a required prop, not an optional note (CATALOGO §3.3).
 * Image policy: prohibida.
 */
export default function PriceAnchorSourced({
  as = "h2",
  id,
  heading,
  claim,
  figure,
  unit,
  estimate = true,
  source,
  sourceRel = "noopener nofollow",
  calculation,
}) {
  if (!unit) {
    throw new Error(
      "PriceAnchorSourced: `unit` is required. The thing the figure measures (providers vs seats) is not optional (CATALOGO §3.3)."
    );
  }

  return (
    <section id={id} className="grid gap-4 max-w-2xl">
      {heading && <Heading as={as}>{heading}</Heading>}
      {claim && <p className="t-body u-ink">{claim}</p>}
      <p className="t-body">
        {/* Not mono: a single inline figure, not a column of them (§1.2). */}
        <span className="t-body u-ink">{figure}</span>{" "}
        <span className="t-small u-muted">{unit}</span>
        {estimate && <span className="t-small u-muted"> · estimate</span>}
        {source && (
          <>
            {" · "}
            <Link
              href={source.href}
              target="_blank"
              rel={sourceRel}
              className="sg-link t-small"
            >
              {source.label}
            </Link>
          </>
        )}
      </p>
      {calculation && (
        <p className="t-body u-muted border-t u-hair pt-4">{calculation}</p>
      )}
    </section>
  );
}
