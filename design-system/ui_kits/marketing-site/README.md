# UI kit — Sokndall marketing site

A recreation of the reference homepage using only the primitives in
`components/` via `_ds_bundle.js`. Open `index.html`.

| File | What it is | Source |
|---|---|---|
| `Hero.jsx` | Pill eyebrow, one-colour display heading, two actions (forest + gold), client names, photo behind a left-to-right paper scrim. | Faithful to the comp |
| `Services.jsx` | Forest section: centred `SectionHeading`, four `ServiceCard`s in a 2×2 grid, a gold "Explore All Services" button. | Faithful to the comp |
| `About.jsx` | "Simplifying Accounting" — heading, three `FeatureItem`s, forest button, photo with an overlapping floating stat card. | Faithful to the comp |
| `Trusted.jsx` | Client-proof band on white with a `StatStrip`. | Adapted — the comp crops here |
| `Footer.jsx` | Forest-900 footer: wordmark, three link columns, legal bar. | Extrapolated — the comp is cropped above the footer |

## Interactions
The header is transparent over the hero and turns solid white after 20px of
scroll. The `ScrollCue` between the hero and the services section smooth-scrolls
to `#services`. Cards lift on hover.

## Notes
No primitive is re-implemented here. Icons are Lucide from CDN. Photos are the
SVG placeholders in `assets/imagery/` — swap for real files.
