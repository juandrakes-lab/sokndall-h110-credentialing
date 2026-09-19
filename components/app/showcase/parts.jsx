// The product, rebuilt in HTML from the app's own parts — shared by the
// access screens' stories (AuthStories) and the marketing pages' product shots
// (ProductShot). Never a screenshot: the same components the app renders, fed
// the demo client's figures (Riverside Pediatrics, test data). People who sign
// in carry generic names and Pexels portraits; providers keep initials, as in
// the app. Server-safe: no hooks.

import { Avatar, IconTile, ICONS, Icon, cardClass } from "@/components/app/ui";

// Pexels, cropped to 160px squares in public/app/people/.
export const PEOPLE = {
  erin: { name: "Erin Walsh", photo: "/app/people/erin.jpg" }, // Alexander Zvir — pexels.com/photo/34761515
  luis: { name: "Luis Moreno", photo: "/app/people/luis.jpg" }, // Apunto Group — pexels.com/photo/7752822
  ana: { name: "Ana Ruiz", photo: "/app/people/ana.jpg" }, // Alvaro Balderas — pexels.com/photo/33680700
};

// The matrix cell, exactly as the app draws it (enrollments/page.jsx).
export const CHIP = {
  not_started: "bg-transparent text-ink-500 border border-dashed border-ink-200",
  submitted: "bg-enroll-purple-bg text-enroll-purple shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  in_review: "bg-sky-50 text-sky-800 shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  info_requested: "bg-status-expiring-bg text-status-expiring shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  approved: "bg-status-active-bg text-status-active shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  denied: "bg-status-expired-bg text-status-expired shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
};

export const deep = "shadow-[0_2px_6px_rgba(0,0,0,0.14),0_30px_60px_-18px_rgba(0,0,0,0.55)]";

// ---- building blocks -------------------------------------------------------

// A window of the app, tilted away from the reader and anchored on its left
// edge, so its far side runs past the panel's edge.
export function AppWindow({ x, y, w, h, nav = "dashboard", tilt = -8, children }) {
  const items = ["dashboard", "followUps", "providers", "enrollments", "documents"];
  return (
    <div
      className="absolute overflow-hidden rounded-[20px] bg-[#eef1ef] ring-1 ring-black/5 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.65)]"
      style={{ left: x, top: y, width: w, height: h, transform: `perspective(2200px) rotateY(${tilt}deg) rotateX(2deg)`, transformOrigin: "left center" }}
    >
      <div className="flex h-11 items-center gap-2 border-b border-ink-900/[0.06] bg-white/80 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="ml-6 flex h-7 w-40 items-center whitespace-nowrap gap-2 rounded-lg border border-ink-200 bg-white px-3 text-[0.6875rem] text-ink-500">
          <Icon d={ICONS.search} className="h-3.5 w-3.5" /> Search…
        </span>
        <span className="ml-auto mr-2 flex h-7 items-center gap-1 rounded-lg bg-brand-700 px-3 text-[0.6875rem] font-medium text-white">
          <Icon d={ICONS.plus} className="h-3 w-3" strokeWidth={2.4} /> New
        </span>
      </div>
      <div className="flex h-[calc(100%-2.75rem)]">
        <div className="flex w-14 shrink-0 flex-col items-center gap-2 pt-4" style={{ background: "linear-gradient(180deg, rgba(44,95,100,0.16), rgba(242,193,78,0.18))" }}>
          <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-700 text-xs font-semibold text-white">S</span>
          {items.map((k) => (
            <span key={k} className={`flex h-8 w-8 items-center justify-center rounded-lg ${k === nav ? "bg-white text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.12)]" : "text-ink-700"}`}>
              <Icon d={ICONS[k]} className="h-4 w-4" />
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

// A card floating in front of the window. `bob` staggers the slow drift.
export function Float({ x, y, w, bob = 0, className = "", children }) {
  return (
    <div className="absolute" style={{ left: x, top: y, width: w }}>
      <div className={`auth-float rounded-2xl bg-white ${deep} ${className}`} style={{ animationDelay: `${bob}s` }}>
        {children}
      </div>
    </div>
  );
}

export function Title({ children, sub }) {
  return (
    <div className="mb-4">
      <p className="text-[1.625rem] font-normal leading-none tracking-[-0.03em] text-ink-900">{children}</p>
      {sub && <p className="mt-1.5 text-xs text-ink-500">{sub}</p>}
    </div>
  );
}

export function Stat({ label, value, hint, icon, tone = "brand", accent = false }) {
  if (accent) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-brand-700 px-4 py-3.5 text-white shadow-[0_10px_30px_-12px_rgba(14,42,46,0.55)]">
        <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(242,193,78,0.4), transparent)" }} />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-medium text-white/85">{label}</span>
          <Icon d={icon} className="h-4 w-4 text-accent-400" />
        </div>
        <p className="relative mt-2 text-[1.625rem] font-semibold leading-none">{value}</p>
        <p className="relative mt-1.5 text-[0.6875rem] text-white/70">{hint}</p>
      </div>
    );
  }
  return (
    <div className={`${cardClass} px-4 py-3.5`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-900">{label}</span>
        <IconTile d={icon} tone={tone} size="sm" />
      </div>
      <p className="mt-2 text-[1.625rem] font-semibold leading-none text-ink-900">{value}</p>
      <p className="mt-1.5 text-[0.6875rem] text-ink-500">{hint}</p>
    </div>
  );
}

export function Row({ name, detail, children }) {
  return (
    <div className="flex items-center gap-3 border-t border-ink-100 px-4 py-2.5">
      <Avatar name={name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8125rem] font-medium text-ink-900">{name}</p>
        <p className="truncate text-[0.6875rem] text-ink-500">{detail}</p>
      </div>
      {children}
    </div>
  );
}
