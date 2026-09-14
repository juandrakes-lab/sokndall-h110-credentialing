import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { startTrial } from "@/lib/billing-actions";
import { buttonClass } from "@/components/app/ui";
import { signOut } from "@/app/(app)/actions";
import SubmitButton from "@/components/app/SubmitButton";
import RecoverSubscription from "./RecoverSubscription";

export const metadata = { title: "Choose your plan — Sokndall", robots: { index: false, follow: false } };

const FEATURES = {
  solo: ["1 user", "1 GB of documents"],
  practice: ["Up to 3 users", "5 GB of documents"],
  billing_co: ["10 users included", "20 GB of documents", "Separate workspace per client"],
};

// Step 2 of signup (alcance §10.1): signed in, no account yet. Choosing a plan
// goes to Polar's checkout; the account exists once the payment is confirmed.
export default async function StartPage({ searchParams }) {
  const sp = await searchParams;
  const picked = PLANS[sp.plan] ? sp.plan : null;
  const { user, org } = await getAppContext();

  if (!user) redirect(`/login?mode=signup&next=${encodeURIComponent(picked ? `/start?plan=${picked}` : "/start")}`);
  if (org) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-ink-50 px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold tracking-tight text-brand-700">Sokndall</p>
          <form action={signOut}>
            <SubmitButton className="text-sm text-ink-500 hover:text-ink-900">
              Sign out ({user.email})
            </SubmitButton>
          </form>
        </div>

        <RecoverSubscription />

        <h1 className="mt-10 text-2xl font-semibold tracking-tight text-ink-900">Choose your plan</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          Every plan has every feature — they differ in how many providers and people they hold. Start with 14 days
          free: your card goes in now, the first charge is on day 15, and you can cancel from Settings any time before.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PLAN_ORDER.map((key) => {
            const plan = PLANS[key];
            const chosen = key === picked;
            return (
              <form
                key={key}
                action={startTrial}
                className={`flex flex-col rounded-xl border bg-white p-6 shadow-sm ${chosen ? "border-brand-600 ring-2 ring-brand-100" : "border-ink-200"}`}
              >
                <input type="hidden" name="plan" value={key} />
                <h2 className="text-lg font-semibold text-ink-900">{plan.label}</h2>
                <p className="mt-2">
                  <span className="text-3xl font-semibold tabular-nums text-ink-900">${plan.price}</span>
                  <span className="text-sm text-ink-500"> /month</span>
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Up to {plan.providerLimit} providers · ${plan.perProvider} per provider
                </p>
                <ul className="mt-4 flex flex-col gap-1.5 text-sm text-ink-700">
                  {FEATURES[key].map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <SubmitButton className={`${buttonClass(chosen ? "primary" : "secondary")} mt-6`}>
                  Start 14-day trial
                </SubmitButton>
              </form>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-ink-500">
          Payments are handled by Polar, our merchant of record. We don&apos;t sell verification or a managed service —
          that&apos;s why it costs a fraction. <Link href="/pricing" className="underline">Compare plans in detail</Link>.
        </p>
      </div>
    </main>
  );
}
