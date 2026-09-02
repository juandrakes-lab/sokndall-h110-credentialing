import React from "react";
import { Card } from "../core/Card.jsx";
import { IconCircle } from "../core/IconCircle.jsx";
import { ArrowLink } from "../core/ArrowLink.jsx";

export function ServiceCard({
  icon, title, body, linkLabel = "Learn More", href = "#", tone = "dark", style, ...rest
}) {
  const dark = tone === "dark";
  return (
    <Card
      tone={tone}
      interactive
      pad="var(--space-8)"
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", ...style }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <IconCircle icon={icon} tone="white" />
        <h4 style={{ font: "var(--type-h4)", color: dark ? "var(--white)" : "var(--text-heading)", margin: 0 }}>
          {title}
        </h4>
      </div>
      <p style={{ font: "var(--type-small)", color: dark ? "var(--text-body-on-dark)" : "var(--text-body)", margin: 0, flex: 1, textWrap: "pretty" }}>
        {body}
      </p>
      {linkLabel ? <ArrowLink href={href} tone={dark ? "onDark" : "default"}>{linkLabel}</ArrowLink> : null}
    </Card>
  );
}
