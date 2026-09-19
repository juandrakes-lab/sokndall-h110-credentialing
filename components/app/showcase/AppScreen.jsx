// A whole screen of the app at its real size, for the marketing pages' product
// shots: the same sidebar, top bar and floating content block as AppFrame, in
// a browser window, never tilted — a shot is only ever drawn at its size or
// smaller, which is what keeps it sharp. Server-safe: no hooks.

import { ICONS, Icon, PersonPhoto } from "@/components/app/ui";
import { PEOPLE } from "@/components/app/showcase/parts";

const NAV = [
  ["dashboard", "Dashboard", ICONS.dashboard],
  ["clients", "Clients", ICONS.clients],
  ["followUps", "Follow-ups", ICONS.followUps, 20],
  ["providers", "Providers", ICONS.providers],
  ["enrollments", "Enrollments", ICONS.enrollments],
  ["documents", "Documents", ICONS.documents],
];

export const floatShadow = "shadow-[0_2px_6px_rgba(14,42,46,0.10),0_28px_56px_-20px_rgba(14,42,46,0.45)] ring-1 ring-ink-900/[0.06]";

// A small indicator card floating over a shot, placed on the scene's canvas.
export function Chip({ x, y, w, bob = 0, children }) {
  return (
    <div className="absolute" style={{ left: x, top: y, width: w }}>
      <div className={`auth-float rounded-2xl bg-white ${floatShadow}`} style={{ animationDelay: `${bob}s` }}>
        {children}
      </div>
    </div>
  );
}

export default function AppScreen({ x = 0, y = 0, w, h, active = "dashboard", url = "dashboard", children }) {
  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_2px_6px_rgba(14,42,46,0.08),0_40px_80px_-30px_rgba(14,42,46,0.45)] ring-1 ring-ink-900/[0.08]"
      style={{ left: x, top: y, width: w, height: h }}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-ink-900/[0.06] bg-white px-4">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="mx-auto flex h-6 w-72 items-center justify-center gap-1.5 rounded-md bg-ink-50 text-[0.6875rem] text-ink-500">
          <Icon d={ICONS.shield} className="h-3 w-3" /> sokndall.com/{url}
        </span>
        <span className="w-12" />
      </div>
      <div className="app-ground-flat flex min-h-0 flex-1">
        <aside className="flex w-56 shrink-0 flex-col gap-1 px-3 pb-4 pt-4">
          <div className="flex items-center gap-2.5 pl-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-700 text-[0.9375rem] font-semibold text-white">S</span>
            <span className="text-[1.0625rem] font-semibold tracking-tight text-ink-900">Sokndall</span>
          </div>
          <div className="mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2">
            <Icon d={ICONS.switch} className="h-[18px] w-[18px] text-ink-700" />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.6875rem] font-medium text-ink-500">Client</span>
              <span className="block truncate text-sm font-semibold text-ink-900">Riverside Pediatrics PLLC</span>
            </span>
          </div>
          <p className="mt-3 px-3 pb-1.5 text-xs font-medium text-ink-700">Work</p>
          {NAV.map(([key, label, icon, count]) => {
            const on = key === active;
            return (
              <span
                key={key}
                className={`flex h-10 items-center gap-3 rounded-xl px-3 text-[0.9375rem] ${on ? "bg-white font-semibold text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.10),0_4px_12px_-4px_rgba(14,42,46,0.12)]" : "font-medium text-ink-900/85"}`}
              >
                <Icon d={icon} className={`h-[18px] w-[18px] ${on ? "text-brand-600" : "text-ink-700"}`} />
                {label}
                {count ? <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[0.6875rem] font-semibold text-white">{count}</span> : null}
              </span>
            );
          })}
          <div className="mt-auto flex items-center gap-2.5 px-2">
            <PersonPhoto name={PEOPLE.erin.name} photo={PEOPLE.erin.photo} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink-900">{PEOPLE.erin.name}</span>
              <span className="block truncate text-[0.6875rem] text-ink-500">Billing Co plan</span>
            </span>
          </div>
        </aside>
        <main className="my-2 mr-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] bg-canvas shadow-[0_1px_2px_rgba(14,42,46,0.05),0_16px_48px_-12px_rgba(14,42,46,0.16)] ring-1 ring-ink-900/[0.05]">
          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-ink-900/[0.06] px-7">
            <span className="flex h-9 w-80 items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-500">
              <Icon d={ICONS.search} className="h-4 w-4" /> Search providers, payers, documents…
              <kbd className="ml-auto text-[0.625rem] font-medium">Ctrl K</kbd>
            </span>
            <span className="ml-auto flex items-center gap-1 text-ink-700">
              <span className="flex h-9 w-9 items-center justify-center"><Icon d={ICONS.importExport} className="h-[18px] w-[18px]" /></span>
              <span className="flex h-9 w-9 items-center justify-center"><Icon d={ICONS.settings} className="h-[18px] w-[18px]" /></span>
            </span>
            <span className="flex h-9 items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 text-sm font-medium text-white">
              <Icon d={ICONS.plus} className="h-4 w-4" strokeWidth={2.2} /> New
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden px-7 pt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
