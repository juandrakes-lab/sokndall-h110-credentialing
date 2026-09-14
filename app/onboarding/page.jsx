import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { savePractice } from "@/lib/practice-actions";
import PracticeForm from "@/components/app/PracticeForm";

export const metadata = {
  title: "Set up your practice — Sokndall",
  robots: { index: false, follow: false },
};

// Step 3 of signup, right after payment: the practice record. For Billing Co
// this is the first client's practice.
export default async function OnboardingPage() {
  const { user, org, practice, clients } = await getAppContext();

  if (!user) redirect("/login");
  if (!org) redirect("/start");
  if (practice) redirect("/dashboard");

  const billingCo = org.plan === "billing_co";
  // Only when adding a client stopped halfway: the client exists, its practice doesn't.
  const finishing = clients.length > 1;

  return (
    <main className="min-h-screen bg-ink-50 px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-lg font-semibold tracking-tight text-brand-700">Sokndall</p>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink-900">
          {finishing ? "Finish setting up this client" : billingCo ? "Add your first client" : "Set up your practice"}
        </h1>
        <p className="mt-1 max-w-xl text-sm text-ink-500">
          {billingCo
            ? "Each client is a practice you credential for. Start with one — you can add the rest from Clients. "
            : ""}
          Payers match these details against the NPI Registry and the IRS on every application. Enter the group NPI
          first and check it — Sokndall fills in the rest from the registry.
        </p>

        <div className="mt-8 rounded-xl border border-ink-200 bg-white px-5 py-6 shadow-sm sm:px-8">
          <PracticeForm action={savePractice} submitLabel="Save and continue" />
        </div>
      </div>
    </main>
  );
}
