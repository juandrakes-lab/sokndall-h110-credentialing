import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/org";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { startCheckout } from "./actions";

export const metadata = {
  title: "Pricing — H110",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const org = user ? await getCurrentOrg() : null;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-ink-900">Simple, transparent pricing</h1>
        <p className="mt-2 text-ink-500">
          No sales call, no contract negotiation. Pick a plan, start your 14-day trial, cancel
          anytime from the app.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {PLAN_ORDER.map((key) => {
          const plan = PLANS[key];
          const isCurrentPlan = org?.plan === key;

          return (
            <div key={key} className="flex flex-col gap-4 rounded-lg border border-ink-200 bg-white p-6">
              <div>
                <h2 className="text-lg font-semibold text-ink-900">{plan.label}</h2>
                <p className="text-sm text-ink-500">{plan.description}</p>
              </div>
              <div>
                <span className="text-3xl font-semibold text-ink-900">${plan.price}</span>
                <span className="text-ink-500">/month</span>
              </div>

              {!user ? (
                <Link
                  href="/login"
                  className="mt-auto rounded-md bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
                >
                  Start 14-day trial
                </Link>
              ) : isCurrentPlan ? (
                <span className="mt-auto rounded-md border border-ink-200 px-4 py-2 text-center text-sm font-medium text-ink-500">
                  Current plan
                </span>
              ) : (
                <form action={startCheckout.bind(null, key)} className="mt-auto">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Start 14-day trial
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-ink-500">
        14-day trial, card required. You&apos;re billed automatically on day 15 unless you cancel —
        cancellation is self-serve from inside the app, no email required.
      </p>
    </main>
  );
}
