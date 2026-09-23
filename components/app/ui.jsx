// Small presentational kit for the authenticated app (Tailwind v4 tokens from
// app/globals.css). Server-safe: no hooks, so pages and client forms share it.
//
// Depth, in three layers: the coloured ground (sidebar), the canvas of the
// floating block, and white cards with a soft shadow on it. Text is ink by
// default; grey (ink-500) is for hints, dates-as-metadata and empty states.

const BUTTON = {
  primary: "bg-brand-700 text-white shadow-[0_1px_2px_rgba(14,42,46,0.25)] hover:bg-brand-600",
  secondary: "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 shadow-[0_1px_2px_rgba(14,42,46,0.05)] hover:bg-ink-50",
  ghost: "text-ink-900 hover:bg-ink-100",
  danger: "bg-status-expired text-white hover:opacity-90",
  link: "text-sm font-medium text-ink-500 underline-offset-4 hover:text-brand-600 hover:underline px-0 py-0",
};

export function buttonClass(variant = "primary", size = "md") {
  const sizing = variant === "link" ? "" : size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4 text-sm";
  return `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${sizing} ${BUTTON[variant]}`;
}

export function PageHeader({ title, description, actions, eyebrow }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2 text-sm font-medium text-ink-700">{eyebrow}</div>}
        <h1 className="text-[2rem] font-normal leading-[1.1] tracking-[-0.03em] text-ink-900 sm:text-[2.375rem]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 lg:shrink-0">{actions}</div>}
    </div>
  );
}

export const cardClass = "rounded-2xl bg-white shadow-[0_1px_2px_rgba(14,42,46,0.05),0_6px_20px_-6px_rgba(14,42,46,0.08)] ring-1 ring-ink-900/[0.06]";

