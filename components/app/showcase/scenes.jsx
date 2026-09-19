// The marketing pages' product shots. A large figure gets a whole screen of
// the app at its real size (AppScreen) with a small indicator card or two
// floating over it; a small figure gets one panel. Every canvas is at least as
// big as the figure shows it, so a shot is only ever scaled down — never up,
// never tilted — which is what keeps the type sharp.
//
// Built from the app's own components (StatCard, Badge, Avatar, Ring,
// SegmentBar, the matrix chips) and the demo client's test data (Riverside
// Pediatrics, and the demo Billing Co book). Signed-in people carry generic
// names and Pexels portraits; providers keep initials. Where a scene carries a
// page's own words (the status path, the two stages, the units), they come in
// as props from that page's data.js.

import { Avatar, Badge, ICONS, Icon, IconTile, PersonPhoto, Ring, STATUS_FILL, SegmentBar, StatCard, cardClass } from "@/components/app/ui";
import { ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";
import { CHIP, PEOPLE } from "@/components/app/showcase/parts";
import AppScreen, { Chip, floatShadow } from "@/components/app/showcase/AppScreen";

// ---- data --------------------------------------------------------------------

const PAYERS = ["Aetna", "Cigna Healthcare", "UnitedHealthcare", "Excellus BCBS", "EmblemHealth"];
const GRID = [
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
const pipelineSegments = PIPELINE.map(([k, v]) => ({ key: k, label: ENROLLMENT_STATUS_LABELS[k], value: v, color: STATUS_FILL[k] }));

// ---- pieces --------------------------------------------------------------------

function ScreenTitle({ title, sub, actions }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-[2rem] font-normal leading-[1.1] tracking-[-0.03em] text-ink-900">{title}</p>
        {sub && <p className="mt-1.5 text-[0.9375rem] text-ink-500">{sub}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

function Btn({ children, primary = false }) {
  return (
    <span className={`flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium ${primary ? "bg-brand-700 text-white" : "bg-white text-ink-900 ring-1 ring-inset ring-ink-200"}`}>
      {children}
    </span>
  );
}

function CardHead({ icon, title, sub, right }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-5 pb-3.5 pt-4">
      <div className="flex items-start gap-2.5">
        {icon && <IconTile d={icon} size="sm" />}
        <div>
          <p className="text-[1rem] font-semibold text-ink-900">{title}</p>
          {sub && <p className="mt-0.5 text-sm text-ink-500">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

function PersonRow({ name, detail, children }) {
  return (
    <div className="flex items-center gap-3 border-t border-ink-100 px-5 py-3 first:border-t-0">
      <Avatar name={name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9375rem] font-medium text-ink-900">{name}</p>
        <p className="truncate text-xs text-ink-500">{detail}</p>
      </div>
      {children}
    </div>
  );
}

function Legend({ items = PIPELINE, cols = 3 }) {
  return (
    <div className="grid gap-x-4 gap-y-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {items.map(([k, v]) => (
        <span key={k} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STATUS_FILL[k] }} />
          <span className="text-sm font-semibold text-ink-900">{v}</span>
          <span className="truncate text-xs text-ink-500">{ENROLLMENT_STATUS_LABELS[k]}</span>
        </span>
      ))}
    </div>
  );
}

function MatrixCard({ cols = [0, 1, 2, 3, 4], rows = 5, first = 220 }) {
  return (
    <div className={`${cardClass} overflow-hidden`}>
      <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th style={{ width: first }} className="border-b border-r border-ink-100 px-4 py-3 text-left text-xs font-medium text-ink-700">
              Provider
            </th>
            {cols.map((c) => (
              <th key={c} className="border-b border-ink-100 px-3 py-3 text-left text-xs font-semibold text-ink-900">
                {PAYERS[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GRID.slice(0, rows).map(([name, spec, cells]) => (
            <tr key={name}>
              <th className="border-b border-r border-ink-100 px-4 py-2 text-left font-normal">
                <span className="flex items-center gap-2.5">
                  <Avatar name={name.split(", ").reverse().join(" ")} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink-900">{name}</span>
                    <span className="block truncate text-xs text-ink-500">{spec}</span>
                  </span>
                </span>
              </th>
              {cols.map((c) => (
                <td key={c} className="border-b border-ink-100 px-2 py-2">
                  <span className={`flex items-center justify-between gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium ${CHIP[cells[c]]}`}>
                    <span className="truncate">{ENROLLMENT_STATUS_LABELS[cells[c]]}</span>
                    {name === "Bello, Aisha" && c === 3 && <span className="h-2 w-2 shrink-0 rounded-full bg-red-600" />}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- home ----------------------------------------------------------------------

// Hero, 1000×680 (shown at about half): the dashboard, whole.
export function HeroMatrix() {
  return (
    <AppScreen w={1000} h={680} active="dashboard" url="dashboard">
      <ScreenTitle title="Dashboard" sub="Saturday, September 19 · Riverside Pediatrics PLLC" actions={<Btn>Export CSV</Btn>} />
      <div className="grid grid-cols-3 gap-4">
        <StatCard accent label="Need you this week" value="31" hint="Expiring soon, overdue and payer requests." icon={ICONS.pulse} />
        <StatCard label="Expiring within 14 days" value="7" hint="Credentials and payer revalidations." icon={ICONS.calendar} tone="red" />
        <StatCard label="Follow-ups overdue" value="18" hint="20 due this week in all." icon={ICONS.phone} tone="amber" />
      </div>
      <div className="mt-4 grid grid-cols-[1.4fr_1fr] gap-4">
        <div className={`${cardClass} overflow-hidden`}>
          <CardHead icon={ICONS.arrowRight} title="Start here" sub="The most urgent items first. Open one to act on it." />
          <PersonRow name="Lauren Mitchell" detail="Payer revalidation · Aetna">
            <Badge tone="red">Expired</Badge>
          </PersonRow>
          <PersonRow name="Maya Chen" detail="State license">
            <Badge tone="red">Expired</Badge>
          </PersonRow>
          <PersonRow name="Daniel Okafor" detail="Malpractice insurance">
            <Badge tone="red">Expired</Badge>
          </PersonRow>
          <PersonRow name="Daniel Okafor" detail="DEA registration">
            <Badge tone="red">1 day left</Badge>
          </PersonRow>
        </div>
        <div className={`${cardClass} overflow-hidden`}>
          <CardHead icon={ICONS.shield} title="Credentials current" sub="Nothing expired or due within 30 days." />
          <div className="px-5 py-4">
            <div className="flex items-center gap-4">
              <Ring value={0.4} size={84} tone="red">
                <span className="text-base font-semibold text-ink-900">40%</span>
              </Ring>
              <p className="text-sm text-ink-700">
                <b className="text-ink-900">6</b> of 15 providers are fully current.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-ink-700">
              {[
                ["Something expired", 2, "bg-status-expired"],
                ["Due within 30 days", 6, "bg-status-expiring"],
                ["Current", 6, "bg-status-active"],
                ["No credentials on file", 1, "bg-ink-200"],
              ].map(([l, n, c]) => (
                <span key={l} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${c}`} />
                    {l}
                  </span>
                  <b className="text-ink-900">{n}</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}

// "The screen this is really about", 1240×700 (shown at about full size).
export function HomeMatrix() {
  return (
    <>
      <AppScreen x={0} y={0} w={1240} h={690} active="enrollments" url="enrollments">
        <ScreenTitle
          title="Enrollments"
          sub="Every provider against every payer you work with. Click a cell to update it."
          actions={
            <>
              <Btn>Export CSV</Btn>
              <Btn>Edit payer list</Btn>
            </>
          }
        />
        <div className={`${cardClass} mb-4 px-5 py-4`}>
          <p className="mb-3 flex items-center justify-between text-sm font-semibold text-ink-900">
            Where every application stands <Badge>105</Badge>
          </p>
          <SegmentBar segments={pipelineSegments} height={12} />
          <div className="mt-3">
            <Legend cols={6} />
          </div>
        </div>
        <MatrixCard />
      </AppScreen>
      <Chip x={700} y={620} w={320} bob={1.2}>
        <div className="p-4">
          <p className="text-xs text-ink-500">Aisha Bello · Excellus BCBS</p>
          <div className="mt-2 rounded-xl bg-status-expiring-bg px-3.5 py-3 ring-1 ring-inset ring-status-expiring/25">
            <p className="text-xs font-semibold text-status-expiring">The payer is waiting on this</p>
            <p className="mt-0.5 text-sm font-medium text-ink-900">Signed W-9 dated this year</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="flex h-8 items-center gap-1.5 rounded-xl bg-brand-700 px-3 text-xs font-medium text-white">
              <Icon d={ICONS.check} className="h-3.5 w-3.5" /> Mark as resolved
            </span>
            <span className="flex items-center gap-1.5 text-xs text-ink-500">
              <span className="h-2 w-2 rounded-full bg-red-600" /> Follow-up due
            </span>
          </div>
        </div>
      </Chip>
      <Chip x={1050} y={650} w={190} bob={0.4}>
        <div className="p-4">
          <p className="text-xs font-medium text-ink-500">Stalled 30+ days</p>
          <p className="mt-1 flex items-center gap-2 text-[1.75rem] font-semibold leading-none text-ink-900">
            11 <Icon d={ICONS.pause} className="h-5 w-5 text-amber-600" strokeWidth={2.2} />
          </p>
        </div>
      </Chip>
    </>
  );
}

// The Monday digest, 560×520 (a narrow card column): the real email, whole.
export function MondayDigest() {
  const section = (title, rows) => (
    <>
      <p className="mt-4 text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500">{title}</p>
      <div className="mt-1.5 border-t border-ink-100">
        {rows.map(([t, d, pill, tone]) => (
          <div key={t} className="flex items-center justify-between gap-2 border-b border-ink-100 py-2.5">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink-900">{t}</span>
              <span className="block text-xs text-ink-500">{d}</span>
            </span>
            <Badge tone={tone}>{pill}</Badge>
          </div>
        ))}
      </div>
    </>
  );
  return (
    <div className={`absolute left-4 top-4 overflow-hidden rounded-[18px] bg-white ${floatShadow}`} style={{ width: 528, height: 488 }}>
      <div className="border-b border-ink-100 bg-ink-50 px-5 py-3.5">
        <p className="truncate text-sm font-semibold text-ink-900">Your week: 20 follow-ups, 23 expiring — Riverside Pediatrics PLLC</p>
        <p className="mt-0.5 text-xs text-ink-500">Sokndall · Monday</p>
      </div>
      <div className="px-6 pt-4">
        <p className="text-base font-bold text-brand-700">Sokndall</p>
        <p className="mt-1 text-xl font-bold text-ink-900">Your week in credentialing</p>
        <p className="mt-1 text-sm text-ink-500">Who to call this week, what&apos;s stuck with a payer, and what expires in the next 90 days.</p>
        {section("Follow-ups this week · 20", [
          ["Olivia Grant · EmblemHealth", "In review", "Overdue since Sep 15", "red"],
          ["Grace Liu · Cigna Healthcare", "In review", "Overdue since Sep 15", "red"],
        ])}
        {section("Stalled 30+ days · 11", [["Samuel Park · EmblemHealth", "In review", "Stalled", "amber"]])}
      </div>
    </div>
  );
}

// ---- /payer-enrollment-software --------------------------------------------------

const TONE_OF = { "Not started": "not_started", Submitted: "submitted", "In review": "in_review", "Info requested": "info_requested", Approved: "approved" };

// One application's path, full width, 1200×300 — TRACK's words on the panel's chips.
export function StatusPath({ steps, end, branch }) {
  return (
    <div className={`${cardClass} absolute inset-x-0 top-2 px-9 py-8`} style={{ height: 284 }}>
      <p className="flex items-center gap-2.5 text-[1.0625rem] font-semibold text-ink-900">
        <IconTile d={ICONS.enrollments} size="sm" /> One application, from submitted to effective date
      </p>
      <ol className="mt-8 flex items-start justify-between gap-2">
        {steps.map((s) => (
          <li key={s.label} className="flex items-start gap-2">
            <span className="flex flex-col items-start">
              <span className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${s.action ? "bg-status-expiring-bg text-status-expiring ring-1 ring-status-expiring" : CHIP[TONE_OF[s.label]]}`}>
                {s.label}
              </span>
              {s.hint && <span className="mt-2 text-xs text-status-expiring">{s.hint}</span>}
            </span>
            <Icon d={ICONS.chevronRight} className="mt-2.5 h-4 w-4 shrink-0 text-ink-300" />
          </li>
        ))}
        <li>
          <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white">
            <Icon d={ICONS.calendar} className="h-4 w-4" /> {end}
          </span>
        </li>
      </ol>
      <div className="mt-8 flex items-center gap-3 border-t border-ink-100 pt-5">
        <span className="rounded-full bg-status-expired-bg px-4 py-2 text-sm font-medium text-status-expired">{branch.label}</span>
        <span className="text-sm text-ink-500">{branch.hint}</span>
      </div>
    </div>
  );
}

// The two stages, 600×460 — the section's own words in two app cards.
export function Stages({ stages }) {
  return (
    <div className="absolute inset-x-0 top-6 flex flex-col gap-4">
      {stages.map((st, i) => (
        <div key={st.name} className={`${cardClass} px-6 py-5`}>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">{i + 1}</span>
            <p className="text-lg font-semibold text-ink-900">{st.name}</p>
          </div>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-700">{st.is}</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge tone="amber">Stalls on</Badge>
            <span className="text-sm text-ink-900">{st.stalls}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// One application's confirmed effective date, 700×560: the application panel.
export function EffectiveDate() {
  const statuses = ["not_started", "submitted", "in_review", "info_requested", "approved", "denied"];
  return (
    <>
      <div className={`absolute left-0 top-0 overflow-hidden rounded-[18px] bg-white ${floatShadow}`} style={{ width: 600, height: 520 }}>
        <div className="border-b border-ink-100 bg-ink-50/80 px-6 py-5">
          <p className="text-sm text-ink-500">Cigna Healthcare</p>
          <p className="mt-0.5 text-2xl font-semibold text-ink-900">Tomás Herrera</p>
          <div className="mt-2">
            <Badge tone="green">Approved</Badge>
          </div>
        </div>
        <div className="flex flex-col gap-6 p-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-900">Status</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-3.5 py-1.5 text-sm ${s === "approved" ? "bg-status-active-bg text-status-active ring-1 ring-status-active" : "bg-white text-ink-700 ring-1 ring-ink-200"}`}
                >
                  {ENROLLMENT_STATUS_LABELS[s]}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-900">Application details</p>
            <div className="grid grid-cols-3 items-center gap-3 rounded-2xl bg-ink-50 p-4 text-sm">
              <span>
                <span className="block text-xs text-ink-500">Submitted</span>
                <span className="text-ink-900">Jan 12, 2026</span>
              </span>
              <span className="rounded-xl bg-status-active-bg px-3 py-2 ring-1 ring-inset ring-status-active/30">
                <span className="block text-xs font-medium text-status-active">Effective</span>
                <span className="font-semibold text-ink-900">Mar 17, 2026</span>
              </span>
              <span>
                <span className="block text-xs text-ink-500">Reference</span>
                <span className="text-ink-900">PRV-949725</span>
              </span>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-900">History</p>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-status-active" />
              <span className="text-sm text-ink-700">
                <b className="text-ink-900">Approved</b> · Sep 17, 2026 · {PEOPLE.luis.name}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Chip x={440} y={440} w={240} bob={0.9}>
        <div className="flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-active-bg text-status-active">
            <Icon d={ICONS.calendar} className="h-5 w-5" />
          </span>
          <span className="text-sm leading-snug text-ink-700">
            In network from
            <br />
            <b className="text-base text-ink-900">Mar 17, 2026</b>
          </span>
        </div>
      </Chip>
    </>
  );
}

// The matrix with the book's totals, 900×640 (beside a dark tile).
export function EnrollmentMatrix() {
  return (
    <>
      <AppScreen x={0} y={0} w={880} h={600} active="enrollments" url="enrollments">
        <ScreenTitle title="Enrollments" sub="Riverside Pediatrics PLLC" />
        <MatrixCard cols={[0, 1, 2]} rows={5} first={230} />
      </AppScreen>
      <Chip x={520} y={540} w={340} bob={0.7}>
        <div className="p-4">
          <p className="mb-3 flex items-center justify-between text-sm font-semibold text-ink-900">
            All applications <Badge>105</Badge>
          </p>
          <SegmentBar segments={pipelineSegments} height={10} />
          <div className="mt-3">
            <Legend items={PIPELINE.slice(0, 3)} />
          </div>
        </div>
      </Chip>
    </>
  );
}

// ---- /for-billing-companies ------------------------------------------------------

const CLIENTS = [
  { name: "Riverside Pediatrics PLLC", providers: 15, due: 20, renew: 25, team: [PEOPLE.erin, PEOPLE.ana] },
  { name: "Lakeview Behavioral Health LLC", providers: 3, due: 0, renew: 3, team: [PEOPLE.erin, PEOPLE.luis] },
  { name: "Clinical Neuroscience Research Associates, Inc.", providers: 3, due: 1, renew: 3, team: [PEOPLE.erin, PEOPLE.ana, PEOPLE.luis] },
];

// Client organizations, scoped access and the aggregate view, 1240×700.
export function ClientBook() {
  return (
    <>
      <AppScreen x={0} y={0} w={1240} h={690} active="clients" url="clients">
        <ScreenTitle title="Clients" sub="21 applications need follow-up this week across 3 clients." actions={<Btn primary>Add client</Btn>} />
        <div className="grid grid-cols-3 gap-4">
          <StatCard accent label="Follow-ups this week" value="21" hint="Across every client." icon={ICONS.phone} />
          <StatCard label="Credentials to renew" value="31" hint="Expired or expiring, all clients." icon={ICONS.calendar} tone="red" />
          <StatCard label="Providers" value="21" suffix="of 50" hint="On the Billing Co plan." icon={ICONS.providers} meter={0.42} />
        </div>
        <div className={`${cardClass} mt-4 overflow-hidden`}>
          <div className="grid grid-cols-[2.2fr_0.8fr_1.2fr_1fr_0.9fr] gap-3 border-b border-ink-100 px-5 py-3 text-xs font-medium text-ink-700">
            <span>Client</span>
            <span>Providers</span>
            <span>Follow-ups this week</span>
            <span>To renew</span>
            <span>Team</span>
          </div>
          {CLIENTS.map((c) => (
            <div key={c.name} className="grid grid-cols-[2.2fr_0.8fr_1.2fr_1fr_0.9fr] items-center gap-3 border-b border-ink-100 px-5 py-3.5 last:border-b-0">
              <span className="truncate text-[0.9375rem] font-semibold text-ink-900">{c.name}</span>
              <span className="text-sm text-ink-700">{c.providers}</span>
              <span>
                <Badge tone={c.due ? "amber" : "green"}>{c.due ? `${c.due} due` : "Nothing due"}</Badge>
              </span>
              <span className="text-sm text-ink-700">{c.renew}</span>
              <span className="flex -space-x-2">
                {c.team.map((p) => (
                  <span key={p.name} className="rounded-full ring-2 ring-white">
                    <PersonPhoto name={p.name} photo={p.photo} size="sm" />
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </AppScreen>
      <Chip x={880} y={610} w={330} bob={1}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <PersonPhoto name={PEOPLE.ana.name} photo={PEOPLE.ana.photo} size="md" />
            <span>
              <b className="block text-sm text-ink-900">{PEOPLE.ana.name}</b>
              <span className="text-xs text-ink-500">Coordinator · sees 2 of 3 clients</span>
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-1.5 text-sm">
            {[
              ["Riverside Pediatrics PLLC", true],
              ["Lakeview Behavioral Health LLC", false],
              ["Clinical Neuroscience Research…", true],
            ].map(([n, on]) => (
              <span key={n} className="flex items-center justify-between gap-2">
                <span className={`truncate ${on ? "text-ink-900" : "text-ink-500 line-through"}`}>{n}</span>
                {on && <Icon d={ICONS.check} className="h-4 w-4 shrink-0 text-status-active" />}
              </span>
            ))}
          </div>
        </div>
      </Chip>
    </>
  );
}

// Per-client report: dates, statuses, last follow-up, 760×580.
export function ClientReport() {
  const rows = [
    ["Aisha Bello", "Pediatric Nurse Practitioner", "All current", "green", { approved: 1, in_review: 4, info_requested: 1, not_started: 1 }],
    ["Ethan Brooks", "Pediatric Cardiology", "1 due within 30 days", "red", { approved: 3, submitted: 1, info_requested: 2, not_started: 1 }],
    ["Maya Chen", "Pediatrics", "1 expired", "red", { approved: 6, not_started: 1 }],
    ["Daniel Okafor", "Pediatrics", "1 expired", "red", { approved: 4, in_review: 1, submitted: 1, not_started: 1 }],
  ];
  return (
    <>
      <div className={`absolute left-0 top-0 overflow-hidden rounded-[18px] bg-canvas ${floatShadow}`} style={{ width: 700, height: 520 }}>
        <div className="px-6 pt-6">
          <ScreenTitle title="Providers" sub="Riverside Pediatrics PLLC · 15 providers" actions={<Btn>Export CSV</Btn>} />
        </div>
        <div className={`${cardClass} mx-6 overflow-hidden`}>
          <div className="grid grid-cols-[1.6fr_1.2fr_1.3fr] gap-3 border-b border-ink-100 px-5 py-3 text-xs font-medium text-ink-700">
            <span>Provider</span>
            <span>Credentials</span>
            <span>Applications</span>
          </div>
          {rows.map(([n, s, cred, tone, apps]) => {
            const total = Object.values(apps).reduce((a, b) => a + b, 0);
            return (
              <div key={n} className="grid grid-cols-[1.6fr_1.2fr_1.3fr] items-center gap-3 border-b border-ink-100 px-5 py-3 last:border-b-0">
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={n} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink-900">{n}</span>
                    <span className="block truncate text-xs text-ink-500">{s}</span>
                  </span>
                </span>
                <span>
                  <Badge tone={tone} dot>
                    {cred}
                  </Badge>
                </span>
                <span>
                  <SegmentBar segments={Object.entries(apps).map(([k, v]) => ({ key: k, label: k, value: v, color: STATUS_FILL[k] }))} height={8} />
                  <span className="mt-1 block text-xs text-ink-500">
                    {apps.approved} approved of {total}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <Chip x={500} y={450} w={250} bob={0.8}>
        <div className="flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-active-bg text-status-active">
            <Icon d={ICONS.file} className="h-5 w-5" />
          </span>
          <span className="text-sm leading-snug text-ink-700">
            <b className="text-ink-900">riverside-providers.csv</b>
            <br />
            ready to send
          </span>
        </div>
      </Chip>
    </>
  );
}

// ---- /credentialing-spreadsheet-template -----------------------------------------

// The free file's credentials tab, 1200×420 — its own columns (docs/spreadsheet-
// template.csv) and example rows, with the days counted to Sep 19, 2026.
export function TemplateSheet() {
  const cols = ["Provider Name", "Credential Type", "State", "Identifier", "Issue Date", "Expiration Date", "Days Until Expiration", "Status"];
  const rows = [
    ["Dr. Jane Smith", "State License", "CA", "MD-12345", "2024-01-15", "2027-01-15", "118", ["Current", "green"]],
    ["Dr. Jane Smith", "DEA Registration", "CA", "BS1234567", "2023-06-01", "2026-06-01", "-110", ["Expired", "red"]],
    ["Dr. John Doe", "Malpractice Insurance", "CA", "POL-98765", "2025-03-01", "2026-03-01", "-202", ["Expired", "red"]],
  ];
  const tabs = ["Providers", "Credentials", "Payer enrollment", "CAQH", "Dashboard", "How to use"];
  return (
    <div className={`absolute inset-x-0 top-2 flex flex-col overflow-hidden rounded-[18px] bg-white ${floatShadow}`} style={{ height: 404 }}>
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-5 py-3">
        <Icon d={ICONS.file} className="h-4 w-4 text-status-active" />
        <span className="text-sm font-semibold text-ink-900">Credentialing tracker</span>
        <span className="text-sm text-ink-500">· Excel or Google Sheets</span>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-ink-50/60">
            <th className="w-10 border border-ink-100" />
            {cols.map((c) => (
              <th key={c} className="border border-ink-100 px-3 py-2.5 text-left text-xs font-semibold text-ink-900">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="border border-ink-100 bg-ink-50/60 text-center text-xs text-ink-500">{i + 2}</td>
              {r.slice(0, 7).map((v, j) => (
                <td key={j} className={`border border-ink-100 px-3 py-2.5 text-ink-900 ${j === 6 ? "text-right tabular-nums" : ""}`}>
                  {v}
                </td>
              ))}
              <td className="border border-ink-100 px-3 py-2">
                <Badge tone={r[7][1]}>{r[7][0]}</Badge>
              </td>
            </tr>
          ))}
          {[5, 6, 7].map((n) => (
            <tr key={n}>
              <td className="border border-ink-100 bg-ink-50/60 text-center text-xs text-ink-500">{n}</td>
              {cols.map((c) => (
                <td key={c} className="h-10 border border-ink-100" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-auto flex gap-1 border-t border-ink-100 bg-ink-50 px-3 py-2">
        {tabs.map((t) => (
          <span key={t} className={`rounded-md px-3 py-1 text-xs ${t === "Credentials" ? "bg-white font-semibold text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.12)]" : "text-ink-500"}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---- /pricing ------------------------------------------------------------------

// Users against providers, 600×460 — the section's rows and caption.
export function UsersProviders({ rows, caption }) {
  const people = [PEOPLE.erin, PEOPLE.luis, PEOPLE.ana];
  // The demo client's fifteen providers, round and round.
  const names = ["Aisha Bello", "Ethan Brooks", "Maya Chen", "Gregory Daytona", "Noah Fischer", "Olivia Grant", "Hannah Kowalski", "Grace Liu", "Lauren Mitchell", "Priya Natarajan", "Daniel Okafor", "Samuel Park", "Sofia Ramirez", "Marcus Reed", "James Whitaker"];
  return (
    <div className="absolute inset-x-0 top-4 flex flex-col gap-4">
      {rows.map((r) => (
        <div key={r.unit} className={`${cardClass} px-6 py-5`}>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.25rem] font-semibold leading-none tracking-[-0.02em] text-ink-900">{r.count}</span>
            <span className="text-base font-semibold text-ink-900">{r.unit}</span>
            <span className="ml-auto text-sm text-ink-500">{r.note}</span>
          </div>
          <div className={`mt-4 flex flex-wrap ${r.kind === "person" ? "gap-2.5" : "gap-1.5"}`}>
            {r.kind === "person"
              ? people.slice(0, r.count).map((p) => <PersonPhoto key={p.name} name={p.name} photo={p.photo} size="md" />)
              : Array.from({ length: r.count }, (_, i) => <Avatar key={i} name={names[i % names.length]} size="sm" />)}
          </div>
        </div>
      ))}
      {caption && (
        <p className="flex items-center gap-2.5 px-1 text-[0.9375rem] text-ink-700">
          <IconTile d={ICONS.team} size="sm" />
          {caption}
        </p>
      )}
    </div>
  );
}
