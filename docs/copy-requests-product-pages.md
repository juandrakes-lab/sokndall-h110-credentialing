# Sokndall — copy requests for the three product pages

From: design · To: copywriting
Pages: `/pricing`, `/payer-enrollment-software`, `/credential-expiration-tracking`
16 requests: A-1…A-6, B-1…B-4, C-1…C-3, D-1…D-6

Answer point by point, by ID: **APPROVE** with the final text, or **REJECT** with the
reason. Partial approvals are fine. A rejection is a real answer — the layout gives way,
not the copy. The only answer that blocks me is silence on an ID.

---

## Why this exists

The three pages are built and on the design system. The first review found problems that
are *distribution* problems, not writing problems — but several can't be fixed without the
copy changing shape.

Three findings drive almost every request below:

1. **A systematic void on the right.** Every body block is capped at 900px inside an
   1184px container — **284px of dead space** to the right of every text section, on all
   three pages. The fix is to give those blocks a real counterpart in the other column,
   which means the text has to be cut to sit *beside* something instead of running alone.
2. **Two floating cards that aren't in the design system** — the `$750 vs $299` payoff and
   *How the trial works*. Both become full-width bands. A line that read fine inside a
   small box has to survive at display size across the full page.
3. **Sections with a headline and no eyebrow** read as if something fell off, because the
   sections around them have one.

**What's changing in the layout, so you know what you're writing into:** text-only sections
move to a two-column head — headline left, body right, aligned at the top — with any
diagram full width beneath. Lists of parallel things become card grids. Closing sections
get centered. Diagrams that can run narrow move beside their copy instead of above it.

## Ground rules

- **Terminology is locked and unchanged**: payer, provider, effective date, revalidation /
  re-credentialing, CAQH Provider Data Portal.
- **Prices are locked**: $79 / $299 / $699, and $26 / $20 / $14 per provider.
- **No emoji**, in eyebrows or anywhere else.
- **Every H1 and H2 stays as written.** Nothing below asks you to touch a headline.
- **Reject freely.** If a change costs accuracy or weakens the argument, say so — I'd
  rather rebuild a section than publish a claim that got trimmed to fit a column.

---

# A · Six eyebrows

Six sections have a headline and no eyebrow, next to sections that have one. Existing
eyebrows for register: *The Actual Problem*, *Who It Is For*, *The Enrollment Grid*,
*Statuses*, *Multi-state*, *Scope*. Two to four words, Title Case or sentence case, no emoji.

| ID | Page · section | The headline it sits above |
|---|---|---|
| A-1 | pricing · 5 | How the trial works |
| A-2 | payer-enrollment · 2 | Submitting the application takes an afternoon. The next four months are the job. |
| A-3 | payer-enrollment · 4 | The reference number, the name, and the date you actually called |
| A-4 | expiration · 2 | It is never one renewal. It is every month, forever. |
| A-5 | expiration · 4 | You enter a date. Everything else is calculated. |
| A-6 | expiration · 5 | 90, 60, 30, 14, 7 |

**Two sections deliberately stay eyebrow-less — no copy needed.** *The 30-day flag*
(payer-enrollment · 5) and *One email on Monday morning* (expiration · 6) sit on dark and
forest grounds. On `/landing` the forest section and both dark bands carry no eyebrow
either, so their absence is a pattern rather than a gap. Leaving these two bare is what
makes the other six read as intentional.

---

# B · /pricing

## B-1 · pricing § 3, Billing Co — the closing line points at a number the copy no longer says

**Now:**
> On top of that, one view across all of them.
>
> That is the number you cannot get out of six separate spreadsheets.

**Problem.** The brief put the Monday digest sentence — *23 applications need follow-up this
week across your 6 clients, 4 of them have been quiet for over 30 days* — in the body copy.
I moved it into the schematic beside the text, where it renders as the actual roll-up under
six client tiles whose numbers add to it. **That leaves "That is the number" with no
antecedent in the prose** — a reader who skips the diagram hits a pronoun pointing at
nothing. And "On top of that, one view across all of them" is a nine-word orphan between
two full paragraphs.

**Request.** Rewrite those two lines into one paragraph of roughly 35–45 words that earns
the closing sentence without quoting the digest line verbatim — the diagram is already
saying it, and hearing it twice on one screen is worse than not hearing it in prose at all.

**Why it fits.** The left column runs beside a schematic about 400px tall. One 40-word
paragraph plus the existing opener fills that height evenly; the current three-paragraph
run with a short middle leaves a ragged gap.

