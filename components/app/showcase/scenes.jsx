// The marketing pages' product shots. A shot shows only as much of the app as
// its space can carry at a readable size: a whole screen where the section is
// about the screen, one card or one panel where it is about a thing on it.
// Every canvas is at least as wide as the figure renders, so a shot is only
// ever scaled down — never up, never tilted — which is what keeps type sharp,
// and every wide one has a narrow variant for a phone (ProductShot picks it).
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
import AppScreen, { Chip, chipLift, lift } from "@/components/app/showcase/AppScreen";
import Logo from "@/components/brand/Logo";

// ---- data --------------------------------------------------------------------

const PAYERS = ["Aetna", "Cigna Healthcare", "UnitedHealthcare", "Excellus BCBS", "EmblemHealth"];
const GRID = [
  ["Bello, Aisha", "Pediatric Nurse Practitioner", ["in_review", "approved", "in_review", "info_requested", "in_review"]],
  ["Brooks, Ethan", "Pediatric Cardiology", ["submitted", "not_started", "approved", "approved", "info_requested"]],
  ["Chen, Maya", "Pediatrics", ["approved", "approved", "not_started", "approved", "approved"]],
  ["Fischer, Noah", "Neonatal-Perinatal Medicine", ["not_started", "info_requested", "approved", "in_review", "in_review"]],
  ["Kowalski, Hannah", "Physician Assistant", ["denied", "approved", "approved", "approved", "approved"]],
  ["Okafor, Daniel", "Pediatrics", ["approved", "in_review", "not_started", "submitted", "approved"]],
];
const PIPELINE = [
  ["approved", 48],
  ["in_review", 19],
  ["submitted", 9],
  ["info_requested", 6],
  ["denied", 1],
  ["not_started", 22],
];
const segments = PIPELINE.map(([k, v]) => ({ key: k, label: ENROLLMENT_STATUS_LABELS[k], value: v, color: STATUS_FILL[k] }));

// ---- pieces --------------------------------------------------------------------

