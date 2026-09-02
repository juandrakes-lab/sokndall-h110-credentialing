import React from "react";

const TONES = {
  sage: { bg: "var(--sage-100)", fg: "var(--sage-ink)" },
  gold: { bg: "var(--gold-500)", fg: "var(--ink-900)" },
  forest: { bg: "var(--forest-800)", fg: "var(--white)" },
  neutral: { bg: "var(--ink-050)", fg: "var(--ink-700)" },
  onDark: { bg: "var(--forest-card)", fg: "var(--paper)" },
};

export function Badge({ children, tone = "sage", style, ...rest }) {
  const c = TONES[tone] || TONES.sage;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "3px 10px", borderRadius: "var(--radius-pill)",
        font: "var(--type-eyebrow)", fontWeight: "var(--fw-semibold)",
        background: c.bg, color: c.fg, ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
