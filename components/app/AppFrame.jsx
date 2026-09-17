"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ClientSwitcher from "@/components/app/ClientSwitcher";
import SubmitButton from "@/components/app/SubmitButton";
import { ICONS, NAV_COOKIE } from "@/components/app/ui";

// Alcance §5, grouped: the day-to-day work first, then the account's plumbing.
const WORK = [
  { href: "/dashboard", label: "Dashboard", icon: ICONS.dashboard },
  { href: "/follow-ups", label: "Follow-ups", icon: ICONS.followUps, countKey: "followUps" },
  { href: "/providers", label: "Providers", icon: ICONS.providers },
  { href: "/enrollments", label: "Enrollments", icon: ICONS.enrollments },
  { href: "/documents", label: "Documents", icon: ICONS.documents },
];
const MANAGE = [
  { href: "/import-export", label: "Import / Export", icon: ICONS.importExport },
  { href: "/settings", label: "Settings", icon: ICONS.settings },
];
// Billing Co only: the panel across all clients.
const CLIENTS = { href: "/clients", label: "Clients", icon: ICONS.clients };

function Icon({ d, className = "h-[18px] w-[18px]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function initials(name, email) {
  const source = (name || email || "?").trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (name && parts[1] ? parts[1][0] : "")).toUpperCase();
}

function NavLink({ item, pathname, collapsed, count, onNavigate }) {
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={`group relative flex h-10 items-center gap-3 rounded-xl text-[0.9375rem] transition-colors ${
        collapsed ? "justify-center px-0" : "px-3"
      } ${
        active
          ? "bg-white font-medium text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.08),0_2px_8px_rgba(14,42,46,0.05)]"
          : "text-ink-700 hover:bg-white/60 hover:text-ink-900"
      }`}
    >
      <Icon d={item.icon} className={`h-[18px] w-[18px] ${active ? "text-brand-600" : "text-ink-500 group-hover:text-ink-700"}`} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {count > 0 &&
        (collapsed ? (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-700 ring-2 ring-white/80" aria-label={`${count} due`} />
        ) : (
          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[0.6875rem] font-semibold tabular-nums text-white">
            {count}
          </span>
        ))}
    </Link>
  );
}

function Group({ label, collapsed, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      {collapsed ? (
        <div className="mx-auto my-2 h-px w-6 bg-ink-500/20" aria-hidden="true" />
      ) : (
        <p className="px-3 pb-1.5 pt-3 text-xs font-medium text-ink-500">{label}</p>
      )}
      {children}
    </div>
  );
}