function ScreenTitle({ title, sub, actions }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-[2rem] font-normal leading-[1.1] tracking-[-0.03em] text-ink-900">{title}</p>
        {sub && <p className="mt-1.5 text-[0.9375rem] text-ink-500">{sub}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}

function Btn({ children, primary = false }) {
  return (
    <span className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-medium ${primary ? "bg-brand-700 text-white" : "bg-white text-ink-900 ring-1 ring-inset ring-ink-200"}`}>
      {children}
    </span>
  );
}

// A card of the app; `floating` lifts it off the page when it stands alone.
function Card({ className = "", floating = false, children }) {
  return <div className={`${floating ? `rounded-2xl bg-white ${lift}` : cardClass} ${className}`}>{children}</div>;
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

function PipelineCard({ cols = 3, floating = false, className = "" }) {
  return (
    <Card floating={floating} className={`px-5 py-4 ${className}`}>
      <p className="mb-3 flex items-center justify-between text-sm font-semibold text-ink-900">
        Where every application stands <Badge>105</Badge>
      </p>
      <SegmentBar segments={segments} height={12} />
      <div className="mt-3">
        <Legend cols={cols} />
      </div>
    </Card>
  );
}

function MatrixCard({ cols = [0, 1, 2, 3, 4], rows = 6, first = 220, floating = false }) {
  return (
    <Card floating={floating} className="overflow-hidden">
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
    </Card>
  );
}

const START_HERE = [
  ["Lauren Mitchell", "Payer revalidation · Aetna", "Expired"],
  ["Maya Chen", "State license", "Expired"],
  ["Daniel Okafor", "Malpractice insurance", "Expired"],
  ["Daniel Okafor", "DEA registration", "1 day left"],
];

function StartHereCard({ rows = 4, floating = false }) {
  return (
    <Card floating={floating} className="overflow-hidden">
      <CardHead icon={ICONS.arrowRight} title="Start here" sub="The most urgent items first. Open one to act on it." />
      {START_HERE.slice(0, rows).map(([n, d, b]) => (
        <PersonRow key={n + d} name={n} detail={d}>
          <Badge tone="red">{b}</Badge>
        </PersonRow>
      ))}
    </Card>
  );
}

function CredentialsCard({ floating = false }) {
  return (
    <Card floating={floating} className="overflow-hidden">
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
    </Card>
  );
}

// ---- home ----------------------------------------------------------------------

// Hero, 880×660: the dashboard with the sidebar folded to its rail (the app's
// own fold), so the content carries the shot at half size.
export function HeroMatrix() {
  return (
    <>
      <AppScreen x={0} y={0} w={880} h={620} active="dashboard" collapsed>
        <ScreenTitle title="Dashboard" sub="Saturday, September 19 · Riverside Pediatrics PLLC" />
        <div className="grid grid-cols-3 gap-4">
          <StatCard accent label="Need you this week" value="31" hint="Expiring soon, overdue and payer requests." icon={ICONS.pulse} />
          <StatCard label="Expiring within 14 days" value="7" hint="Credentials and revalidations." icon={ICONS.calendar} tone="red" />
          <StatCard label="Follow-ups overdue" value="18" hint="20 due this week in all." icon={ICONS.phone} tone="amber" />
        </div>
        <div className="mt-4 grid grid-cols-[1.35fr_1fr] gap-4">
          <StartHereCard />
          <CredentialsCard />
        </div>
      </AppScreen>
      <Chip x={330} y={540} w={520}>
        <div className="px-5 py-4">
          <p className="mb-3 flex items-center justify-between text-sm font-semibold text-ink-900">
            Where every application stands <Badge>105</Badge>
          </p>
          <SegmentBar segments={segments} height={12} />
          <div className="mt-3">
            <Legend items={PIPELINE.slice(0, 4)} cols={4} />
          </div>
        </div>
      </Chip>
    </>
  );
}

// The home hero, 1120×720: the whole dashboard at 1:1, running off the right
// edge of the panel (ProductShot `bleed`) instead of shrunk to fit a column —
// at the column's width the old shot was drawn at half size, the floor the
// Stage allows. Sidebar open, not folded: what the crop keeps is the left of
// the screen, and there the nav names the six things the product tracks and
// the client selector shows it holds more than one practice. Folded, that
// space says nothing.
//
// The two facts float as the app's own chips (they were the marketing kit's
// cards before, the only figure on the page with furniture from outside the
// app). Their words come from the page's data.js — `notes`.
export function HeroDashboard({ notes = [] }) {
  const ICON = [ICONS.calendar, ICONS.phone];
  return (
    <>
      <AppScreen x={0} y={0} w={1120} h={612} active="dashboard" onInk>
        <ScreenTitle title="Dashboard" sub="Saturday, September 19 · Riverside Pediatrics PLLC" />
        <div className="grid grid-cols-3 gap-4">
          <StatCard accent label="Need you this week" value="31" hint="Expiring soon, overdue and payer requests." icon={ICONS.pulse} />
          <StatCard label="Expiring within 14 days" value="7" hint="Credentials and revalidations." icon={ICONS.calendar} tone="red" />
          <StatCard label="Follow-ups overdue" value="18" hint="20 due this week in all." icon={ICONS.phone} tone="amber" />
        </div>
        <div className="mt-4 grid grid-cols-[1.35fr_1fr] gap-4">
          <StartHereCard />
          <CredentialsCard />
        </div>
      </AppScreen>
      {notes.map((n, i) => (
        <Chip key={n.label} x={i === 0 ? 16 : 344} y={588} w={300} onInk>
          <div className="flex items-start gap-3 px-4 py-3.5">
            <IconTile d={ICON[i] ?? ICONS.pulse} size="sm" />
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-semibold leading-tight text-ink-900">{n.value}</p>
              <p className="mt-1 text-xs leading-snug text-ink-500">{n.label}</p>
            </div>
          </div>
        </Chip>
      ))}
    </>
  );
}

// The dashboard on a phone: the numbers and the list, nothing else.
export function NarrowDashboard() {
  return (
    <div className="absolute inset-x-0 top-0 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <StatCard accent onInk label="Need you this week" value="31" hint="Expiring, overdue and requests." icon={ICONS.pulse} />
        <StatCard label="Follow-ups overdue" value="18" hint="20 due this week." icon={ICONS.phone} tone="amber" />
      </div>
      <StartHereCard rows={3} floating />
    </div>
  );
}

// "The screen this is really about", 1240×760: the whole screen, sidebar and
// all — this section is about the screen itself, not one card on it.
export function HomeMatrix() {
  return (
    <>
      <AppScreen x={0} y={0} w={1240} h={690} active="enrollments">
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
        <div className="mb-4">
          <PipelineCard cols={6} />
        </div>
        <MatrixCard rows={5} />
      </AppScreen>
      <Chip x={700} y={620} w={320}>
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
      <Chip x={1050} y={650} w={190}>
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

// The matrix on a phone: three payers, the pipeline under it.
export function NarrowMatrix() {
  return (
    <div className="absolute inset-x-0 top-0 flex flex-col gap-3">
      <MatrixCard cols={[0, 1, 2]} rows={5} first={150} floating />
      <PipelineCard cols={3} floating />
    </div>
  );
}

// The Monday digest, 560×560: an email as it arrives — envelope first.
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
    <div className={`absolute inset-x-0 top-0 overflow-hidden rounded-[18px] bg-white ${lift}`}>
      <div className="flex items-start gap-3 border-b border-ink-100 bg-ink-50 px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white"><Logo variant="symbol" small title="" className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold text-ink-900">Sokndall</span>
            <span className="shrink-0 text-xs text-ink-500">Mon 9:02</span>
          </p>
          <p className="truncate text-xs text-ink-500">to erin.walsh@riversidepeds.com</p>
          <p className="mt-1.5 text-sm font-semibold text-ink-900">Your week: 20 follow-ups, 23 expiring</p>
        </div>
      </div>
      <div className="px-5 pb-5 pt-4">
        <p className="text-xl font-bold text-ink-900">Your week in credentialing</p>
        <p className="mt-1 text-sm text-ink-500">Who to call this week, what&apos;s stuck with a payer, and what expires in the next 90 days.</p>
        {section("Follow-ups this week · 20", [
          ["Olivia Grant · EmblemHealth", "In review", "Overdue since Sep 15", "red"],
          ["Grace Liu · Cigna Healthcare", "In review", "Overdue since Sep 15", "red"],
        ])}
        {section("Stalled 30+ days · 11", [["Samuel Park · EmblemHealth", "In review", "Stalled", "amber"]])}
        {/* The third block, added 2026-09-20: the section's heading promises
            three things in one place, and the email is that place — so it has
            to carry the expiries too, not only the follow-ups. */}
        {section("Expiring in the next 90 days · 23", [
          ["Maya Chen · State license", "New York, expires Oct 4", "14 days", "red"],
          ["Aisha Bello · CAQH attestation", "Due for re-attestation", "27 days", "amber"],
        ])}
        <span className="mt-5 inline-flex h-10 items-center rounded-xl bg-brand-700 px-4 text-sm font-medium text-white">Open this week&apos;s follow-ups</span>
      </div>
    </div>
  );
}

// The digest on a phone: the envelope and the first rows of each block. The
// wide one is drawn on a 600px canvas and a phone column is ~320, which put it
// under 0.55 — the type stops being readable well before the Stage's floor.
export function NarrowDigest() {
  return (
    <div className={`absolute inset-x-0 top-0 overflow-hidden rounded-[18px] bg-white ${lift}`}>
      <div className="flex items-start gap-3 border-b border-ink-100 bg-ink-50 px-4 py-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white"><Logo variant="symbol" small title="" className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold text-ink-900">Sokndall</span>
            <span className="shrink-0 text-xs text-ink-500">Mon 9:02</span>
          </p>
          <p className="truncate text-xs text-ink-500">to erin.walsh@riversidepeds.com</p>
          <p className="mt-1.5 text-sm font-semibold text-ink-900">Your week: 20 follow-ups, 23 expiring</p>
        </div>
      </div>
      <div className="px-4 pb-4 pt-3.5">
        <p className="text-lg font-bold text-ink-900">Your week in credentialing</p>
        {[
          ["Follow-ups this week · 20", "Olivia Grant · EmblemHealth", "In review", "Overdue since Sep 15", "red"],
          ["Stalled 30+ days · 11", "Samuel Park · EmblemHealth", "In review", "Stalled", "amber"],
          ["Expiring in the next 90 days · 23", "Maya Chen · State license", "New York, expires Oct 4", "14 days", "red"],
        ].map(([head, t, d, pill, tone]) => (
          <div key={head}>
            <p className="mt-3.5 text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500">{head}</p>
            <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-ink-100 pt-2.5">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">{t}</span>
                <span className="block text-xs text-ink-500">{d}</span>
              </span>
              <Badge tone={tone}>{pill}</Badge>
            </div>
          </div>
        ))}
        <span className="mt-4 inline-flex h-10 items-center rounded-xl bg-brand-700 px-4 text-sm font-medium text-white">Open this week&apos;s follow-ups</span>
      </div>
    </div>
  );
}

// ---- /payer-enrollment-software --------------------------------------------------

const TONE_OF = { "Not started": "not_started", Submitted: "submitted", "In review": "in_review", "Info requested": "info_requested", Approved: "approved" };

function StepChip({ step, big = false }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full font-medium ${big ? "px-4 py-2 text-[0.9375rem]" : "px-3.5 py-1.5 text-sm"} ${
        step.action ? "bg-status-expiring-bg text-status-expiring ring-1 ring-status-expiring" : CHIP[TONE_OF[step.label]]
      }`}
    >
      {step.label}
    </span>
  );
}

