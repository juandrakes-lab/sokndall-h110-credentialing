# Copy limits

Two sections: the home page (the neo landing) first, then the editorial
template. Both are measured against `components/neo/neo.css`.

---

# Copy limits — Sokndall home

The character budget each text slot on the home page tolerates before its block
changes shape.

## How these were measured

Every number below was measured against the rendered page at a **1280px
viewport**, not estimated. For each slot the real text was swapped for filler
of a known length, and the element's rendered line count was read back
(`height − padding − border ÷ line-height`), binary-searching for:

- **min** — the shortest text that still fills the same number of lines
- **max** — the longest text that still fits in that same number of lines

So the range is "the copy keeps the shape it has now". Going under `min` costs
a line; going over `max` adds one.

Two caveats worth knowing before you trust a number to the character:

1. **±10 characters of noise.** The filler uses average-length domain words.
   Real copy with several long words ("recredentialing", "revalidation") wraps
   earlier than the number says; copy with short words wraps later.
2. **These are 1280px numbers.** The type scale is fluid (`clamp`), so a slot's
   capacity moves with the viewport. Below ~980px most multi-column blocks
   collapse to one column and every limit grows.

Adding a line is not automatically a break. Where it *is* a break — because a
neighbour is pinned to the same height, or the block is on a fixed ratio — the
row says so.

---

## Hero

| Slot | Now | Range | Notes |
|---|---|---|---|
| **H1** (`.sk-display`) | 18 + 23 per authored line | **≤ 17 per line** to avoid a wrap | The two lines are authored with `<br>`, so the break is a copy decision. The current second line (23) exceeds 17 and deliberately wraps, giving three visual lines. Stay at or under 17 per line for a clean two-line hero. |
| **Subhead** (`.sk-hero__sub`) | 145 | **133 – 195** | 3 lines. Under 133 it drops to 2 and the CTA row rides up. |
| **Strip item** (`.sk-strip__item`) | 19 | **≤ 42** | One line inside a 270px cell; longer wraps and unbalances the four-up. |
| **Schematic caption** (`.sk-herofig__note`) | 81 | **71 – 135** | 2 lines. The hero figure is locked at 4:3, so a third line eats into the diagram. |

## Section heads (all sections)

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Eyebrow pill** (`.sk-pill`) | 24 | **≤ 189** | One line; it is a nowrap-ish chip. Practically: keep it under ~30 or it dominates the heading. |
| **Section H2** (`.sk-h2`) | 21 + 18 per line | **≤ 21 per line** | Authored `<br>`. Same on the dark bands (16 + 13 there). |
| **Intro note** (`.sk-head__note`) | 156 | **92 – 179** | 2 lines, full width under both head columns. |
| **Aside paragraph**, light (`.sk-head__aside`) | 169 | **115 – 166** | 3 lines. The current copy sits right at the top of the band — the measured max is 166 with average words and the real 169 still fits because of where its breaks fall. Treat 165 as the safe ceiling. |
| **Aside paragraph**, dark band | 288 | **253 – 302** | 6 lines. Wider column, so it takes far more. |
| **Stat caption** (`.sk-head__statcap`) | 53 | **44 – 84** | 2 lines, right-aligned under the figure. |

## Section 2 — grey block + row-card list

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Row-card title** (`.sk-h4`) | 17 | **≤ 23** | One line. Past 23 it wraps and the card grows past its siblings. |
| **Row-card body** (`.sk-body`) | 47 – 60 | **47 – 86** | 2 lines. The three cards set the grey block's height, so a fourth line on any one of them lengthens the whole column. |
| **Closing line** (`.sk-closing`) | 139 | **116 – 219** | 2 lines, plain text on the section ground. |

## Section 3 — four blocks across three columns

The wide card's content sets the grid's height, so its budget is the one that
moves the section.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Wide-card title** | 23 | **≤ 45** | One line. |
| **Wide-card body** | 92 | **57 – 108** | 2 lines. This one drives the whole grid's height — a third line pushes columns two and three down with it. |
| **Tall-card title** | 26 | **≤ 26** | One line, and it is **at the limit**. Any longer wraps. |
| **Tall-card body** | 80 | **59 – 85** | 3 lines in the narrowest column. |
| **Tall-card list item** | 25 | **≤ 31** | One line each. |
| **Small-card title** | 20 | **≤ 25** | One line; the icon sits top-right and the title reserves space for it. |
| **Small-card body** | 50 | **41 – 80** | 2 lines. |

