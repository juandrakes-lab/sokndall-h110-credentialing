import LegalPage from "@/components/neo/LegalPage";
import { pageMeta } from "@/lib/seo";
import { PRIVACY } from "@/lib/legal";

export const metadata = pageMeta({
  title: "Privacy Policy — Sokndall",
  description: "What Sokndall collects, who processes it, how long it is kept, and how to export or delete it. No patient data, and no advertising use of what you enter.",
  path: "/privacy",
});

export default function Page() {
  return <LegalPage doc={PRIVACY} />;
}