// One application's path, 1000×340 — TRACK's words on the panel's own chips,
// inside a card of the app rather than a plain box.
export function StatusPath({ steps, end, branch }) {
  return (
    <div className={`absolute inset-x-0 top-0 overflow-hidden rounded-2xl bg-white ${lift}`}>
      <CardHead
        icon={ICONS.enrollments}
        title="One application"
        sub="Ethan Brooks · UnitedHealthcare Community Plan"
        right={<Badge tone="amber">Info requested</Badge>}
      />
      <div className="px-6 py-6">
        <ol className="flex items-start justify-between gap-1">
          {steps.map((s) => (
            <li key={s.label} className="flex items-start gap-1">
              <span className="flex flex-col items-start">
                <StepChip step={s} big />
                {s.hint && <span className="mt-2 max-w-[11rem] text-xs leading-snug text-status-expiring">{s.hint}</span>}
              </span>
              <Icon d={ICONS.chevronRight} className="mt-3 h-4 w-4 shrink-0 text-ink-300" />
            </li>
          ))}
          <li>
            <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-700 px-4 py-2 text-[0.9375rem] font-medium text-white">
              <Icon d={ICONS.calendar} className="h-4 w-4" /> {end}
            </span>
          </li>
        </ol>
        <div className="mt-7 flex items-center gap-3 rounded-2xl bg-ink-50 px-5 py-4">
          <span className="whitespace-nowrap rounded-full bg-status-expired-bg px-4 py-2 text-sm font-medium text-status-expired">{branch.label}</span>
          <span className="text-sm text-ink-700">{branch.hint}</span>
        </div>
      </div>
    </div>
  );
}

