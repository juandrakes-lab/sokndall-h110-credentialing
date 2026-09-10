import Heading from "./primitives/Heading";

/**
 * 3.3 GoodFitSection — who the competitor IS the right choice for. No
 * peyorative adjectives. Visual treatment identical to body prose: if it is
 * set off as a card it reads as a performative concession (CATALOGO §3.3).
 * So: no border, no surface, no card. Just a heading and paragraphs.
 * Image policy: prohibida.
 */
export default function GoodFitSection({ as = "h2", id, heading, children }) {
  return (
    <section id={id} className="grid gap-4 max-w-2xl">
      {heading && <Heading as={as}>{heading}</Heading>}
      <div className="t-body-editorial u-ink grid gap-4">{children}</div>
    </section>
  );
}
