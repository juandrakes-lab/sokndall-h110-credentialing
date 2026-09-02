import "@/components/site/site.css";
import "@/components/site/site-pages.css";
import Landing from "@/components/site/Landing";
import { pageMeta } from "@/lib/seo";

// "/" serves the full marketing landing. It renders 100% statically — no
// cookies, no Supabase call. Signed-in users are forwarded to /dashboard by
// middleware.js before this page is served.
export const metadata = pageMeta({
  title: "Sokndall — Credentialing & payer enrollment tracking",
  description:
    "Track the credentials that expire and the payer applications that go quiet, for practices and billing companies with 1 to 50 providers. Published pricing, 14-day trial, no sales call.",
  path: "/",
});

export default function HomePage() {
  return <Landing />;
}
