import Heading from "./primitives/Heading";

/**
 * 3.4 AlertLadder — the 90 / 60 / 30 / 14 / 7 thresholds with what to do at
 * each. 90 is deliberately neutral: there is nothing to do yet, and that
 * neutrality is the point — it is not "improved" with colour (CATALOGO §3.4).
 * The day column is mono (it lines up). Amber only on steps that require
 * action now.
 * Image policy: prohibida.
 */
export default function AlertLadder({ as = "h2", id, heading, steps = [] }) {
  return (
    <section id={id} className="grid gap-4 max-w-2xl">
      {heading && <Heading as={as}>{heading}</Heading>}
      <ol className="grid">
        {steps.map((s, i) => (
          <li
            key={s.day}
            className={`flex gap-4 py-4 ${i > 0 ? "border-t u-hair" : ""}`}
          >
            <span className="mono-data u-muted">{s.day}</span>
            <div className="grid gap-1">
              <span className={`t-small ${s.action ? "text-signal" : "u-ink"}`}>
                {s.label}
              </span>
              <p className="t-body u-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