## Section 4 — the matrix

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Diagram note** (`.sk-matrix__note`) | 260 | **180 – 356** | 2 lines, full width. |
| **Bullet** (`.sk-list li`) | 112 | **72 – 137** | 2 lines each. |
| **Aside title** (`.sk-h4`) | 23 | **≤ 110** | The aside card is white and free to grow. |
| **Aside body** (`.sk-small`) | 138 | **81 – 153** | 3 lines. Its card is height-matched to the bullet card beside it. |

## Section 5 — price anchor (dark band)

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Figure label** (`.sk-fig__l`) | 36 | **≤ 50** | One line. |
| **Figure note** (`.sk-small`) | 70 | **54 – 106** | 2 lines. The three figures are height-matched, so the longest one sets all three. |
| **Closing line** (`.sk-anchor__closing`) | 188 | **113 – 216** | 2 lines. |

## Section 6 — pricing

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Plan description** (`.sk-small`) | 37 | **≤ 48** | One line. A second line offsets the feature list on that card only. |
| **Plan feature** (`li`) | 17 – 45 | **≤ 46** | One line each. |
| **Featured tag** (`.sk-plan__tag`) | 34 | **≤ 58** | `nowrap` and absolutely positioned, so it never wraps — it runs past the card's edge instead. 58 is where it reaches the 350px card's right edge. |
| **Pricing note** (`.sk-plans__note`) | 88 + link | **≤ 184** | One line including the trailing link. |

## Section 7 — what it does not do

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Item title** (`.sk-h4`) | 15 – 46 | **≤ 23** on one line | The longest current title already wraps to two lines and the layout absorbs it — the row card centres both columns, so a two-line title is fine here. |
| **Item body** (`.sk-body`) | 40 – 100 | **47 – 86** for 2 lines | Cards are independent; a longer body only grows its own card. |
| **Closing line** (`.sk-scope__closing`) | 184 | **116 – 219** | 2 lines. |

## Section 8 — FAQ

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Question** (`.sk-faq__q`) | 41 | **≤ 150** | One line. The row is a button with the +/− sign pinned right; past 150 the question wraps and the sign stays centred. |
| **Answer** (`.sk-faq__a .sk-body`) | 81 | **≤ 117** | One line at the current width. Answers wrap freely — the accordion has no height constraint — so this is a shape guide, not a hard limit. |

## Closing CTA and footer

| Slot | Now | Range | Notes |
|---|---|---|---|
| **CTA heading** (`.sk-h2`) | 42 | **28 – 53** | 2 lines in a 736px block. Under 28 it collapses to one line; over 53 it goes to three. |
| **CTA body** (`.sk-lead`) | 128 | **78 – 149** | 2 lines, capped at a 52ch measure. |
| **Footer blurb** (`.sk-footer__blurb`) | 122 | **112 – 145** | 4 lines in a 30ch column. |

---

## The three slots with the least headroom

Worth knowing before a copy pass:

1. **Section 3, tall-card title** — 26 of 26. Any longer word wraps it.
2. **Hero H1** — 17 characters per authored line. The current second line
   already exceeds it on purpose.
3. **Section 3, wide-card body** — 92 of 108, and it sets the height of the
   whole three-column grid.

---

# Copy limits — the editorial template

Same method as above, same caveats (±10 characters of filler noise). Rows
marked **(judgment)** are not measurements — they are limits on how the copy
reads, not on where it wraps, and they are called out so nobody treats them as
mechanical.

One thing makes these numbers easier to trust than the home page's: **the
editorial template has a single stable geometry.** Above 1120px every measure
is a fixed pixel value and nothing moves with the viewport —

| Element | Width |
|---|---|
| Masthead band, and the lead image inside it | **1040px** |
| Contents sidebar, and the email capture under it | **288px** |
| Reading column | **720px** |
| Title measure inside the masthead | 26ch (~757px at 1440) |
| Standfirst measure | 54ch |
| Meta row measure | 30rem (480px) |

