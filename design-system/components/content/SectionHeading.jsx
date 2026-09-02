import React from "react";
import { Pill } from "../core/Pill.jsx";

/* Pill eyebrow + a single-colour display headline + optional supporting line.
   Unlike a two-tone split heading, the reference keeps the whole headline one colour. */
export function SectionHeading({
  eyebrow, eyebrowIcon, title, description, size = "h2", align = "left", tone = "light", style, ...rest
}) {
  const dark = tone === "dark";
  const font = size === "display" ? "var(--type-display)" : "var(--type-h2)";
  const ls = size === "display" ? "var(--ls-display)" : "var(--ls-heading)";
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", gap: "var(--space-4)",
        textAlign: align, alignItems: align === "center" ? "center" : "flex-start",
        maxWidth: 640, ...style,
      }}
      {...rest}
    >
      {eyebrow ? <Pill icon={eyebrowIcon} tone={dark ? "dark" : "sage"}>{eyebrow}</Pill> : null}
      <h2 style={{ font, letterSpacing: ls, color: dark ? "var(--white)" : "var(--text-heading)", margin: 0, textWrap: "balance" }}>
        {title}
      </h2>
      {description ? (
        <p style={{ font: "var(--type-body)", color: dark ? "var(--text-body-on-dark)" : "var(--text-body)", margin: 0, maxWidth: 460, textWrap: "pretty" }}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
