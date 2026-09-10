import Heading from "./primitives/Heading";
import Cta from "./primitives/Cta";
import Placeholder from "./primitives/Placeholder";

/**
 * 3.1 Hero — H1 + subhead + primary CTA + secondary + microcopy. Landing only.
 * Image policy: obligatoria — a person in BLEED treatment, or pass `media`
 * (the MatrixSchematic) on the home.
 */
export default function Hero({
  as = "h1",
  title,
  subhead,
  primary,
  secondary,
  microcopy,
  image,
  imageAlt,
  media,
}) {
  if (process.env.NODE_ENV !== "production" && !image && !media) {
    // eslint-disable-next-line no-console
    console.warn("Hero: image is obligatoria (BLEED photo), or pass `media` (MatrixSchematic on the home).");
  }

  return (
    <div className="grid gap-12 md:grid-cols-2 md:items-center">
      <div className="grid gap-6">
        <Heading as={as} styleClass="t-display">
          {title}
        </Heading>
        {subhead && <p className="t-body u-muted max-w-xl">{subhead}</p>}
        {(primary || secondary) && (
          <div className="flex flex-wrap items-center gap-3">
            {primary && (
              <Cta href={primary.href} tone="primary">
                {primary.label}
              </Cta>
            )}
            {secondary && (
              <Cta href={secondary.href} tone="secondary">
                {secondary.label}
              </Cta>
            )}
          </div>
        )}
        {microcopy && <p className="t-small u-muted">{microcopy}</p>}
      </div>
      <div>
        {media ? (
          media
        ) : image ? (
          <img
            src={image}
            alt={imageAlt || ""}
            width="1040"
            height="1040"
            className="w-full ratio-1x1 object-cover"
          />
        ) : (
          <Placeholder ratio="1x1" treatment="BLEED" label="Hero photo — a person doing this work, BLEED on light" />
        )}
      </div>
    </div>
  );
}
