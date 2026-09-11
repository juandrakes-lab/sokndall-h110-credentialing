// Solid-fill icons for the neo skin. 24-box, `currentColor`, no strokes —
// they sit directly on the surface with no box or fill behind them, so the
// glyph itself has to carry the weight. Line art reads as an outline of an
// icon at this size; a filled shape reads as the thing.

const base = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" };

export function IconCalendar(p) {
  return (
    <svg {...base} {...p}>
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h.5A2.5 2.5 0 0 1 21 6.5V9H3V6.5A2.5 2.5 0 0 1 5.5 4H6V3a1 1 0 0 1 1-1Z" />
      <path d="M3 11h18v8.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 19.5V11Zm9 2.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
    </svg>
  );
}

export function IconGrid(p) {
  return (
    <svg {...base} {...p}>
      <rect x="2.5" y="2.5" width="8.5" height="8.5" rx="2.2" />
      <rect x="13" y="2.5" width="8.5" height="8.5" rx="2.2" />
      <rect x="2.5" y="13" width="8.5" height="8.5" rx="2.2" />
      <rect x="13" y="13" width="8.5" height="8.5" rx="2.2" opacity="0.45" />
    </svg>
  );
}

export function IconBell(p) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2a6 6 0 0 0-6 6c0 3.6-.9 5.2-1.7 6.1-.5.6-.1 1.6.7 1.6h14c.8 0 1.2-1 .7-1.6C18.9 13.2 18 11.6 18 8a6 6 0 0 0-6-6Z" />
      <path d="M9.6 17.5a2.5 2.5 0 0 0 4.8 0H9.6Z" />
    </svg>
  );
}

export function IconMail(p) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 7.4V17a2.5 2.5 0 0 0 2.5 2.5h14A2.5 2.5 0 0 0 21.5 17V7.4l-8.8 6.1a1.2 1.2 0 0 1-1.4 0L2.5 7.4Z" />
      <path d="M21.3 5.2A2.5 2.5 0 0 0 19 4H5a2.5 2.5 0 0 0-2.3 1.2L12 11.6l9.3-6.4Z" />
    </svg>
  );
}

export function IconClock(p) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5.5v4.9l3 1.9a1 1 0 1 1-1.1 1.7l-3.4-2.2a1 1 0 0 1-.5-.9V7.5a1 1 0 1 1 2 0Z" />
    </svg>
  );
}

export function IconDoc(p) {
  return (
    <svg {...base} {...p}>
      <path d="M13.5 2H7a2.5 2.5 0 0 0-2.5 2.5v15A2.5 2.5 0 0 0 7 22h10a2.5 2.5 0 0 0 2.5-2.5V8h-4.5a1.5 1.5 0 0 1-1.5-1.5V2Zm-4 10h5a1 1 0 1 1 0 2h-5a1 1 0 1 1 0-2Zm0 4h3.5a1 1 0 1 1 0 2H9.5a1 1 0 1 1 0-2Z" />
      <path d="M15.5 2.3V6.5h4.2l-4.2-4.2Z" />
    </svg>
  );
}

export function IconShield(p) {
  return (
    <svg {...base} {...p}>
      <path d="M11.6 2.1 5 4.9a1.5 1.5 0 0 0-.9 1.4V12c0 4.9 3.3 8.6 7.6 10 4.3-1.4 7.6-5.1 7.6-10V6.3a1.5 1.5 0 0 0-.9-1.4l-6.6-2.8a1.5 1.5 0 0 0-1.2 0Zm4.1 7.2-4.3 4.5a1 1 0 0 1-1.45 0L8 11.8a1 1 0 1 1 1.45-1.38l1.22 1.28 3.58-3.77a1 1 0 0 1 1.45 1.37Z" />
    </svg>
  );
}

