"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accountReady } from "@/lib/billing-actions";
import { buttonClass } from "@/components/app/ui";

const EVERY_MS = 2000;
const GIVE_UP_MS = 90000;

export default function WelcomePoller() {
  const router = useRouter();
  const [waitedTooLong, setWaitedTooLong] = useState(false);

  useEffect(() => {
    const started = Date.now();
    let stopped = false;

    async function tick() {
      if (stopped) return;
      let ready = false;
      try {
        ready = await accountReady();
      } catch {
        // A deploy or restart can orphan the action; re-rendering the page
        // asks the server directly (it redirects once the account exists).
        router.refresh();
      }
      if (ready) {
        router.replace("/onboarding");
        return;
      }
      if (Date.now() - started > GIVE_UP_MS) setWaitedTooLong(true);
      setTimeout(tick, EVERY_MS);
    }
    tick();
    return () => {
      stopped = true;
    };
  }, [router]);

  return waitedTooLong ? (
    <div className="mt-6 flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold text-ink-900">Still confirming your payment</h1>
      <p className="text-sm text-ink-500">
        This usually takes seconds. We&apos;ll keep checking — you can also come back later; your account appears as soon as
        the payment is confirmed.
      </p>
      <Link href="/start" className={buttonClass("secondary")}>
        Back to plans
      </Link>
    </div>
  ) : (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" aria-hidden="true" />
      <h1 className="text-xl font-semibold text-ink-900">Setting up your account</h1>
      <p className="text-sm text-ink-500">Your trial has started. This takes a few seconds.</p>
    </div>
  );
}
