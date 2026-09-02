# Sokndall Design System

Sokndall is an accounting & advisory firm serving individuals and small-to-mid
businesses across the USA. The public face is a marketing site whose job is to
feel **trustworthy, plain-spoken and warm** — a firm that removes worry rather
than one that performs cleverness. The visual language: deep forest green for the
editorial sections and the primary action, a single warm gold for the one CTA
that matters most, cream paper everywhere else, soft sage pill labels, rounded
geometric type, and real photography of people at work.

## Sources supplied

| Source | What it gave us |
|---|---|
| Reference comp (screenshot) | A full-page marketing homepage: hero, forest services section, "Simplifying Accounting" about block, footer. Palette, type scale, spacing rhythm, component inventory and layout were read from it. It is the **only** source. |

No codebase, Figma file, font binaries, logo files or photography were supplied.
Everything here is derived from that one comp; anything extrapolated beyond it is
labelled.

**Open items, flagged for the user:**
1. The comp is branded "Financial Partners". The brand is **Sokndall**, so the
   system is built as Sokndall and the mark is set in type — see `Wordmark`. No
   logo file exists; wherever a mark belongs, render `<Wordmark />`.
2. **Font is a substitution.** The comp's rounded geometric sans is matched with
   **Poppins** (Google Fonts). Swap for licensed files when available; keep the
   `--font-sans` token name.
