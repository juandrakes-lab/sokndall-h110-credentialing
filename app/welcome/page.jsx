import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import WelcomePoller from "./WelcomePoller";

export const metadata = { title: "Setting up your account — Sokndall", robots: { index: false, follow: false } };

// Where Polar's checkout returns. The account is created by the webhook a few
// seconds later; this page waits for it instead of guessing.
export default async function WelcomePage() {
  const { user, org } = await getAppContext();
  if (!user) redirect("/login");
  if (org) redirect("/onboarding");

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-5">
      <div className="w-full max-w-md rounded-xl border border-ink-200 bg-white px-6 py-8 text-center shadow-sm">
        <p className="text-lg font-semibold tracking-tight text-brand-700">Sokndall</p>
        <WelcomePoller />
      </div>
    </main>
  );
}
