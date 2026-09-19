"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonClass, Icon, ICONS } from "@/components/app/ui";

// A page header's buttons. On a laptop every action sits in a row, the one
// primary last. Below that, when there are three or more, the secondary ones
// fold into a "⋯" menu beside the primary so the header stays one tidy row;
// with fewer, the buttons share the row's width on a phone.
//
// secondary: [{ label, href, download?, icon? }] — download marks a file link
// (a plain <a>, not client navigation).
export default function HeaderActions({ primary, secondary = [], children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const fold = secondary.length + (primary ? 1 : 0) >= 3;
  const share = "max-sm:flex-1";

  const inline = (item, extra = "") =>
    item.download ? (
      // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
      <a key={item.href} href={item.href} className={`${buttonClass("secondary")} ${extra}`}>
        {item.label}
      </a>
    ) : (
      <Link key={item.href} href={item.href} className={`${buttonClass("secondary")} ${extra}`}>
        {item.label}
      </Link>
    );

  return (
    <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:flex-nowrap">
      {children}
      {fold ? (
        <>
          <span className="hidden items-center gap-2 lg:flex">{secondary.map((s) => inline(s))}</span>
          <div ref={ref} className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="More actions"
              title="More actions"
              className={`${buttonClass("secondary")} w-10 px-0`}
            >
              <Icon d={ICONS.more} className="h-5 w-5" strokeWidth={2.6} />
            </button>
            {open && (
              <div className="glass absolute left-0 top-full z-40 mt-2 w-56 p-1.5">
                {secondary.map((s) => {
                  const body = (
                    <>
                      <Icon d={s.icon ?? (s.download ? ICONS.download : ICONS.chevronRight)} className="h-[18px] w-[18px] text-brand-600" />
                      <span className="text-sm font-medium text-ink-900">{s.label}</span>
                    </>
                  );
                  const cls = "flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/70";
                  return s.download ? (
                    // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
                    <a key={s.href} href={s.href} onClick={() => setOpen(false)} className={cls}>
                      {body}
                    </a>
                  ) : (
                    <Link key={s.href} href={s.href} onClick={() => setOpen(false)} className={cls}>
                      {body}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        secondary.map((s) => inline(s, share))
      )}
      {primary && <span className={`flex ${share} lg:flex-none [&>*]:w-full`}>{primary}</span>}
    </div>
  );
}
