import Heading from "./primitives/Heading";
import Placeholder from "./primitives/Placeholder";

/**
 * 3.4 FailureDeepDive — one failure mode in depth: mechanism → symptom → how
 * to catch it in week 1 instead of week 8. Marked in the copy as its own
 * visual hierarchy, done here with a left rule rather than a card or a shadow.
 * Image policy: justificada — the section where a documental photo makes the
 * most sense; passes through the component's `image` prop when one exists.
 */
export default function FailureDeepDive({
  as = "h2",
  id,
  heading,
  mechanism,
  symptom,
  catchEarly,
  image,
  imageAlt,
  imageJustification,
}) {
  return (
    <section id={id} className="grid gap-6 max-w-2xl border-l u-hair pl-6">
      {heading && <Heading as={as}>{heading}</Heading>}
      <div className="grid gap-4">
        <Row label="Mechanism" body={mechanism} />
        <Row label="Symptom" body={symptom} />
        <Row label="Catch it in week one" body={catchEarly} />
      </div>
      {image ? (
        <figure className="grid gap-2">
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
      ) : (
        <Placeholder
          ratio="3x2"
          treatment="FLOAT"
          label="Documental photo — a person doing this reconciliation work"
        />
      )}
    </section>
  );
}

function Row({ label, body }) {
  return (
    <div className="grid gap-1">
      <span className="t-small u-muted">{label}</span>
      <p className="t-body u-ink">{body}</p>
    </div>
  );
}