3. **Icons are a substitution.** [Lucide](https://lucide.dev) line icons, from
   CDN. Drop real SVGs into `assets/` and swap the `<i data-lucide>` usage if a
   set arrives.
4. **Photography is placeholder.** `assets/imagery/` ships two SVG blocks at the
   right aspect ratios. See `assets/imagery/README.md`.

## Index

- `styles.css` — the single file consumers link. `@import`s only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
  `radius.css`, `elevation.css`, `motion.css`, `base.css`.
- `guidelines/` — 20 foundation specimen cards (Colors, Type, Spacing, Brand).
- `assets/imagery/` — `hero-team.svg`, `about-desk.svg` (placeholders).
- `components/` — 15 primitives:
  - `brand/` — **Wordmark**
  - `core/` — **Button**, **ArrowLink**, **Pill**, **Badge**, **Card**, **IconCircle**
  - `content/` — **SectionHeading**, **ServiceCard**, **FeatureItem**, **LogoWall**, **StatStrip**
  - `navigation/` — **NavBar**, **ScrollCue**
- `ui_kits/marketing-site/` — the homepage recreated from the primitives.
- `templates/marketing-homepage/` — the homepage as a static, framework-free HTML file.
- `index.js` — barrel export; consumers import from here.
- `_ds_bundle.js` — browser build of the components for the specimen cards / UI kit.
- `_ds_manifest.json` — inventory of tokens, components, cards, templates.
- `_adherence.oxlintrc.json` — lint rules that keep usage on-system.
- `SKILL.md` — portable Agent Skill wrapper.

Every component directory carries `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`
and one group `*.card.html`.

## Content fundamentals

**Voice.** Plain, reassuring, benefit-led. It talks about the client's outcome
("keep more of what you earn"), not the firm's process. Confident, never salesy.
No exclamation marks.

**Person.** "We" / "our" for the firm; "you" / "your" for the reader. The reader
is "individuals and businesses", "your team" — never "users".

**Headlines.** Four to seven words, Title Case, a promise about the reader's
future: "Smart Financial Solutions for a Stronger Tomorrow", "Simplifying
Accounting So You Can Focus on What Matters Most". One colour — no two-tone split.

**Eyebrows / pills.** A short phrase in Title or sentence case with one leading
emoji or icon: "🏆 Top-Rated Accounting & Advisory Firm in USA", "💛 We're Here To
Support Your Financial Success". Not uppercase, not letterspaced.

**Body.** One or two sentences, 12–24 words, often a triad ("save, grow, and
thrive"). Card copy is one sentence, 20 words or fewer.

**Buttons.** Verb-first, two to three words: "Get Free Consultation", "Schedule a
Call", "Explore All Services", "More About Us". Onward links: "Learn More ↗".

**Numbers.** Approximate, always with a "+" or "%": "500+ businesses", "98%
retention". Paired with a two-word label.

**Emoji.** One leading glyph in a Pill or eyebrow — deliberate. Never in body
copy, never in a headline.

**Words the brand uses:** smart, stronger, simplify, focus, trusted, accurate,
compliant, proactive, tailored, year-round, peace of mind.
**Words it avoids:** disrupt, revolutionary, game-changing, hustle, ninja, 10x,
effortless.

## Visual foundations

**Colour.** One brand green, one accent gold, one warm neutral ramp.
- Forest `--forest-800 #1c3a2a` fills the editorial sections and the primary
  button; `--forest-900` is its hover and the deepest gradient stop;
  `--forest-500` is the logo mark.
- Gold `--gold-500 #e8b84b` fills the single highest-emphasis action on a view and
  nothing else. Text on gold is `--ink-900`.
- Text is warm near-black, not pure black: `--ink-900` headings, `--ink-500` body.
- Surfaces are two values only: page `--paper #f6f8f3`, cards `#ffffff`. On forest
  sections, cards use `--forest-card`.
- Four pale tints (sage, gold, forest, cream) exist for icon backgrounds on light
  sections; the reference uses plain white circles.

**Type.** One family — Poppins. Display 56/1.08 at -0.02em semibold; H2 34/1.16;
H4 20/1.32; body 16/1.65; small 14; eyebrow 13 medium (Title case, barely
tracked); stat figures 30 semibold. Weights: 400, 500, 600, 700. No italics.

**Spacing & layout.** 4px base. 1200px container with 40px page padding. Sections
breathe at 104px (64px tight). Card padding 28px, card gap 24px. The header is
76px, sticky, desktop-only — it scrolls rather than wraps.

**Section layout.** A body block never runs alone across half a section — that
leaves ~280px of dead space on the right of every text section. The default shape
is **headline left, body right**. Which edge the body aligns to depends on its
height: measure H (eyebrow top → headline bottom) and B (body height) — if B
reaches H within ~24px the body starts level with the **eyebrow**; if it falls
well short it starts level with the **headline**, because a short body hung off
the pill ends high above the headline's baseline and reads as floating. If B
overruns H by more than its own height, centre the section instead. Where there is no second column of
copy, a schematic, photo or table fills it; a figure narrower than the container
sits *beside* its copy, not under a headline with white beside it. A statement is
a full-bleed band, never a rounded card floating inside a section. Parallel items
are a card grid that fills every row. An element narrower than the
container and with no copy to sit beside it (an accordion, a lone figure) is
centred, never pushed to the left margin. Closing sections are centred with the
CTA under the copy, and a section aligns one way throughout — no centred closing
line under left-aligned content. An eyebrow labels a section; it is never the
headline. Light sections carry an eyebrow; forest and dark sections do not.
See `guidelines/section-layout.html`.

**Backgrounds.** Flat `--paper` or flat white, except two gradients: a faint green
`--gradient-hero` glow behind the hero copy, and the top-to-bottom
`--gradient-dark` wash on the forest sections. The hero photo occupies the right
~54% behind a left-to-right paper scrim so the headline sits on near-solid paper.
No mesh, no blobs, no dot grids. A thin hand-drawn accent mark may sit just
outside a photo or section corner — used sparingly.

**Imagery.** Real people in real advisory moments — accountants with clients,
teams reviewing documents, over-the-shoulder at a laptop. Warm natural daylight,
business-casual to formal, approachable. Avoid cold colour casts, heavy filters,
dark low-key light and empty stock cliché.

**Transparent only when the image is anchored to a section seam.** Otherwise it is
a normal framed photo.
- *Anchored* (a figure standing on the boundary between two sections) — cut out on
  transparent, no frame: top at the content margin, bottom flush with the next
  section's edge; ~64px gutter to the text. Deliver on a plain white background,
  composed bottom-anchored.
- *Not anchored, light section* — a normal photo in a 16px rounded frame with a 1px
  hairline and a soft shadow, contained with normal margins. Fills the frame.
- *Dark / forest section* — contained and centred on an opaque tile: 1px hairline,
  top-right corner cut on a short diagonal, art inside ~16px padding.

See `guidelines/imagery.html`.

**Cards.** White fill, 1px `--border-card` hairline, **16px** radius, a wide soft
green-cast shadow. Buttons are 6px — nearly square. Only pills and icon circles
are fully round. Never a coloured left border, never a gradient fill.

**Shadows.** Four steps, all wide and soft, tinted with the brand green. No inset
shadows. Focus is a 3px forest 32%-alpha ring.

**Motion.** 180ms `cubic-bezier(.4,0,.2,1)` standard; 120ms colour-only; 280ms
shadow/transform. Cards lift `translateY(-3px)` on hover; buttons press to
`scale(0.985)`; the ArrowLink arrow slides 3px right. No bounce, no spring, no
scroll parallax, no looping motion.

## Iconography

**System:** Lucide line icons (CDN `unpkg.com/lucide@0.462.0`) — a flagged
substitution. Stroke-width 1.75, never filled. Colour: `--forest-800` inside
white circles, white on forest, `--forest-600` for check marks. Sizes: 22 in icon
circles, 16 in buttons, 13 in check chips, 18 in lists. The arrow in "Learn More
↗" is the Unicode glyph `&#8599;`, not an icon — it animates with the link.

**Emoji** appear only as the single leading glyph of a Pill or eyebrow.
