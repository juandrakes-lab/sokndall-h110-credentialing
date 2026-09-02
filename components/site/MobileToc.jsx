// The contents list, collapsed into a native <details> for viewports where
// the sidebar doesn't fit. No JS: a native disclosure widget is accessible
// and works without hydration, and a collapsed list doesn't need scroll-spy.
//
// items: [{ id, label }] — same shape ArticleSidebar takes.

export default function MobileToc({ items, heading = "Contents" }) {
  return (
    <details className="lp-toc-mobile lp-a-span">
      <summary>{heading}</summary>
      <ol className="lp-toc-list">
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={"#" + it.id}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
