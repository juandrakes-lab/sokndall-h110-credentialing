import "@/components/site/site.css";
import "@/components/site/site-pages.css";
import Landing from "./Landing";

export const metadata = {
  title: "Sokndall — Credentialing & payer enrollment tracking",
  description:
    "Track the credentials that expire and the payer applications that go quiet, for practices and billing companies with 1 to 50 providers. Published pricing, 14-day trial, no sales call.",
};

export default function LandingPage() {
  return <Landing />;
}
