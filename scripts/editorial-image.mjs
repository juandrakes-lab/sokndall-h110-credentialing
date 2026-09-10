// One source photograph in, the three files an editorial page needs out:
//
//   public/editorial/<slug>-header.webp   1600 x 686  (21:9 masthead)
//   public/editorial/<slug>-card.webp      672 x 448  (3:2 related-guide card)
//   public/editorial/<slug>-og.jpg        1200 x 630  (Open Graph)
//
// Every WebP is re-encoded at falling quality until it is under 200 KB
// (on-page-seo.md §9). The output is printed as the entry to paste into
// components/neo/pageImages.js.
//
// Usage:
//   node scripts/editorial-image.mjs <slug> <path-or-url> "<alt text>" [focus]
// `focus` is sharp's crop gravity: centre (default), north, south, east, west,
// or "attention" to let sharp pick the salient region.
//
// Written 2026-09-10 for the Pexels headers. The API key supplied for that run
// was rejected (401), so the script is ready and unused; see DESIGN_DECISIONS.md.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [slug, input, alt, focus = "centre"] = process.argv.slice(2);
if (!slug || !input || !alt) {
  console.error('usage: node scripts/editorial-image.mjs <slug> <path-or-url> "<alt>" [focus]');
  process.exit(1);
}

const MAX = 200 * 1024;
const OUT = path.join(process.cwd(), "public", "editorial");
fs.mkdirSync(OUT, { recursive: true });

const src = /^https?:/i.test(input)
  ? Buffer.from(await (await fetch(input)).arrayBuffer())
  : fs.readFileSync(input);

async function webp(name, width, height) {
  for (let q = 82; q >= 40; q -= 6) {
    const buf = await sharp(src).resize(width, height, { fit: "cover", position: focus }).webp({ quality: q }).toBuffer();
    if (buf.length <= MAX) {
      fs.writeFileSync(path.join(OUT, name), buf);
      return { name, width, height, kb: Math.round(buf.length / 1024), q };
    }
  }
  throw new Error(`${name}: could not get under 200 KB`);
}

const header = await webp(`${slug}-header.webp`, 1600, 686);
const card = await webp(`${slug}-card.webp`, 672, 448);
const og = await sharp(src).resize(1200, 630, { fit: "cover", position: focus }).jpeg({ quality: 78 }).toBuffer();
fs.writeFileSync(path.join(OUT, `${slug}-og.jpg`), og);

console.log(JSON.stringify({ header, card, og: { kb: Math.round(og.length / 1024) } }, null, 2));
console.log(`
  "/${slug}": {
    alt: ${JSON.stringify(alt)},
    header: { src: "/editorial/${header.name}", width: ${header.width}, height: ${header.height} },
    card: { src: "/editorial/${card.name}", width: ${card.width}, height: ${card.height} },
    og: "/editorial/${slug}-og.jpg",
  },`);
