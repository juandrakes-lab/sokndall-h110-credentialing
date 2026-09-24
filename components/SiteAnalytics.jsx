"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

// Vercel Web Analytics on the public pages only. The privacy policy promises
// no analytics inside the application (lib/legal.js, "Cookies and tracking"),
// so the script is not even loaded on these prefixes. Cookieless, no consent
// banner needed. Login and signup stay measured: they are public pages and
// the end of the funnel the SEO work is judged by.
const APP_PREFIXES = [
  "/dashboard", "/providers", "/enrollments", "/follow-ups", "/documents",
  "/settings", "/clients", "/import-export", "/export",
  "/onboarding", "/welcome", "/start", "/invite", "/auth",
  "/forgot-password", "/reset-password", "/styleguide",
];

export default function SiteAnalytics() {
  const pathname = usePathname() ?? "/";
  const inApp = APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return inApp ? null : <Analytics />;
}
