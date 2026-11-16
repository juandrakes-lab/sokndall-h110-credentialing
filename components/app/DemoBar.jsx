import Link from "next/link";
import LocalDateTime from "@/components/app/LocalDateTime";
import DemoVisit from "@/components/app/DemoVisit";
import { DEMO_EVENTS } from "@/lib/demo";

// The demo account's bar, on every screen: whose demo it is, the time left,
// the three guided steps, the latest prepared moment, and the way out —
// "Load my real data".
export default function DemoBar({ demo, open, since }) {
  const guideStep = demo.guide_state === "step2" ? 2 : !demo.guide_state || demo.guide_state === "step1" ? 1 : null;
  const sinceParts = [
    since?.requests && `${since.requests} payer request${since.requests === 1 ? "" : "s"}`,
    since?.stalled && `${since.stalled} application${since.stalled === 1 ? "" : "s"} stalled`,
  ].filter(Boolean);
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
            Load my real data (we do it for you)
          </Link>
        </div>
        {open && sinceParts.length > 0 && (
          <p className="text-xs text-ink-900">
            <span className="font-semibold">Since your last visit:</span> {sinceParts.join(", ")}.{" "}
            <Link href="/follow-ups" className="underline">
              See them
            </Link>
          </p>
        )}
        {open && guideStep && (
          <p className="text-xs text-ink-700">
            Getting started · {guideStep} of 2 ·{" "}
            <Link href="/clients" className="underline">
              Continue
            </Link>
          </p>
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