Below 1120px the page is one column capped at 43rem (688px), the contents
collapse to a plegable block, and every limit below grows. So **1120px and up
is the binding case** — copy that fits there fits everywhere. All numbers were
measured at 1440.

Reference page: `/caqh-reattestation`.

## PageHeader

The masthead spans the full 1040px band and is centred on it, so these are the
only slots on the page not bound by the 720px column.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **H1** (`.sk-edhead h1`) | 75 | **74 – 111** | 3 lines. The title has its own 26ch measure inside the 1040px band — at the full band width a headline runs to 120 characters a line and stops being a headline. Under 74 it drops to 2 lines. |
| **Standfirst** (`.sk-edhead__sub`) | 185 | **159 – 235** | 3 lines at a 54ch measure. Under 159 it drops to 2 and the meta rule rides up under the title. |
| **Meta — category** (`.sk-edhead__cat`) | 23 | **≤ 28** | Alongside a date and a reading time in a 480px row. This is **the tightest slot in the template**. Wrapping is not a break — the separator dot trails its own item, so a wrapped row never starts a line with a stray bullet — but the row stops reading as one line of facts. |
| **Meta — the row** | 58 | **≤ 63** | Including both dots. Drop the reading time and the category gets about 12 characters back. |
| **Image caption** (`.sk-edhead__cap`) | — | **≤ 177** | One line across the 1040px band. Left-aligned under a centred image on purpose: it is a caption, not a subtitle. |
| **Lead image crop** | 21:9 | fixed | 1040 × 446. A 3:2 crop at this width is 693px tall and swallows the first screen. Below 760px it reverts to 3:2, because 21:9 on a phone is a 165px strip. |

## Contents list (288px sidebar)

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Entry** (`.sk-edtoc a`) | 22 – 33 | **≤ 47** | One line. A wrapped entry is not a break — the list has no fixed height — but two-line entries in a list of eight stop scanning as an outline. Write section labels for this width; do not truncate H2s into it. |
| **Entry count** | 8 | **5 – 10** *(judgment)* | The contents and the email capture share one sticky block. At 8 entries that block is ~560px, which clears a 900px viewport. Past 10 it starts scrolling inside itself. |

## ProseSection (720px column)

| Slot | Now | Range | Notes |
|---|---|---|---|
| **H2** (`.sk-ed__prose h2`) | 21 – 74 | **≤ 55** for one line · **56 – 109** for two | The longest current heading (74) sits mid-band on two lines. Three lines is where an H2 starts reading as a standfirst. |
| **Paragraph** (`.sk-ed__prose p`) | 366 | **290 – 390** for 4 lines | Prose wraps freely and nothing is height-matched to it, so this is rhythm rather than a limit. The number that matters is the measure: 720px holds ~92 characters a line. |

## StatedVsObserved

The one block on the page with a fixed internal geometry, so these are real
limits rather than guides.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Caption** (`.sk-svo__cap`) | 67 | **≤ 116** | One line above the top rule. Over 116 it wraps and the block gains a line before it has said anything. |
| **Stated** (`.sk-svo__body p`) | 114 + source | **90 – 174** | 2 lines in the content column (720 − 96 label column − 24 gap). The source link is inside this budget — a long publisher name is what usually costs the third line. |
| **Observed — figure** (`.sk-num`) | 7 – 8 | **≤ 15** | The mono column is 76px. It is a column read downward, which is the whole reason the figure is mono; past 15 characters it wraps and stops aligning with the figure below it. "60 days", "8 months", "60 to 90 days" (13) all fit. |
| **Observed — case** (`.sk-svo__case p`) | 125 | **76 – 146** | 2 lines. The cases stack, so a third line on one is visible against its neighbours immediately. |
| **Observed — count** | 2 | **2 – 4** *(judgment)* | Two is the minimum that reads as a pattern rather than an anecdote. Past four the block stops being a comparison and becomes a list. |
| **Note** (`.sk-svo__note`) | 145 | **104 – 204** | 2 lines. This is where the provenance goes and it is not optional: the observed side is reports, not measurements, and the block has to say so. |

## SourcedFigure

