"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Avatar, Badge, ICONS, Icon, IconTile, Ring, STATUS_FILL, SegmentBar, cardClass } from "@/components/app/ui";
import { ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";

// The access screens' panel: five "stories", each one sentence and a scene
// rebuilt in HTML from the app's own parts — never a screenshot. A scene is a
// big app window in perspective that runs off the panel's edge, with detail
// cards floating in front of it. Scenes are drawn on a fixed 720×600 canvas
// and scaled to fit the room the panel has, so nothing overlaps or stretches
// at any window size. They advance like Instagram stories (paused on hover;
// never on their own with reduced motion); the bars jump to one.
//
// The figures are the demo client's (Riverside Pediatrics, test data). People
// who sign in carry generic names and Pexels portraits; providers keep
// initials, as in the app — they never have photos.

// Pexels, cropped to 160px squares in public/app/people/.
const PEOPLE = {
  erin: { name: "Erin Walsh", photo: "/app/people/erin.jpg" }, // Alexander Zvir — pexels.com/photo/34761515
  luis: { name: "Luis Moreno", photo: "/app/people/luis.jpg" }, // Apunto Group — pexels.com/photo/7752822
  ana: { name: "Ana Ruiz", photo: "/app/people/ana.jpg" }, // Alvaro Balderas — pexels.com/photo/33680700
};

const W = 720;
const H = 600;
const DURATION = 7000;

// The matrix cell, exactly as the app draws it (enrollments/page.jsx).
const CHIP = {
  not_started: "bg-transparent text-ink-500 border border-dashed border-ink-200",
  submitted: "bg-enroll-purple-bg text-enroll-purple shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  in_review: "bg-sky-50 text-sky-800 shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  info_requested: "bg-status-expiring-bg text-status-expiring shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  approved: "bg-status-active-bg text-status-active shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
  denied: "bg-status-expired-bg text-status-expired shadow-[0_1px_2px_rgba(14,42,46,0.10)]",
};

const deep = "shadow-[0_2px_6px_rgba(0,0,0,0.14),0_30px_60px_-18px_rgba(0,0,0,0.55)]";

// ---- building blocks -------------------------------------------------------

// A window of the app, tilted away from the reader and anchored on its left
// edge, so its far side runs past the panel's edge.
function AppWindow({ x, y, w, h, nav = "dashboard", tilt = -11, children }) {
  const items = ["dashboard", "followUps", "providers", "enrollments", "documents"];
  return (
    <div
      className="absolute overflow-hidden rounded-[20px] bg-[#eef1ef] ring-1 ring-black/5 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.65)]"
      style={{ left: x, top: y, width: w, height: h, transform: `perspective(2200px) rotateY(${tilt}deg) rotateX(4deg)`, transformOrigin: "left center" }}
    >
      <div className="flex h-11 items-center gap-2 border-b border-ink-900/[0.06] bg-white/80 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="ml-16 flex h-7 w-72 items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 text-[0.6875rem] text-ink-500">
          <Icon d={ICONS.search} className="h-3.5 w-3.5" /> Search providers, payers, documents…
        </span>
        <span className="ml-auto mr-24 flex h-7 items-center gap-1 rounded-lg bg-brand-700 px-3 text-[0.6875rem] font-medium text-white">
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
function Float({ x, y, w, bob = 0, className = "", children }) {
  return (
    <div className="absolute" style={{ left: x, top: y, width: w }}>
      <div className={`auth-float rounded-2xl bg-white ${deep} ${className}`} style={{ animationDelay: `${bob}s` }}>
        {children}
      </div>
    </div>
  );
}

function Title({ children, sub }) {
  return (
    <div className="mb-4">
      <p className="text-[1.625rem] font-normal leading-none tracking-[-0.03em] text-ink-900">{children}</p>
      {sub && <p className="mt-1.5 text-xs text-ink-500">{sub}</p>}
    </div>
  );
}

function Stat({ label, value, hint, icon, tone = "brand", accent = false }) {
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

function Row({ name, detail, children }) {
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

// ---- the five scenes -------------------------------------------------------

function Board() {
  return (
    <>
      <AppWindow x={40} y={34} w={860} h={520}>
        <Title sub="Saturday, September 19 · Riverside Pediatrics PLLC">Dashboard</Title>
        <div className="grid grid-cols-3 gap-3">
          <Stat accent label="Need you this week" value="31" hint="Expiring soon, overdue and payer requests." icon={ICONS.pulse} />
          <Stat label="Expiring within 14 days" value="7" hint="Credentials and payer revalidations." icon={ICONS.calendar} tone="red" />
          <Stat label="Follow-ups overdue" value="18" hint="20 due this week in all." icon={ICONS.phone} tone="amber" />
        </div>
        <div className="mt-3 grid grid-cols-[1.35fr_1fr] gap-3">
          <div className={`${cardClass} overflow-hidden`}>
            <p className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-ink-900">
              <Icon d={ICONS.arrowRight} className="h-4 w-4" /> Start here
            </p>
            <Row name="Lauren Mitchell" detail="Payer revalidation · Aetna"><Badge tone="red">Expired</Badge></Row>
            <Row name="Maya Chen" detail="State license"><Badge tone="red">Expired</Badge></Row>
            <Row name="Daniel Okafor" detail="DEA registration"><Badge tone="red">1 day left</Badge></Row>
          </div>
          <div className={`${cardClass} p-4`}>
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Icon d={ICONS.shield} className="h-4 w-4 text-brand-600" /> Credentials current
            </p>
            <div className="mt-3 flex flex-col gap-2 text-xs text-ink-700">
              <span className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-status-expired" />Something expired</span><b className="text-ink-900">2</b></span>
              <span className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-status-expiring" />Due within 30 days</span><b className="text-ink-900">6</b></span>
              <span className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-status-active" />Current</span><b className="text-ink-900">6</b></span>
            </div>
          </div>
        </div>
      </AppWindow>
      <Float x={0} y={508} w={250} bob={0}>
        <div className="flex items-center gap-3 p-3.5">
          <Ring value={0.4} size={60} tone="red"><span className="text-xs font-semibold text-ink-900">40%</span></Ring>
          <p className="text-xs leading-snug text-ink-700"><span className="text-sm font-semibold text-ink-900">6 of 15</span><br />providers fully current</p>
        </div>
      </Float>
      <Float x={424} y={0} w={286} bob={1.6}>
        <div className="flex gap-3 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-status-expired-bg text-status-expired"><Icon d={ICONS.mail} className="h-[18px] w-[18px]" /></span>
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-status-expired">Expiration alert</p>
            <p className="mt-0.5 text-[0.8125rem] font-medium leading-snug text-ink-900">Daniel Okafor · DEA registration expires tomorrow</p>
          </div>
        </div>
      </Float>
    </>
  );
}

const PAYERS = ["Aetna", "Cigna Healthcare", "UnitedHealthcare", "Excellus BCBS", "EmblemHealth"];
const MATRIX = [
  ["Bello, Aisha", "Pediatric Nurse Practitioner", ["in_review", "approved", "in_review", "info_requested", "in_review"]],
  ["Brooks, Ethan", "Pediatric Cardiology", ["submitted", "not_started", "approved", "approved", "info_requested"]],
  ["Chen, Maya", "Pediatrics", ["approved", "approved", "not_started", "approved", "approved"]],
  ["Fischer, Noah", "Neonatal-Perinatal Medicine", ["not_started", "info_requested", "approved", "in_review", "in_review"]],
  ["Kowalski, Hannah", "Physician Assistant", ["denied", "approved", "approved", "approved", "approved"]],
];
const PIPELINE = [
  ["approved", 48],
  ["in_review", 19],
  ["submitted", 9],
  ["info_requested", 6],
  ["denied", 1],
  ["not_started", 22],
];

function Matrix() {
  return (
    <>
      <AppWindow x={40} y={20} w={900} h={540} nav="enrollments">
        <Title sub="Every provider against every payer you work with.">Enrollments</Title>
        <div className={`${cardClass} overflow-hidden`}>
          <table className="w-full border-separate border-spacing-0 text-xs">
            <thead>
              <tr>
                <th className="w-44 border-b border-r border-ink-100 px-3 py-2.5 text-left font-medium text-ink-700">Provider</th>
                {PAYERS.map((p) => (
                  <th key={p} className="border-b border-ink-100 px-2 py-2.5 text-left font-semibold text-ink-900">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map(([name, spec, cells]) => (
                <tr key={name}>
                  <th className="border-b border-r border-ink-100 px-3 py-2 text-left font-normal">
                    <div className="flex items-center gap-2">
                      <Avatar name={name.split(", ").reverse().join(" ")} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink-900">{name}</p>
                        <p className="truncate text-[0.625rem] text-ink-500">{spec}</p>
                      </div>
                    </div>
                  </th>
                  {cells.map((s, i) => (
                    <td key={i} className="border-b border-ink-100 px-1.5 py-2">
                      <span className={`flex items-center justify-between gap-1 rounded-lg px-2 py-1.5 font-medium ${CHIP[s]}`}>
                        <span className="truncate">{ENROLLMENT_STATUS_LABELS[s]}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppWindow>
      <Float x={0} y={392} w={330} bob={0}>
        <div className="p-4">
          <p className="flex items-center justify-between text-sm font-semibold text-ink-900">
            Where every application stands <Badge>105</Badge>
          </p>
          <div className="mt-3">
            <SegmentBar segments={PIPELINE.map(([k, v]) => ({ key: k, label: ENROLLMENT_STATUS_LABELS[k], value: v, color: STATUS_FILL[k] }))} height={10} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2">
            {PIPELINE.map(([k, v]) => (
              <span key={k} className="flex min-w-0 items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_FILL[k] }} />
                <span className="text-sm font-semibold text-ink-900">{v}</span>
                <span className="truncate text-[0.625rem] text-ink-500">{ENROLLMENT_STATUS_LABELS[k]}</span>
              </span>
            ))}
          </div>
        </div>
      </Float>
      <Float x={500} y={0} w={210} bob={1.4}>
        <div className="flex flex-col gap-2 p-3.5 text-xs text-ink-700">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-600" /> Follow-up due today</span>
          <span className="flex items-center gap-2"><Icon d={ICONS.pause} className="h-3.5 w-3.5 text-amber-600" strokeWidth={2.2} /> Stalled 30+ days</span>
        </div>
      </Float>
    </>
  );
}

function PayerRequest() {
  const queue = [
    ["Ethan Brooks", "UnitedHealthcare Community Plan", "Current CAQH attestation"],
    ["Noah Fischer", "Cigna Healthcare", "Signed W-9 dated this year"],
    ["Aisha Bello", "Excellus BlueCross BlueShield", "Signed W-9 dated this year"],
    ["Lauren Mitchell", "New York Medicaid", "Signed W-9 dated this year"],
  ];
  const statuses = ["not_started", "submitted", "in_review", "info_requested", "approved", "denied"];
  return (
    <>
      <AppWindow x={0} y={60} w={560} h={500} nav="followUps" tilt={-14}>
        <Title>Follow-ups</Title>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Payer requests" value="6" hint="Payers waiting on you." icon={ICONS.alert} tone="amber" />
          <Stat label="Overdue" value="18" hint="Call these first." icon={ICONS.phone} tone="red" />
        </div>
        <div className={`${cardClass} mt-3 overflow-hidden`}>
          {queue.map(([n, p, asked]) => (
            <div key={n} className="flex gap-3 border-t border-ink-100 px-4 py-2.5 first:border-t-0">
              <Avatar name={n} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-[0.8125rem] font-medium text-ink-900">
                  {n} <span className="font-normal text-ink-500">· {p}</span>
                </p>
                <p className="truncate text-[0.6875rem] text-status-expiring">Payer asked for: {asked}</p>
              </div>
            </div>
          ))}
        </div>
      </AppWindow>
      <div
        className={`absolute overflow-hidden rounded-[20px] bg-white ${deep}`}
        style={{ left: 330, top: 0, width: 470, height: 560, transform: "perspective(2200px) rotateY(-7deg)", transformOrigin: "left center" }}
      >
        <div className="border-b border-ink-100 bg-ink-50/80 px-6 py-4">
          <p className="text-xs text-ink-500">UnitedHealthcare Community Plan · Medicaid</p>
          <p className="mt-0.5 text-xl font-semibold text-ink-900">Ethan Brooks</p>
          <p className="mt-1.5 flex items-center gap-2">
            <Badge tone="amber">Info requested</Badge>
            <span className="text-xs text-ink-500">Next follow-up Sep 23, 2026</span>
          </p>
        </div>
        <div className="flex flex-col gap-5 p-6">
          <div className="rounded-2xl bg-status-expiring-bg px-5 py-4 ring-1 ring-inset ring-status-expiring/25">
            <p className="text-xs font-semibold text-status-expiring">The payer is waiting on this · since Sep 18, 2026</p>
            <p className="mt-1 text-[0.9375rem] font-medium text-ink-900">Current CAQH attestation</p>
            <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-xl bg-brand-700 px-3 text-xs font-medium text-white">
              <Icon d={ICONS.check} className="h-3.5 w-3.5" /> Mark as resolved
            </span>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((s) => (
                <span key={s} className={`rounded-full px-3 py-1.5 text-xs ${s === "info_requested" ? "bg-status-expiring-bg text-status-expiring ring-1 ring-status-expiring" : "bg-white text-ink-700 ring-1 ring-ink-200"}`}>
                  {ENROLLMENT_STATUS_LABELS[s]}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">Application details</p>
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-ink-50 p-3.5 text-xs">
              <span><span className="block text-ink-500">Submitted</span><span className="text-ink-900">Jan 30, 2023</span></span>
              <span><span className="block text-ink-500">Reference</span><span className="text-ink-900">APP-9668868</span></span>
              <span><span className="block text-ink-500">Owner</span><span className="text-ink-900">{PEOPLE.erin.name}</span></span>
            </div>
          </div>
        </div>
      </div>
      <Float x={120} y={536} w={196} bob={0.8}>
        <div className="flex items-center gap-2.5 py-2.5 pl-2.5 pr-4">
          <Avatar name={PEOPLE.erin.name} photo={PEOPLE.erin.photo} size="sm" />
          <span className="text-xs leading-snug text-ink-700">
            Assigned to
            <br />
            <span className="font-semibold text-ink-900">{PEOPLE.erin.name}</span>
          </span>
        </div>
      </Float>
    </>
  );
}

function Calls() {
  const calls = [
    { who: PEOPLE.ana, head: "Grace Liu · EmblemHealth", line: "Phone · Sep 18 · Rita, EmblemHealth enrollment", body: "Moved to committee review", ref: "EH-5521903" },
    { who: PEOPLE.luis, head: "Aisha Bello · UnitedHealthcare", line: "Phone · Sep 18 · Mark, UHC provider services", body: "Still in credentialing committee queue, no ETA", ref: "UHC-88120045" },
  ];
  const field = (label, value, wide) => (
    <div className={wide ? "col-span-2" : ""}>
      <p className="mb-1 text-xs font-medium text-ink-900">{label}</p>
      <div className="flex h-9 items-center rounded-xl border border-ink-200 bg-white px-3 text-xs text-ink-900">{value}</div>
    </div>
  );
  return (
    <>
      <AppWindow x={40} y={20} w={860} h={520} nav="followUps">
        <Title sub="EmblemHealth · Grace Liu">Log a follow-up</Title>
        <div className={`${cardClass} grid max-w-[560px] grid-cols-2 gap-3 p-5`}>
          {field("Date", "Sep 18, 2026")}
          {field("How", "Phone")}
          {field("Who you spoke with", "Rita, EmblemHealth enrollment")}
          {field("Reference / ticket number", "EH-5521903")}
          {field("What happened", "Moved to committee review", true)}
          {field("Next follow-up", "Sep 25, 2026")}
          <div className="flex items-end">
            <span className="flex h-9 items-center rounded-xl bg-brand-700 px-4 text-xs font-medium text-white">Log follow-up</span>
          </div>
        </div>
      </AppWindow>
      <Float x={350} y={300} w={360} bob={0}>
        <div className="p-5">
          <p className="text-sm font-semibold text-ink-900">Latest calls</p>
          <ol className="mt-3 flex flex-col gap-4">
            {calls.map((c) => (
              <li key={c.ref} className="flex gap-3">
                <Avatar name={c.who.name} photo={c.who.photo} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-900">{c.head}</p>
                  <p className="mt-0.5 text-xs text-ink-700">{c.line}</p>
                  <p className="mt-0.5 text-xs text-ink-700">{c.body}</p>
                  <p className="mt-0.5 text-[0.6875rem] text-ink-500">Ref. {c.ref} · by {c.who.name}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Float>
      <Float x={0} y={470} w={220} bob={1.3}>
        <div className="flex items-center gap-2.5 p-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon d={ICONS.calendar} className="h-[18px] w-[18px]" />
          </span>
          <span className="text-xs text-ink-700">
            Next follow-up
            <br />
            <b className="text-ink-900">Sep 25, 2026</b>
          </span>
        </div>
      </Float>
    </>
  );
}

function ProviderFile() {
  const creds = [
    ["State license", "NY 041510 · NYS Education Department", "Expired", "red"],
    ["CAQH attestation", "Due Oct 19, 2026", "30 days left", "amber"],
    ["DEA registration", "NY FC7882172 · May 8, 2027", "Current", "green"],
    ["Board certification", "American Board of Pediatrics · Oct 16, 2027", "Current", "green"],
    ["Malpractice insurance", "Medical Protective · Feb 2, 2028", "Current", "green"],
  ];
  const kept = ["State licenses", "DEA", "Malpractice", "Board certifications", "CAQH", "Payer applications"];
  return (
    <>
      <AppWindow x={40} y={20} w={860} h={530} nav="providers">
        <div className="mb-4 flex items-center gap-3">
          <Avatar name="Maya Chen" size="lg" />
          <div>
            <p className="text-[1.625rem] font-normal leading-none tracking-[-0.03em] text-ink-900">Maya Chen</p>
            <p className="mt-1.5 text-xs text-ink-500">Pediatrics · Riverside Pediatrics PLLC</p>
          </div>
        </div>
        <div className={`${cardClass} max-w-[600px] overflow-hidden`}>
          <p className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-ink-900">
            <Icon d={ICONS.shield} className="h-4 w-4 text-brand-600" /> Credentials
          </p>
          {creds.map(([t, d, b, tone]) => (
            <div key={t} className="flex items-center justify-between gap-3 border-t border-ink-100 px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-[0.8125rem] font-medium text-ink-900">{t}</p>
                <p className="truncate text-[0.6875rem] text-ink-500">{d}</p>
              </div>
              <Badge tone={tone} dot>
                {b}
              </Badge>
            </div>
          ))}
        </div>
      </AppWindow>
      <Float x={400} y={318} w={310} bob={0}>
        <div className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Icon d={ICONS.shield} className="h-4 w-4 text-brand-600" /> What Sokndall keeps
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {kept.map((k) => (
              <Badge key={k} tone="green">
                {k}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-ink-50 px-3.5 py-2.5">
            <span className="text-xs text-ink-500 line-through">Patient records</span>
            <Badge tone="neutral">Never</Badge>
          </div>
        </div>
      </Float>
    </>
  );
}

const STORIES = [
  { text: "Every license, DEA and CAQH date on one board, flagged before it lapses.", Scene: Board },
  { text: "Every provider against every payer, so you see where each application stands.", Scene: Matrix },
  { text: "When a payer asks for something, it stays in sight until someone resolves it.", Scene: PayerRequest },
  { text: "Every call logged, so the next follow-up picks up where the last one left off.", Scene: Calls },
  { text: "Provider paperwork only — never a single patient record.", Scene: ProviderFile },
];

// Scales the fixed canvas to the room it has: the whole scene always fits,
// sharp at every size, and the text below is never covered.
function Stage({ children }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    const fit = () => setScale(Math.min(el.clientWidth / W, el.clientHeight / H));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="relative min-h-0 flex-1">
      <div
        className="absolute left-0 top-1/2"
        style={{ width: W, height: H, transform: `translateY(-50%) scale(${scale})`, transformOrigin: "left center", opacity: scale ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

export default function AuthStories({ start = 0 }) {
  const [i, setI] = useState(start % STORIES.length);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const next = () => setI((n) => (n + 1) % STORIES.length);

  return (
    <div className="auth-stories flex h-full flex-col">
      <div className="flex gap-1.5 px-12 pt-9 xl:px-14">
        {STORIES.map((s, n) => (
          <button
            key={s.text}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Show ${n + 1} of ${STORIES.length}`}
            aria-current={n === i || undefined}
            className="group flex h-4 flex-1 items-center"
          >
            <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/20 group-hover:bg-white/30">
              {n < i && <span className="absolute inset-0 bg-white/85" />}
              {n === i && (
                <span
                  key={`${i}-${reduced}`}
                  className="auth-story-fill absolute inset-0 bg-white/85"
                  style={{ "--story-ms": `${DURATION}ms` }}
                  onAnimationEnd={reduced ? undefined : next}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="relative min-h-0 flex-1">
        {STORIES.map(({ text, Scene }, n) => (
          <div
            key={text}
            aria-hidden={n !== i}
            className={`absolute inset-0 flex flex-col transition-[opacity,transform] duration-700 ${n === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
          >
            <div className="flex min-h-0 flex-1 flex-col py-8 pl-12 xl:pl-14">
              <Stage>
                <Scene />
              </Stage>
            </div>
            <p className="max-w-2xl px-12 pb-11 text-[1.75rem] font-normal leading-[1.2] tracking-[-0.02em] text-white xl:px-14">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
