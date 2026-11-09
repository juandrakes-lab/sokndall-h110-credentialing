"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logDemoVisit } from "@/lib/demo-actions";

// Demo accounts only: which section is open (the activity log announced on
// entry). Nothing else — no clicks, no text.
export default function DemoVisit() {
  const pathname = usePathname();
  useEffect(() => {
    logDemoVisit(pathname).catch(() => {});
  }, [pathname]);
  return null;
}
