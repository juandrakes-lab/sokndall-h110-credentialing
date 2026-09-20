// A screen of the app at its real size, for the marketing pages' product
// shots: the same sidebar, top bar and floating content block as AppFrame.
// No browser chrome — the window is the product, not the browser. Server-safe.
//
// `collapsed` folds the sidebar to its icon rail, as the app does, and moves
// the client selector into the top bar (AppFrame does exactly this), which
// buys the content ~180px — the right trade when the shot is about what is on
// the screen rather than about the app's furniture.

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

// One depth system for every shot: the app's own card shadow, deepened so a
// screen reads as lifted off the page. Cards/panels use `lift`, the small
// indicator cards `chipLift` — nothing invents its own.
export const lift = "shadow-[0_1px_2px_rgba(14,42,46,0.06),0_28px_56px_-18px_rgba(14,42,46,0.45)] ring-1 ring-ink-900/[0.07]";
export const chipLift = "shadow-[0_1px_2px_rgba(14,42,46,0.08),0_18px_36px_-14px_rgba(14,42,46,0.42)] ring-1 ring-ink-900/[0.07]";

// A small indicator card floating over a shot, placed on the scene's canvas.
export function Chip({ x, y, w, children }) {
  return (
    <div className={`absolute rounded-2xl bg-white ${chipLift}`} style={{ left: x, top: y, width: w }}>
      {children}
    </div>
  );
}

export default function AppScreen({ x = 0, y = 0, w, h, active = "dashboard", collapsed = false, children }) {
  return (
    <div className={`app-ground-flat absolute flex overflow-hidden rounded-[18px] ${lift}`} style={{ left: x, top: y, width: w, height: h }}>
      <aside className={`flex shrink-0 flex-col gap-1 px-3 pb-4 pt-4 ${collapsed ? "w-[76px] items-center" : "w-56"}`}>
        <div className={`flex items-center gap-2.5 ${collapsed ? "" : "pl-2"}`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-700 text-[0.9375rem] font-semibold text-white">S</span>
          {!collapsed && <span className="text-[1.0625rem] font-semibold tracking-tight text-ink-900">Sokndall</span>}
        </div>
        {!collapsed && (
          <div className="mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2">
            <Icon d={ICONS.switch} className="h-[18px] w-[18px] text-ink-700" />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.6875rem] font-medium text-ink-500">Client</span>
              <span className="block truncate text-sm font-semibold text-ink-900">Riverside Pediatrics PLLC</span>
            </span>
          </div>
        )}
        {!collapsed && <p className="mt-3 px-3 pb-1.5 text-xs font-medium text-ink-700">Work</p>}
        <div className={`flex flex-col gap-0.5 ${collapsed ? "mt-4 w-full items-center" : ""}`}>
          {NAV.map(([key, label, icon, count]) => {
            const on = key === active;
            return (
              <span
                key={key}
                className={`relative flex h-10 items-center gap-3 rounded-xl text-[0.9375rem] ${collapsed ? "w-10 justify-center px-0" : "px-3"} ${
                  on ? "bg-white font-semibold text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.10),0_4px_12px_-4px_rgba(14,42,46,0.12)]" : "font-medium text-ink-900/85"
                }`}
              >
                <Icon d={icon} className={`h-[18px] w-[18px] ${on ? "text-brand-600" : "text-ink-700"}`} />
                {!collapsed && label}
                {count ? (
                  collapsed ? (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-700 ring-2 ring-white/70" />
                  ) : (
                    <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[0.6875rem] font-semibold text-white">{count}</span>
                  )
                ) : null}
              </span>
            );
          })}
        </div>
        <div className={`mt-auto flex items-center gap-2.5 ${collapsed ? "" : "px-2"}`}>
          <PersonPhoto name={PEOPLE.erin.name} photo={PEOPLE.erin.photo} size="sm" />
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink-900">{PEOPLE.erin.name}</span>
              <span className="block truncate text-[0.6875rem] text-ink-500">Billing Co plan</span>
            </span>
          )}
        </div>
      </aside>
      <main className="my-2 mr-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] bg-canvas shadow-[0_1px_2px_rgba(14,42,46,0.05),0_16px_48px_-12px_rgba(14,42,46,0.16)] ring-1 ring-ink-900/[0.05]">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-ink-900/[0.06] px-7">
          {collapsed && (
            <span className="flex h-9 shrink-0 items-center gap-2 rounded-xl px-2">
              <Icon d={ICONS.switch} className="h-[18px] w-[18px] text-ink-700" />
              <span className="text-sm font-semibold text-ink-900">Riverside Pediatrics PLLC</span>
            </span>
          )}
          <span className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-500">
            <Icon d={ICONS.search} className="h-4 w-4 shrink-0" />
            <span className="truncate">Search providers, payers, documents…</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-ink-700">
            <span className="flex h-9 w-9 items-center justify-center">
              <Icon d={ICONS.importExport} className="h-[18px] w-[18px]" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center">
              <Icon d={ICONS.settings} className="h-[18px] w-[18px]" />
            </span>
          </span>
          <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 text-sm font-medium text-white">
            <Icon d={ICONS.plus} className="h-4 w-4" strokeWidth={2.2} /> New
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden px-7 pt-6">{children}</div>
      </main>
    </div>
  );
}
