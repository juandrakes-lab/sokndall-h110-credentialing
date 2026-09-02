import React from "react";

/* A row of proof figures with hairline dividers. Numbers are approximate, always
   carry a "+", and pair with a two-word label. */
export function StatStrip({ stats = [], tone = "light", style, ...rest }) {
  const dark = tone === "dark";
  return (
    <div
      style={{
        display: "grid", gridTemplateColumns: "repeat(" + Math.max(stats.length, 1) + ",1fr)",
        ...style,
      }}
      {...rest}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            padding: "0 var(--space-7)",
            borderLeft: i ? "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-hairline)") : "none",
          }}
        >
          <div style={{ font: "var(--font-display)", fontSize: "var(--fs-stat)", fontWeight: "var(--fw-semibold)", color: dark ? "var(--white)" : "var(--text-heading)", lineHeight: 1.1, letterSpacing: "var(--ls-heading)" }}>
            {s.value}
          </div>
          <div style={{ font: "var(--type-small)", color: dark ? "var(--text-body-on-dark)" : "var(--text-body)", marginTop: 4 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
