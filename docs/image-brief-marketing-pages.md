# Image slots — /pricing, /payer-enrollment-software, /credential-expiration-tracking

**Status: all three placed (2026-08-29).** `public/pages/enrollment-hero.png`,
`expiration-hero.png`, `pricing-comparison.png` — 1.5–2.0 MB PNG each, same
`next/image`/WebP conversion debt as the landing's three images (tracked
together, see `no-img-element` lint warnings). The two BLEED photos ended up
framed waist-up rather than full-length (a deliberate change from the original
brief, made when writing the generation prompts) — the waist crop lands cleanly
on the section seam, so the mechanics below still hold.

Companion to `app/landing/IMAGE-BRIEF.md`, which covers `/landing`. Same three
treatments, same rule, same delivery standard.

**The rule (unchanged):** transparent, cut-out art *only* when the image is
anchored to a section seam. Everything else is a normal framed photo.

## Why there are only three photos across three pages

Every other visual on these pages is a real HTML/CSS schematic, not art:

| Page | Schematic | What it actually shows |
|---|---|---|
| /pricing | Billing Co client grid + roll-up | Six isolated client organizations and the one cross-client digest number they add up to (23 / 4) |
| /payer-enrollment-software | Enrollment timeline | One application plotted on a 190-day track: submitted day 0, the payer's stated 60–120 day window, effective date at day 182 |
| /payer-enrollment-software | Follow-up log | Four real log lines — date, who was reached, what they said, reference number |
| /payer-enrollment-software | Matrix, 12 × 10 | The home matrix component, scaled |
| /credential-expiration-tracking | Derived status | One entered date in, five credentials out, each with its own derived state and day count |
| /credential-expiration-tracking | Alert ladder | 90 / 60 / 30 / 14–7, with what you do at each |
| /credential-expiration-tracking | Monday digest | The email itself, with counts |
| /credential-expiration-tracking | Multi-state rows | One provider, six state licenses, six dates, six states |

Each of those represents something concrete and would be *weaker* as a drawing.
An abstract "boundary" graphic or an org chart would have gone in the same slots
and said nothing — so they were not used.

## The three photo slots

Containers are fluid. Sizes below are the desktop render at 1280 viewport
(container inner 1184). Lock the aspect ratio, deliver at 2×.

| Slot | Page · section | Treatment | Render size | Aspect | Deliver (1× / 2×) | Format |
|---|---|---|---|---|---|---|
| `pricing-comparison` | /pricing · 4 Cost per provider | **FRAMED** | 497 × 497 | **1 : 1** | 500 × 500 / 1000 × 1000 | normal photo, fills the frame |
| `enrollment-hero` | /payer-enrollment-software · 1 Hero | **BLEED** → stands on the seam with §2 | 460 × 501 | **3 : 4** vertical | 460 × 615 / 920 × 1230 | transparent PNG, white bg, bottom-anchored |
| `expiration-hero` | /credential-expiration-tracking · 1 Hero | **BLEED** → stands on the seam with §2 | 440 × 473 | **3 : 4** vertical | 440 × 587 / 880 × 1175 | transparent PNG, white bg, bottom-anchored |

Both BLEED images are composed **bottom-anchored** — subject on the bottom edge,
headroom above. Art shorter than the column stays glued to the seam; that is
intended.

## Generation prompts

### `pricing-comparison` — FRAMED, normal photo (no white background)

```
create a high fidelity editorial photograph of a practice manager in her 40s at a
small US medical practice back office, seated at a desk mid-task, comparing a
printed invoice held in one hand against a provider roster on the open laptop in
front of her, a slim stack of folders and a coffee cup on the desk, glancing down
at the paperwork, not looking at camera, natural room setting with a window out
of frame, bright warm natural daylight with a soft directional key from the
window side, gentle contrast, medium depth of field with the background softly
out of focus, shot on a 50mm lens at a slight 3/4 angle, square crop framing her
and the desk surface, muted warm-neutral palette, calm and ordinary, clean
editorial finish, no visible logos or brand names, no readable text
```

Deliver **1:1**, ~1000 × 1000 (2×).

### `enrollment-hero` — BLEED, transparent, white background

