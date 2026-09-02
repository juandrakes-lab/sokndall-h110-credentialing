# Template — Marketing homepage

`MarketingHomepage.html` is a **static** starting point: one self-contained HTML
file that renders the full homepage (header, hero, forest services section, about
block with floating stat, footer) using only the design tokens from
`../../styles.css`. No framework, no build, no runtime.

This is the local stand-in for Claude Design's `.dc.html` template format — the
custom-element (`<x-dc>` / `<x-import>`) runtime is not reproduced here. To build
the same page in React, copy `ui_kits/marketing-site/` instead, which composes the
real primitives from `_ds_bundle.js`.

## Use

1. Copy the file into your project.
2. Repoint the `styles.css` link, and keep or drop the Lucide `<script>`.
3. Replace the gradient placeholder blocks with real `<img>` photos — see
   `../../assets/imagery/README.md` for direction.
