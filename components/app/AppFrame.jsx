"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { switchClient } from "@/lib/client-actions";
import AppSearch from "@/components/app/AppSearch";
import ScrollLock from "@/components/app/ScrollLock";
import SubmitButton from "@/components/app/SubmitButton";
import { ICONS, Icon, NAV_COOKIE, PersonPhoto } from "@/components/app/ui";

// Alcance §5, grouped: the day-to-day work first, then the account's plumbing.
const WORK = [
  { href: "/dashboard", label: "Dashboard", icon: ICONS.dashboard, bottom: true },
  { href: "/follow-ups", label: "Follow-ups", icon: ICONS.followUps, countKey: "followUps", bottom: true },
  { href: "/providers", label: "Providers", icon: ICONS.providers, bottom: true },
  { href: "/enrollments", label: "Enrollments", icon: ICONS.enrollments, bottom: true },
  { href: "/documents", label: "Documents", icon: ICONS.documents },
];
const MANAGE = [
  { href: "/import-export", label: "Import / Export", icon: ICONS.importExport },
  { href: "/settings", label: "Settings", icon: ICONS.settings },
];
// Billing Co only: the panel across all clients.
const CLIENTS = { href: "/clients", label: "Clients", icon: ICONS.clients };

const isOn = (pathname, href) => pathname === href || pathname.startsWith(href + "/");

function NavLink({ item, pathname, folded, count, onNavigate }) {
  const active = isOn(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={folded ? item.label : undefined}
      className={`group relative flex h-10 items-center gap-3 rounded-xl text-[0.9375rem] transition-colors ${folded ? "justify-center px-0" : "px-3"} ${
        active ? "bg-white font-semibold text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.10),0_4px_12px_-4px_rgba(14,42,46,0.12)]" : "font-medium text-ink-900/85 hover:bg-white/55 hover:text-ink-900"
      }`}
    >
      <Icon d={item.icon} className={`h-[18px] w-[18px] ${active ? "text-brand-600" : "text-ink-700"}`} />
      {!folded && <span className="truncate">{item.label}</span>}
      {count > 0 &&
        (folded ? (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-700 ring-2 ring-white/70" aria-label={`${count} due`} />
        ) : (
          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[0.6875rem] font-semibold tabular-nums text-white">{count}</span>
        ))}
    </Link>
  );
}