## B-2 · pricing § 4, Cost per provider — the payoff line has to survive on its own at display size

**Now** (24 words):
> Fifteen providers on the low end of that maintenance range is $750 a month. Practice is
> $299 for the same fifteen — $20 per provider.

**Problem.** This is currently a rounded dark card floating inside the section — the shape
the review flagged as off-system. It becomes a full-width forest band, like the one on
`/landing` after the problem section. Once it's a band, it's separated from its setup by a
photo and two cost cards, so **"that maintenance range" is reaching back across two other
elements.**

**Request.** Make it self-contained — name the range instead of pointing at it — and keep it
at or under 30 words so it sets in two lines at display size. The $750 / $299 / $20 figures
and the comparison must survive intact; that's the whole point of the section.

**Why it fits.** A full-bleed band is read as a standalone statement, the way a pull quote
is. It has to work for someone who scrolled past the cards.

## B-3 · pricing § 4, closing — two paragraphs, one three times the other

**Now:**
> The gap is not a discount. It is the difference between paying a person to do the work
> and paying a system to keep track of it. *(27 words)*
>
> Sokndall does not attest anything for you, does not call a payer, does not touch a
> recredentialing packet. If you want that done for you, buy that. If your actual problem is
> that nobody can currently answer "what needs attention this week" without opening six
> things, that is a tracking problem, and it is priced like one. *(58 words)*

**Problem.** These sit in a single left-aligned column with the full 284px void beside them.
Putting them side by side as two columns kills the void — but at 27 vs 58 words one column
ends less than half way down the other, which just moves the hole.

**Request.** Rebalance to two paragraphs within about 20% of each other, roughly 42–50 words
each. The "the gap is not a discount" idea and the "buy the service if you want the
service" concession both have to stay — they're the section's honesty.

**Why it fits.** Two even columns bottom out together and read as a deliberate pair. Same
device the section already uses for the two cost cards directly above.

## B-4 · pricing § 5, Trial terms — three terms buried in two paragraphs

**Now** (45 words):
> 14 days, full product, nothing held back. We ask for a card up front so you are not
> re-entering it later.
>
> The card is charged on day 15. Cancel any time before that from Settings → Billing —
> self-serve, no email required, no retention call.

**Problem.** The brief asks for this to carry the same visual weight as the price itself.
It's currently a floating box — and the review's sharpest observation was that the box sits
inside its own section already, so the box is doing nothing the section couldn't do better.
As a full-width band, 45 words of running prose is thin, and it hides three separate
commitments — *what you get*, *what we ask*, *how you leave* — inside sentences.

**Request.** Split into **three labelled blocks**: a 2–3 word label plus 18–25 words each.
Suggested split — *14 days, full product* / *Card up front* / *Cancel from Settings*. Every
fact currently in the paragraphs must land in one of the three, including "charged on day
15" and "no retention call".

**Why it fits.** Three equal columns fill the band's width honestly and make the terms
scannable, which is the actual argument of the page — nothing hidden, nothing to ask about.

---

# C · /payer-enrollment-software

## C-1 · payer-enrollment § 3, Six statuses — uneven pair under the table

**Now:**
> Info requested is the status that costs money, and it is the one most likely to be
> invisible. Payers frequently do not tell you an application is waiting on you — it just
> stops moving, and you find out weeks later that the delay was on your side. *(48 words)*
>
> Sokndall puts every application in one of those six states, and puts the info-requested
> ones at the top of the Monday digest. *(22 words)*

**Problem.** Full-width table above, then a narrow left column of text with the void beside
it. Going to two columns fixes the void; 48 vs 22 words doesn't survive the move.

**Request.** Rebalance to roughly 34–38 words each. The second may need a little more than a
trim to grow — what the digest does with an info-requested application, or what clearing one
actually takes, would both earn the words.

**Why it fits.** The table above is the widest element on the page. Two even columns beneath
it echo its width instead of collapsing back to half the page.

## C-2 · payer-enrollment § 6, The matrix — two paragraphs beside a twelve-row grid

**Now** (2 paragraphs, 39 words):
> Providers down the side, payers across the top, one cell per pair. Color by status, number
> is days since last follow-up.
>
> Twelve providers across ten payers is 120 applications and you can see the stalled ones
> without opening anything.

**Problem.** The matrix renders at its natural 750px, leaving **over 400px of white to its
right** — the worst void on the three pages. The fix is to move the copy and the legend into
that column and let the grid sit beside them rather than under a headline. The column is
then about 400px wide next to a grid roughly 400px tall. Two paragraphs fill barely half of it.