Inline, so it has no box of its own. The wrap limit is whatever the surrounding
paragraph has left; what is bounded is how the sentence reads.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Figure** (`.sk-src__v`) | 12 – 26 | **≤ 30** *(judgment)* | Semibold inside running text. Longer than about 30 characters and the emphasis stops reading as a figure and starts reading as a bolded phrase, which is a different and worse thing. |
| **Source label** (`.sk-src__a`) | 26 – 44 | **≤ 48** *(judgment)* | Sits in parentheses immediately after the figure, underlined, in `--ink`. Past 48 the parenthetical is longer than the clause it qualifies. Publication + date is the right shape ("DataSpring announcement, June 8, 2026", 36). |
| **Figure + source together** | 38 – 70 | **≤ 78** *(judgment)* | Beyond this the sentence has to be split, because the reader loses the verb across the parenthetical. |
| **Estimate marker** | 10 | fixed | `[estimate]`, always those words, always text and never an icon. |

## RelatedGuides

| Slot | Now | Range | Notes |
|---|---|---|---|
These were measured when `RelatedGuides` was a list of three rows at 720px. It
is a grid of three cards now, and the numbers below replace them. Measured at
1280px; above the 1120px breakpoint the foot is a fixed 1040px and a card's
content column is a fixed **286px**, so unlike most rows in this file these do
not move with the viewport at all.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Title** (`.sk-rg__t`) | 14 – 43 | **37 – 66** | One line holds up to **36**; two lines run **37 – 76**. The published max sits 10 under the measurement, the filler noise this file documents. **37 is a floor, not a gate:** the component warns under it and never throws, because a title that cannot be extended without falsifying what the page is about is allowed to sit on one line — that card is then shorter than its neighbours, and the two-line cards are never cut down to match it. Getting to two lines is a copy job. Three lines start at 77 and are refused. |
| **Hook** (`.sk-rg__h`) | 63 – 78 | **≤ 87** | Two lines at 286px; 97 measured, less the same 10. |
| **Type eyebrow** (`.sk-rg__kind`) | 5 – 10 | **not capped** | One line. Its value is not authored per page — it is looked up by route in `pageKinds.js`, so there is no character limit to enforce on a page; the practical range is the five labels themselves: `Guide`, `Comparison`, `Pricing`, `Template`, `Product` (added 6 Sep 2026, when the three product pages turned out to be mislabelled `Guide` — DESIGN_RULES.md §12). Longest is `Comparison` at 10. |
| **Block heading** (`.sk-rg .sk-micro`) | 14 | **≤ 152** | One line across the full 1040px foot. |
| **Card count** | 3 | **3** | Fixed. The component throws on any other number — that is what stops the row ever ending in a gap. |
| **Card width** | 336px | fixed | Three columns above 1120px, one column below. No two-column step: 2 + 1 is the gap in the row the fixed count exists to prevent. |

