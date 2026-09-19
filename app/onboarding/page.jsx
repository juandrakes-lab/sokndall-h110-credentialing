import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { savePractice } from "@/lib/practice-actions";
import PracticeForm from "@/components/app/PracticeForm";
import { AuthShell } from "@/components/app/AuthParts";

export const metadata = {
  title: "Set up your practice — Sokndall",
  robots: { index: false, follow: false },
};

// Step 3 of signup, right after payment: the practice record. For Billing Co
// this is the first client's practice.
export default async function OnboardingPage() {
  const { user, org, role, practice, clients } = await getAppContext();

  if (!user) redirect("/login");
  if (!org) redirect("/start");
  if (practice || (role !== "owner" && clients.length === 0)) redirect("/dashboard");

  const billingCo = org.plan === "billing_co";
  // Only when adding a client stopped halfway: the client exists, its practice doesn't.
  const finishing = clients.length > 1;

  return (
    <AuthShell
      wide
      step={finishing ? undefined : 3}
      title={finishing ? "Finish setting up this client" : billingCo ? "Add your first client" : "Set up your practice"}
      subtitle={`${billingCo ? "Each client is a practice you credential for. Start with one — you can add the rest from Clients. " : ""}Payers match these details against the NPI Registry and the IRS on every application. Enter the group NPI first and check it — Sokndall fills in the rest from the registry.`}
    >
      <div className="mt-8">
        <PracticeForm action={savePractice} submitLabel="Save and open my dashboard" />
      </div>
    </AuthShell>
  );
}
