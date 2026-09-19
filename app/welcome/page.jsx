import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import WelcomePoller from "./WelcomePoller";
import { AuthShell } from "@/components/app/AuthParts";

export const metadata = { title: "Setting up your account — Sokndall", robots: { index: false, follow: false } };

// Where Polar's checkout returns. The account is created by the webhook a few
// seconds later; this page waits for it instead of guessing.
export default async function WelcomePage() {
  const { user, org } = await getAppContext();
  if (!user) redirect("/login");
  if (org) redirect("/onboarding");

  return (
    <AuthShell step={2}>
      <div className="-mt-6 text-left [&>div]:items-start">
        <WelcomePoller />
      </div>
    </AuthShell>
  );
}
