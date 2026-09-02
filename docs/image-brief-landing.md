# Landing — image slots (Phase 3)

6 slots, 3 treatments. Containers are **fluid** — no fixed px heights. The sizes
below are the desktop render (viewport ≥ 1280, container inner = 1184px); what to
lock is the **aspect ratio**. Deliver at 2× for retina.

§7 Scope carries **no image** — its four points are a 2×2 card grid.

## The rule

**Transparent (white background, cut out) ONLY when the image is anchored to a
section seam. Everything else is a normal framed photo.**

- **BLEED** — light section, transparent cut-out. Top edge starts at the section's
  content margin (level with the eyebrow, 96px down); bottom edge is anchored
  **flush with the seam** of the next section, so the subject stands on the
  boundary. 64px gutter to the text column. → deliver as **transparent PNG on a
  plain white background**, composed **bottom-anchored**.
- **FRAMED** — light section, not anchored. A normal photo in a 16px rounded
  frame, hairline border + soft shadow, contained in its column. → deliver as a
  **normal photo that fills the frame**; no transparency, no white-background
  requirement.
- **TILE** — the dark forest section. Opaque line icon, contained and centred on a
  solid forest tile with a diagonal top-right cut.

## Slots

| Slot | Section | Treatment | Render size | Aspect to lock | Deliver (1× / 2×) | Format |
|---|---|---|---|---|---|---|
| `hero-photo` | 1 · Hero | **BLEED** → stands on the seam with §2 | **480 × 620** | **~3 : 4** vertical | 480 × 620 / 960 × 1240 | transparent PNG, white bg, bottom-anchored |
| `positioning-visual` | 2 · Positioning | **FRAMED** photo | **520 × 347** | **3 : 2** | 520 × 347 / 1040 × 694 | normal photo, fills the frame |
| `problem-diagram` | 3 · The problem | **BLEED** → flush with the dark band | **416 × 755** | **~5 : 9** tall | 416 × 755 / 832 × 1510 | transparent PNG, white bg, bottom-anchored |
| `icon-credentials` | 4 · Three things | **TILE** | art **331 × 331** (tile 365) | **1 : 1** | 331 × 331 / 662 × 662 | transparent PNG line icon |
| `icon-applications` | 4 · Three things | TILE | art 331 × 331 (tile 365) | 1 : 1 | 331 × 331 / 662 × 662 | transparent PNG line icon |
| `icon-followup` | 4 · Three things | TILE | art 331 × 331 (tile 365) | 1 : 1 | 331 × 331 / 662 × 662 | transparent PNG line icon |

**Both BLEED images are composed bottom-anchored** — the subject sits on the
bottom edge of the frame, with whatever headroom is needed above. If the delivered
art is shorter than the column it stays glued to the seam and leaves space at the
top; that is intended.

`hero-photo` is the only slot that needs a real photo model (it is a person).
`positioning-visual` is a photo too. `problem-diagram` and the three `icon-*` are
schematic — better hand-built as on-brand SVG than generated.

## Generation prompts

### `hero-photo` — BLEED, transparent, white background
```
create a high fidelity full-length editorial photograph of a calm, focused woman in her early 40s, a credentialing specialist at a small US medical practice, standing and glancing down at a printed provider roster she holds in one hand, a slim closed laptop tucked under the other arm, business-casual wardrobe (fine-knit blazer over a plain top, tailored trousers, flat shoes), natural relaxed posture, candid, not looking at camera, plain seamless pure-white studio background, bright even natural daylight with a soft directional key light from camera-left and a subtle rim light separating her hair from the white, gentle contrast, only a small soft contact shadow under her shoes, shot on a 50mm lens at eye level, body turned about 20 degrees toward frame-left, full figure with clear headroom above and feet near the bottom edge of the frame, muted warm-neutral colour palette, clean fashion-editorial finish, crisp focus throughout, no logos, no text
```
Deliver vertical **3:4**, ~1080×1440 (2×). Feet near the bottom edge, headroom
above. White seamless bg, hair rim-lit, no cast shadow on the backdrop → clean
background removal.

### `positioning-visual` — FRAMED, normal photo (no white bg)
```
create a high fidelity editorial photograph of a small US medical-practice front office, one person in their 30s–40s working at a reception/admin desk mid-task — a printed roster and folders on the desk, an open laptop, a landline phone — glancing down at the paperwork, not looking at camera, natural room setting with a window out of frame, bright warm natural daylight, soft directional key from the window side, gentle contrast, shallow-to-medium depth of field with the background softly out of focus, shot on a 35mm lens at a slight 3/4 angle, medium shot framing the person and their immediate desk, muted warm-neutral palette, calm and ordinary, clean editorial finish, no visible logos or brand names, no text
```
Deliver **3:2** landscape, ~1040×694 (2×). Normal photo — it sits inside a rounded
frame with a soft shadow, so no transparency and no white-background needed.

### `problem-diagram` — BLEED, transparent, vertical (better as SVG)
```
create a clean minimal flat vector illustration on a plain white background, a tall vertical timeline running top to bottom: a thin vertical track with five evenly spaced node dots, the progress fill stops at about 40% from the top leaving the lower track empty, a small circular date marker sits stalled just past a horizontal "due" line, a faint dotted gap continues below it, uniform 2px strokes, deep forest green (#2f5d3f) line art, a single muted rust (#b4453c) accent only on the stalled marker, abundant vertical white space, no people, no gradients, no shadows, editorial infographic style, vertical aspect around 5:9, composed so the stalled marker sits in the lower third
```
Deliver **vertical ~5:9**, ~880×1500 (2×), bottom-weighted.

### `icon-credentials` / `icon-applications` / `icon-followup` — TILE (better as SVG)
Base:
```
create a single minimal line icon, one uniform ~2px stroke weight, rounded caps, no fill, centered on a transparent background, no background shape, no shadow, monochrome black (will be recolored), designed on a 64px grid, legible at small size —
```
- `icon-credentials`: `…a calendar page with one date circled.`
- `icon-applications`: `…a document sheet with a pause symbol (two short vertical bars) overlaid on it.`
- `icon-followup`: `…a short weekly calendar strip with one day marked, next to a small envelope.`

Deliver **1:1**, ~660×660 (2×), transparent.

## Dropping real images in (`Landing.jsx`)

Files go in `public/landing/`. Replace the `<ImgSlot .../>` call:

- **bleed** — inside the existing `<div className="lp-img-bleed">`:
  `<img className="lp-img" src="/landing/hero-photo.png" alt="…" />`
- **framed** — `<div className="lp-img-framed"><img className="lp-img" src="/landing/positioning-visual.jpg" alt="…" /></div>`
- **tile** — `<div className="lp-imgtile"><img className="lp-img" src="/landing/icon-credentials.png" alt="…" /></div>`

`.lp-img` is `width:100%; height:auto`, so the container takes the image's real
proportions. Inside a bleed the image is `height:100%; object-fit:contain;
object-position:bottom`.
