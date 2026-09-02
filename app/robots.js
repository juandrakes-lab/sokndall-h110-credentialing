import { SITE_URL } from "@/lib/seo";

// Private, per-user surfaces. Never useful in an index.
const DISALLOW = [
  "/dashboard",
  "/providers",
  "/payers",
  "/enrollments",
  "/credentials",
  "/onboarding",
  "/auth",
  "/login",
];

// Search and AI answer engines we explicitly welcome. GPTBot is intentionally
// not listed — it falls under the default "*" rule (crawl allowed) rather than
// being called out or blocked.
const ALLOWED_BOTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: ALLOWED_BOTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
