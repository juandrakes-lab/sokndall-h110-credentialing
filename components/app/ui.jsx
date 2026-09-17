// Small presentational kit for the authenticated app (Tailwind v4 tokens from
// app/globals.css). Server-safe: no hooks, so pages and client forms share it.

const BUTTON = {
  primary: "bg-brand-700 text-white hover:bg-brand-600",
  secondary: "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50",
  ghost: "text-ink-700 hover:bg-ink-100",
  danger: "bg-status-expired text-white hover:opacity-90",
  link: "text-brand-600 underline-offset-2 hover:underline px-0 py-0",
};

export function buttonClass(variant = "primary", size = "md") {
  const sizing = variant === "link" ? "" : size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  return `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${sizing} ${BUTTON[variant]}`;
}

export function PageHeader({ title, description, actions, eyebrow }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5 text-sm text-ink-500">{eyebrow}</div>}
        <h1 className="text-[1.625rem] font-semibold leading-tight tracking-tight text-ink-900">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[0.9375rem] text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "", as: Tag = "section" }) {
  return (
    <Tag className={`rounded-2xl border border-ink-200/80 bg-white ${className}`}>{children}</Tag>
  );
}

export function CardHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-2 border-b border-ink-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

const TONES = {
  green: "bg-status-active-bg text-status-active ring-status-active/20",
  amber: "bg-status-expiring-bg text-status-expiring ring-status-expiring/25",
  red: "bg-status-expired-bg text-status-expired ring-status-expired/20",
  neutral: "bg-status-neutral-bg text-status-neutral ring-ink-200",
  brand: "bg-brand-50 text-brand-600 ring-brand-100",
  blue: "bg-sky-50 text-sky-800 ring-sky-200",
};

export function Badge({ tone = "neutral", children }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}>
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
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-700">
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

const PILL_TONES = {
  brand: "bg-brand-50 text-brand-700 [&_svg]:text-brand-600",
  amber: "bg-status-expiring-bg text-status-expiring",
  red: "bg-status-expired-bg text-status-expired",
  green: "bg-status-active-bg text-status-active",
  neutral: "bg-ink-100 text-ink-700 [&_svg]:text-ink-500",
};

// A section's name as a soft pill with its icon (the reference's "Code Review"
// heading), with the count beside it. Used where a page has a few big blocks
// instead of boxes inside boxes.
export function SectionPill({ icon, tone = "brand", count, children, as: Tag = "h2" }) {
  return (
    <Tag className="flex items-center gap-2.5">
      <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.9375rem] font-medium ${PILL_TONES[tone]}`}>
        {icon && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d={icon} />
          </svg>
        )}
        {children}
      </span>
      {count !== undefined && <span className="text-sm font-medium tabular-nums text-ink-500">{count}</span>}
    </Tag>
  );
}

// Remembers whether the sidebar is folded. Lives here, not in the "use client"
// AppFrame, because the server layout reads it too.
export const NAV_COOKIE = "sk_nav";

// Stroke icons (24px grid) shared by the sidebar and section pills.
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
};
