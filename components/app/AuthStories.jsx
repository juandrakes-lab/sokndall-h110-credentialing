"use client";

import { useEffect, useState } from "react";
import { Avatar, Badge, ICONS, Icon, Ring, STATUS_FILL } from "@/components/app/ui";
import { ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";

// The access screens' panel: a few "stories", each one sentence and a small
// piece of the product rebuilt in HTML with the app's own parts — not a
// screenshot. They advance on their own like Instagram stories (paused while
// hovered; never on their own with reduced motion) and the bars jump to one.
//
// The figures are the demo client's (Riverside Pediatrics, test data). People
// who sign in carry generic names and Pexels portraits (credits in PEOPLE);
// providers keep initials, as in the app — they never have photos.

// Pexels, cropped to 160px squares in public/app/people/.
const PEOPLE = {
  erin: { name: "Erin Walsh", photo: "/app/people/erin.jpg" }, // Alexander Zvir — pexels.com/photo/34761515
  luis: { name: "Luis Moreno", photo: "/app/people/luis.jpg" }, // Apunto Group — pexels.com/photo/7752822
  ana: { name: "Ana Ruiz", photo: "/app/people/ana.jpg" }, // Alvaro Balderas — pexels.com/photo/33680700
};

const DURATION = 7000;

const float = "rounded-2xl bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12),0_24px_48px_-16px_rgba(0,0,0,0.45)]";

function Expirations() {
  const rows = [
    { name: "Lauren Mitchell", what: "Payer revalidation · Aetna", badge: "Expired" },
    { name: "Daniel Okafor", what: "DEA registration", badge: "1 day left" },
    { name: "Ethan Brooks", what: "State license", badge: "7 days left" },
  ];
  return (
    <div className="relative mx-auto w-[400px] pt-14 pb-16">
      <div className={`${float} p-1.5`}>
        <p className="flex items-center gap-2 px-3.5 pb-2 pt-3 text-[0.9375rem] font-semibold text-ink-900">
          <Icon d={ICONS.arrowRight} className="h-4 w-4" /> Start here
        </p>
        {rows.map((r) => (
          <div key={r.name + r.what} className="flex items-center gap-3 border-t border-ink-100 px-3.5 py-2.5">
            <Avatar name={r.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-900">{r.name}</p>
              <p className="truncate text-xs text-ink-500">{r.what}</p>
            </div>
            <Badge tone="red">{r.badge}</Badge>
          </div>
        ))}
      </div>
      <div className="absolute -right-10 top-0 w-44 rounded-2xl bg-brand-600 p-4 text-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <p className="text-xs font-medium text-white/80">Need you this week</p>
        <p className="mt-1 text-[1.75rem] font-semibold leading-none">31</p>
      </div>
      <div className={`${float} absolute -bottom-2 -left-10 flex items-center gap-3 p-3 pr-5`}>
        <Ring value={0.4} size={56} tone="red">
          <span className="text-xs font-semibold text-ink-900">40%</span>
        </Ring>
        <p className="text-xs leading-snug text-ink-700">
          <span className="font-semibold text-ink-900">6 of 15</span>
          <br />
          providers fully current
        </p>
      </div>
    </div>
  );
}

// Five providers × five payers of the demo client, as they stand.
const PAYERS = ["Aetna", "Cigna", "UHC", "Excellus", "Emblem"];
const MATRIX = [
  ["Aisha Bello", ["in_review", "approved", "in_review", "info_requested", "in_review"]],
  ["Ethan Brooks", ["submitted", "not_started", "approved", "approved", "info_requested"]],
  ["Maya Chen", ["approved", "approved", "not_started", "approved", "approved"]],
  ["Noah Fischer", ["not_started", "info_requested", "approved", "in_review", "in_review"]],
  ["Hannah Kowalski", ["denied", "approved", "approved", "approved", "approved"]],
];

function Matrix() {
  return (
    <div className="relative mx-auto w-[420px] pb-8">
      <div className={`${float} p-4`}>
        <div className="grid grid-cols-[minmax(0,1fr)_repeat(5,44px)] items-center gap-x-1.5 gap-y-2">
          <span />
          {PAYERS.map((p) => (
            <span key={p} className="truncate text-center text-[0.625rem] font-medium text-ink-500">
              {p}
            </span>
          ))}
          {MATRIX.map(([name, cells]) => (
            <div key={name} className="contents">
              <span className="flex min-w-0 items-center gap-2">
                <Avatar name={name} size="sm" />
                <span className="truncate text-xs font-medium text-ink-900">{name}</span>
              </span>
              {cells.map((s, i) => (
                <span key={i} className="h-7 rounded-md" style={{ background: STATUS_FILL[s] }} title={ENROLLMENT_STATUS_LABELS[s]} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={`${float} absolute -bottom-12 left-1/2 flex -translate-x-1/2 gap-3.5 whitespace-nowrap px-4 py-2.5`}>
        {["approved", "in_review", "submitted", "info_requested"].map((s) => (
          <span key={s} className="flex items-center gap-2 text-xs text-ink-700">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_FILL[s] }} />
            {ENROLLMENT_STATUS_LABELS[s]}
          </span>
        ))}
      </div>
      <div className="absolute -left-8 -top-12 rounded-2xl bg-white px-4 py-3 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.45)]">
        <p className="text-[1.5rem] font-semibold leading-none text-ink-900">48</p>
        <p className="mt-1 text-xs text-ink-500">approved of 105</p>
      </div>
    </div>
  );
}

function PayerRequest() {
  return (
    <div className="relative mx-auto w-[400px]">
      <div className={`${float} overflow-hidden`}>
        <div className="border-b border-ink-100 bg-ink-50/70 px-5 py-4">
          <p className="text-xs text-ink-500">UnitedHealthcare Community Plan · Medicaid</p>
          <p className="mt-0.5 text-lg font-semibold text-ink-900">Ethan Brooks</p>
          <div className="mt-1.5">
            <Badge tone="amber">Info requested</Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-xl bg-status-expiring-bg px-4 py-3.5 ring-1 ring-inset ring-status-expiring/25">
            <p className="text-xs font-semibold text-status-expiring">The payer is waiting on this · since Sep 18</p>
            <p className="mt-1 text-sm font-medium text-ink-900">Current CAQH attestation</p>
            <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-xl bg-brand-700 px-3 text-xs font-medium text-white">
              <Icon d={ICONS.check} className="h-3.5 w-3.5" /> Mark as resolved
            </span>
          </div>
        </div>
      </div>
      <div className={`${float} absolute -bottom-9 -right-10 flex items-center gap-2.5 py-2.5 pl-2.5 pr-4`}>
        <Avatar name={PEOPLE.erin.name} photo={PEOPLE.erin.photo} size="sm" />
        <span className="text-xs leading-snug text-ink-700">
          Assigned to
          <br />
          <span className="font-semibold text-ink-900">{PEOPLE.erin.name}</span>
        </span>
      </div>
    </div>
  );
}

function FollowUps() {
  const calls = [
    { who: PEOPLE.luis, head: "Phone · Sep 18 · Mark, UHC provider services", body: "Still in credentialing committee queue, no ETA", ref: "UHC-88120045" },
    { who: PEOPLE.ana, head: "Phone · Sep 18 · Rita, EmblemHealth enrollment", body: "Moved to committee review", ref: "EH-5521903" },
  ];
  return (
    <div className="relative mx-auto w-[410px] pt-8">
      <div className={`${float} p-5`}>
        <p className="text-sm font-semibold text-ink-900">History</p>
        <ol className="mt-3 flex flex-col gap-4">
          {calls.map((c) => (
            <li key={c.ref} className="flex gap-3">
              <Avatar name={c.who.name} photo={c.who.photo} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink-900">{c.head}</p>
                <p className="mt-0.5 text-xs text-ink-700">{c.body}</p>
                <p className="mt-0.5 text-[0.6875rem] text-ink-500">
                  Ref. {c.ref} · by {c.who.name}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="absolute -right-8 -top-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.45)]">
        <Icon d={ICONS.phone} className="h-4 w-4 text-brand-600" />
        <span className="text-xs text-ink-700">
          Next follow-up <span className="font-semibold text-ink-900">Sep 23</span>
        </span>
      </div>
    </div>
  );
}

function ProviderOnly() {
  const kept = ["State licenses", "DEA", "Malpractice", "Board certifications", "CAQH attestation", "Payer applications"];
  return (
    <div className="relative mx-auto w-[380px]">
      <div className={`${float} p-5`}>
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
    </div>
  );
}

const STORIES = [
  { text: "Every license, DEA and CAQH date on one board, flagged before it lapses.", View: Expirations },
  { text: "Every provider against every payer, so you see where each application stands.", View: Matrix },
  { text: "When a payer asks for something, it stays in sight until someone resolves it.", View: PayerRequest },
  { text: "Every call logged, so the next follow-up picks up where the last one left off.", View: FollowUps },
  { text: "Provider paperwork only — never a single patient record.", View: ProviderOnly },
];

export default function AuthStories({ start = 0 }) {
  const [i, setI] = useState(start % STORIES.length);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const next = () => setI((n) => (n + 1) % STORIES.length);

  return (
    <div className="auth-stories flex h-full flex-col px-12 pb-12 pt-10 xl:px-14">
      <div className="flex gap-1.5">
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

      <div className="relative flex-1">
        {STORIES.map(({ text, View }, n) => (
          <div
            key={text}
            aria-hidden={n !== i}
            className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <div className="flex flex-1 items-center justify-center py-16 xl:[&>*]:scale-[1.18] 2xl:[&>*]:scale-[1.3]">
              <View />
            </div>
            <p className="max-w-lg text-[1.75rem] font-normal leading-[1.2] tracking-[-0.02em] text-white">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
