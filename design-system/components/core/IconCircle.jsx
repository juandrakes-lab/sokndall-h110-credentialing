import React from "react";

const TONES = {
  white: { bg: "var(--white)", fg: "var(--forest-800)" },
  sage: { bg: "var(--tint-sage)", fg: "var(--tint-sage-ink)" },
  gold: { bg: "var(--tint-gold)", fg: "var(--tint-gold-ink)" },
  forest: { bg: "var(--forest-700)", fg: "var(--white)" },
};

/* The round icon holder from the service cards: a white disc with a forest line
   icon. Fully circular — the one fully-round shape besides pills. */
export function IconCircle({ icon, tone = "white", size = 56, style, ...rest }) {
  const c = TONES[tone] || TONES.white;
  return (
    <div
      style={{
        width: size, height: size, flex: "0 0 auto",
        display: "grid", placeItems: "center",
        background: c.bg, color: c.fg, borderRadius: "var(--radius-tile)",
        ...style,
      }}
      {...rest}
    >
      {typeof icon === "string"
        ? <i data-lucide={icon} style={{ width: Math.round(size * 0.4), height: Math.round(size * 0.4) }} />
        : icon}
    </div>
  );
}