export function Card({ children, className = "", as: Tag = "section", ...rest }) {
  return (
    <Tag className={`${cardClass} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, actions, icon, divider = true }) {
  return (
    <div className={`flex flex-col gap-3 px-5 pb-4 pt-5 sm:flex-row sm:items-start sm:justify-between ${divider ? "border-b border-ink-100" : ""}`}>
      <div className="flex min-w-0 items-start gap-2.5">
        {icon && <IconTile d={icon} />}
        <div className="min-w-0">
          <h2 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

// A section's stroke icon, sitting straight on the surface in its tone — no
// box around it (the reference's marks).
export function IconTile({ d, tone = "brand", size = "md" }) {
  const tones = {
    brand: "text-brand-600",
    amber: "text-status-expiring",
    red: "text-status-expired",
    green: "text-status-active",
    neutral: "text-ink-700",
    accent: "text-accent-700",
  };
  const box = size === "sm" ? "h-[22px] w-[22px]" : "h-6 w-6";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`mt-px shrink-0 ${box} ${tones[tone]}`} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const TONES = {
  green: "bg-status-active-bg text-status-active",
  amber: "bg-status-expiring-bg text-status-expiring",
  red: "bg-status-expired-bg text-status-expired",
  neutral: "bg-status-neutral-bg text-ink-700",
  brand: "bg-brand-50 text-brand-700",
  violet: "bg-enroll-purple-bg text-enroll-purple",
  blue: "bg-sky-50 text-sky-800",
};

export function Badge({ tone = "neutral", children, dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium shadow-[0_1px_2px_rgba(14,42,46,0.10),0_1px_1px_rgba(14,42,46,0.04)] ${TONES[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function Field({ label, htmlFor, hint, required, error, children, className = "" }) {
  // An error turns the field's own input red, not just the message under it.
  const invalid = error
    ? "[&_:is(input,select,textarea)]:border-status-expired [&_:is(input,select,textarea)]:ring-2 [&_:is(input,select,textarea)]:ring-status-expired-bg"
    : "";
  return (
    <div className={`flex flex-col gap-1.5 ${invalid} ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-900">
        {label}
        {required && <span className="text-status-expired"> *</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-status-expired">{error}</p>
      ) : (
        hint && <p className="text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-500/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-ink-50";

export function FormError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-xl border border-status-expired/30 bg-status-expired-bg px-4 py-3 text-sm text-status-expired">
      {message}
    </div>
  );
}

export function FormNotice({ message }) {
  if (!message) return null;
  return (
    <div role="status" className="rounded-xl border border-status-active/30 bg-status-active-bg px-4 py-3 text-sm text-status-active">
      {message}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      {description && <p className="max-w-md text-sm text-ink-500">{description}</p>}
      {action}
    </div>
  );
}

const HEADING_TONES = {
  brand: "text-brand-600",
  amber: "text-status-expiring",
  red: "text-status-expired",
  green: "text-status-active",
  neutral: "text-ink-700",
};

// A section's name: its icon in the section's tone, the title, and the count.
export function SectionPill({ icon, tone = "brand", count, children, as: Tag = "h2" }) {
  return (
    <Tag className="flex items-center gap-2.5">
      {icon && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 shrink-0 ${HEADING_TONES[tone]}`} aria-hidden="true">
          <path d={icon} />
        </svg>
      )}
      <span className="text-lg font-semibold tracking-[-0.01em] text-ink-900">{children}</span>
      {count !== undefined && (
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold tabular-nums text-ink-700 shadow-[0_1px_2px_rgba(14,42,46,0.10)]">{count}</span>
      )}
    </Tag>
  );
}

// A headline number with its label: the dashboards' KPI. `href` makes the whole
// tile a link; `meter` (0–1) draws a thin progress bar under the figure.
export function StatCard({ label, value, suffix, hint, icon, tone = "brand", href, meter, Link, accent = false, onInk = false }) {
  if (accent) {
    // The one filled tile on a page: the number that frames the rest.
    // `onInk`: the same tile standing on an ink ground (the marketing hero's
    // phone shot). Its fill is the panel's own ink and its shadow is ink, so
    // there it had no edge and no depth at all. One step lighter, a white
    // hairline for the edge, and the black on-ink shadow of the showcase's
    // depth system. The app itself never passes it. 2026-09-21.
    const skin = onInk
      ? "bg-brand-600 ring-1 ring-white/15 shadow-[0_2px_6px_rgba(0,0,0,0.30),0_26px_50px_-16px_rgba(0,0,0,0.70)]"
      : "bg-brand-700 shadow-[0_1px_2px_rgba(14,42,46,0.10),0_10px_30px_-12px_rgba(14,42,46,0.55)]";
    return (
      <div className={`relative overflow-hidden rounded-2xl px-5 py-4 text-white ${skin}`}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(242,193,78,0.35), transparent)" }} />
        <div className="relative flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-white/85">{label}</span>
          {icon && <Icon d={icon} className="h-[22px] w-[22px] text-accent-400" />}
        </div>
        <div className="relative mt-3 text-[2rem] font-semibold leading-none tracking-[-0.02em] tabular-nums">{value}</div>
        {hint && <p className="relative mt-2 text-xs text-white/70">{hint}</p>}
      </div>
    );
  }
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink-900">{label}</span>
        {icon && <IconTile d={icon} tone={tone} size="sm" />}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[2rem] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink-900">{value}</span>
        {suffix && <span className="text-sm font-medium text-ink-500">{suffix}</span>}
      </div>
      {meter !== undefined && <Meter value={meter} tone={tone} className="mt-3" />}
      {hint && <p className="mt-2 text-xs text-ink-500">{hint}</p>}
    </>
  );
  const cls = `${cardClass} block px-5 py-4`;
  if (href && Link) {
    return (
      <Link href={href} className={`${cls} transition hover:ring-ink-900/15`}>
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}

// A row of StatCards: three columns on a laptop, a swipeable strip on a phone
// (stacked, three tiles would push the page's real content off the screen).
export function StatRow({ children, cols = 3 }) {
  const grid = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  return (
    <div className={`-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 -mb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:gap-4 sm:overflow-visible sm:mb-0 sm:px-0 sm:pb-0 [&>*]:w-[78%] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-auto ${grid}`}>
      {children}
    </div>
  );
}

const METER_FILL = {
  brand: "bg-brand-600",
  green: "bg-status-active",
  amber: "bg-status-expiring",
  red: "bg-status-expired",
  accent: "bg-accent-400",
  neutral: "bg-ink-500",
};

export function Meter({ value, tone = "brand", className = "" }) {
  const pct = Math.max(0, Math.min(1, value || 0)) * 100;
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-ink-100 ${className}`} role="presentation">
      <div className={`h-full rounded-full ${METER_FILL[tone]}`} style={{ width: `${pct > 0 ? Math.max(pct, 2) : 0}%` }} />
    </div>
  );
}

// A ring for one share (e.g. providers fully current). Stroke 8, round cap,
// the share in the middle; the label always rides beside it in text.
export function Ring({ value, size = 88, tone = "green", children }) {
  const colors = { green: "var(--color-status-active)", amber: "var(--color-status-expiring)", red: "var(--color-status-expired)", brand: "var(--color-brand-600)" };
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const share = Math.max(0, Math.min(1, value || 0));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-ink-100)" strokeWidth="8" />
        {share > 0 && (
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors[tone]} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${c * share} ${c}`} />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

// Enrollment statuses as marks (bars, dots). Validated as a set for colour-blind
// separation in this order; every use ships a label and a count beside it.
export const STATUS_FILL = {
  approved: "#16a34a",
  in_review: "#0284c7",
  submitted: "#7c3aed",
  info_requested: "#d97706",
  denied: "#be123c",
  not_started: "#cbd5e1",
};
export const PIPELINE_ORDER = ["approved", "in_review", "submitted", "info_requested", "denied", "not_started"];

// One horizontal stacked bar, 2px surface gaps between segments.
export function SegmentBar({ segments, height = 12 }) {
  const total = segments.reduce((n, s) => n + s.value, 0);
  if (!total) return <div className="rounded-full bg-ink-100" style={{ height }} />;
  return (
    <div className="flex w-full gap-[2px] overflow-hidden rounded-full" style={{ height }}>
      {segments
        .filter((s) => s.value > 0)
        .map((s) => (
          <div key={s.key} title={`${s.label}: ${s.value}`} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
        ))}
    </div>
  );
}

export function initials(name, fallback) {
  const source = (name || fallback || "?").trim();
  // An email stands in for a name until the person sets one: one letter only.
  if (source.includes("@")) return source[0].toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

const AVATAR_TONES = ["bg-brand-50 text-brand-700", "bg-accent-100 text-accent-700", "bg-sky-50 text-sky-800", "bg-enroll-purple-bg text-enroll-purple", "bg-status-active-bg text-status-active"];

// Initials in a circle, the colour picked from the name so a person keeps it.
export function Avatar({ name, photo, size = "md" }) {
  const hash = [...(name ?? "")].reduce((n, ch) => n + ch.charCodeAt(0), 0);
  const box = size === "lg" ? "h-14 w-14 text-lg" : size === "sm" ? "h-8 w-8 text-[0.6875rem]" : "h-9 w-9 text-xs";
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element -- a small avatar; next/image adds nothing here
    return <img src={photo} alt="" className={`${box} shrink-0 rounded-full object-cover`} referrerPolicy="no-referrer" />;
  }
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${box} ${AVATAR_TONES[hash % AVATAR_TONES.length]}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

// A person who signs in: the photo they uploaded, else the one their Google
// sign-in supplies, else initials on the site's yellow. Providers never get
// a photo — they are records, not users; they keep an initials circle.
export function PersonPhoto({ name, photo, size = "md" }) {
  const box = { sm: "h-7 w-7 text-[0.6875rem]", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base", xl: "h-20 w-20 text-2xl" }[size];
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element -- a 256px avatar from Storage or Google; next/image adds nothing here
    return <img src={photo} alt="" className={`${box} shrink-0 rounded-full object-cover ring-2 ring-white`} referrerPolicy="no-referrer" />;
  }
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-accent-400 font-semibold text-brand-700 ${box}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

// Page-level tabs as links (the state lives in the URL, so the server renders
// the right one and a tab can be bookmarked).
export function Tabs({ tabs, active, Link }) {
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" aria-label="Sections">
      {tabs.map((t) => {
        const on = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.href}
            scroll={false}
            aria-current={on ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              on ? "bg-brand-700 text-white" : "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`rounded-full px-1.5 text-xs tabular-nums ${on ? "bg-white/20 text-white" : "bg-ink-100 text-ink-700"}`}>{t.count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// Remembers whether the sidebar is folded. Lives here, not in the "use client"
// AppFrame, because the server layout reads it too.
export const NAV_COOKIE = "sk_nav";

// Stroke icons (24px grid) shared by the sidebar, tiles and section pills.
export const ICONS = {
  dashboard: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  followUps: "M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  providers: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-1a6 6 0 0112 0v1M18 11a3 3 0 100-6M22 21v-1a5 5 0 00-3-4.58",
  enrollments: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  documents: "M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9zM14 3v6h6M8 13h8M8 17h5",
  importExport: "M7 4v12M3 12l4 4 4-4M17 20V8M13 12l4-4 4 4",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z",
  clients: "M3 21V7l9-4 9 4v14M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01",
  calendar: "M8 3v3M16 3v3M4 8h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  pause: "M10 9v6M14 9v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  filter: "M4 6h16M7 12h10M10 18h4",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-3.5-3.5",
  plus: "M12 5v14M5 12h14",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert: "M12 9v4M12 17h.01M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4",
  pulse: "M3 12h4l3-8 4 16 3-8h4",
  file: "M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9zM14 3v6h6",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  card: "M3 6h18v12H3zM3 10h18",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  team: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21v-1a7 7 0 0114 0v1M16 3.13a4 4 0 010 7.75M22 21v-1a7 7 0 00-4-6.3",
  building: "M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16M16 9h2a2 2 0 012 2v10M8 7h4M8 11h4M8 15h4M3 21h18",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  help: "M12 21a9 9 0 100-18 9 9 0 000 18z M9.6 9.2a2.5 2.5 0 014.9.8c0 1.7-2.5 2-2.5 3.5 M12 17h.01",
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
  switch: "M8 9l4-4 4 4M16 15l-4 4-4-4",
  logout: "M15 17l5-5-5-5M20 12H9M12 21H6a2 2 0 01-2-2V5a2 2 0 012-2h6",
};

export function Icon({ d, className = "h-[18px] w-[18px]", strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