// The same path between a phone and a wide desktop, 640×430. The wide scene is
// one unbroken row of six chips on a 1000px canvas: it cannot reflow, so from
// 1024 down it just shrank — 0.66 at 768 and 0.55 at 641, which put its 15px
// chips at 8. Measured 2026-09-20. This one wraps the row instead, so the
// worst case across the whole middle band is 0.86.
export function MidStatusPath({ steps, end, branch }) {
  return (
    <div className={`absolute inset-x-0 top-0 overflow-hidden rounded-2xl bg-white ${lift}`}>
      <CardHead
        icon={ICONS.enrollments}
        title="One application"
        sub="Ethan Brooks · UnitedHealthcare Community Plan"
        right={<Badge tone="amber">Info requested</Badge>}
      />
      <div className="px-5 py-5">
        <ol className="flex flex-wrap items-start gap-x-1.5 gap-y-3">
          {steps.map((s) => (
            <li key={s.label} className="flex items-start gap-1.5">
              <span className="flex flex-col items-start">
                <StepChip step={s} />
                {s.hint && <span className="mt-1.5 max-w-[10rem] text-xs leading-snug text-status-expiring">{s.hint}</span>}
              </span>
              <Icon d={ICONS.chevronRight} className="mt-2 h-4 w-4 shrink-0 text-ink-300" />
            </li>
          ))}
          <li>
            <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-700 px-3.5 py-1.5 text-sm font-medium text-white">
              <Icon d={ICONS.calendar} className="h-4 w-4" /> {end}
            </span>
          </li>
        </ol>
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-ink-50 px-4 py-3.5">
          <span className="whitespace-nowrap rounded-full bg-status-expired-bg px-3.5 py-1.5 text-sm font-medium text-status-expired">{branch.label}</span>
          <span className="text-sm text-ink-700">{branch.hint}</span>
        </div>
      </div>
    </div>
  );
}

// The same path on a phone: one column.
export function NarrowStatusPath({ steps, end, branch }) {
  return (
    <div className={`absolute inset-x-0 top-0 overflow-hidden rounded-2xl bg-white ${lift}`}>
      <CardHead icon={ICONS.enrollments} title="One application" sub="UnitedHealthcare Community Plan" />
      <ol className="flex flex-col gap-2.5 px-5 py-5">
        {steps.map((s) => (
          <li key={s.label} className="flex flex-col items-start">
            <StepChip step={s} />
            {s.hint && <span className="mt-1.5 text-xs text-status-expiring">{s.hint}</span>}
          </li>
        ))}
        <li>
          <span className="flex w-fit items-center gap-2 rounded-full bg-brand-700 px-3.5 py-1.5 text-sm font-medium text-white">
            <Icon d={ICONS.calendar} className="h-4 w-4" /> {end}
          </span>
        </li>
      </ol>
      <div className="flex flex-col gap-2 border-t border-ink-100 px-5 py-4">
        <span className="w-fit rounded-full bg-status-expired-bg px-3.5 py-1.5 text-sm font-medium text-status-expired">{branch.label}</span>
        <span className="text-xs text-ink-500">{branch.hint}</span>
      </div>
    </div>
  );
}

