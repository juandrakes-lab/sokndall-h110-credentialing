// "Explore more guides" — three cards at the very end of every article, after
// the CTA block. This is interlinking, not another pitch: no button, no
// accent colour, just a title, a one-line hook and an arrow. Shown on every
// viewport (unlike the sidebar/related-guides split above, which is about
// where a nav aid lives while reading, not about exit links).
//
// items: [{ href, name, hook }], category: the small kicker on each card.

import Link from "next/link";

export default function ExploreMore({ items, heading = "Explore more guides", category = "Guide" }) {
  if (!items?.length) return null;
  return (
    <div className="lp-explore">
      <p className="hd">{heading}</p>
      <div className="lp-explore-grid">
        {items.map((g) => (
          <Link key={g.href} href={g.href} className="lp-explore-card">
            <span className="cat">{category}</span>
            <h4>{g.name}</h4>
            <p>{g.hook}</p>
            <span className="go">Read the guide &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
