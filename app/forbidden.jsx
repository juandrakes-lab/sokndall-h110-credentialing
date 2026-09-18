import Link from "next/link";
import { buttonClass } from "@/components/app/ui";

export const metadata = {
  title: "Not available on your plan — Sokndall",
  robots: { index: false, follow: false },
};

// Served with HTTP 403 by forbidden(): today, the multi-client screens on any
// plan but Billing Co (alcance §4.3).
export default function Forbidden() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-5">
      <div className="max-w-md text-center">
        <p className="text-lg font-semibold tracking-tight text-brand-700">Sokndall</p>
        <h1 className="mt-6 text-xl font-semibold text-ink-900">This isn&apos;t part of your plan</h1>
        <p className="mt-2 text-sm text-ink-500">
          Managing several client practices from one account is part of the Billing Co plan.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard" className={buttonClass("secondary")}>
            Back to the dashboard
          </Link>
          <Link href="/settings?tab=billing" className={buttonClass("primary")}>
            See plans
          </Link>
        </div>
      </div>
    </main>
  );
}
