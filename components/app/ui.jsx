// Small presentational kit for the authenticated app (Tailwind v4 tokens from
// app/globals.css). Server-safe: no hooks, so pages and client forms share it.

const BUTTON = {
  primary: "bg-brand-700 text-white hover:bg-brand-600 shadow-sm",
  secondary: "border border-ink-200 bg-white text-ink-900 hover:bg-ink-50 shadow-sm",
  ghost: "text-ink-700 hover:bg-ink-100",
  danger: "bg-status-expired text-white hover:opacity-90 shadow-sm",
  link: "text-brand-600 underline-offset-2 hover:underline px-0 py-0",
};

export function buttonClass(variant = "primary", size = "md") {
  const sizing = variant === "link" ? "" : size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  return `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${sizing} ${BUTTON[variant]}`;
}

export function PageHeader({ title, description, actions, eyebrow }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1 text-sm text-ink-500">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "", as: Tag = "section" }) {
  return (
    <Tag className={`rounded-xl border border-ink-200 bg-white shadow-sm ${className}`}>{children}</Tag>
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
};

export function Badge({ tone = "neutral", children }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function Field({ label, htmlFor, hint, required, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-700">
        {label}
        {required && <span className="text-status-expired"> *</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-status-expired">{error}</p>
      ) : (
        hint && <p className="text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-ink-500/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-ink-50";

export function FormError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-lg border border-status-expired/30 bg-status-expired-bg px-4 py-3 text-sm text-status-expired">
      {message}
    </div>
  );
}

export function FormNotice({ message }) {
  if (!message) return null;
  return (
    <div role="status" className="rounded-lg border border-status-active/30 bg-status-active-bg px-4 py-3 text-sm text-status-active">
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
