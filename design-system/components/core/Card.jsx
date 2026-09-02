import React from "react";

/* White surface, hairline border, 16px corner, wide soft shadow.
   tone="dark" swaps to the forest-card surface used for the service-card row. */
export function Card({ children, interactive = false, elevation = "card", tone = "light", pad, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const dark = tone === "dark";
  const shadow =
    elevation === "none" ? "none"
    : elevation === "float" ? "var(--shadow-float)"
    : elevation === "panel" ? "var(--shadow-panel)"
    : "var(--shadow-card)";
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: dark ? "var(--surface-dark-card)" : "var(--surface-card)",
        border: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-card)"),
        borderRadius: "var(--radius-card)",
        padding: pad || "var(--card-pad)",
        color: dark ? "var(--text-body-on-dark)" : "var(--text-body)",
        boxShadow: dark ? "none" : interactive && hover ? "var(--shadow-card-hover)" : shadow,
        transform: interactive && hover ? "var(--lift-hover)" : "none",
        transition: "var(--transition-card)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
