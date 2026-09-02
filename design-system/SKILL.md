---
name: sokndall-design
description: Use this skill to generate well-branded interfaces and assets for Sokndall (accounting & advisory firm), for production or for throwaway prototypes and mocks. Contains the design guidelines, colour and type tokens, fonts, and the React UI-kit components.
user-invocable: true
---

Read `readme.md` in this folder, then explore the other files — `styles.css` and
`tokens/` for the foundations, `components/` for the primitives (each has a
`.prompt.md` with a usage example), `guidelines/` for the specimen cards, and
`ui_kits/marketing-site/` for a full page assembled from the primitives.

- **Visual artifacts** (slides, mocks, throwaway prototypes): copy `styles.css`
  and the token files out, link them, and build static HTML. Reuse the class and
  style patterns from `templates/marketing-homepage/MarketingHomepage.html`.
- **Production code**: read the rules here to design on-brand, import components
  from `index.js` (never from component internals), and use colour / spacing
  tokens via `var(--…)` rather than raw values. `_adherence.oxlintrc.json` codifies
  this.

If invoked with no other guidance, ask what the user wants to build, ask a couple
of clarifying questions, then act as an expert designer for this brand — output
HTML artifacts or production code depending on the need.
