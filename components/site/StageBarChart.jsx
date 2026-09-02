// A qualitative horizontal duration chart — real HTML/CSS, not a photo or a
// mockup. Used where the copy names a concrete duration comparison and a
// line makes the size difference obvious faster than the sentence does (the
// hub's six stages, Medicare's stated-vs-realistic range).
//
// rows: [{ label, range, weight, long?, tiny? }]
//   label  — the stage/segment name, shown at the left
//   range  — the real stated range in words ("Weeks to months"), printed
//            inside the bar — never a fabricated day count
//   weight — 0–1, the bar's relative width. Illustrative, not measured: it
//            encodes which stage the copy says dominates, nothing more
//            precise than that.
//   long   — true marks the bar that dominates (rust tone instead of green)
//   tiny   — true keeps the label legible when the bar is very short by
//            setting it in dark text instead of white

export default function StageBarChart({ rows, caption }) {
  return (
    <figure className="lp-barchart">
      {rows.map((r) => (
        <div key={r.label} className={"lp-barchart-row" + (r.long ? " is-long" : "") + (r.tiny ? " is-tiny" : "")}>
          <span className="lb">{r.label}</span>
          <div className="lp-barchart-track">
            <div className="lp-barchart-fill" style={{ width: Math.max(r.weight, 0.08) * 100 + "%" }}>
              <span>{r.range}</span>
            </div>
          </div>
        </div>
      ))}
      {caption && <figcaption className="lp-a-caption" style={{ marginTop: 16 }}>{caption}</figcaption>}
    </figure>
  );
}
