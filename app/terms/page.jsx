import LegalPage from "@/components/neo/LegalPage";
import { TERMS } from "@/lib/legal";

// Not indexed while the text is a draft (lib/legal.js); switch to pageMeta once final.
export const metadata = {
  title: "Terms of Service — Sokndall",
  robots: { index: TERMS.final, follow: TERMS.final },
};

export default function Page() {
  return <LegalPage doc={TERMS} />;
}
