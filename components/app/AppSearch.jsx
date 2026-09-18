"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchApp } from "@/lib/search-actions";
import { switchClient } from "@/lib/client-actions";
import { ICONS, Icon, initials } from "@/components/app/ui";

// The pages and the things you can start from here, matched on plain words —
// so "add provider" or "import" gets you there without hunting through the nav.
const PLACES = [
  { label: "Dashboard", href: "/dashboard", icon: ICONS.dashboard, words: "dashboard home expirations overview" },
  { label: "Follow-ups", href: "/follow-ups", icon: ICONS.followUps, words: "follow ups queue chase calls stalled week" },
  { label: "Providers", href: "/providers", icon: ICONS.providers, words: "providers clinicians roster people" },
  { label: "Add a provider", href: "/providers/new", icon: ICONS.plus, words: "add new provider create" },
  { label: "Enrollments", href: "/enrollments", icon: ICONS.enrollments, words: "enrollments matrix payers applications status" },
  { label: "Edit payer list", href: "/enrollments/payers", icon: ICONS.building, words: "payers insurance list add payer" },
  { label: "Documents", href: "/documents", icon: ICONS.documents, words: "documents files uploads w9 cv license copies" },
  { label: "Import / Export", href: "/import-export", icon: ICONS.importExport, words: "import export csv spreadsheet download" },
  { label: "Settings", href: "/settings", icon: ICONS.settings, words: "settings practice account profile name" },
  { label: "Team", href: "/settings?tab=team", icon: ICONS.team, words: "team users invite members seats" },
  { label: "Plan and billing", href: "/settings?tab=billing", icon: ICONS.card, words: "billing plan invoice subscription payment upgrade" },
  { label: "Email alerts", href: "/settings?tab=alerts", icon: ICONS.mail, words: "alerts email digest reminders days" },
];

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function AppSearch({ onDone, autoFocus = false, showClients = false }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [pending, startTransition] = useTransition();
  const [searching, setSearching] = useState(false);
  const box = useRef(null);
  const input = useRef(null);

  // ⌘K / Ctrl-K from anywhere in the app.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!box.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Debounced: the server action runs a fifth of a second after typing stops.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const id = setTimeout(async () => {
      try {
        const found = await searchApp(term);
        setResults(found);
      } finally {
        setSearching(false);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  const words = norm(q.trim()).split(/\s+/).filter(Boolean);
  const places = words.length ? PLACES.filter((p) => words.every((w) => norm(`${p.label} ${p.words}`).includes(w))).slice(0, 4) : [];

  const items = [
    ...places.map((p) => ({ kind: "place", key: `p-${p.href}`, label: p.label, detail: "Go to", icon: p.icon, go: () => router.push(p.href) })),
    ...(results?.providers ?? []).map((p) => ({ kind: "provider", key: `pr-${p.id}`, label: p.name, detail: p.detail || "Provider", avatar: p.name, go: () => router.push(`/providers/${p.id}`) })),
    ...(results?.payers ?? []).map((p) => ({ kind: "payer", key: `pa-${p.id}`, label: p.name, detail: "Payer · open the matrix", icon: ICONS.building, go: () => router.push("/enrollments") })),
    ...(results?.documents ?? []).map((d) => ({ kind: "document", key: `d-${d.id}`, label: d.name, detail: d.detail || "Document", icon: ICONS.file, go: () => router.push(`/providers/${d.providerId}`) })),
    ...(showClients ? results?.clients ?? [] : []).map((c) => ({
      kind: "client",
      key: `c-${c.id}`,
      label: c.name,
      detail: "Switch to this client",
      icon: ICONS.clients,
      go: () => startTransition(() => switchClient(c.id, window.location.pathname)),
    })),
  ];

  function choose(item) {
    if (!item) return;
    setOpen(false);
    setQ("");
    setResults(null);
    onDone?.();
    item.go();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(items[cursor]);
    } else if (e.key === "Escape") {
      setOpen(false);
      input.current?.blur();
    }
  }

  const busy = searching || pending;

  return (
    <div ref={box} className="relative w-full">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-500">
          {busy ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
          ) : (
            <Icon d={ICONS.search} className="h-4 w-4" />
          )}
        </span>
        <input
          ref={input}
          type="search"
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value);
            setCursor(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search providers, payers, documents…"
          aria-label="Search the app"
          className="h-10 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-16 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <kbd className="pointer-events-none absolute inset-y-0 right-3 hidden items-center text-[0.6875rem] font-medium text-ink-500 sm:flex">Ctrl K</kbd>
      </div>

      {open && q.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-12 z-40 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_12px_40px_rgba(14,42,46,0.16)] ring-1 ring-ink-900/10">
          {items.length === 0 ? (
            <p className="px-3 py-4 text-sm text-ink-500">{busy ? "Searching…" : `Nothing matches “${q.trim()}”.`}</p>
          ) : (
            <ul className="max-h-[22rem] overflow-y-auto">
              {items.map((item, i) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => choose(item)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${i === cursor ? "bg-ink-50" : ""}`}
                  >
                    {item.avatar ? (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700" aria-hidden="true">
                        {initials(item.avatar)}
                      </span>
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-ink-100 text-ink-700" aria-hidden="true">
                        <Icon d={item.icon} className="h-4 w-4" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900">{item.label}</span>
                      <span className="block truncate text-xs text-ink-500">{item.detail}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
