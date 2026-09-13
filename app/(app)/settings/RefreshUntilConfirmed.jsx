"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EVERY_MS = 2000;
const GIVE_UP_MS = 60000;

// While Polar confirms a billing change (by webhook), re-render the page every
// couple of seconds; the server stops rendering this once the change is in.
export default function RefreshUntilConfirmed({ waiting, late }) {
  const router = useRouter();
  const [tooLong, setTooLong] = useState(false);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - started > GIVE_UP_MS) {
        setTooLong(true);
        clearInterval(timer);
        return;
      }
      router.refresh();
    }, EVERY_MS);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <p className="mt-2 flex items-center gap-2 text-sm text-ink-500" role="status">
      {!tooLong && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" aria-hidden="true" />
      )}
      {tooLong ? late : waiting}
    </p>
  );
}
