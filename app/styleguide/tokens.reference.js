/**
 * Reference values for the /styleguide scales. This file is EXCLUDED from the
 * marketing-system lint rules (see .eslintrc.json) for the sole reason that a
 * scale documentation page has to print the literal hex of each token. Nothing
 * here is used as a style value — the swatches render with token utilities
 * (bg-ink, bg-signal, …), and these strings are shown as text.
 */
export const COLOR_TOKENS = [
  { name: "ink", hex: "#0E2A2E", use: "dark section ground / text on light", cls: "bg-ink", onDark: false },
  { name: "ink-2", hex: "#1B4348", use: "second dark surface", cls: "bg-ink-2", onDark: false },
  { name: "rule", hex: "#3D6A6B", use: "hairline on dark", cls: "bg-rule", onDark: false },
  { name: "rule-light", hex: "#D6D3CA", use: "hairline on light + grey placeholder fill", cls: "bg-rule-light", onDark: true },
  { name: "paper", hex: "#F2F0EA", use: "light section ground", cls: "bg-paper", onDark: true },
  { name: "paper-2", hex: "#FFFFFF", use: "elevated surface on light", cls: "bg-paper-2", onDark: true },
  { name: "muted", hex: "#5F6E6E", use: "secondary text on light", cls: "bg-muted", onDark: false },
  { name: "muted-dark", hex: "#8FAEAE", use: "secondary text on dark", cls: "bg-muted-dark", onDark: false },
  { name: "signal", hex: "#C88A2E", use: "amber — signal only, never decoration", cls: "bg-signal", onDark: false },
];

export const TYPE_ROLES = [
  { role: "display", size: "44 / 36 mobile", leading: "1.1", cls: "t-display", note: "H1 of a landing only" },
  { role: "h1-editorial", size: "34 / 28", leading: "1.15", cls: "t-h1", note: "H1 of editorial + comparison" },
  { role: "h2", size: "24 / 22", leading: "1.25", cls: "t-h2", note: "" },
  { role: "h3", size: "18", leading: "1.35", cls: "t-h3", note: "" },
  { role: "body-landing", size: "16", leading: "1.55", cls: "t-body", note: "" },
  { role: "body-editorial", size: "17", leading: "1.6", cls: "t-body-editorial", note: "measure 70–75 char" },
  { role: "small", size: "14", leading: "1.5", cls: "t-small", note: "" },
  { role: "mono-data", size: "13", leading: "1.4", cls: "mono-data", note: "tabular-nums on — column figures only" },
];

// 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 — nothing outside this scale.
export const SPACE_STEPS = [
  { px: 4, cls: "h-1" },
  { px: 8, cls: "h-2" },
  { px: 12, cls: "h-3" },
  { px: 16, cls: "h-4" },
  { px: 24, cls: "h-6" },
  { px: 32, cls: "h-8" },
  { px: 48, cls: "h-12" },
  { px: 64, cls: "h-16" },
  { px: 96, cls: "h-24" },
  { px: 128, cls: "h-32" },
];
