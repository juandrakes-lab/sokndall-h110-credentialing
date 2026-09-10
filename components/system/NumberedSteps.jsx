import Heading from "./primitives/Heading";

/**
 * 3.2 NumberedSteps — H2 + ordered stages with name, description, optional
 * duration. Numbered only because the content genuinely is a sequence.
 * The 01/02/03 column is mono (it lines up vertically). Durations are prose.
 * Image policy: prohibida.
 */
export default function NumberedSteps({ as = "h2", id, heading, steps = [] }) {
  return (
    <section id={id} className="grid gap-6">
      {heading && <Heading as={as}>{heading}</Heading>}
      <ol className="grid max-w-2xl">
        {steps.map((s, i) => (
          <li
            key={s.name}
            className={`flex gap-4 py-4 ${i > 0 ? "border-t u-hair" : ""}`}
          >
            <span className="mono-data u-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="grid gap-1">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="t-small u-ink">{s.name}</span>
                {s.duration && (
                  <span className="t-small u-muted">{s.duration}</span>
                )}
              </div>
              <p className="t-body u-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
