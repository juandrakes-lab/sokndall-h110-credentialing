# Design tokens — Sokndall home

Extracted from `components/neo/neo.css`, where every value is declared on the
`.sokndall-neo` scope root. This file is the export, not the source: change a
value in `neo.css` first and copy it here.

Scope: the marketing home. The authenticated app runs on its own Tailwind
`@theme` in `app/globals.css` and shares nothing with this file.

---

## 1. Colour

Text is binary — **black on a light surface, white on a dark one** — with one
exception: `.sk-stat` ("60 days") keeps `--ink`. Gradients: one hue only, on buttons and as a glow on dark blocks (DESIGN_RULES §17, 2026-09-11).

### Grounds and surfaces

| Token | Value | Role |
|---|---|---|
| `--card` | `#FFFFFF` | Light section ground **and** white card |
| `--paper` | `#F2F0EA` | Grey card fill — never a section ground |
| `--ink` | `#0E2A2E` | Dark section ground; the inset rounded blocks |
| `--ink-2` | `#1B4348` | Second dark surface (pill on a dark band) |

### Text

| Token | Value | Role |
|---|---|---|
| `--black` | `#000000` | All text on a light surface |
| `--body` | → `--black` | Alias. The old `#243334` step is retired. |
| `--muted` | → `--black` | Alias. The old `#5F6E6E` microcopy step is retired. |
| `--muted-dark` | `#FFFFFF` | All text on a dark surface |
| `--ink` | `#0E2A2E` | Used as text in exactly one place: `.sk-stat` |

### Accent and borders

| Token | Value | Role |
|---|---|---|
| `--amber` | `#C88A2E` | Primary CTA, and states that need action |
| `--line` | `rgba(14, 42, 46, 0.075)` at `--hairline: 1px` (was 0.03 / 0.25px until 2026-09-11) | Card outline on a light surface — meant to be seen |
| `--line-strong` | `rgba(14, 42, 46, 0.22)` | Ghost-button border, dashed placeholder |
| `--rule-dark` | `#3D6A6B` | Hairline on a dark surface |
| `--rule-dark-2` | `rgba(61, 106, 107, 0.55)` | Softer hairline on a dark surface |
| `--tint` | `rgba(14, 42, 46, 0.05)` | Nested light surface |
| `--tint-2` | `rgba(14, 42, 46, 0.08)` | Reserved image ground inside a grey card |
| `--amber-tint` | `rgba(200, 138, 46, 0.14)` | The only amber *tint* — action-state cells |
| `--amber-hi` | `color-mix(--amber 72%, white)` | Light end of the CTA's one-hue gradient (2026-09-11) |
| `--accent` | → `--rule-dark` (`#3D6A6B`) | **Role, added 2026-09-11 — not a new colour.** The brand family's mid tone on light surfaces: icons, list dots, `.sk-stat`, the rule beside a section's closing line. 6.0:1 on white; never body text |

### Where amber is allowed

1. `.sk-btn--primary` and `.sk-nav__cta` — the same CTA, on any surface.
2. Action states, as **fill and border only**: the matrix's `--action` /
   `--urgent` cells and their legend swatches. The text on them is `--ink`.
3. The focus ring.

It is not an ordinal, a bullet, a wordmark accent, an eyebrow or a
current-page marker. The eyebrow pill is `--ink` with a white label
(`--ink-2` on a dark band, so it separates from its ground).

### Status tokens

Two states: neutral, or needs action. Every status also carries a glyph and a
written label, so removing colour loses nothing.

| Token | Resolves to |
|---|---|
| `--ok` / `--ok-bg` | `--ink` / `--tint` |
| `--warn` / `--warn-bg` | `--amber` / `--amber-tint` |
| `--stop` / `--stop-bg` | `--amber` / `--amber-tint` |

### Contrast

Measured (WCAG 2.1 relative luminance), not estimated.

| Pair | Ratio | Verdict |
|---|---|---|
| `--black` on `--card` | 21.0:1 | Text on white |
| `--black` on `--paper` | 17.9:1 | Text on a grey card |
| `#FFFFFF` on `--ink` | 15.1:1 | Text on the dark band |
| `#FFFFFF` on `--ink-2` | 10.8:1 | Text on the second dark surface |
| `--ink` on `--card` | 15.1:1 | `.sk-stat` |
| `--ink` on `--amber` | 5.1:1 | **Why the CTA's label is ink, not white** |
| `#FFFFFF` on `--amber` | 2.9:1 | Fails. Never used. |
| `--amber` as text on `--card` | 2.7:1 | Fails. **Amber is a fill, never text on light.** |

That last row is a constraint, not a footnote: action states take an amber fill
plus an amber border and write on it in ink.

