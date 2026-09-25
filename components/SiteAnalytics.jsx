"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { ATTRIBUTION_COOKIE, ATTRIBUTION_KEYS, ATTRIBUTION_MAX_AGE } from "@/lib/attribution";

// Public pages only: Vercel Web Analytics, and the campaign cookie.
//
// The privacy policy promises no analytics inside the application (lib/legal.js,
// "Cookies and tracking"), so neither runs on these prefixes. Login and signup
// stay in: they are public pages and the end of the funnel.
//
// Analytics is cookieless. The campaign cookie (sk_attr) is first-party and is
// only written when the address carries campaign tags — utm_* or an ad click
// id — so a visitor who arrives any other way gets no cookie at all. It holds
// those tags and the page they landed on, for 30 days; picking a plan reads it
// (lib/billing-actions.js startTrial) and the new account keeps it.
const APP_PREFIXES = [
  "/dashboard", "/providers", "/enrollments", "/follow-ups", "/documents",
  "/settings", "/clients", "/import-export", "/export",
  "/onboarding", "/welcome", "/start", "/invite", "/auth",
  "/forgot-password", "/reset-password", "/styleguide", "/unsubscribe",
];

function rememberCampaign() {
  const q = new URLSearchParams(window.location.search);
  const tags = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = q.get(key)?.trim();
    if (value) tags[key] = value.slice(0, 200);
  }
  if (!Object.keys(tags).length) return;
  tags.landing_path = window.location.pathname.slice(0, 300);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(tags))}; Max-Age=${ATTRIBUTION_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

export default function SiteAnalytics() {
  const pathname = usePathname() ?? "/";
  const inApp = APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!inApp) rememberCampaign();
  }, [pathname, inApp]);

  return inApp ? null : <Analytics />;
}
