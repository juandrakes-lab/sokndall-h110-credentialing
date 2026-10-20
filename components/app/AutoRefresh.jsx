"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-reads the page every few seconds while something can change from
// outside it (an upload link a provider may be using right now), so new
// arrivals show up without a manual reload. Pauses while the tab is hidden.
export default function AutoRefresh({ seconds = 15 }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