---

## 2. Typography

Two families, both via `next/font/google` in `components/neo/Shell.jsx` —
self-hosted, no render-blocking request, no layout shift. The variables are
attached to the `.sokndall-neo` wrapper, not to `<html>`, so nothing outside
the skin changes family.

| Token | Family | Use |
|---|---|---|
| `--sans` | `var(--font-geist)` → **Geist** | Everything |
| `--mono` | `var(--font-geist-mono)` → **Geist Mono** | Figures, via `.sk-num` |

Fallbacks: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
and `ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`.

| Role | Class | Size | Line height | Weight | Tracking |
|---|---|---|---|---|---|
| Hero H1 | `.sk-display` | `clamp(2.5rem, 1.15rem + 5.8vw, 4.5rem)` — 40→72px | 0.98 | 600 | −0.042em |
| Section heading | `.sk-h2` | `clamp(2.25rem, 1.3rem + 3vw, 3.375rem)` — 36→54px (was 40→65px until 2026-09-11) | 1.04 | **400** | −0.036em |
| Large card title | `.sk-h3` | `clamp(1.375rem, 1.15rem + 0.95vw, 1.75rem)` — 22→28px | 1.14 | 600 | −0.026em |
| Card title | `.sk-h4` | `1.125rem` — 18px | 1.24 | 600 | −0.020em |
| Figure | `.sk-stat` | `clamp(3.4375rem, 1.75rem + 6.5vw, 5.3125rem)` — 55→85px | 0.94 | 400 | −0.045em |
| Lead / intro | `.sk-lead` | `clamp(1rem, 0.94rem + 0.3vw, 1.125rem)` — 16→18px | 1.58 | 400 | — |
| Body (large) | `.sk-body--lg` | `1rem` — 16px | 1.60 | 400 | — |
| Body | `.sk-body` | `0.9375rem` — 15px | 1.62 | 400 | — |
| Caption | `.sk-small` | `0.8125rem` — 13px | 1.50 | 400 | — |
| Micro / eyebrow | `.sk-micro` | `0.6875rem` — 11px | 1.40 | 600 | +0.04em, uppercase |
| Figures | `.sk-num` | inherits | — | — | −0.010em, Geist Mono, tabular |

**Only `.sk-h2` is set at regular weight.** The hero display and the in-card
headings keep semibold; they were never in scope for that change. `.sk-stat` is
sans, not mono — it carries a unit word beside the figure and a monospace
advance spaces that word badly.

---

## 3. Spacing

One 8px ramp. Sections take their rhythm from `--sec-y` and nothing else.

| Token | Value |
|---|---|
| `--s-1` | `4px` |
| `--s-2` | `8px` |
| `--s-3` | `12px` |
| `--s-4` | `16px` |
| `--s-5` | `24px` |
| `--s-6` | `32px` |
| `--s-7` | `48px` |
| `--s-8` | `64px` |
| `--s-9` | `96px` |
| `--s-10` | `128px` |

### Composite

| Token | Value | Role |
|---|---|---|
| `--sec-y` | `clamp(64px, 7vw, 112px)` | Vertical padding on every band — the only section rhythm value |
| `--head-y` | `clamp(32px, 3.6vw, 56px)` | Section head → section body |
| `--gap` | `var(--s-4)` = 16px | Grid gutter |
| `--card-pad` | `clamp(20px, 2.4vw, 30px)` | `.sk-card--pad`, and what a bleeding child cancels |

### Layout

| Token | Value | Role |
|---|---|---|
| `--maxw` | `1200px` | Measure, held by `.sk-wrap` |
| `--page-x` | `clamp(8px, 1.6vw, 22px)` (halved 2026-09-11) | A dark block's margin from the page edge |
| `--light-x` | `clamp(34px, 7.2vw, 100px)` (fixed since 2026-09-11) | Inset on a white section |
| `--pad-x` | `calc(var(--light-x) - var(--page-x))` | Inner padding inside a block — absorbs what the smaller margin gave back, so copy does not move |

A dark block insets by `--page-x` then pads by `--pad-x`; a light section has
no block, so it insets by the sum. That is what keeps a paragraph in a white
section optically aligned with one inside a dark block.

Fixed hero spacing: `--s-9` (96px) nav bar → H1, `--s-7` (48px) H1 → subhead
and subhead → CTA row.

### Values that are deliberately not on the scale

Sub-16px measurements inside small components are **component metrics**, not
spacing steps: a 6px status dot, 5px/9px pill padding, the 3px gap between a
glyph and its label, 22px and 26px icon boxes. Snapping them to the scale would
change the design; giving each a token would add indirection without meaning.
They stay as literals.

