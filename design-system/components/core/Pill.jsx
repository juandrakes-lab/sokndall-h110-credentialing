import React from "react";

/* The comp's signature eyebrow: a fully-rounded sage chip with one leading glyph.
   Sentence/Title case — never uppercase, never letterspaced. */
export function Pill({ children, icon, tone = "sage", style, ...rest }) {
  const dark = tone === "dark";
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
        padding: "6px 14px 6px 12px", borderRadius: "var(--radius-pill)",
        font: "var(--type-eyebrow)", letterSpacing: "var(--ls-eyebrow)",
        background: dark ? "rgba(255,255,255,.10)" : "var(--sage-100)",
        color: dark ? "var(--white)" : "var(--sage-ink)",
        border: dark ? "1px solid var(--border-on-dark)" : "1px solid transparent",
        ...style,
      }}
      {...rest}
    >
      {icon ? <span aria-hidden="true" style={{ fontSize: "1.05em", lineHeight: 1 }}>{icon}</span> : null}
      {children}
    </span>
  );
}
