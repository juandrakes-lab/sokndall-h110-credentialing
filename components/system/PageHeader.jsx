import Heading from "./primitives/Heading";
import Placeholder from "./primitives/Placeholder";

/**
 * 3.1 PageHeader — H1 + subhead + optional meta row. Opens editorial and
 * comparison pages. No CTA (that is the difference from Hero).
 * Image policy: obligatoria on editorial (documental, column width),
 * justificada on comparison. `variant` picks which.
 */
export default function PageHeader({
  as = "h1",
  title,
  subhead,
  meta = [],
  variant = "editorial",
  image,
  imageAlt,
}) {
  const needsImage = variant === "editorial";

  if (process.env.NODE_ENV !== "production" && needsImage && !image) {
    // eslint-disable-next-line no-console
    console.warn(
      "PageHeader(editorial): image is obligatoria — rendering a FLOAT placeholder until a documental photo exists."
    );
  }

  const img = image ? (
    <img
      src={image}
      alt={imageAlt || ""}
      width="1280"
      height="720"
      className="w-full ratio-16x9 border u-hair"
    />
  ) : needsImage ? (
    <Placeholder ratio="16x9" treatment="FLOAT" label="Editorial lead image — documental, column width" />
  ) : null;

  return (
    <header className="grid gap-6">
      <div className="grid gap-4">
        <Heading as={as} styleClass="t-h1">
          {title}
        </Heading>
        {subhead && <p className="t-body-editorial u-muted max-w-2xl">{subhead}</p>}
        {meta.length > 0 && <div className="t-small u-muted">{meta.join(" · ")}</div>}
      </div>
      {img}
    </header>
  );
}
