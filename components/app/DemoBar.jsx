import Link from "next/link";
import LocalDateTime from "@/components/app/LocalDateTime";
import DemoVisit from "@/components/app/DemoVisit";
import { DEMO_EVENTS } from "@/lib/demo";

// The demo account's bar, on every screen: whose demo it is, the time left,
// the three guided steps, the latest prepared moment, and the way out —
// "Load my real data".
export default function DemoBar({ demo, steps, open }) {
  const done = steps?.filter((s) => s.done).length ?? 0;
  const latest = [...(demo.events_done ?? [])].reverse().map((k) => DEMO_EVENTS[k]).find(Boolean);
  return (
    <div role="status" className="border-b border-brand-700/15 bg-brand-50 px-4 py-3 text-sm text-ink-900 sm:px-8">
      <DemoVisit />
      <div className="mx-auto flex max-w-6xl flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p>
            <span className="font-semibold">Sokndall demo for {demo.firm}</span>
            <span className="text-ink-700">
              {" · "}
              {open ? (
                <>
                  until <LocalDateTime iso={demo.expires_at} />
                </>
              ) : (
                "ended, read-only"
              )}
              {" · "}Sample data: nothing here carries over to a real account. Don&apos;t enter patient information.
            </span>
          </p>
          <Link href="/real-data" className="shrink-0 rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">
            Load my real data
          </Link>
        </div>
        {open && steps && (
          <ol className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-700" aria-label={`Guided steps, ${done} of 3 done`}>
            <li className="font-medium">Try it · {done}/3</li>
            {steps.map((s, i) => (
              <li key={s.key}>
                <Link href={s.href} className={s.done ? "text-status-active line-through decoration-1" : "underline"}>
                  {s.done ? "✓" : `${i + 1}.`} {s.label}
                </Link>
              </li>
            ))}
            {done === 3 && (
              <li className="font-medium text-ink-900">
                That&apos;s how it looks with sample data. Want it with yours?{" "}
                <Link href="/real-data" className="underline">
                  Load my real data
                </Link>
              </li>
            )}
          </ol>
        )}
        {open && latest && (
          <p className="text-xs text-ink-700">
            <span className="font-medium text-ink-900">New: {latest.title}.</span> {latest.body}{" "}
            <Link href={latest.href} className="underline">
              See it
            </Link>
            {!demo.contact_email && (
              <>
                {" · "}
                <Link href="/settings?tab=alerts" className="underline">
                  Get these alerts by email
                </Link>
              </>
            )}
          </p>
        )}
        <p className="text-xs text-ink-500">This demo records which parts you use, to know what to show you and how to help. Nothing of your real work is stored.</p>
      </div>
    </div>
  );
}