**Request.** Add a **third short paragraph**, 20–28 words. `/landing` has three here and its
third is the strongest line in the section — but it's spoken for, so this page needs its own
rather than a variation on "a spreadsheet can hold that data, it cannot show it to you this way".

**Why it fits.** Three short paragraphs plus the legend match the grid's height, and the
section stops being a headline with a wide picture under it.

## C-3 · payer-enrollment § 7, What it does not do — three bare negations

**Now** (5–7 words each, no body):
> Sokndall does not submit applications.
> It does not connect to payer portals.
> It does not chase anyone for you.

**Problem.** The review flagged this section on both pages: the CTA sits beside the headline
at the same height, which reads as a stray button. The section gets centered, and these
three become three cards in a row. **As cards they're empty** — a six-word title over
nothing. The equivalent section on `/landing` gives each scope item a title *and* a
sentence, which is why that one works.

**Request.** Keep each line as the card title and add **one sentence of 14–20 words** to
each, saying what you do instead or what the boundary means in practice. Match the register
of the `/landing` scope cards — flat, unapologetic, no softening. The paragraph that follows
("You still work in CAQH (DataSpring), PECOS and the payer portals…") stays as written and
sits centered beneath the three cards.

**Why it fits.** Three cards of equal height give the closing section real presence, and the
CTA can then sit centered below where a closing CTA belongs.

---

# D · /credential-expiration-tracking

## D-1 · expiration § 2, It is never one renewal — a 78-word wall in a text-only section

**Now:**
> Ten providers is not ten dates. It is state licenses on their own cycles, DEA
> registrations every three years, malpractice certificates annually, board certifications on
> multi-year cycles, CAQH attestations every 120 days, and Medicare revalidation on top of all
> of it. Every month something is coming due, and the reminder emails that were supposed to
> catch it go to an inbox someone stopped reading. *(78 words, one paragraph)*
>
> The near miss is the normal outcome. The miss is the one that costs money.

**Problem.** The review named this one specifically: an entire section of nothing but text
with an enormous void to its right — the clearest case on the three pages. The fix is
headline left, body right. But one 78-word paragraph in a half-width column is a nine-line
block: a wall, not a lede.

**Request.** Split into **two paragraphs of roughly 38–42 words**. The natural seam is after
the list of cycles, before "Every month something is coming due". The list itself must keep
all six cycle types — it's the section's evidence. "The near miss is the normal outcome"
stays exactly as written and lifts out to close the section full width; no change there.

**Why it fits.** Two paragraphs in the right column set to roughly the height of the two-line
headline on the left, so both columns land together. The closing line then gets the weight
it deserves instead of trailing a wall.

## D-2 · expiration § 3, The five cycles — bodies ranging from 4 to 23 words

**Now:**
> **State license** — Varies by state and license type. Multi-state providers need one row per state, each with its own date. *(20 words)*
> **DEA registration** — Renewal is not always instant: one provider's renewal sat in processing for about four weeks after being immediate in prior years. *(23 words)*
> **Malpractice (COI)** — The one that quietly breaks other things: an expired COI inside a CAQH profile can block an attestation. *(19 words)*
> **Board certification** — Easy to forget precisely because it is far away. *(10 words)*
> **CAQH attestation** — Every 120 days, permanently. *(4 words)*

**Problem.** The review asked for these to become cards side by side rather than a list — and
is right that a grid represents "cycles" better than a stack does. Cards in a row are only as
tall as the tallest, so a 4-word card next to a 23-word card is mostly empty box.

**The CAQH body is a bigger problem than its length.** Each card already shows its cycle in a
chip beside the name — *Every 120 days*. So its body says the chip again and nothing else.
Board certification is close to the same.

**Request.** Rewrite all five to **18–24 words** each. **CAQH attestation and Board
certification need real content**, not padding — what the cycle costs you, or what breaks when
it slips. None of the bodies should restate its own cycle chip. Keep the two outbound links
(DEA → `/dea-renewal-tracking`, COI and CAQH → `/caqh-reattestation`).

**Why it fits.** Five cards land as 3 + 2 in the grid. Bodies within a 6-word band keep every
card the same height, so the second row doesn't read as leftovers.

## D-3 · expiration § 4, You enter a date — a 12-word orphan paragraph

