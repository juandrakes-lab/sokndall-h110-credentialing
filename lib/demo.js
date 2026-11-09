// Interactive demo accounts (pedido 2026-11-08; migration 20261108000000).
// A demo is an organization with a cred_demos row. Shared helpers for the
// pages (read with the visitor's own session, RLS) and for the server-only
// pieces (admin client, passed in by the caller).

import { createHash, randomBytes } from "node:crypto";

export const DEMO_HOURS = 72;
export const DEMO_UNOPENED_DAYS = 7; // the link works this long before the first open
export const DEMO_KEEP_DAYS = 7; // read-only after it ends, then deleted
export const DEMO_NEW_PROVIDERS = 3;
export const JUAN_EMAIL = "hello@sokndall.com";

export const newDemoCode = () => randomBytes(18).toString("base64url");
export const hashDemoCode = (code) => createHash("sha256").update(String(code)).digest("hex");

// The visitor's demo, or null for every real account.
export async function getDemo(supabase, orgId) {
  if (!orgId) return null;
  const { data } = await supabase.from("cred_demos").select("*").eq("org_id", orgId).maybeSingle();
  return data ?? null;
}

export function demoState(demo) {
  if (!demo) return null;
  const now = Date.now();
  const ends = demo.expires_at ? new Date(demo.expires_at).getTime() : null;
  return {
    open: Boolean(ends && ends > now && !demo.revoked_at),
    endsAt: demo.expires_at,
    hoursLeft: ends ? Math.max(0, Math.ceil((ends - now) / 3600000)) : null,
    deleteAt: ends ? new Date(ends + DEMO_KEEP_DAYS * 86400000).toISOString() : null,
  };
}

// The three guided steps, read from what the app already stores — nothing
// extra is recorded to know they were done. Only actions after the first open
// count (the seed itself has statuses, calls and no reports).
export async function demoSteps(supabase, demo) {
  if (!demo?.first_opened_at) return null;
  const since = demo.first_opened_at;
  const [approved, logged, reported] = await Promise.all([
    supabase.from("cred_enrollment_events").select("id", { count: "exact", head: true }).eq("to_status", "approved").gt("created_at", since),
    supabase.from("cred_communications").select("id", { count: "exact", head: true }).gt("created_at", since),
    supabase.from("cred_reports").select("id", { count: "exact", head: true }).gt("generated_at", since),
  ]);
  return [
    { key: "approved", label: "Move an application to Approved", href: "/enrollments", done: (approved.count ?? 0) > 0 },
    { key: "follow_up", label: "Log a follow-up", href: "/follow-ups", done: (logged.count ?? 0) > 0 },
    { key: "report", label: "Generate a client report", href: "/reports", done: (reported.count ?? 0) > 0 },
  ];
}

// --- Prepared moments (spec §"Eventos"), relative to the first open --------
// Day 1 (stalled) and day 3 (CAQH within alerts) happen on their own: the seed
// is shifted at first open so the dates cross the line then. Day 2 — a payer
// asks for a document — is applied by cred_demo_tick the first time anyone
// (the visitor, or the daily job) looks after the 48 h mark.
export const DEMO_EVENTS = {
  stalled: { title: "An application just stalled", body: "An application has gone 30 days without a status change. It now shows as Stalled in the grid and in Follow-ups.", href: "/follow-ups" },
  payer_request: { title: "A payer asked for a document", body: "It shows under Payer requests in Follow-ups, waiting on you.", href: "/follow-ups" },
  caqh: { title: "A CAQH re-attestation is due soon", body: "A provider's CAQH re-attestation entered the alert window on the dashboard.", href: "/dashboard" },
};

// With the visitor's own session; returns the moments that became due now.
export async function tickDemo(supabase) {
  const { data } = await supabase.rpc("cred_demo_tick");
  return data ?? [];
}

// Plain-text email, same look as the trial emails.
export function demoEmail(subject, paragraphs) {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return {
    subject,
    text: paragraphs.join("\n\n"),
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#0e2a2e;max-width:520px">${paragraphs.map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("")}</div>`,
  };
}

// What a demo's visitor did, for Juan's summary. Admin client only.
export async function demoSummary(admin, demo) {
  const { data: rows } = await admin.from("cred_demo_activity").select("kind, detail, created_at").eq("org_id", demo.org_id).order("created_at");
  const all = rows ?? [];
  const visits = [...new Set(all.filter((r) => r.kind === "visit").map((r) => r.detail))];
  const blocked = [...new Set(all.filter((r) => r.kind === "blocked").map((r) => r.detail))];
  const since = demo.first_opened_at ?? demo.created_at;
  const [approved, logged, reported] = await Promise.all([
    admin.from("cred_enrollment_events").select("id", { count: "exact", head: true }).eq("org_id", demo.org_id).eq("to_status", "approved").gt("created_at", since),
    admin.from("cred_communications").select("id", { count: "exact", head: true }).eq("org_id", demo.org_id).gt("created_at", since),
    admin.from("cred_reports").select("id", { count: "exact", head: true }).eq("org_id", demo.org_id).gt("generated_at", since),
  ]);
  const steps = [
    (approved.count ?? 0) > 0 && "moved an application to Approved",
    (logged.count ?? 0) > 0 && `logged ${logged.count} follow-up${logged.count === 1 ? "" : "s"}`,
    (reported.count ?? 0) > 0 && `generated ${reported.count} report${reported.count === 1 ? "" : "s"}`,
  ].filter(Boolean);
  const opens = all.filter((r) => r.kind === "open").length;
  return [
    `Opened: ${demo.first_opened_at ? new Date(demo.first_opened_at).toUTCString() : "never"} (${opens} visit${opens === 1 ? "" : "s"} through the link)`,
    `Last activity: ${demo.last_seen_at ? new Date(demo.last_seen_at).toUTCString() : "—"}`,
    `Guided steps done: ${steps.length ? steps.join(", ") : "none"}`,
    `Sections visited: ${visits.length ? visits.join(", ") : "none"}`,
    `Blocked features tapped: ${blocked.length ? blocked.join(", ") : "none"}`,
    `Email left: ${demo.contact_email ? "yes" : "no"}`,
    `Asked to load real data: ${all.some((r) => r.kind === "load_real") ? "yes" : "no"}`,
  ];
}

// Server actions a demo must never run (imports, billing, invitations, upload
// links, documents). The screens already show these as locked; this is the
// same rule where it's enforced.
export const DEMO_ACTION_ERROR = "That isn't available in the demo. In your real account we do it for you.";
