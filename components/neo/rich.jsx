import Link from "next/link";

import SOURCES from "@/components/neo/sources";

/**
 * Rich — a copy string with inline links, rendered on the server.
 *
 * Copy lives in `data.js` files as plain strings, and a sentence often has to
 * carry its own source link on the same line (DESIGN_RULES.md §2 regla 2). This
 * is the one place that turns a string into a sentence with links, so every
 * page writes its links the same way and the FAQ schema can strip them back to
 * the literal on-screen text.
 *
 * Syntax, inside any string:
 *
 *   [anchor text](/pricing)            internal route, next/link
 *   [anchor text](src:medicotech)      an external source from `sources.js` —
 *                                      rel and target come from the registry,
 *                                      so a competitor is `nofollow` everywhere
 *                                      it is cited, not only where someone
 *                                      remembered
 *
 * An unknown `src:` key throws at build time rather than rendering a dead link.
 */
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function resolveHref(href) {
  if (href.startsWith("src:")) {
    const key = href.slice(4);
    const s = SOURCES[key];
    if (!s) throw new Error(`Rich: unknown source key "${key}". Add it to components/neo/sources.js.`);
    return s;
  }
  return { href };
}

/** The literal text a reader sees, with link syntax removed. Used for the
 *  FAQPage schema, whose questions and answers must match the page verbatim. */
export function plainText(str) {
  if (typeof str !== "string") return "";
  return str.replace(LINK, "$1");
}

/** An external link carrying the registry's rel. Internal routes go through
 *  next/link and stay in the tab. */
export function SmartLink({ href, className, children }) {
  const s = resolveHref(href);
  if (/^https?:/i.test(s.href)) {
    const rel = s.nofollow ? "noopener nofollow" : "noopener";
    return (
      <a className={className} href={s.href} target="_blank" rel={rel}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={s.href}>
      {children}
    </Link>
  );
}

export default function Rich({ text, linkClassName }) {
  if (typeof text !== "string") return text ?? null;
  const out = [];
  let last = 0;
  let m;
  LINK.lastIndex = 0;
  while ((m = LINK.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <SmartLink key={m.index} href={m[2]} className={linkClassName}>
        {m[1]}
      </SmartLink>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
