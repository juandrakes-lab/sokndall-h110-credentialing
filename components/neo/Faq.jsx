"use client";

import { useId, useState } from "react";
import Link from "next/link";

// The one interactive island on a marketing page. Every answer is in the
// server-rendered HTML whether or not the item is open — collapsed items are
// `hidden`, not absent — so the copy is crawlable and searchable in-page.
export default function Faq({ items, openFirst = false }) {
  const [open, setOpen] = useState(openFirst ? 0 : -1);
  const uid = useId();

  return (
    <div className="sk-faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        const qid = `${uid}-q${i}`;
        const aid = `${uid}-a${i}`;
        return (
          <div className="sk-faq__item" data-open={isOpen} key={item.q}>
            <h3>
              <button
                type="button"
                id={qid}
                className="sk-faq__q"
                aria-expanded={isOpen}
                aria-controls={aid}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                {item.q}
                <span className="sk-faq__sign" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            <div className="sk-faq__a" id={aid} role="region" aria-labelledby={qid} hidden={!isOpen}>
              <p className="sk-body">
                {item.a}
                {item.linkHref ? (
                  <>
                    {" "}
                    <Link href={item.linkHref} className="sk-link">
                      {item.linkLabel || "Read more"}
                    </Link>
                  </>
                ) : null}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