function UserMenu({ collapsed, displayName, email, trial, signOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {open && (
        <div className={`absolute bottom-full z-30 mb-2 w-60 rounded-2xl bg-white p-1.5 shadow-[0_8px_30px_rgba(14,42,46,0.14)] ring-1 ring-ink-900/5 ${collapsed ? "left-0" : "inset-x-0 w-auto"}`}>
          <div className="px-3 py-2">
            {displayName && <p className="truncate text-sm font-medium text-ink-900">{displayName}</p>}
            <p className="truncate text-xs text-ink-500">{email}</p>
          </div>
          <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
            <Icon d={ICONS.settings} className="h-4 w-4 text-ink-500" /> Settings
          </Link>
          <form action={signOut}>
            <SubmitButton className="w-full justify-start rounded-xl px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50">
              Sign out
            </SubmitButton>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={collapsed ? displayName || email : undefined}
        className={`flex w-full items-center gap-3 rounded-2xl text-left transition-colors hover:bg-white/60 ${collapsed ? "justify-center p-1.5" : "p-2"}`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-400 text-sm font-semibold text-brand-700">
          {initials(displayName, email)}
        </span>
        {!collapsed && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-ink-900">{displayName || email}</span>
            <span className="block truncate text-xs text-ink-500">{trial || email}</span>
          </span>
        )}
        {!collapsed && (
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-ink-500" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M6 12l4-4 4 4" />
          </svg>
        )}
      </button>
    </div>
  );
}

// The authenticated app's frame: a frosted, foldable sidebar on the coloured
// ground, and the page itself as one white block floating beside it. Whether
// the sidebar is folded lives in a cookie so the server renders it right the
// first time (no jump on load).
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
  email,
  trial,
  signOut,
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${NAV_COOKIE}=${next ? "collapsed" : "open"}; path=/; max-age=31536000; samesite=lax`;
  }

  const work = showClients ? [WORK[0], CLIENTS, ...WORK.slice(1)] : WORK;
  const section = [...work, ...MANAGE].find((i) => pathname === i.href || pathname.startsWith(i.href + "/"));
  // On a phone the drawer is always the full sidebar.
  const folded = collapsed && !mobileOpen;

  const sidebar = (
    <div className="flex h-full flex-col gap-2 px-3 pb-3 pt-4">
      <div className={`flex items-center gap-2 ${folded ? "flex-col" : "justify-between pl-2"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5" title="Sokndall">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-700 text-[0.9375rem] font-semibold text-white">S</span>
          {!folded && <span className="text-[1.0625rem] font-semibold tracking-tight text-ink-900">Sokndall</span>}
        </Link>
        <button
          type="button"
          onClick={mobileOpen ? () => setMobileOpen(false) : toggle}
          aria-label={mobileOpen ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={mobileOpen ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-white/70 hover:text-ink-900"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
                <path d="M9.5 4.5v15" />
              </>
            )}
          </svg>
        </button>
      </div>

      {clients.length > 1 &&
        (folded ? (
          <button
            type="button"
            onClick={toggle}
            title={`Client: ${workspaceName}`}
            className="mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-xs font-semibold text-brand-700 ring-1 ring-ink-900/5"
          >
            {initials(workspaceName)}
          </button>
        ) : (
          <div className="mt-2 px-1">
            <ClientSwitcher clients={clients} activeId={activeClientId} />
          </div>
        ))}

      <nav className="mt-1 flex flex-1 flex-col gap-1 overflow-y-auto">
        <Group label="Work" collapsed={folded}>
          {work.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} collapsed={folded} count={item.countKey ? counts[item.countKey] : 0} />
          ))}
        </Group>
        <Group label="Account" collapsed={folded}>
          {MANAGE.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} collapsed={folded} />
          ))}
        </Group>
      </nav>

      <UserMenu collapsed={folded} displayName={displayName} email={email} trial={trial} signOut={signOut} />
    </div>
  );

  return (
    <div className="app-ground min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      {/* Desktop: part of the layout, frosted over the ground. */}
      <aside
        className={`hidden shrink-0 bg-white/25 backdrop-blur-2xl transition-[width] duration-200 lg:block ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        {sidebar}
      </aside>

      {/* Phone and tablet: the same sidebar as a drawer. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink-900/25" onClick={() => setMobileOpen(false)} />
          <aside className="app-ground absolute inset-y-0 left-0 w-72 shadow-2xl">
            <div className="h-full bg-white/35 backdrop-blur-xl">{sidebar}</div>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1 p-2 sm:p-3 lg:py-3 lg:pl-0 lg:pr-3">
        <main className="min-h-[calc(100vh-1rem)] rounded-[1.5rem] bg-white shadow-[0_1px_2px_rgba(14,42,46,0.05),0_12px_40px_rgba(14,42,46,0.07)] ring-1 ring-ink-900/[0.04] sm:min-h-[calc(100vh-1.5rem)] lg:h-full lg:min-h-0 lg:overflow-y-auto">
          <div className="flex h-14 items-center gap-3 border-b border-ink-100 px-4 sm:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-50 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
              <span className="truncate text-ink-500" title={workspaceName}>{workspaceName}</span>
              {section && (
                <>
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 text-ink-500/60" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M8 5l5 5-5 5" />
                  </svg>
                  <Link href={section.href} className="flex shrink-0 items-center gap-1.5 font-medium text-ink-900">
                    <Icon d={section.icon} className="h-4 w-4 text-brand-600" />
                    {section.label}
                  </Link>
                </>
              )}
            </nav>
          </div>
          {banner}
          <div className="mx-auto max-w-6xl px-4 py-7 sm:px-8 lg:py-9">{children}</div>
        </main>
      </div>
    </div>
  );
}
