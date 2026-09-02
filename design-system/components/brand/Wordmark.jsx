import React from "react";

/* No logo file was supplied with the reference comp, so the mark IS the name,
   set in the brand sans, uppercase, tight tracking. Do not substitute a drawn glyph. */
export function Wordmark({ size = 22, color, tone = "ink", as = "span", className, style, ...rest }) {
  const Tag = as;
  const resolved =
    color ||
    (tone === "inverse" ? "var(--white)" : tone === "accent" ? "var(--forest-600)" : "var(--ink-900)");
  return (
    <Tag
      className={className}
      style={{
        display: "inline-block",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--fw-bold)",
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: resolved,
        ...style,
      }}
      {...rest}
    >
      Sokndall
    </Tag>
  );
}
