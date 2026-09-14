"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Someone who already paid but whose account never appeared (a lost or late
// webhook) lands here again. Before they pick a plan a second time — which
// Polar would refuse — ask Polar whether their subscription already exists.
export default function RecoverSubscription() {
  const router = useRouter();
  const [found, setFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/billing/sync", { method: "POST" })
      .then((res) => (res.ok ? res.json() : { ready: false }))
      .then(({ ready }) => {
        if (cancelled || !ready) return;
        setFound(true);
        router.replace("/onboarding");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!found) return null;
  return (
    <p role="status" className="mt-6 flex items-center gap-2 rounded-lg border border-status-active/30 bg-status-active-bg px-4 py-3 text-sm text-ink-900">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" aria-hidden="true" />
      We found your subscription — opening your account…
    </p>
  );
}
