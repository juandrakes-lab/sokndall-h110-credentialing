import LegalPage from "@/components/neo/LegalPage";
import { pageMeta } from "@/lib/seo";
import { TERMS } from "@/lib/legal";

export const metadata = pageMeta({
  title: "Terms of Service — Sokndall",
  description: "The agreement between Sokndall and the practices and billing companies that use it: what the software does, plans and billing, your data, and the limits.",
  path: "/terms",
});

export default function Page() {
  return <LegalPage doc={TERMS} />;
}
