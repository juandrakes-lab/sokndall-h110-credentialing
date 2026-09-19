"use client";

import { useEffect, useState } from "react";
import { Avatar, Badge, ICONS, Icon, Ring, STATUS_FILL, SegmentBar, cardClass } from "@/components/app/ui";
import { AppWindow, CHIP, Float, PEOPLE, Row, Stat, Title, deep } from "@/components/app/showcase/parts";
import Stage from "@/components/app/showcase/Stage";
import { ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";

// The access screens' panel: five "stories", each one sentence and a scene
// rebuilt in HTML from the app's own parts — never a screenshot. A scene is a
// big app window in perspective that runs off the panel's edge, with detail
// cards floating in front of it. Scenes are drawn on a fixed 560×460 canvas
// and scaled to fit the room the panel has, so nothing overlaps or stretches
// at any window size. They advance like Instagram stories (paused on hover;
// never on their own with reduced motion); the bars jump to one.
//
// The figures are the demo client's (Riverside Pediatrics, test data). People
// who sign in carry generic names and Pexels portraits; providers keep
// initials, as in the app — they never have photos.

const W = 560;
const H = 460;
const DURATION = 7000;

// ---- the five scenes -------------------------------------------------------
// Few things per scene, drawn large: a scene is read at a glance while it
// plays, so it shows one idea, not a whole screen.

function Board() {
  return (
    <>
      <AppWindow x={24} y={52} w={528} h={400}>
        <Title>Dashboard</Title>
        <div className="grid grid-cols-2 gap-3">
          <Stat accent label="Need you this week" value="31" hint="Expiring, overdue and payer requests." icon={ICONS.pulse} />
          <Stat label="Expiring within 14 days" value="7" hint="Credentials and revalidations." icon={ICONS.calendar} tone="red" />
        </div>
        <div className={`${cardClass} mt-3 overflow-hidden`}>
          <p className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-ink-900">
            <Icon d={ICONS.arrowRight} className="h-4 w-4" /> Start here
          </p>
          <Row name="Maya Chen" detail="State license">
            <Badge tone="red">Expired</Badge>
          </Row>
          <Row name="Daniel Okafor" detail="DEA registration">
            <Badge tone="red">1 day left</Badge>
          </Row>
        </div>
      </AppWindow>
      <Float x={300} y={0} w={256} bob={1.6}>
        <div className="flex gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-status-expired-bg text-status-expired">
            <Icon d={ICONS.mail} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-status-expired">Expiration alert</p>
            <p className="mt-0.5 text-sm font-medium leading-snug text-ink-900">Daniel Okafor&apos;s DEA expires tomorrow</p>
          </div>
        </div>
      </Float>
      <Float x={0} y={0} w={220} bob={0}>
        <div className="flex items-center gap-3 p-4">
          <Ring value={0.4} size={60} tone="red">
            <span className="text-sm font-semibold text-ink-900">40%</span>
          </Ring>
          <p className="text-sm leading-snug text-ink-700">
            <span className="font-semibold text-ink-900">6 of 15</span>
            <br />
            fully current
          </p>
        </div>
      </Float>
    </>
  );
}

const PAYERS = ["Aetna", "Cigna", "UHC"];
const MATRIX = [
  ["Bello, Aisha", ["in_review", "approved", "in_review"]],
  ["Brooks, Ethan", ["submitted", "not_started", "approved"]],
  ["Chen, Maya", ["approved", "approved", "not_started"]],
  ["Fischer, Noah", ["not_started", "info_requested", "approved"]],
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
      <AppWindow x={24} y={24} w={528} h={420} nav="enrollments">
        <Title>Enrollments</Title>
        <div className={`${cardClass} overflow-hidden`}>
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="w-44 border-b border-r border-ink-100 px-4 py-3 text-left text-xs font-medium text-ink-700">Provider</th>
                {PAYERS.map((p) => (
                  <th key={p} className="border-b border-ink-100 px-2 py-3 text-left text-xs font-semibold text-ink-900">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map(([name, cells]) => (
                <tr key={name}>
                  <th className="border-b border-r border-ink-100 px-4 py-2.5 text-left font-normal">
                    <span className="flex items-center gap-2.5">
                      <Avatar name={name.split(", ").reverse().join(" ")} size="sm" />
                      <span className="truncate font-semibold text-ink-900">{name}</span>
                    </span>
                  </th>
                  {cells.map((s, i) => (
                    <td key={i} className="border-b border-ink-100 px-1.5 py-2.5">
                      <span className={`block truncate rounded-lg px-2.5 py-1.5 text-xs font-medium ${CHIP[s]}`}>{ENROLLMENT_STATUS_LABELS[s]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppWindow>
      <Float x={0} y={352} w={290} bob={0}>
        <div className="p-4">
          <p className="flex items-center justify-between text-sm font-semibold text-ink-900">
            All applications <Badge>105</Badge>
          </p>
          <div className="mt-3">
            <SegmentBar segments={PIPELINE.map(([k, v]) => ({ key: k, label: ENROLLMENT_STATUS_LABELS[k], value: v, color: STATUS_FILL[k] }))} height={10} />
          </div>
          <div className="mt-3 flex justify-between">
            {PIPELINE.slice(0, 3).map(([k, v]) => (
              <span key={k} className="flex flex-col">
                <span className="text-lg font-semibold leading-none text-ink-900">{v}</span>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                  <span className="h-2 w-2 rounded-full" style={{ background: STATUS_FILL[k] }} />
                  {ENROLLMENT_STATUS_LABELS[k]}
                </span>
              </span>
            ))}
          </div>
        </div>
      </Float>
    </>
  );
}

function PayerRequest() {
  return (
    <>
      <AppWindow x={0} y={70} w={420} h={360} nav="followUps" tilt={-12}>
        <Title>Follow-ups</Title>
        <Stat label="Payer requests" value="6" hint="Payers waiting on you." icon={ICONS.alert} tone="amber" />
        <div className={`${cardClass} mt-3 overflow-hidden`}>
          {["Ethan Brooks", "Noah Fischer"].map((n) => (
            <div key={n} className="flex items-center gap-3 border-t border-ink-100 px-4 py-2.5 first:border-t-0">
              <Avatar name={n} size="sm" />
              <span className="truncate text-sm font-medium text-ink-900">{n}</span>
            </div>
          ))}
        </div>
      </AppWindow>
      <div
        className={`absolute overflow-hidden rounded-[20px] bg-white ${deep}`}
        style={{ left: 200, top: 20, width: 350, height: 400, transform: "perspective(2200px) rotateY(-6deg)", transformOrigin: "left center" }}
      >
        <div className="border-b border-ink-100 bg-ink-50/80 px-6 py-5">
          <p className="text-xs text-ink-500">UnitedHealthcare Community Plan</p>
          <p className="mt-1 text-xl font-semibold text-ink-900">Ethan Brooks</p>
          <div className="mt-2">
            <Badge tone="amber">Info requested</Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="rounded-2xl bg-status-expiring-bg px-5 py-4 ring-1 ring-inset ring-status-expiring/25">
            <p className="text-xs font-semibold text-status-expiring">The payer is waiting on this</p>
            <p className="mt-1 text-base font-medium text-ink-900">Current CAQH attestation</p>
            <span className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 text-sm font-medium text-white">
              <Icon d={ICONS.check} className="h-4 w-4" /> Mark as resolved
            </span>
          </div>
        </div>
      </div>
      <Float x={170} y={400} w={210} bob={0.8}>
        <div className="flex items-center gap-3 py-3 pl-3 pr-4">
          <Avatar name={PEOPLE.erin.name} photo={PEOPLE.erin.photo} size="md" />
          <span className="text-sm leading-snug text-ink-700">
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
  const field = (label, value, wide) => (
    <div className={wide ? "col-span-2" : ""}>
      <p className="mb-1.5 text-xs font-medium text-ink-900">{label}</p>
      <div className="flex h-10 items-center rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900">{value}</div>
    </div>
  );
  return (
    <>
      <AppWindow x={24} y={24} w={528} h={420} nav="followUps">
        <Title sub="EmblemHealth · Grace Liu">Log a follow-up</Title>
        <div className={`${cardClass} grid max-w-[440px] grid-cols-2 gap-3 p-5`}>
          {field("Who you spoke with", "Rita, enrollment", true)}
          {field("What happened", "Moved to committee review", true)}
          {field("Reference", "EH-5521903")}
          {field("Next follow-up", "Sep 25")}
        </div>
      </AppWindow>
      <Float x={280} y={290} w={272} bob={0}>
        <div className="flex gap-3 p-4">
          <Avatar name={PEOPLE.ana.name} photo={PEOPLE.ana.photo} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-900">Phone · Sep 18</p>
            <p className="mt-0.5 text-sm text-ink-700">Moved to committee review</p>
            <p className="mt-1 text-xs text-ink-500">Logged by {PEOPLE.ana.name}</p>
          </div>
        </div>
      </Float>
    </>
  );
}

function ProviderFile() {
  const creds = [
    ["State license", "Expired", "red"],
    ["CAQH attestation", "30 days left", "amber"],
    ["DEA registration", "Current", "green"],
  ];
  return (
    <>
      <AppWindow x={24} y={24} w={528} h={420} nav="providers">
        <div className="mb-5 flex items-center gap-3">
          <Avatar name="Maya Chen" size="lg" />
          <div>
            <p className="text-[1.625rem] font-normal leading-none tracking-[-0.03em] text-ink-900">Maya Chen</p>
            <p className="mt-1.5 text-sm text-ink-500">Pediatrics</p>
          </div>
        </div>
        <div className={`${cardClass} max-w-[440px] overflow-hidden`}>
          <p className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-ink-900">
            <Icon d={ICONS.shield} className="h-4 w-4 text-brand-600" /> Credentials
          </p>
          {creds.map(([t, b, tone]) => (
            <div key={t} className="flex items-center justify-between gap-3 border-t border-ink-100 px-4 py-3">
              <span className="text-sm font-medium text-ink-900">{t}</span>
              <Badge tone={tone} dot>
                {b}
              </Badge>
            </div>
          ))}
        </div>
      </AppWindow>
      <Float x={300} y={300} w={252} bob={0}>
        <div className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Icon d={ICONS.shield} className="h-4 w-4 text-brand-600" /> Kept on file
          </p>
          <p className="mt-2 text-sm text-ink-700">Licenses, DEA, malpractice, CAQH, payer applications.</p>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-ink-50 px-3.5 py-2.5">
            <span className="text-sm text-ink-500 line-through">Patient records</span>
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
              <Stage w={W} h={H}>
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
