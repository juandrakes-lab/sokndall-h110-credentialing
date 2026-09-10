import Shell from "@/components/neo/Shell";
import Landing from "@/components/neo/Landing";
import { pageMeta } from "@/lib/seo";

// "/" serves the full marketing landing. It renders 100% statically — no
// cookies, no Supabase call. Signed-in users are forwarded to /dashboard by
// middleware.js before this page is served.
//
// The previous forest/gold implementation is still intact at
// components/site/Landing.jsx; only the import here changed.
export const metadata = pageMeta({
  title: "Sokndall — Credential expiry & payer enrollment tracking",
  description:
    "Track the credentials that expire and the payer applications that go quiet, for practices with 3 to 30 providers. Published pricing, 14-day trial, no sales call.",
  path: "/",
});

export default function HomePage() {
  return (
    <Shell>
      <Landing />
    </Shell>
  );
}