### The specificity rule that makes the scale work

The element reset carries **zero** specificity:

```css
:where(.sokndall-neo) :where(p, h1, h2, h3, h4, ul, ol, dl, dd, figure) { margin: 0; }
```

Written plainly as `.sokndall-neo p { margin: 0 }` it is (0,1,1) and outranks
every single-class spacing rule at (0,1,0) — so every `margin-top` on a
paragraph, heading or list is silently dropped and the vertical rhythm reads as
arbitrary no matter what the scale says. Keep the `:where()`.

---

## 4. Radius

| Token | Value | Applied to |
|---|---|---|
| `--r-block` | `28px` | A dark section — the inset rounded block |
| `--r-panel` | `16px` | The hero's figure container |
| `--r-card` | `14px` | Cards, FAQ rows, the bleeding reserved image |
| `--r-inner` | `8px` | Nested surfaces, matrix cells |
| `--r-btn` | `6px` | Buttons |
| `--r-xs` | `4px` | The matrix legend swatch |
| `--r-pill` | `999px` | Pills, status marks, chips, the plan tag |

---

## 5. Elevation

Every light card carries a `var(--hairline)` `--line` outline **and** a shadow.
The hairline holds the edge at any zoom; the shadow gives depth and says which
kind of surface the card is.

| Token | Value | Applied to |
|---|---|---|
| `--sh-white` | `0 1px 2px rgba(14,42,46,.035), 0 8px 16px -6px rgba(14,42,46,.08), 0 22px 40px -12px rgba(14,42,46,.115)` | White cards — lit from above: the offset drops and the blur widens, so there is more shadow beneath the card than around its top |
| `--sh-grey` | → `--sh-white` (2026-09-11) | Grey cards take the same elevation as white ones: the same card no longer changes depth with its colour |
| `--sh-on-ink` | `0 2px 4px rgba(0,0,0,.207), 0 10px 24px -8px rgba(0,0,0,.391)` | Cards inside a dark block — same light direction, read in black |

`--sh-card` and `--sh-float` are aliases of `--sh-white`, kept for the pages
that have not been rebuilt.

### The hairline

| Token | Value |
|---|---|
| `--hairline` | `0.25px` |
| `--line` | `rgba(14, 42, 46, 0.03)` |

Its weight is spent in two places and has to be. A border cannot render thinner
than one device pixel, so on a 1x display `0.25px` is floored to `1px` and the
width does nothing — the alpha carries it there. At 2x and above the sub-pixel
width bites as well. The two move together, keeping their ratio
(`0.75px`/`0.09` → `0.5px`/`0.06` → `0.25px`/`0.03`). Move one without the
other and only half the displays see it. At `0.03` the outline is at the
threshold of visibility — that is the intent.

**White versus grey is a hierarchy signal**, not decoration. In section 2 the
reserved block and the row cards are white against the section's own white;
in section 3 the two grey columns hold the supporting layers and the white
column holds the one the product automates.

---

## 6. Surfaces

The page is the full width of the viewport and it is white. Every light section
is white; there are no grey section grounds and no rules between sections — the
separation is the vertical margin. Grey survives only as a card fill.

| Class | Treatment |
|---|---|
| `.sk-band--card` / `.sk-band--paper` | White, `padding-inline: var(--light-x)` |
| `.sk-band--ink` | `--ink` block, `margin-inline: var(--page-x)`, `border-radius: var(--r-block)` |
| `.sk-band--ink-2` | Same, on `--ink-2` |
| `.sk-hero` | **Exception** — full-bleed and square |
| `.sk-footer` | **Exception** — full-bleed and square |

The hero and the footer bookend the page and run edge to edge; only the dark
sections *inside* the page float as rounded blocks. Both exceptions still inset
their copy by `--light-x`, so every line on the page shares one left edge.

Band order: ink (hero, full-bleed) → white ×3 → ink block → white ×3 → ink
block → ink (footer, full-bleed).

---

## 7. Reserved visual slots

Placeholders for artwork that does not exist yet are declared with a fixed
aspect ratio, so dropping the real thing in later cannot reflow its
neighbours.

| Slot | Ratio | State |
|---|---|---|
| Hero, right column (`.sk-hero__media`) | 4:3 | Occupied by the provider × payer schematic |
| Section 2, left block (`.sk-slot--grey`) | takes its height from the cards beside it | Empty, filled grey |
| Section 3, inside the wide card (`.sk-quad__img`) | 3:2 | Empty. Bleeds to the card's left, right and bottom edges — its negative margins cancel `--card-pad` exactly — and stays rounded on all four corners. |
| Section 3, column three lower (`.sk-slot--card`) | fills the second row | Empty, white |
