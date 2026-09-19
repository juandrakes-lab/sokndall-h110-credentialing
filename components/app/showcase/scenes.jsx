// The marketing pages' product shots, one scene per figure (ProductShot draws
// each on its canvas). Every scene shows one idea at a readable size — a few
// rows, not a whole screen. Figures are the demo client's (Riverside Pediatrics
// and the demo Billing Co book, test data); where a scene carries the page's
// own words (a status path, the two stages, the units), they come in as props
// from that page's data.js, so the copy stays where it is approved.

import { Avatar, Badge, ICONS, Icon, IconTile, PersonPhoto, STATUS_FILL, SegmentBar, cardClass } from "@/components/app/ui";
import { ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";
import { AppWindow, CHIP, Float, PEOPLE, Title, deep } from "@/components/app/showcase/parts";

// ---- shared pieces -----------------------------------------------------------

// The demo client's matrix, rows × payers as they stand.
const GRID = {
  payers: ["Aetna", "Cigna", "UHC", "Excellus", "EmblemHealth"],
  rows: [
    ["Bello, Aisha", "Pediatric NP", ["in_review", "approved", "in_review", "info_requested", "in_review"]],
    ["Brooks, Ethan", "Pediatric Cardiology", ["submitted", "not_started", "approved", "approved", "info_requested"]],
    ["Chen, Maya", "Pediatrics", ["approved", "approved", "not_started", "approved", "approved"]],
    ["Fischer, Noah", "Neonatal-Perinatal", ["not_started", "info_requested", "approved", "in_review", "in_review"]],
    ["Kowalski, Hannah", "Physician Assistant", ["denied", "approved", "approved", "approved", "approved"]],
  ],
};

const PIPELINE = [
  ["approved", 48],
  ["in_review", 19],
  ["submitted", 9],
  ["info_requested", 6],
  ["denied", 1],
  ["not_started", 22],
];

function MatrixTable({ cols, rows = 5, spec = false, first = 168, tight = false }) {
  return (
    <div className={`${cardClass} overflow-hidden`}>
      <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th style={{ width: first }} className="border-b border-r border-ink-100 px-3 py-3 text-left text-xs font-medium text-ink-700">Provider</th>
            {cols.map((c) => (
              <th key={c} className="border-b border-ink-100 px-2 py-3 text-left text-xs font-semibold text-ink-900">
                {GRID.payers[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GRID.rows.slice(0, rows).map(([name, specialty, cells]) => (
            <tr key={name}>
              <th className="border-b border-r border-ink-100 px-3 py-2.5 text-left font-normal">
                <span className="flex items-center gap-2.5">
                  <Avatar name={name.split(", ").reverse().join(" ")} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink-900">{name}</span>
                    {spec && <span className="block truncate text-[0.6875rem] text-ink-500">{specialty}</span>}
                  </span>
                </span>
              </th>
              {cols.map((c) => (
                <td key={c} className={`border-b border-ink-100 py-2.5 ${tight ? "px-1" : "px-1.5"}`}>
                  <span className={`block truncate rounded-lg py-1.5 text-xs font-medium ${tight ? "px-2" : "px-2.5"} ${CHIP[cells[c]]}`}>{ENROLLMENT_STATUS_LABELS[cells[c]]}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PipelineCard() {
  return (
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
  );
}

// A flat app card for the diagrams (no window around them).
function Panel({ className = "", children }) {
  return <div className={`${cardClass} ${className}`}>{children}</div>;
}

// ---- home --------------------------------------------------------------------

// Hero, 560×420, on the dark hero panel. The hero's own indicator chips float
// over this figure, so the scene carries no floating card of its own.
export function HeroMatrix() {
  return (
    <AppWindow x={6} y={40} w={548} h={340} nav="enrollments">
      <Title>Enrollments</Title>
      <MatrixTable cols={[0, 1, 2]} rows={4} first={146} tight />
    </AppWindow>
  );
}

// "The screen this is really about", full width, 1040×500.
export function HomeMatrix() {
  return (
    <>
      <AppWindow x={30} y={30} w={800} h={440} nav="enrollments" tilt={-5}>
        <Title>Enrollments</Title>
        <MatrixTable cols={[0, 1, 2, 3]} rows={5} spec />
      </AppWindow>
      <Float x={740} y={170} w={280} bob={1.2}>
        <div className="p-4">
          <p className="text-xs text-ink-500">Aisha Bello · Excellus BCBS</p>
          <div className="mt-2 rounded-xl bg-status-expiring-bg px-3.5 py-3 ring-1 ring-inset ring-status-expiring/25">
            <p className="text-[0.6875rem] font-semibold text-status-expiring">The payer is waiting on this</p>
            <p className="mt-0.5 text-sm font-medium text-ink-900">Signed W-9 dated this year</p>
          </div>
          <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-xl bg-brand-700 px-3 text-xs font-medium text-white">
            <Icon d={ICONS.check} className="h-3.5 w-3.5" /> Mark as resolved
          </span>
        </div>
      </Float>
    </>
  );
}

// The Monday digest, 400×340 (a narrow card column): the real email's layout
// with the demo client's week.
export function MondayDigest() {
  const rows = [
    ["Olivia Grant · EmblemHealth", "In review"],
    ["Grace Liu · Cigna Healthcare", "In review"],
  ];
  return (
    <div
      className="absolute overflow-hidden rounded-[18px] bg-white ring-1 ring-black/5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.65)]"
      style={{ left: 20, top: 20, width: 360, height: 300 }}
    >
      <div className="flex items-center gap-2.5 border-b border-ink-100 bg-ink-50 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-700 text-xs font-semibold text-white">S</span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold text-ink-900">Sokndall</span>
          <span className="block text-[0.6875rem] text-ink-500">Monday · Your week</span>
        </span>
      </div>
      <div className="px-5 pt-4">
        <p className="text-lg font-bold leading-tight text-ink-900">Your week in credentialing</p>
        <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500">Follow-ups this week · 20</p>
        <div className="mt-1.5 border-t border-ink-100">
          {rows.map(([t, d]) => (
            <div key={t} className="flex items-center justify-between gap-2 border-b border-ink-100 py-2.5">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">{t}</span>
                <span className="block text-xs text-ink-500">{d}</span>
              </span>
              <span className="shrink-0 rounded-full bg-status-expired-bg px-2 py-0.5 text-[0.6875rem] font-medium text-status-expired">Overdue</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500">Stalled 30+ days · 11</p>
      </div>
    </div>
  );
}

// ---- /payer-enrollment-software ------------------------------------------------

const TONE_OF = { "Not started": "not_started", Submitted: "submitted", "In review": "in_review", "Info requested": "info_requested", Approved: "approved" };

// One application's path, 720×270 — TRACK's steps, end and branch, drawn with
// the panel's status chips.
// Full width, 1040×290.
export function StatusPath({ steps, end, branch }) {
  return (
    <div className={`${cardClass} absolute left-8 right-8 top-8 bottom-8 px-8 py-7`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
        <Icon d={ICONS.enrollments} className="h-4 w-4 text-brand-600" /> One application
      </p>
      <ol className="mt-7 flex items-start justify-between gap-3">
        {steps.map((s, i) => (
          <li key={s.label} className="flex flex-col items-start">
            <span className={`relative z-10 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium ${s.action ? "bg-status-expiring-bg text-status-expiring ring-1 ring-status-expiring" : CHIP[TONE_OF[s.label]] ?? "bg-white text-ink-700 ring-1 ring-ink-200"}`}>
              {s.label}
            </span>
            {s.hint && <span className="mt-2 max-w-[10rem] text-xs leading-snug text-status-expiring">{s.hint}</span>}
          </li>
        ))}
        <li className="flex flex-col items-start">
          <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-700 px-3.5 py-2 text-sm font-medium text-white">
            <Icon d={ICONS.calendar} className="h-3.5 w-3.5" /> {end}
          </span>
        </li>
      </ol>
      <div className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-4">
        <span className="rounded-full bg-status-expired-bg px-3.5 py-2 text-sm font-medium text-status-expired">{branch.label}</span>
        <span className="text-sm text-ink-500">{branch.hint}</span>
      </div>
    </div>
  );
}

// The two stages, 560×420 — the section's own words in two app cards.
export function Stages({ stages }) {
  return (
    <div className="absolute inset-6 flex flex-col justify-center gap-4">
      {stages.map((st, i) => (
        <div key={st.name} className={`${cardClass} relative px-6 py-5`}>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">{i + 1}</span>
            <p className="text-lg font-semibold text-ink-900">{st.name}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{st.is}</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge tone="amber">Stalls on</Badge>
            <span className="text-sm text-ink-900">{st.stalls}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// One application's confirmed effective date, 560×420 (demo: Tomás Herrera at Cigna).
export function EffectiveDate() {
  return (
    <>
      <div
        className={`absolute overflow-hidden rounded-[20px] bg-white ${deep}`}
        style={{ left: 30, top: 24, width: 470, height: 340, transform: "perspective(2200px) rotateY(-7deg)", transformOrigin: "left center" }}
      >
        <div className="border-b border-ink-100 bg-ink-50/80 px-6 py-5">
          <p className="text-xs text-ink-500">Cigna Healthcare</p>
          <p className="mt-1 text-xl font-semibold text-ink-900">Tomás Herrera</p>
          <div className="mt-2">
            <Badge tone="green">Approved</Badge>
          </div>
        </div>
        <div className="p-6">
          <p className="mb-3 text-sm font-semibold text-ink-900">Application details</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-ink-50 px-4 py-3">
              <p className="text-xs text-ink-500">Submitted</p>
              <p className="mt-0.5 text-ink-900">Jan 12, 2026</p>
            </div>
            <div className="rounded-xl bg-status-active-bg px-4 py-3 ring-1 ring-inset ring-status-active/30">
              <p className="text-xs font-medium text-status-active">Effective</p>
              <p className="mt-0.5 font-semibold text-ink-900">Mar 17, 2026</p>
            </div>
            <div className="col-span-2 rounded-xl bg-ink-50 px-4 py-3">
              <p className="text-xs text-ink-500">Reference</p>
              <p className="mt-0.5 text-ink-900">PRV-949725</p>
            </div>
          </div>
        </div>
      </div>
      <Float x={286} y={318} w={250} bob={0.9}>
        <div className="flex items-center gap-3 p-3.5">
          <Avatar name={PEOPLE.luis.name} photo={PEOPLE.luis.photo} size="md" />
          <span className="text-sm leading-snug text-ink-700">
            Marked <b className="text-ink-900">Approved</b>
            <br />
            Sep 17 · {PEOPLE.luis.name}
          </span>
        </div>
      </Float>
    </>
  );
}

// The matrix with the book's totals, 600×440 (half width, beside a dark tile).
export function EnrollmentMatrix() {
  return (
    <>
      <AppWindow x={20} y={16} w={560} h={292} nav="enrollments" tilt={-5}>
        <Title>Enrollments</Title>
        <MatrixTable cols={[2, 3, 4]} rows={3} />
      </AppWindow>
      <Float x={220} y={300} w={300} bob={0.7}>
        <PipelineCard />
      </Float>
    </>
  );
}

// ---- /for-billing-companies --------------------------------------------------

const CLIENTS = [
  { name: "Riverside Pediatrics PLLC", providers: 15, due: 20, renew: 25 },
  { name: "Lakeview Behavioral Health LLC", providers: 3, due: 0, renew: 3 },
  { name: "Clinical Neuroscience Research Associates, Inc.", providers: 3, due: 1, renew: 3 },
];

// Client organizations, scoped access and the aggregate view, full width, 1040×440.
export function ClientBook() {
  return (
    <>
      <AppWindow x={330} y={30} w={680} h={380} nav="dashboard" tilt={-5}>
        <Title sub="Follow-ups due this week, across every client">Clients</Title>
        <div className={`${cardClass} overflow-hidden`}>
          {CLIENTS.map((c) => (
            <div key={c.name} className="flex items-center justify-between gap-3 border-t border-ink-100 px-4 py-3 first:border-t-0">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">{c.name}</span>
                <span className="block text-xs text-ink-500">{c.providers} providers</span>
              </span>
              <Badge tone={c.due ? "amber" : "green"}>{c.due ? `${c.due} follow-up${c.due === 1 ? "" : "s"} this week` : "Nothing due"}</Badge>
            </div>
          ))}
        </div>
      </AppWindow>
      <div className={`glass absolute left-6 top-10 w-[340px] p-1.5 ${deep}`}>
        <p className="px-3 pb-1 pt-2 text-xs font-medium text-ink-500">Client</p>
        {CLIENTS.map((c, i) => (
          <div key={c.name} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${i === 0 ? "bg-white" : ""}`}>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-900">{c.name}</span>
            {i === 0 && <Icon d={ICONS.check} className="h-4 w-4 text-brand-600" />}
          </div>
        ))}
      </div>
      <Float x={40} y={260} w={240} bob={1}>
        <div className="flex items-center gap-3 p-3.5">
          <PersonPhoto name={PEOPLE.ana.name} photo={PEOPLE.ana.photo} size="md" />
          <span className="text-sm leading-snug text-ink-700">
            <b className="text-ink-900">{PEOPLE.ana.name}</b>
            <br />
            Sees 2 of 3 clients
          </span>
        </div>
      </Float>
    </>
  );
}

// Per-client report: dates, statuses, last follow-up, 560×420.
export function ClientReport() {
  const rows = [
    ["Aisha Bello", "Pediatric Nurse Practitioner", "All current", "green", "1 approved of 7"],
    ["Ethan Brooks", "Pediatric Cardiology", "1 due within 30 days", "red", "3 approved of 7"],
    ["Maya Chen", "Pediatrics", "1 expired", "red", "5 approved of 7"],
    ["Daniel Okafor", "Pediatrics", "1 expired", "red", "4 approved of 7"],
  ];
  return (
    <>
      <AppWindow x={18} y={22} w={524} h={360} nav="providers" tilt={-6}>
        <Title sub="Riverside Pediatrics PLLC">Providers</Title>
        <div className={`${cardClass} overflow-hidden`}>
          {rows.map(([n, s, cred, tone, apps]) => (
            <div key={n} className="flex items-center gap-3 border-t border-ink-100 px-4 py-2.5 first:border-t-0">
              <Avatar name={n} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-900">{n}</span>
                <span className="block truncate text-[0.6875rem] text-ink-500">{apps}</span>
              </span>
              <Badge tone={tone} dot>
                {cred}
              </Badge>
            </div>
          ))}
        </div>
      </AppWindow>
      <Float x={330} y={336} w={210} bob={0.8}>
        <div className="flex items-center gap-3 p-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon d={ICONS.download} className="h-5 w-5" />
          </span>
          <span className="text-sm leading-snug text-ink-700">
            <b className="text-ink-900">Export CSV</b>
            <br />
            one file per client
          </span>
        </div>
      </Float>
    </>
  );
}

// ---- /credentialing-spreadsheet-template ------------------------------------

// The free file's credentials tab, full width, 1040×420 — its own columns (docs/spreadsheet-
// template.csv) and example rows, with the days counted to Sep 19, 2026.
export function TemplateSheet() {
  const cols = ["Provider Name", "Credential Type", "State", "Identifier", "Expiration Date", "Days Until Expiration", "Status"];
  const rows = [
    ["Dr. Jane Smith", "State License", "CA", "MD-12345", "2027-01-15", "118", ["Current", "green"]],
    ["Dr. Jane Smith", "DEA Registration", "CA", "BS1234567", "2026-06-01", "-110", ["Expired", "red"]],
    ["Dr. John Doe", "Malpractice Insurance", "CA", "POL-98765", "2026-03-01", "-202", ["Expired", "red"]],
  ];
  const tabs = ["Providers", "Credentials", "Payer enrollment", "CAQH", "Dashboard", "How to use"];
  return (
    <div className="absolute inset-8 flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/[0.08] shadow-[0_24px_60px_-24px_rgba(14,42,46,0.45)]">
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-4 py-2.5">
        <Icon d={ICONS.file} className="h-4 w-4 text-status-active" />
        <span className="text-sm font-medium text-ink-900">Credentialing tracker</span>
        <span className="text-xs text-ink-500">· Excel or Google Sheets</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <table className="w-full border-collapse text-[0.8125rem]">
          <thead>
            <tr className="bg-ink-50/60">
              <th className="w-8 border border-ink-100" />
              {cols.map((c) => (
                <th key={c} className="border border-ink-100 px-3 py-2 text-left text-xs font-semibold text-ink-900">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="border border-ink-100 bg-ink-50/60 text-center text-[0.6875rem] text-ink-500">{i + 2}</td>
                {r.slice(0, 6).map((v, j) => (
                  <td key={j} className={`border border-ink-100 px-3 py-2 text-ink-900 ${j === 5 ? "text-right tabular-nums" : ""}`}>
                    {v}
                  </td>
                ))}
                <td className="border border-ink-100 px-3 py-2">
                  <Badge tone={r[6][1]}>{r[6][0]}</Badge>
                </td>
              </tr>
            ))}
            {[5, 6].map((n) => (
              <tr key={n}>
                <td className="border border-ink-100 bg-ink-50/60 text-center text-[0.6875rem] text-ink-500">{n}</td>
                {cols.map((c) => (
                  <td key={c} className="h-9 border border-ink-100" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-1 border-t border-ink-100 bg-ink-50 px-3 py-1.5">
        {tabs.map((t) => (
          <span key={t} className={`rounded-md px-3 py-1 text-xs ${t === "Credentials" ? "bg-white font-semibold text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.12)]" : "text-ink-500"}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---- /pricing ----------------------------------------------------------------

// Users against providers, 560×420 — the section's rows and caption.
export function UsersProviders({ rows, caption }) {
  const people = [PEOPLE.erin, PEOPLE.luis, PEOPLE.ana];
  // The demo client's fifteen providers, round and round.
  const names = ["Aisha Bello", "Ethan Brooks", "Maya Chen", "Gregory Daytona", "Noah Fischer", "Olivia Grant", "Hannah Kowalski", "Grace Liu", "Lauren Mitchell", "Priya Natarajan", "Daniel Okafor", "Samuel Park", "Sofia Ramirez", "Marcus Reed", "James Whitaker"];
  return (
    <div className="absolute inset-6 flex flex-col gap-3.5">
      {rows.map((r) => (
        <Panel key={r.unit} className="px-5 py-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-semibold leading-none tracking-[-0.02em] text-ink-900">{r.count}</span>
            <span className="text-sm font-semibold text-ink-900">{r.unit}</span>
            <span className="ml-auto text-xs text-ink-500">{r.note}</span>
          </div>
          <div className={`mt-3 flex flex-wrap ${r.kind === "person" ? "gap-2" : "gap-1"}`}>
            {r.kind === "person"
              ? people.slice(0, r.count).map((p) => <PersonPhoto key={p.name} name={p.name} photo={p.photo} size="md" />)
              : Array.from({ length: r.count }, (_, i) => (
                  <span key={i} className="scale-[0.8]">
                    <Avatar name={names[i % names.length]} size="sm" />
                  </span>
                ))}
          </div>
        </Panel>
      ))}
      {caption && (
        <p className="flex items-center gap-2 px-1 text-sm text-ink-700">
          <IconTile d={ICONS.team} size="sm" />
          {caption}
        </p>
      )}
    </div>
  );
}
