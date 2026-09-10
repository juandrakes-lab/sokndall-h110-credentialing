import Link from "next/link";
import Heading from "./primitives/Heading";

/**
 * 3.3 SourcedPricingDisclosure — what is and is not publicly known about a
 * competitor's price, each claim carrying its source. In several cases the
 * absence of a public figure is itself the finding, so a claim can carry
 * `noSource` text instead of a link.
 * Image policy: prohibida.
 */
export default function SourcedPricingDisclosure({ as = "h2", id, heading, lead, claims = [] }) {
  return (
    <section id={id} className="grid gap-4 max-w-2xl">
      {heading && <Heading as={as}>{heading}</Heading>}
      {lead && <p className="t-body u-ink">{lead}</p>}
      <ul className="grid">
        {claims.map((c, i) => (
          <li
            key={c.text}
            className={`grid gap-1 py-4 ${i > 0 ? "border-t u-hair" : ""}`}
          >
            <p className="t-body u-ink">
              {c.text}
              {c.estimate && <span className="u-muted"> [estimate]</span>}
            </p>
            {c.source ? (
              <Link
                href={c.source.href}
                target="_blank"
                rel={c.source.rel || "noopener nofollow"}
                className="sg-link t-small"
              >
                {c.source.label}
              </Link>
            ) : (
              <span className="t-small u-muted">
                {c.noSource || "No public figure — the absence is the finding."}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
