import Heading from "./primitives/Heading";

/**
 * 3.2 ProseSection — H2 + body. The connective tissue (~15 pages).
 * Image policy: justificada. This is the one component where the agent
 * decides per page — so when an image IS passed, `imageJustification`
 * (a sentence) is required and prints as the caption; when it is omitted,
 * the reason belongs in the page's own notes.
 */
export default function ProseSection({
  as = "h2",
  id,
  heading,
  children,
  image,
  imageAlt,
  imageJustification,
}) {
  if (process.env.NODE_ENV !== "production" && image && !imageJustification) {
    // eslint-disable-next-line no-console
    console.warn(
      `ProseSection "${heading}": image present without imageJustification (§3.2 — the choice must be explained).`
    );
  }

  return (
    <section id={id} className="grid gap-4">
      {heading && <Heading as={as}>{heading}</Heading>}
      <div className="t-body-editorial u-ink grid gap-4 max-w-2xl">{children}</div>
      {image && (
        <figure className="grid gap-2 max-w-2xl">
          <img
            src={image}
            alt={imageAlt || ""}
            width="1040"
            height="694"
            className="w-full ratio-3x2 border u-hair"
          />
          {imageJustification && (
            <figcaption className="t-small u-muted">{imageJustification}</figcaption>
          )}
        </figure>
      )}
    </section>
  );
}
