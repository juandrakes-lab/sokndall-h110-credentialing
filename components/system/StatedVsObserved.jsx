import Link from "next/link";
import Heading from "./primitives/Heading";

/**
 * 3.3 StatedVsObserved — the stated timeline (with source) against the
 * observed timeline in concrete cases. Has no reference; it is the project's
 * own form (CATALOGO §3.3, §6.2). Requirements: the two sides never merge
 * into one paragraph, and the observed side is not a decorative pull-quote.
 * So: two labelled rows, hairline-divided, observed rendered as plain body.
 * Image policy: prohibida.
 */
export default function StatedVsObserved({
  as = "h2",
  id,
  heading,
  stated,
  statedSource,
  statedSourceRel = "noopener",
  observed = [],
}) {
  return (
    <section id={id} className="grid max-w-2xl border u-hair rounded">
      {heading && (
        <div className="px-4 pt-4 pb-2">
          <Heading as={as} styleClass="t-h3">
            {heading}
          </Heading>
        </div>
      )}

      <div className="grid gap-2 md:grid-cols-4 md:gap-6 px-4 py-4 border-t u-hair">
        <div className="t-small u-muted md:col-span-1">Stated</div>
        <p className="t-body u-ink md:col-span-3">
          {stated}
          {statedSource && (
            <>
              {" ("}
              <Link
                href={statedSource.href}
                target="_blank"
                rel={statedSourceRel}
                className="sg-link"
              >
                {statedSource.label}
              </Link>
              {")"}
            </>
          )}
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-4 md:gap-6 px-4 py-4 border-t u-hair">
        <div className="t-small u-muted md:col-span-1">Observed</div>
        <ul className="md:col-span-3 grid gap-3">
          {observed.map((o) => (
            <li key={o.text} className="grid gap-1">
              <span className="t-body u-ink">{o.text}</span>
              {o.figure && <span className="mono-data u-muted">{o.figure}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