export function IconUsers(p) {
  return (
    <svg {...base} {...p}>
      <circle cx="9" cy="7.3" r="3.9" />
      <path d="M9 12.8c-3.5 0-6.3 2.3-6.3 5.3 0 .9.7 1.6 1.6 1.6h9.4c.9 0 1.6-.7 1.6-1.6 0-3-2.8-5.3-6.3-5.3Z" />
      <circle cx="17.4" cy="8.6" r="2.9" opacity="0.55" />
      <path d="M17.4 12.9c-.7 0-1.4.1-2 .3a8 8 0 0 1 2.5 4.9c0 .3 0 .6-.1.9h3a1.4 1.4 0 0 0 1.4-1.4c0-2.6-2.2-4.7-4.8-4.7Z" opacity="0.55" />
    </svg>
  );
}

export function IconArrowUpRight(p) {
  return (
    <svg {...base} {...p}>
      <path d="M8.5 5.5h9a1 1 0 0 1 1 1v9a1 1 0 1 1-2 0V8.9L7.2 18.2a1 1 0 0 1-1.4-1.4L15.1 7.5H8.5a1 1 0 0 1 0-2Z" />
    </svg>
  );
}

export function IconSearch(p) {
  return (
    <svg {...base} {...p}>
      <path d="M10.8 3a7.8 7.8 0 1 0 4.7 14l4.3 4.2a1 1 0 0 0 1.4-1.4l-4.2-4.3A7.8 7.8 0 0 0 10.8 3Zm0 2.2a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Z" />
    </svg>
  );
}

export function IconRefresh(p) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.2a8.8 8.8 0 0 1 7.5 4.2V4.6a1 1 0 1 1 2 0v5a1 1 0 0 1-1 1h-5a1 1 0 1 1 0-2h2.8A6.8 6.8 0 0 0 5.3 11a1 1 0 0 1-2-.2A8.8 8.8 0 0 1 12 3.2Zm8.7 8.2a1 1 0 0 1 .9 1.1 8.8 8.8 0 0 1-16.1 3.9v2.8a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H6.7a6.8 6.8 0 0 0 12.9-2.9 1 1 0 0 1 1.1-.9Z" />
    </svg>
  );
}

export function IconBan(p) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM5.6 12a6.4 6.4 0 0 1 10-5.3L6.7 15.6A6.4 6.4 0 0 1 5.6 12Zm6.4 6.4a6.4 6.4 0 0 1-3.7-1.2l8.9-8.9A6.4 6.4 0 0 1 12 18.4Z" />
    </svg>
  );
}

export function IconUser(p) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="7.5" r="4.5" />
      <path d="M12 13.5c-4.4 0-8 2.8-8 6.3 0 1.2 1 2.2 2.2 2.2h11.6c1.2 0 2.2-1 2.2-2.2 0-3.5-3.6-6.3-8-6.3Z" />
    </svg>
  );
}

export function IconCard(p) {
  return (
    <svg {...base} {...p}>
      <path d="M2 7.5A2.5 2.5 0 0 1 4.5 5h15A2.5 2.5 0 0 1 22 7.5V9H2V7.5Z" />
      <path d="M2 11h20v5.5a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 16.5V11Zm3.5 3.25a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4Z" />
    </svg>
  );
}

export function IconLock(p) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2a5 5 0 0 0-5 5v2.2A2.5 2.5 0 0 0 5 11.6v7.9A2.5 2.5 0 0 0 7.5 22h9a2.5 2.5 0 0 0 2.5-2.5v-7.9a2.5 2.5 0 0 0-2-2.4V7a5 5 0 0 0-5-5Zm3 7H9V7a3 3 0 1 1 6 0v2Zm-3 4.5a1.5 1.5 0 0 1 .8 2.8V18a.8.8 0 0 1-1.6 0v-1.7a1.5 1.5 0 0 1 .8-2.8Z" />
    </svg>
  );
}

// Three stacked bars, the middle one offset — a panel of providers with one
// row out of line.
export function Wordmark(p) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <rect x="2" y="4.5" width="20" height="3.6" rx="1.8" />
      <rect x="6.5" y="10.2" width="15.5" height="3.6" rx="1.8" opacity="0.55" />
      <rect x="2" y="15.9" width="20" height="3.6" rx="1.8" />
    </svg>
  );
}