**Recount after the 6 Sep 2026 link cleanup** (six dead-route pages removed,
`/caqh-reattestation`'s related row repointed): of the seven distinct titles
now in the copy, **four are under 37 and render on one line** — "symplr
pricing" (14), "MedTrainer pricing" (18), "What Sokndall costs" (19), "Modio
Health pricing" (20) — and **three reach two lines**: "The free credentialing
spreadsheet template" (43), "symplr pricing: what is public and what is not"
(46), "What Sokndall costs, and what each plan covers" (46). Still a copy
backlog on the four short ones, not a layout defect — and the split moved
closer to even than it was.

## EmailCapture — the template CTA (720px reading column)

**Moved 6 Sep 2026, and this replaces the numbers above.** This is the "free
template" box from `DESIGN_RULES.md` §9 — email in, spreadsheet out. It used
to live in the 288px contents sidebar; that sidebar now carries the contents
list and nothing else. The box renders full-width in the 720px reading column
via `.sk-ed__tcta`, on both the editorial and the comparison variant — once per
page, roughly 75% into the body on an article, immediately before the price
section on a comparison page. `max-width: none` on `.sk-ec` is what gives it
the column's width instead of a card's.

The change in width is not noise: at 248px the heading sat on a floor (35 of a
34–69 band) and made the "least headroom" list. At 720px it does not — one
line now holds up to 91 characters, more than double the card's old two-line
ceiling.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Heading** (`.sk-ec__t`) | 35 | **≤ 91** for 1 line · **92 – 172** for 2 | 680px of content width (720 minus the card's 2×20px padding). No floor any more — a short heading no longer unbalances anything at this width. |
| **Field label** | 10 | **≤ 117** | One line. Was ≤43 at the old 248px width. |
| **Button label** (`.sk-ec__btn`) | 21 | **≤ 116** for one line | Still wraps to two lines past that rather than growing out of the box — `.sk-btn` is `nowrap` and the wrap override is unchanged — but the box is wide enough now that reaching the limit takes a genuinely long label. |
| **Microcopy** (`.sk-ec__micro`) | 100 | **97 – 185** for 2 lines · **186 – 280** for 3 | Was 3 lines at 85–121 in the old 248px column; now 2 lines comfortably holds the current copy. Carries both what arrives and the unsubscribe terms, set at the same size as the offer on purpose — shrinking it is the behaviour this product criticises elsewhere. Do not buy a line back by cutting the unsubscribe half. |

## Closing — two different components now, not one

`DESIGN_RULES.md` §9 split "the closing CTA" into two named things, and each
editorial page uses exactly one of them:

- **The product CTA** (`.sk-article__cta`, borrowed from the article
  template) — the full band, body copy plus a primary/secondary button pair.
  It is **comparison-only**: it renders as the tail's `.sk-ed__cta`, after the
  price table and before the FAQ (see "The tail" below, which has the same
  numbers under different labels — they are one component measured twice).
- **`EditorialClose`** — a single soft link, no box, no button, no
  primary/secondary pair. This is what a plain article closes with instead:
  `/caqh-reattestation`, the one live page of the non-comparison variant, uses
  this, not the band. A guide that answers a question does not also ask for
  the sale.

Measuring the product CTA against a plain-article page is what produced this
section's original numbers, back when both variants used the same band. They
no longer do, so the table below is `.sk-article__cta`'s numbers where they
still apply (the comparison tail), plus `EditorialClose`, which had no
documented limit before this pass.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Product CTA body** | 113 | **99 – 189** | 2 lines at 720px (comparison variant only — see "The tail"). |
| **Product CTA primary label** | 28 | **≤ 37** | One line; `nowrap`, with the secondary link beside it on the same row. |
| **Product CTA secondary label** | 43 | **≤ 56** | Past 56 the action row wraps to two lines, which is correct at 390 and looks like a mistake at 1440. |
| **EditorialClose link** (`.sk-ed__close`) | 42 | **≤ 155** for 1 line | Measured at 1040px — it renders in `.sk-ed__foot`, which spans the full masthead width after the column break (checkpoint 1.4), not the 720px reading column. Generous on purpose: it is one sentence, not a component with a box to outgrow. |

## The four slots with the least headroom

1. **PageHeader category** — 23 of 28, alongside a date and a reading time.
2. **RelatedGuides title** — a 37-character floor, and 4 of the 7 distinct
   titles in the current copy fall under it. Missing the floor is allowed —
   the card is just shorter than its neighbours — but it is the limit in this
   file most often missed by real copy, not the one with least numeric room.
3. **Observed figure** — 15 characters in a 76px mono column, and that column
   is the reason the figure is mono at all.
4. **StatedVsObserved caption** — 67 of 116, and the whole block gains a line
   the moment it wraps.

*(EmailCapture's heading held this slot until the CTA moved out of the 288px
sidebar into the 720px reading column — see below. At that width it is no
longer tight.)*

---

# Copy limits — the comparison variant

`EditorialTemplate variant="comparison"`, which the three competitor pages run
on: `/symplr-pricing`, `/modio-health-pricing`, `/medtrainer-pricing`. Same
method and the same ±10 characters of filler noise as everything above.

**The geometry is the editorial template's, unchanged** — 1040px masthead,
288px contents sidebar, 720px reading column — so most slots the two share
keep the numbers in the editorial section: PageHeader, ProseSection, the
contents list, RelatedGuides and the closing CTA. Those were re-measured on
`/symplr-pricing` and came back inside the noise band of the figures already
published above; where a number here differs from one there by a few
characters, that is the difference between filler and real copy, not a second
measurement to reconcile.

**EmailCapture is the one exception, and it moved by more than noise.** The
CTA it renders no longer lives in the 288px sidebar on either variant — see
the note under its own heading below for what changed and why.

What follows is what the variant adds on top of that: the three comparison
components, and the fixed tail the template renders after the body sections —
the template CTA, then price, then the product CTA, then FAQ. Measured at
1440px.

Reference pages: `/symplr-pricing` (all three components), `/styleguide/comparison`
(the vendor table).

## SourcedPricingDisclosure

A two-column row: a status word in a 128px column, the claim and its provenance
in the 568px remainder.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Status label** (`.sk-spd__lb`) | 13 | **≤ 18** | Not a copy slot — it prints one of three fixed words, and the component throws on anything else. The number is here because 18 is where a fourth status word would wrap the label column and pull the row out of alignment with its neighbours. |
| **Claim** (`.sk-spd__body p`) | 127 | **86 – 166** | 2 lines at 568px. Rows are independent, so a third line grows only its own row. |
| **Provenance** (`.sk-spd__src`) | 90 | **90 – 188** | 2 lines, and it is **at its floor**. This line carries the note or the estimate's basis *and* the source link, and the component refuses to render a claim without one, so the budget cannot be spent entirely on the sentence. A long publisher name is what usually costs the third line. |
| **Lead** (`.sk-spd` section lead) | 225 | **200 – 300** | 3 lines at the full 720px, before the block starts. |

## PurchaseModelCompare

A 208px criterion column and two 232px cells facing each other.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Criterion** (`.sk-pmc__crit`) | 13 | **≤ 29** | One line in the 208px column. |
| **Unit** (`.sk-pmc__unit`) | 42 | **35 – 62** | 2 lines under the criterion. It is required by the component, so this budget is never zero — "Measured in:" is printed by the component and does not count against it. |
| **Cell** (`.sk-pmc__cell p`) | 75 – 78 | **62 – 95** | 3 lines at 232px. **The two cells are height-matched** — they are grid items that stretch — so the longer of the pair sets the row and the shorter one gains white space rather than saving height. Budget the pair together. |
| **Column name** (`.sk-pmc__who`) | 8 | **≤ 36** | One line. Printed once in the header above 640px and once per cell below it. |
| **Note** | 299 | **299 – 397** | 4 lines at 720px, **at its floor**. |

## MultiVendorComparison

`/best-credentialing-software` only, and the tightest block in the skin. At five
vendors the table is 720px of row header plus columns: **191px for the row
header and about 99px per vendor.** A vendor column is roughly 13 characters a
line.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Column head** (`thead th`) | 15 | **≤ 22** | 2 lines at 99px. A vendor's name, and nothing else fits beside it. |
| **Row header** (`th[scope=row]`) | 53 | **≤ 57** | 3 lines at 191px, including the unit line under it. |
| **Unit** (`.sk-mvc__unit`) | 33 | **22 – 39** | 2 lines. Write it as a measure ("share of reviewers, by size"), not as a sentence. |
| **Cell** (`td`) | ≤ 29 | **≤ 29 free** | Up to 29 characters a cell costs nothing: the row's height floor is set by its header, and every cell fits inside it. Past that the whole row grows — measured, with everything else held: **40 → 133px, 55 → 155px, 70 → 199px**, against a 92px floor. |
| **Caption** (`.sk-mvc__cap`) | 331 | **236 – 354** | 3 lines at 720px. This is where a detail too long for a cell goes, and it is the reason the cell limit is liveable. |
| **Source row** (`.sk-mvc__sources li`) | 40 | **≤ 124** | One line at 720px, vendor name and link together. |
| **Vendor count** | 5 | **≤ 5** *(judgment)* | Five is the ceiling in a 720px column. A sixth takes the columns under 85px, where a two-word cell wraps to three lines and the table stops being readable before it stops fitting. |

The trap this table sets is that **nothing about an over-long cell looks wrong
while you write it.** It wraps, the table stays inside its container, and the
cost lands on the row's height. Writing the first version of this page against
the research produced one row 285px tall and a table of 1069px; the same facts,
with the detail moved into the caption, render in 746px.

## The tail — template CTA, price, product CTA, FAQ

Rendered by the template after the body sections, in the same 720px column, in
this order (confirmed against the rendered DOM on `/symplr-pricing`):

**last body section → template CTA → price → product CTA → FAQ**

The template CTA (`EmailCapture`) sits right before the price section on this
variant — its own numbers are in the "EmailCapture" entry above, not repeated
here. Everything below it is unchanged from before.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **Price H2** | 53 | **≤ 55** | One line, and effectively at the limit. "What Sokndall costs, and what it is being compared to" is 53. |
| **Price paragraph** | 211 | **200 – 300** | 3 lines. Optional — the section renders with the table alone. |
| **FAQ question** (`.sk-faq__q`) | 36 | **≤ 98** | One line at 718px, with the +/− sign pinned right. Wider than the home page's row, so a question that fits there fits here. Re-measured after the padding change: the row is 74px tall and the card 76px, against 104px before — the 28px that came out was `.sk-prose h3`'s top margin leaking into the accordion, not padding. |
| **FAQ answer** (`.sk-faq__a .sk-body`) | 166 | **96 – 185** | 2 lines at 674px. The accordion has no height constraint, so this is shape rather than a limit. |
| **Product CTA body** | 137 | **99 – 188** | 2 lines at 660px — `.sk-ed__cta`, the same block as the "Product CTA body" row above. |
| **Product CTA labels, together** | 40 | **≤ 86 combined** | The pair share one 660px row, so neither label has a limit of its own: what wraps the row is the two of them plus the gap. Measured by growing both in step. |

---

# Copy limits — the institutional template

`/security` and `/about`, and nothing else. One centred column at **36rem
(576px)**, no sidebar, no CTA anywhere on the page. That makes it the simplest
geometry in the skin and the easiest set of numbers to trust: there is one
column, it does not move with the viewport above 656px, and nothing on the page
is height-matched to anything else.

Measured at 1440px. Reference pages: `/security` (no image slot), `/about` (the
one portrait slot in the template).

| Slot | Now | Range | Notes |
|---|---|---|---|
| **H1** (`.sk-inst__head h1`) | 65 · 14 | **56 – 78** for 3 lines | At 576px, not the editorial masthead's 757px, so a title that fits `/caqh-reattestation` will not fit here. `/about`'s "About Sokndall" (14) is one line; `/security`'s 65 is three. |
| **Standfirst** (`.sk-edhead__sub`) | 155 · 168 | **151 – 217** | 3 lines. `/security` sits at the floor: under 151 it drops to 2 and the meta row rides up under the title. |
| **Meta row** (`.sk-edhead__meta`) | 25 | **≤ 83** | One line at 480px. Far more headroom than the editorial masthead's 63, because these pages carry only "Updated" plus a date — no category and no reading time. |
| **H2** (`.sk-inst__prose h2`) | 12 – 38 | **≤ 44** | One line. Shorter than the editorial column's 55, and this is the slot most likely to catch someone moving copy between the two templates. |
| **Paragraph** (`.sk-inst__prose p`) | 271 – 473 | **232 – 311** for 4 lines · **469 – 545** for 7 | 576px holds about 72 characters a line. Prose wraps freely and nothing is pinned to it, so this is rhythm rather than a limit. |
| **Portrait caption** (`.sk-inst__portrait .sk-small`) | 114 | **100 – 189** | 2 lines at the full 576px, left-aligned under a centred photo. |
| **Portrait direction** (`.sk-photo__slot span`) | 285 | **≤ ~273** | **A hard box, and the only silent break in this file.** The empty slot is a 304 × 380 figure at 4:5 with `overflow: hidden`, so direction text longer than the box is *clipped without any sign that it was* — no scrollbar, no growth, no warning. The current 285 fits only because of where its breaks fall. Treat 260 as the safe ceiling, and put anything longer in the page's own comments instead. |
| **Page length** | 363 · 606 words | **300 – 600** *(judgment)* | The template's own spec, and the reason it exists. `/security` is at 363. `/about` is at 606 — six words over, in the founder section, which is the one the copy brief calls the most important on the page. Recorded rather than cut. |

## What this template does not have, and why nothing measures it

No contents list, no email capture, no closing CTA, no related guides. Three of
those four carry the tightest slots in the editorial template, so the absence is
worth stating: **there is no slot on either of these pages that breaks a
neighbour.** Every block sits in one column, in flow, and a line added anywhere
costs exactly one line.

The one exception is the portrait direction above, and it is an exception
because the slot is a placeholder for art that does not exist yet — the moment a
real photograph lands, that text stops rendering and the limit stops applying.

## The three slots with the least headroom, across both new templates

1. **MultiVendorComparison cell** — 29 characters before the row starts
   growing, in a 99px column, and no visual signal that it has.
2. **Portrait direction** — clipped silently past the 4:5 box.
3. **SourcedPricingDisclosure provenance** — at its 90-character floor, and it
   has to carry a source link the component will not let you omit.


---

# Copy limits — PlanFeatureMatrix (`/pricing`)

Added 2026-09-12. Measured at 1280px on the rendered page, text widths read
with the page's own font, so these replace the brief's `[SIN MEDIR]`. Same ±10
characters of noise as everything above.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **H2** (one line, card-title size) | 35 | **≤ 70** for one line | Since 2026-09-12 the table sits under the price list, inside the header, and its H2 is set at 28px like the list's own. The authored two-line break is joined into one line. |
| **Intro note** | 110 | **≤ 120** for 2 lines | Centred, capped at 60ch (559px). |
| **Row label** | 14 – 33 | **≤ 50** for one line | A 387px column at 15px semibold, left-aligned. Past 50 the row grows one line; nothing breaks. |
| **Value cell** | 1 – 16 | **≤ 18** · counts large, words at 15px | 250px per plan column, centred. Status cells print no word any more (symbol only, the word is screen-reader text), so they have no limit. |
| **Column head** | 4 – 10 | **≤ 22** | White on the petrol head row, centred. |
| **Caption** | — | **≤ 200** for one line | Withdrawn 2026-09-14: with the tax-ID and additional-users rows the approved caption stopped being true. Back when copy rewrites it. |
| **Security line** | 144 | **≤ 90 per line** · 2 lines up to ~180 | Closing line with its accent rule, 671px. |
| **Row count** | 7 | **4 – 7** *(judgment)* — now at the ceiling | The brief's argument: parity said once, the differing rows shown. Past 7 the table becomes the feature list it was designed not to be. |

Re-measured 2026-09-12 at a 1348px viewport after the move under the plans
(the numbers at 1280 are a few characters lower). Below 640px each row is a card and every limit above grows.

---

# Copy limits — EntityChooser (`/pricing`)

Added 2026-09-14 for the tax-ID question above the price list; re-measured the
same day after the flat redesign (three columns, no panel). Measured at 1280px.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **H3** | 48 | **≤ 60** for 2 lines | 339px first column, 22px. |
| **Lead** | 117 | **≤ 150** for 4 lines | Same column. |
| **Option label** | 24 · 20 | **≤ 32** for one line | 339px column behind its petrol rule, 17px bold. |
| **Option body** | 65 · 68 | **≤ 90** for 2 lines | |
| **Closing** | 169 | **≤ 210** for 2 lines | Under the two answers, 710px, 14px. |
| **Options** | 2 | **2** | A two-answer question. A third answer needs a different layout. |

# Copy limits — FigureBandSection `groups` (`/pricing` anchors)

Added 2026-09-14. Measured at 1280px.

| Slot | Now | Range | Notes |
|---|---|---|---|
| **H2** (authored lines) | 14 · 18 | **≤ 21 per line** | Unchanged from the standard head. |
| **Aside** | 262 | **≤ 300** for 5 lines | Right half of the dark tile, 486px. |
| **Group title (H3)** | 29 · 19 | **≤ 44** for one line | 512px. |
| **Figure label** | 27 – 37 | **≤ 50** | The range set large, the unit under it. |
| **Figure note** | 70 – 76 | **≤ 120** for 2 lines | |
| **Group closing** | 201 · 153 | **≤ 240** for 4 lines | 512px open column. Both closings sit on the same baseline row. |
| **Figures per group** | 2 | **2 – 3** | Stacked. Four stops reading as a group. |
