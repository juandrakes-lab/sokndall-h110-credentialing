"use client";

import { useState } from "react";

/**
 * 3.6 FaqBlock — H2 + question/answer pairs, emits FAQPage schema whose
 * questions are literally the on-screen ones. The accordion is client, but
 * every answer is rendered into the server HTML (just `hidden`), so a
 * JS-less crawler still gets the text (on-page-seo.md §1, §8).
 * Heading level is a prop.
 * Image policy: prohibida.
 */
export default function FaqBlock({ as = "h2", id, heading, items = [] }) {
  const [open, setOpen] = useState(() => new Set());
  const H = as;

  const toggle = (i) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section id={id} className="grid gap-4 max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {heading && <H className="t-h2 u-ink">{heading}</H>}
      <dl className="grid border-t u-hair">
        {items.map((it, i) => (
          <div key={it.q} className="border-b u-hair">
            <dt>
              <button
                type="button"
                aria-expanded={open.has(i)}
                aria-controls={`faq-a-${i}`}
                onClick={() => toggle(i)}
                className="w-full text-left flex items-baseline justify-between gap-4 py-4 t-body u-ink"
              >
                <span>{it.q}</span>
                <span aria-hidden="true" className="u-muted t-small">
                  {open.has(i) ? "–" : "+"}
                </span>
              </button>
            </dt>
            <dd
              id={`faq-a-${i}`}
              hidden={!open.has(i)}
              className="pb-4 t-body u-muted"
            >
              {it.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
