import LegalPage from "@/components/neo/LegalPage";
import { PRIVACY } from "@/lib/legal";

// Not indexed while the text is a draft (lib/legal.js); switch to pageMeta once final.
export const metadata = {
  title: "Privacy Policy — Sokndall",
  robots: { index: PRIVACY.final, follow: PRIVACY.final },
};

export default function Page() {
  return <LegalPage doc={PRIVACY} />;
}
