import Link from "next/link";
import Heading from "./primitives/Heading";

/**
 * 3.6 RelatedGuides — 3 links to other content pages. Covers part of the
 * required internal linking (on-page-seo.md §6). Anchors are descriptive,
 * never "learn more".
 * Image policy: justificada — usually omitted; a thumbnail per card only if
 * real art exists.
 */
export default function RelatedGuides({
  as = "h2",
  id,
  heading = "Related guides",
  items = [],
}) {
  return (
    <section id={id} className="grid gap-4">
      <Heading as={as} styleClass="t-h3">
        {heading}
      </Heading>
      <ul className="grid gap-3 md:grid-cols-3">
        {items.slice(0, 3).map((it) => (
          <li key={it.href} className="border u-hair rounded p-4">
            <Link href={it.href} className="grid gap-1">
              <span className="t-body sg-link">{it.title}</span>
              {it.blurb && <span className="t-small u-muted">{it.blurb}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