```
create a high fidelity full-length editorial photograph of a composed man in his
late 30s, a provider-enrollment specialist at a small US medical practice,
standing with a desk phone handset held to one ear and an open application folder
in his other hand which he is glancing down at, business-casual wardrobe (open
collar shirt, unstructured blazer, tailored trousers), natural relaxed posture,
candid, not looking at camera, plain seamless pure-white studio background,
bright even natural daylight with a soft directional key light from camera-right
and a subtle rim light separating him from the white, gentle contrast, only a
small soft contact shadow under his shoes, shot on a 50mm lens at eye level, body
turned about 20 degrees toward frame-right, full figure with clear headroom above
and feet near the bottom edge of the frame, muted warm-neutral colour palette,
clean fashion-editorial finish, crisp focus throughout, no logos, no text
```

Deliver vertical **3:4**, ~920 × 1230 (2×). Feet near the bottom edge, headroom
above. White seamless bg, rim-lit edges, no cast shadow on the backdrop → clean
background removal.

### `expiration-hero` — BLEED, transparent, white background

```
create a high fidelity full-length editorial photograph of a calm woman in her
early 50s, a practice administrator at a small US medical practice, standing and
holding a short stack of tabbed manila credential files against her forearm while
checking a date on the top folder, reading glasses pushed up, business-casual
wardrobe (fine-knit cardigan over a plain blouse, tailored trousers, flat shoes),
natural relaxed posture, candid, not looking at camera, plain seamless pure-white
studio background, bright even natural daylight with a soft directional key light
from camera-left and a subtle rim light separating her hair from the white,
gentle contrast, only a small soft contact shadow under her shoes, shot on a 50mm
lens at eye level, body turned about 15 degrees toward frame-left, full figure
with clear headroom above and feet near the bottom edge of the frame, muted
warm-neutral colour palette, clean fashion-editorial finish, crisp focus
throughout, no logos, no text
```

Deliver vertical **3:4**, ~880 × 1175 (2×), bottom-anchored.

## Dropping the real art in

Files go in `public/`. Replace the `<ImgSlot .../>` call:

- **bleed** — inside the existing `<div className="lp-img-bleed">`:
  `<img className="lp-img" src="/pages/enrollment-hero.png" alt="…" />`
- **framed** — `<div className="lp-img-framed"><img className="lp-img" src="/pages/pricing-comparison.jpg" alt="…" /></div>`

The three landing images are 1.4–2.1 MB PNG; move all of them (these included) to
`next/image` or WebP before this goes to production.

---

# Image slot — `/payer-enrollment/` (article template, hub page only)

**Status: placed (2026-08-30).** `public/pages/hub-hero.png`, ~2.0 MB PNG,
1536 × 1024 native (exactly 3:2, no crop needed) — same `next/image`/WebP
conversion debt as every other photo on the site. This page runs on
the *article* template (`site-article.css`), not the landing one, so the rules
above about section-seam bleeds don't apply here: an article gets at most one
lead image, framed, sitting in the centered masthead above the closing rule —
never a bleed, never one per section. Of the five pages in the payer-enrollment
cluster, only the hub carries an image; Medicare, Aetna, BCBS and Cigna
deliberately carry none (see the copywriter's per-page notes — those four are
either data-diagram territory or don't need art at all).

| Slot | Page · section | Treatment | Render size | Aspect | Deliver (1× / 2×) | Format |
|---|---|---|---|---|---|---|
| `hub-hero` | /payer-enrollment · masthead | **FRAMED** | 720 × 480 | **3 : 2** | 720 × 480 / 1440 × 960 | normal photo, fills the frame |

### `hub-hero` — FRAMED, normal photo (no white background)

```
create a high fidelity editorial photograph of a small US medical-practice back
office, one person in their 30s–40s at a desk mid-task, an open manila folder of
printed enrollment paperwork beside a slim closed laptop, glancing down at the
folder, not looking at camera, natural room setting with a window out of frame,
bright warm natural daylight with a soft directional key from the window side,
gentle contrast, medium depth of field with the background softly out of focus,
shot on a 50mm lens at a slight 3/4 angle, medium shot framing the person and
their immediate desk, muted warm-neutral palette, calm and ordinary, clean
editorial finish, no visible logos or brand names, no readable text
```

Deliver **3:2** landscape, ~1440 × 960 (2×). Normal photo — it sits inside a
16px rounded frame with a soft shadow (`.lp-img-framed`), so no transparency and
no white-background requirement, same as `positioning-visual` and
`pricing-comparison` above.

Drop-in, once placed: replace the `<ImgSlot id="hub-hero" .../>` call in
`app/payer-enrollment/page.jsx` with
`<img className="lp-img" src="/pages/hub-hero.png" alt="…" />`, keeping the
surrounding `<div className="lp-article-lead-img"><div className="lp-img-framed">…</div></div>` wrapper.
