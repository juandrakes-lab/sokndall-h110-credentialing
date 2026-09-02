import React from "react";

/* "Trusted by 500+ businesses across the USA" over a row of partner names.
   Names are set in muted type — no third-party logo files ship with this system. */
export function LogoWall({ caption = "Trusted by 500+ businesses across the USA", names = [], tone = "light", style, ...rest }) {
  const dark = tone === "dark";
  return (
    <div style={{ ...style }} {...rest}>
      {caption ? (
        <div style={{ font: "var(--type-small)", fontWeight: "var(--fw-medium)", color: dark ? "var(--text-body-on-dark)" : "var(--text-muted)" }}>
          {caption}
        </div>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-9)", marginTop: "var(--space-5)", flexWrap: "wrap" }}>
        {names.map((n) => (
          <span
            key={n}
            style={{
              font: "var(--font-display)", fontSize: "var(--fs-h5)", fontWeight: "var(--fw-semibold)",
              color: dark ? "rgba(255,255,255,.6)" : "var(--ink-300)", letterSpacing: "var(--ls-heading)",
            }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