// The client this whole app is showing (alcance §4.4) — on the ground, not in a
// white box, and the same menu on the phone.
function ClientMenu({ clients, activeId, folded, align = "left" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef(null);
  const active = clients.find((c) => c.id === activeId);

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={folded ? active?.name : undefined}
        className={`flex w-full items-center gap-2.5 rounded-xl transition-colors hover:bg-white/55 ${folded ? "justify-center p-2" : "px-3 py-2"}`}
      >
        {folded ? (
          pending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-700 border-t-transparent" />
          ) : (
            <Icon d={ICONS.switch} className="h-[18px] w-[18px] text-ink-700" />
          )
        ) : (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[0.6875rem] font-medium text-ink-500">Client</span>
              <span className="block truncate text-sm font-semibold text-ink-900">{active?.name}</span>
            </span>
            {pending ? (
              <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-ink-700 border-t-transparent" />
            ) : (
              <Icon d={ICONS.chevronDown} className="h-4 w-4 text-ink-700" />
            )}
          </>
        )}
      </button>

      {open && (
        <div className={`absolute z-40 mt-1 w-64 rounded-2xl glass p-1.5 ${align === "left" ? "left-0" : "right-0"}`}>
          <p className="px-3 py-1.5 text-xs font-medium text-ink-500">Clients</p>
          <ul className="max-h-72 overflow-y-auto">
            {clients.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setOpen(false);
                    startTransition(() => switchClient(c.id, pathname));
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm ${c.id === activeId ? "bg-ink-50 font-semibold text-ink-900" : "text-ink-900 hover:bg-ink-50"}`}
                >
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  {c.id === activeId && <Icon d={ICONS.check} className="h-4 w-4 text-brand-600" />}
                </button>
              </li>
            ))}
          </ul>
          <Link href="/clients" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-brand-600 hover:bg-ink-50">
            <Icon d={ICONS.clients} className="h-4 w-4" /> Manage clients
          </Link>
        </div>
      )}
    </div>
  );
}

function NewMenu({ owner, multi }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const items = [
    { href: "/providers/new", label: "Provider", hint: "Add one by NPI", icon: ICONS.providers },
    { href: "/documents?upload=1", label: "Document", hint: "Upload a license, W-9, CV…", icon: ICONS.upload },
    { href: "/import-export/providers", label: "Import providers", hint: "From a CSV spreadsheet", icon: ICONS.importExport },
    ...(owner ? [{ href: "/settings?tab=team", label: "Teammate", hint: "Invite by email", icon: ICONS.team }] : []),
    ...(owner && multi ? [{ href: "/clients/new", label: "Client", hint: "A new practice to manage", icon: ICONS.clients }] : []),
  ];
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgba(14,42,46,0.25)] hover:bg-brand-600">
        <Icon d={ICONS.plus} className="h-4 w-4" strokeWidth={2.2} />
        New
      </button>
      {open && (
        <div className="glass absolute right-0 top-full z-40 mt-2 w-64 p-1.5">
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/70">
              <Icon d={item.icon} className="h-[18px] w-[18px] text-brand-600" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink-900">{item.label}</span>
                <span className="block truncate text-xs text-ink-500">{item.hint}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// A tool reached from the top bar: an icon, its name on hover.
function ToolLink({ href, label, icon, pathname }) {
  const active = isOn(pathname, href);
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${active ? "bg-white text-brand-600 shadow-[0_1px_2px_rgba(14,42,46,0.10)]" : "text-ink-700 hover:bg-white/70 hover:text-ink-900"}`}
    >
      <Icon d={icon} className="h-[19px] w-[19px]" />
    </Link>
  );
}

function UserMenu({ folded, displayName, email, photo, trial, signOut, align = "up" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {open && (
        <div className={`absolute z-40 w-60 rounded-2xl glass p-1.5 ${align === "up" ? "bottom-full mb-2 left-0" : "top-full mt-2 right-0"}`}>
          <div className="px-3 py-2">
            {displayName && <p className="truncate text-sm font-semibold text-ink-900">{displayName}</p>}
            <p className="truncate text-xs text-ink-500">{email}</p>
          </div>
          <Link href="/settings?tab=you" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-900 hover:bg-ink-50">
            <Icon d={ICONS.user} className="h-4 w-4 text-ink-700" /> Your profile
          </Link>
          <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-900 hover:bg-ink-50">
            <Icon d={ICONS.settings} className="h-4 w-4 text-ink-700" /> Settings
          </Link>
          <form action={signOut}>
            <SubmitButton className="w-full !justify-start gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-900 hover:bg-ink-50">
              <Icon d={ICONS.logout} className="h-4 w-4 text-ink-700" /> Sign out
            </SubmitButton>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Your account"
        title={folded ? displayName || email : undefined}
        className={`flex w-full items-center gap-3 rounded-xl text-left transition-colors hover:bg-white/55 ${folded ? "justify-center p-1.5" : "px-2 py-2"}`}
      >
        <PersonPhoto name={displayName || email} photo={photo} />
        {!folded && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink-900">{displayName || email}</span>
              <span className="block truncate text-xs text-ink-500">{trial || email}</span>
            </span>
            <Icon d={ICONS.chevronDown} className="h-4 w-4 text-ink-700" />
          </>
        )}
      </button>
    </div>
  );
}

// The authenticated app's frame. On a laptop: one coloured ground, a frosted
// sidebar sitting on it and the page as a white block floating beside it, with
// a single page scrollbar. On a phone: no floating block (it only steals room)
// — the page fills the screen and the four everyday sections live in a bottom
// bar, with the rest behind "More".
export default function AppFrame({
  children,
  banner,
  initialCollapsed = false,
  showClients,
  counts = {},
  clients,
  activeClientId,
  workspaceName,
  displayName,
  photo,
  email,
  trial,
  signOut,
  owner = false,
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [sheet, setSheet] = useState(null); // "more" | "search"

  useEffect(() => setSheet(null), [pathname]);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${NAV_COOKIE}=${next ? "collapsed" : "open"}; path=/; max-age=31536000; samesite=lax`;
  }

  const work = showClients ? [WORK[0], CLIENTS, ...WORK.slice(1)] : WORK;
  const everything = [...work, ...MANAGE];
  const bottomItems = work.filter((i) => i.bottom);
  const moreItems = everything.filter((i) => !i.bottom);
  const multi = clients.length > 1;

  const sidebar = (folded) => (
    <div className="flex h-full flex-col gap-1 px-3 pb-4 pt-4">
      <div className={`flex items-center ${folded ? "flex-col gap-3" : "justify-between gap-2 pl-2"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5" title="Sokndall">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-700 text-[0.9375rem] font-semibold text-white">S</span>
          {!folded && <span className="text-[1.0625rem] font-semibold tracking-tight text-ink-900">Sokndall</span>}
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-ink-700 transition-colors hover:bg-white/70 hover:text-ink-900 lg:flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]" aria-hidden="true">
            <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
            <path d="M9.5 4.5v15" />
          </svg>
        </button>
      </div>

      {/* Folded, the client moves to the top bar — it needs its name to be useful. */}
      {multi && !folded && (
        <div className="mt-3">
          <ClientMenu clients={clients} activeId={activeClientId} folded={false} />
        </div>
      )}

      <nav className="mt-3 flex flex-1 flex-col gap-0.5">
        {!folded && <p className="px-3 pb-1.5 text-xs font-medium text-ink-700">Work</p>}
        {work.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} folded={folded} count={item.countKey ? counts[item.countKey] : 0} />
        ))}
      </nav>

      <UserMenu folded={folded} displayName={displayName} email={email} photo={photo} trial={trial} signOut={signOut} />
    </div>
  );

  return (
    <div className="app-ground min-h-screen lg:flex">
      {/* Laptop: the sidebar is part of the ground — no panel, no seam. */}
      <aside className={`sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block ${collapsed ? "w-[76px]" : "w-64"}`}>{sidebar(collapsed)}</aside>

      <div className="min-w-0 flex-1 lg:py-3 lg:pl-0 lg:pr-3">
        <main className="min-h-screen bg-canvas lg:min-h-[calc(100vh-1.5rem)] lg:rounded-[1.5rem] lg:shadow-[0_1px_2px_rgba(14,42,46,0.05),0_16px_48px_-12px_rgba(14,42,46,0.16)] lg:ring-1 lg:ring-ink-900/[0.05]">
          {/* Top bar: search on a laptop; on a phone the workspace and a search button. */}
          <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/[0.97] px-4 sm:px-6 lg:rounded-t-[1.5rem] lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-2xl">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-700 text-sm font-semibold text-white lg:hidden">S</span>
              <div className="hidden min-w-0 flex-1 lg:block">
                <AppSearch showClients={multi} indexKey={activeClientId ?? "one"} />
              </div>
              <div className="min-w-0 flex-1 lg:hidden">
                {multi ? (
                  <ClientMenu clients={clients} activeId={activeClientId} folded={false} />
                ) : (
                  <p className="truncate text-sm font-semibold text-ink-900">{workspaceName}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSheet("search")}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-900 ring-1 ring-ink-200 lg:hidden"
            >
              <Icon d={ICONS.search} className="h-[18px] w-[18px]" />
            </button>
            <div className="lg:hidden">
              <UserMenu folded displayName={displayName} email={email} photo={photo} trial={trial} signOut={signOut} align="down" />
            </div>
            <div className="ml-auto hidden items-center gap-1.5 lg:flex">
              {multi && collapsed && (
                <div className="mr-1 w-56">
                  <ClientMenu clients={clients} activeId={activeClientId} folded={false} align="right" />
                </div>
              )}
              {MANAGE.map((item) => (
                <ToolLink key={item.href} href={item.href} label={item.label} icon={item.icon} pathname={pathname} />
              ))}
              <div className="ml-1.5">
                <NewMenu owner={owner} multi={multi} />
              </div>
            </div>
          </div>

          {banner}

          <div className={`mx-auto px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-12 ${collapsed ? "max-w-[88rem]" : "max-w-[76rem]"}`}>{children}</div>
        </main>
      </div>

      {/* Phone: the four everyday sections, and the rest behind More. */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-900/[0.07] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Sections">
        {bottomItems.map((item) => {
          const active = isOn(pathname, item.href);
          const count = item.countKey ? counts[item.countKey] : 0;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.6875rem] font-medium">
              <span className={`relative flex h-7 w-12 items-center justify-center rounded-full ${active ? "bg-brand-50 text-brand-700" : "text-ink-700"}`}>
                <Icon d={item.icon} className="h-[18px] w-[18px]" />
                {count > 0 && <span className="absolute right-2 top-0.5 h-2 w-2 rounded-full bg-brand-700 ring-2 ring-white" aria-label={`${count} due`} />}
              </span>
              <span className={active ? "text-ink-900" : "text-ink-700"}>{item.label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={() => setSheet("more")} className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.6875rem] font-medium" aria-expanded={sheet === "more"}>
          <span className={`flex h-7 w-12 items-center justify-center rounded-full ${moreItems.some((i) => isOn(pathname, i.href)) ? "bg-brand-50 text-brand-700" : "text-ink-700"}`}>
            <Icon d={ICONS.more} className="h-[18px] w-[18px]" />
          </span>
          <span className="text-ink-700">More</span>
        </button>
      </nav>

      {sheet && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <ScrollLock />
          <button type="button" aria-label="Close" className="absolute inset-0 bg-ink-900/30" onClick={() => setSheet(null)} />
          <div className={`absolute inset-x-0 ${sheet === "more" ? "bottom-0 rounded-t-3xl" : "top-0 rounded-b-3xl"} glass-strong p-4 pb-6`}>
            {sheet === "search" ? (
              <div className="pt-2">
                <AppSearch autoFocus showClients={multi} indexKey={activeClientId ?? "one"} onDone={() => setSheet(null)} />
                <button type="button" onClick={() => setSheet(null)} className="mt-3 w-full rounded-xl py-2 text-sm font-medium text-ink-700">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-200" aria-hidden="true" />
                <ul className="flex flex-col gap-1">
                  {moreItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSheet(null)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[0.9375rem] font-medium ${isOn(pathname, item.href) ? "bg-ink-50 text-ink-900" : "text-ink-900"}`}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-100 text-ink-700">
                          <Icon d={item.icon} className="h-[18px] w-[18px]" />
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-ink-100 pt-3">
                  <p className="px-3 text-sm font-semibold text-ink-900">{displayName || email}</p>
                  <p className="px-3 text-xs text-ink-500">{trial || email}</p>
                  <form action={signOut} className="mt-2">
                    <SubmitButton className="flex w-full !justify-start items-center gap-3 rounded-xl px-3 py-3 text-left text-[0.9375rem] font-medium text-ink-900">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-100 text-ink-700">
                        <Icon d={ICONS.logout} className="h-[18px] w-[18px]" />
                      </span>
                      Sign out
                    </SubmitButton>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