// The two stages, 560×440 — the section's own words in two cards of the app.
export function Stages({ stages }) {
  return (
    <div className="absolute inset-x-0 top-0 flex flex-col gap-4">
      {stages.map((st, i) => (
        <div key={st.name} className={`rounded-2xl bg-white px-6 py-5 ${lift}`}>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-[0.9375rem] font-semibold text-white">{i + 1}</span>
            <p className="text-xl font-semibold text-ink-900">{st.name}</p>
          </div>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-700">{st.is}</p>
          <div className="mt-3.5 flex items-center gap-2">
            <Badge tone="amber">Stalls on</Badge>
            <span className="text-sm text-ink-900">{st.stalls}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// One application's confirmed effective date, 620×620: the panel, with the
// date it all turns on repeated on a card of its own.
export function EffectiveDate() {
  const statuses = ["not_started", "submitted", "in_review", "info_requested", "approved", "denied"];
  return (
    <>
      <div className={`absolute top-0 overflow-hidden rounded-[18px] bg-white ${lift}`} style={{ left: 30, width: 560, height: 520 }}>
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
      {/* Centred with the card (30..590 on a 620 canvas) and deeper than it:
          the chip sits ON the card, so it has to read as the nearer of the two. */}
      <Chip x={230} y={470} w={360} over>
        <div className="flex items-center gap-3.5 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-status-active-bg text-status-active">
            <Icon d={ICONS.calendar} className="h-6 w-6" />
          </span>
          <span className="text-sm leading-snug text-ink-700">
            In network — bill from
            <br />
            <b className="text-lg text-ink-900">Mar 17, 2026</b>
          </span>
        </div>
      </Chip>
    </>
  );
}

// The matrix and its totals, 780×640: the card itself, not the whole screen —
// the section beside it is already a full-height tile.
export function EnrollmentMatrix() {
  return (
    <>
      <div className="absolute inset-x-0 top-0">
        <MatrixCard cols={[0, 1, 2]} rows={6} first={215} floating />
      </div>
      {/* Overlapping the card's bottom edge rather than sitting under it: the
          section beside this one is a full-height tile, and the two cards have
          to read as one object against it. 2026-09-20. */}
      <Chip x={20} y={339} w={650} over>
        <div className="px-5 py-4">
          <p className="mb-3 flex items-center justify-between text-[0.9375rem] font-semibold text-ink-900">
            Where every application stands <Badge>105</Badge>
          </p>
          <SegmentBar segments={segments} height={14} />
          {/* Three columns, not six: at six the legend is 108px per entry and
              every label truncates ("Appr…", "Submi…"). Measured 2026-09-20. */}
          <div className="mt-3.5">
            <Legend cols={3} />
          </div>
        </div>
      </Chip>
    </>
  );
}

// ---- /for-billing-companies ------------------------------------------------------

const CLIENTS = [
  { name: "Riverside Pediatrics PLLC", providers: 15, due: 20, renew: 25, apps: { approved: 48, in_review: 19, submitted: 9, info_requested: 6, denied: 1, not_started: 22 }, team: [PEOPLE.erin, PEOPLE.ana] },
  { name: "Lakeview Behavioral Health LLC", providers: 3, due: 0, renew: 3, apps: { approved: 14, in_review: 2, not_started: 5 }, team: [PEOPLE.erin, PEOPLE.luis] },
  { name: "Clinical Neuroscience Research Associates, Inc.", providers: 3, due: 1, renew: 3, apps: { approved: 9, in_review: 4, submitted: 2, not_started: 6 }, team: [PEOPLE.erin, PEOPLE.ana, PEOPLE.luis] },
];

function ClientsTable({ compact = false, floating = false }) {
  const grid = compact ? "grid-cols-[1.7fr_0.8fr]" : "grid-cols-[2fr_0.7fr_0.9fr_0.7fr_1.4fr_0.9fr]";
  return (
    <Card floating={floating} className="overflow-hidden">
      <div className={`grid ${grid} gap-3 border-b border-ink-100 px-5 py-3 text-xs font-medium text-ink-700`}>
        <span>Client</span>
        {!compact && <span>Providers</span>}
        <span>Follow-ups</span>
        {!compact && (
          <>
            <span>To renew</span>
            <span>Applications</span>
            <span>Team</span>
          </>
        )}
      </div>
      {CLIENTS.map((c) => (
        <div key={c.name} className={`grid ${grid} items-center gap-3 border-b border-ink-100 px-5 py-4 last:border-b-0`}>
          <span className="min-w-0">
            <span className="block truncate text-[0.9375rem] font-semibold text-ink-900">{c.name}</span>
            {compact && <span className="block text-xs text-ink-500">{c.providers} providers</span>}
          </span>
          {!compact && <span className="text-sm text-ink-700">{c.providers}</span>}
          <span>
            <Badge tone={c.due ? "amber" : "green"}>{c.due ? `${c.due} due` : "None due"}</Badge>
          </span>
          {!compact && (
            <>
              <span className="text-sm text-ink-700">{c.renew}</span>
              <span>
                <SegmentBar segments={Object.entries(c.apps).map(([k, v]) => ({ key: k, label: k, value: v, color: STATUS_FILL[k] }))} height={8} />
                <span className="mt-1 block text-xs text-ink-500">{Object.values(c.apps).reduce((a, b) => a + b, 0)} applications</span>
              </span>
              <span className="flex -space-x-2">
                {c.team.map((p) => (
                  <span key={p.name} className="rounded-full ring-2 ring-white">
                    <PersonPhoto name={p.name} photo={p.photo} size="sm" />
                  </span>
                ))}
              </span>
            </>
          )}
        </div>
      ))}
    </Card>
  );
}

// Client organizations, scoped access and the aggregate view, 1160×760.
export function ClientBook() {
  return (
    <>
      <AppScreen x={0} y={0} w={1160} h={660} active="clients" collapsed>
        <ScreenTitle title="Clients" sub="21 applications need follow-up this week across 3 clients." actions={<Btn primary>Add client</Btn>} />
        <div className="grid grid-cols-4 gap-4">
          <StatCard accent label="Follow-ups this week" value="21" hint="Across every client." icon={ICONS.phone} />
          <StatCard label="Credentials to renew" value="31" hint="Expired or expiring, all clients." icon={ICONS.calendar} tone="red" />
          <StatCard label="Payer requests" value="7" hint="Payers waiting on you." icon={ICONS.alert} tone="amber" />
          <StatCard label="Providers" value="21" suffix="of 50" hint="On the Billing Co plan." icon={ICONS.providers} meter={0.42} />
        </div>
        <div className="mt-4">
          <ClientsTable />
        </div>
      </AppScreen>
      <Chip x={660} y={590} w={460}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <PersonPhoto name={PEOPLE.ana.name} photo={PEOPLE.ana.photo} size="md" />
            <span>
              <b className="block text-sm text-ink-900">{PEOPLE.ana.name}</b>
              <span className="text-xs text-ink-500">Coordinator · sees 2 of 3 clients</span>
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {[
              ["Riverside Pediatrics PLLC", true],
              ["Lakeview Behavioral Health", false],
              ["Clinical Neuroscience Res…", true],
              ["Everything else", false],
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

// The book on a phone: the clients and what each one owes you this week.
export function NarrowClients() {
  return (
    <div className="absolute inset-x-0 top-0 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <StatCard accent label="Follow-ups this week" value="21" hint="Across every client." icon={ICONS.phone} />
        <StatCard label="To renew" value="31" hint="All clients." icon={ICONS.calendar} tone="red" />
      </div>
      <ClientsTable compact floating />
    </div>
  );
}

const REPORT = [
  ["Aisha Bello", "Pediatric Nurse Practitioner", "All current", "green", { approved: 1, in_review: 4, info_requested: 1, not_started: 1 }],
  ["Ethan Brooks", "Pediatric Cardiology", "1 due within 30 days", "red", { approved: 3, submitted: 1, info_requested: 2, not_started: 1 }],
  ["Maya Chen", "Pediatrics", "1 expired", "red", { approved: 6, not_started: 1 }],
  ["Noah Fischer", "Neonatal-Perinatal Medicine", "2 due within 30 days", "red", { approved: 1, in_review: 2, submitted: 1, info_requested: 1, not_started: 2 }],
  ["Hannah Kowalski", "Physician Assistant", "2 due within 30 days", "red", { approved: 6, denied: 1 }],
  ["Daniel Okafor", "Pediatrics", "1 expired", "red", { approved: 4, in_review: 1, submitted: 1, not_started: 1 }],
];

// `compact` (the phone): two columns instead of three, the credential badge
// under the provider's name. At 440 the three-column row gave the name ~105px
// and the badge column took the rest, so "Ethan Brooks" and "Noah Fischer"
// truncated — the one thing on the row that must not. Measured 2026-09-20.
function ReportCard({ rows = 6, compact = false }) {
  const grid = compact ? "grid-cols-[1.45fr_1fr]" : "grid-cols-[1.6fr_1.2fr_1.3fr]";
  return (
    <Card floating className="overflow-hidden">
      <CardHead icon={ICONS.providers} title="Providers" sub="Riverside Pediatrics PLLC · 15 providers" right={<Btn>Export CSV</Btn>} />
      <div className={`grid ${grid} gap-3 border-b border-ink-100 px-5 py-2.5 text-xs font-medium text-ink-700`}>
        <span>Provider</span>
        {!compact && <span>Credentials</span>}
        <span>Applications</span>
      </div>
      {REPORT.slice(0, rows).map(([n, s, cred, tone, apps]) => {
        const total = Object.values(apps).reduce((a, b) => a + b, 0);
        const badge = (
          <Badge tone={tone} dot>
            {cred}
          </Badge>
        );
        return (
          <div key={n} className={`grid ${grid} items-center gap-3 border-b border-ink-100 px-5 py-3 last:border-b-0`}>
            <span className={`flex min-w-0 gap-2.5 ${compact ? "items-start" : "items-center"}`}>
              <Avatar name={n} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">{n}</span>
                <span className="block truncate text-xs text-ink-500">{s}</span>
                {compact && <span className="mt-1.5 block">{badge}</span>}
              </span>
            </span>
            {!compact && <span>{badge}</span>}
            <span>
              <SegmentBar segments={Object.entries(apps).map(([k, v]) => ({ key: k, label: k, value: v, color: STATUS_FILL[k] }))} height={8} />
              <span className="mt-1 block text-xs text-ink-500">
                {apps.approved} approved of {total}
              </span>
            </span>
          </div>
        );
      })}
    </Card>
  );
}

// Per-client report, 800×660: the card a client is sent, not the whole screen.
export function ClientReport() {
  return (
    <>
      <div className="absolute inset-x-0 top-0">
        <ReportCard />
      </div>
      {/* Over the card's bottom-right corner, not 76px under it: floating
          apart, the chip read as a second object and pulled the figure's mass
          down. 2026-09-20. */}
      <Chip x={376} y={449} w={400} over>
        <div className="flex items-center gap-3.5 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-status-active-bg text-status-active">
            <Icon d={ICONS.file} className="h-6 w-6" />
          </span>
          <span className="text-sm leading-snug text-ink-700">
            <b className="text-base text-ink-900">riverside-providers.csv</b>
            <br />
            every date, status and last follow-up
          </span>
        </div>
      </Chip>
    </>
  );
}

export function NarrowReport() {
  return (
    <div className="absolute inset-x-0 top-0">
      <ReportCard rows={4} compact />
    </div>
  );
}

// ---- /credentialing-spreadsheet-template -----------------------------------------

// The free file's Credentials tab: its real columns and example row (the file
// in Drive, read 2026-09-19), its colour legend — yellow you type in, grey
// calculated — and the file's own six tabs along the bottom.
const SHEET_COLS = [
  ["Provider Name", 150],
  ["Credential Type", 155],
  ["State / Issuing Body", 135],
  ["ID / Number", 110],
  ["Issue Date", 100],
  ["Expiration Date", 120],
  ["Days Left", 90, true],
  ["Status", 110, true],
  ["Renewal Started?", 125],
  ["Responsible Person", 150],
];
const SHEET_ROW = {
  "Provider Name": "Alvarez, Maria",
  "Credential Type": "State Medical License",
  "State / Issuing Body": "TX",
  "ID / Number": "TX-J1234",
  "Issue Date": "2024-01-15",
  "Expiration Date": "2026-01-31",
  "Days Left": "-207",
  Status: "EXPIRED",
  "Renewal Started?": "No",
  "Responsible Person": "Front office — Dana",
};
const SHEET_TABS = ["How to use", "Dashboard", "Providers", "Credentials", "Payer Enrollment", "CAQH"];

function Sheet({ cols, rows = 4, tabs = SHEET_TABS }) {
  return (
    <div className={`absolute inset-x-0 top-0 flex flex-col overflow-hidden rounded-[18px] bg-white ${lift}`}>
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-5 py-3">
        <Icon d={ICONS.file} className="h-4 w-4 shrink-0 text-status-active" />
        <span className="truncate text-sm font-semibold text-ink-900">Provider Credentialing &amp; Payer Enrollment Tracker</span>
        <span className="ml-auto flex shrink-0 items-center gap-3 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-accent-100 ring-1 ring-accent-400/60" /> you type
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-ink-100 ring-1 ring-ink-200" /> calculated
          </span>
        </span>
      </div>
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="bg-ink-50/70">
            <th className="w-9 border border-ink-100" />
            {cols.map(([c, width]) => (
              <th key={c} style={{ width }} className="truncate border border-ink-100 px-2.5 py-2.5 text-left text-xs font-semibold text-ink-900">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-ink-100 bg-ink-50/70 text-center text-xs text-ink-500">2</td>
            {cols.map(([c, , calculated]) => (
              <td
                key={c}
                className={`truncate border border-ink-100 px-2.5 py-2.5 ${calculated ? "bg-ink-100/70 font-medium text-ink-900" : "bg-accent-100/40 text-ink-900"} ${c === "Days Left" ? "text-right tabular-nums" : ""}`}
              >
                {c === "Status" ? <Badge tone="red">{SHEET_ROW[c]}</Badge> : SHEET_ROW[c]}
              </td>
            ))}
          </tr>
          {Array.from({ length: rows }, (_, n) => (
            <tr key={n}>
              <td className="border border-ink-100 bg-ink-50/70 text-center text-xs text-ink-500">{n + 3}</td>
              {cols.map(([c, , calculated]) => (
                <td key={c} className={`h-10 border border-ink-100 ${calculated ? "bg-ink-100/70" : "bg-accent-100/40"}`} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-auto flex gap-1 border-t border-ink-100 bg-ink-50 px-3 py-2">
        {tabs.map((t) => (
          <span key={t} className={`whitespace-nowrap rounded-md px-3 py-1 text-xs ${t === "Credentials" ? "bg-white font-semibold text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.12)]" : "text-ink-500"}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TemplateSheet() {
  return <Sheet cols={SHEET_COLS} rows={4} />;
}

// On a phone: the four columns that carry the point, sized to the canvas.
// It used to borrow the wide widths (150+120+90+110 plus the row gutter: 506 on
// a 460 canvas), so the Status column ran 46px past the card and the card's own
// corner clipped "EXPIRED" mid-word — it read as a deliberate crop and was a
// bug. The tab bar likewise ran out at "Payer Enrollme…"; it keeps the data
// tabs, which fit. Measured 2026-09-20.
// 36 (row gutter) + 120 + 98 + 66 + 90 = 410, the canvas: the narrower the
// canvas the larger it draws on a phone (0.75 at 400 inside the ground).
const NARROW_SHEET_COLS = [
  ["Provider Name", 120],
  ["Expiration Date", 98],
  ["Days Left", 66, true],
  ["Status", 90, true],
];
export function NarrowSheet() {
  return <Sheet cols={NARROW_SHEET_COLS} rows={4} tabs={["Providers", "Credentials", "Payer Enrollment", "CAQH"]} />;
}

// ---- /pricing ------------------------------------------------------------------

// Users against providers, 560×470 — the section's rows and caption.
// The same two units on a phone, 330 wide. The wide scene is a 560px canvas,
// and a phone column is ~332: it drew at 0.59, which put the 32px avatars at
// 19 and the numeral at 24. Measured 2026-09-20. Here the note drops under the
// count instead of sitting beside it (at 332 the two do not share a line) and
// the chips are a size smaller, so the whole thing draws at 1.
export function NarrowUsersProviders({ rows, caption }) {
  const people = [PEOPLE.erin, PEOPLE.luis, PEOPLE.ana];
  const names = ["Aisha Bello", "Ethan Brooks", "Maya Chen", "Gregory Daytona", "Noah Fischer", "Olivia Grant", "Hannah Kowalski", "Grace Liu", "Lauren Mitchell", "Priya Natarajan", "Daniel Okafor", "Samuel Park", "Sofia Ramirez", "Marcus Reed", "James Whitaker"];
  return (
    <div className="absolute inset-x-0 top-0 flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.unit} className={`rounded-2xl bg-white px-5 py-4 ${lift}`}>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.125rem] font-semibold leading-none tracking-[-0.02em] text-ink-900">{r.count}</span>
            <span className="text-base font-semibold text-ink-900">{r.unit}</span>
          </div>
          <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-500">{r.note}</p>
          <div className={`mt-3 flex flex-wrap ${r.kind === "person" ? "gap-2.5" : "gap-1.5"}`}>
            {r.kind === "person"
              ? people.slice(0, r.count).map((p) => <PersonPhoto key={p.name} name={p.name} photo={p.photo} size="md" />)
              : Array.from({ length: r.count }, (_, i) => <Avatar key={i} name={names[i % names.length]} size="sm" />)}
          </div>
        </div>
      ))}
      {caption && (
        <div className={`flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 ${chipLift}`}>
          <IconTile d={ICONS.team} size="sm" />
          <p className="text-[0.875rem] leading-snug text-ink-700">{caption}</p>
        </div>
      )}
    </div>
  );
}

export function UsersProviders({ rows, caption }) {
  const people = [PEOPLE.erin, PEOPLE.luis, PEOPLE.ana];
  // The demo client's fifteen providers, round and round.
  const names = ["Aisha Bello", "Ethan Brooks", "Maya Chen", "Gregory Daytona", "Noah Fischer", "Olivia Grant", "Hannah Kowalski", "Grace Liu", "Lauren Mitchell", "Priya Natarajan", "Daniel Okafor", "Samuel Park", "Sofia Ramirez", "Marcus Reed", "James Whitaker"];
  return (
    <div className="absolute inset-x-0 top-0 flex flex-col gap-4">
      {rows.map((r) => (
        <div key={r.unit} className={`rounded-2xl bg-white px-6 py-5 ${lift}`}>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.5rem] font-semibold leading-none tracking-[-0.02em] text-ink-900">{r.count}</span>
            <span className="text-lg font-semibold text-ink-900">{r.unit}</span>
            <span className="ml-auto text-sm text-ink-500">{r.note}</span>
          </div>
          <div className={`mt-4 flex flex-wrap ${r.kind === "person" ? "gap-3" : "gap-2"}`}>
            {r.kind === "person"
              ? people.slice(0, r.count).map((p) => <PersonPhoto key={p.name} name={p.name} photo={p.photo} size="md" />)
              : Array.from({ length: r.count }, (_, i) => <Avatar key={i} name={names[i % names.length]} size="sm" />)}
          </div>
        </div>
      ))}
      {caption && (
        <div className={`flex items-center gap-3 rounded-2xl bg-white px-5 py-4 ${chipLift}`}>
          <IconTile d={ICONS.team} size="sm" />
          <p className="text-[0.9375rem] text-ink-700">{caption}</p>
        </div>
      )}
    </div>
  );
}
