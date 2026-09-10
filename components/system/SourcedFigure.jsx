import Link from "next/link";

/**
 * 3.3 SourcedFigure — a figure + its source + link, inline in the paragraph
 * flow. The most-used component after ProseSection (~13 pages). The link is
 * underlined and in brand colour, not invisible; the estimate marker is text,
 * never an icon (CATALOGO §3.3).
 * Image policy: prohibida.
 *
 * Usage: <p>Enrollment runs <SourcedFigure source={{label,href}}>60 to 120
 * days</SourcedFigure> per provider per payer.</p>
 */
export default function SourcedFigure({
  children,
  source,
  estimate = false,
  sourceRel = "noopener",
}) {
  return (
    <span>
      {children}
      {estimate && <span className="u-muted"> [estimate]</span>}
      {source && (
        <>
          {" ("}
          <Link
            href={source.href}
            target="_blank"
            rel={sourceRel}
            className="sg-link"
          >
            {source.label}
          </Link>
          {")"}
        </>
      )}
    </span>
  );
}