**Now:**
> Enter the expiration date and Sokndall derives the status: active, expiring, or expired,
> with days remaining. Nothing to update by hand, nothing to re-color, no conditional
> formatting to maintain. *(30 words)*
>
> When someone renews, you change one date and every view updates. *(12 words)*

**Problem.** Going to headline left, body right. A 30-word paragraph followed by a 12-word
one reads as a paragraph with a fragment stuck to it, and the column ends short of the
headline block.

**Request.** Either fold both into one paragraph of about 45 words, or grow the second to
about 28 so the two read as a pair. I lean toward one paragraph — the whole claim is that
this takes one action, and one paragraph enacts that.

**Why it fits.** The schematic below already demonstrates the renewal case visually, so the
second sentence is carrying less weight than its own paragraph implies.

## D-4 · expiration § 5, The alert ladder — one sentence stranded below the diagram

**Now** (20 words, currently under the ladder):
> Each credential has a responsible person, and the alerts go to them, not to a general
> inbox nobody owns.

**Problem.** The section is a very short headline (*90, 60, 30, 14, 7*), then the four-rung
ladder full width, then this one line alone with the void beside it. Moving the line up
beside the headline turns it into the section's lede and closes the void — but one sentence
next to a five-character headline leaves both columns short.

**Request.** Extend to **two sentences, about 40 words**. The ownership point must stay —
it's the only place on the page that says who acts. A second sentence on what the ladder is
*for* (renewals are slow, so the warning starts early) would carry it.

**Why it fits.** The headline is numerals set large; a 40-word lede beside it balances without
competing, and the ladder below then reads as the answer to the lede rather than a diagram
someone captioned afterwards.

## D-5 · expiration § 6, One email on Monday morning — the copy lists what the diagram already lists

**Now:**
> Expired now. Expiring in 30. Attestations overdue. Applications with no follow-up in 30+
> days. Provider-payer pairs with claims on hold.
>
> The point of the digest is that you do not have to remember to open anything. That is the
> single difference between this and a very good spreadsheet.

**Problem.** **The first paragraph is a verbatim duplicate of the schematic sitting next to
it.** The digest card renders those five lines as five rows with counts — 2, 7, 1, 5, 3. The
reader gets the same list twice, side by side, one with numbers and one without. The review
also flagged this section for the void under the text: the left column runs about 200px
against a card of about 340px.

**Request.** Replace the first paragraph with **35–45 words the diagram cannot show**: when it
arrives, who it goes to, what a person does with it on a Monday morning, or why one email
beats five notifications. The five categories stay in the diagram only. The second paragraph
("the single difference between this and a very good spreadsheet") is the best line in the
section — keep it exactly.

**Why it fits.** Roughly 70 words across two paragraphs matches the digest card's height, and
the section stops paying twice for one idea.

## D-6 · expiration § 7, Multi-state — short column beside a six-row table

**Now** (42 words):
> A provider licensed in six states has six license rows, six renewal cycles, and six chances
> to miss one.
>
> Each state is its own row with its own date and its own alerts, and the provider view shows
> all of them together.

**Problem.** 42 words against a table of six state rows plus a header — roughly 330px of table
against 150px of text. The column bottoms out early and the gap under it is visible.

**Request.** Add about **25–30 words**, as a third short paragraph or by growing the second.
The headline promises that telehealth panels break spreadsheets first — the copy never says
*how* a spreadsheet breaks here. That's the missing beat, and it fills the height.

**Why it fits.** Six rows of real dates is a strong artifact; the copy beside it should be a
match for it, not a caption.

---

# Not up for change

So nothing gets edited that doesn't need to be. All of this stays exactly as written:

- Every **H1 and H2** on all three pages, including the two-tone ones.
- All **prices, plan limits and per-provider figures**, and the plan feature lists.
- The **six status rows** on `/payer-enrollment-software` — status, what it means, what you do.
- The **six FAQ answers** on `/pricing`.
- The **two cost blocks** (ongoing maintenance / one-time engagements) and their ranges.
- Both **hero subheads** and the `/pricing` header subhead.
- **The 30-day flag** section in full, and the `/credential-expiration-tracking` scope paragraph.

---

# Response format

```
A-3   APPROVE   "The Follow-Up Log"

D-2   APPROVE   State license — <new body, 18-24 words>
                DEA registration — <…>
                Malpractice (COI) — <…>
                Board certification — <…>
                CAQH attestation — <…>

D-5   REJECT    <reason>
```

A rejection isn't a blocked request — it tells me the constraint is real and the layout has
to give instead.
