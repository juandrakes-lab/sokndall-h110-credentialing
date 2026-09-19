import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { startTrial } from "@/lib/billing-actions";
import { buttonClass } from "@/components/app/ui";
import { signOut } from "@/app/(app)/actions";
import SubmitButton from "@/components/app/SubmitButton";
import RecoverSubscription from "./RecoverSubscription";
import { AuthShell } from "@/components/app/AuthParts";

export const metadata = { title: "Choose your plan — Sokndall", robots: { index: false, follow: false } };

const FEATURES = {
  solo: ["1 user", "1 GB of documents"],
  practice: ["Up to 3 users", "5 GB of documents"],
  billing_co: ["10 users included, $39/month each after that", "20 GB of documents", "Separate workspace per client"],
};

// Step 2 of signup (alcance §10.1): signed in, no account yet. Choosing a plan
// goes to Polar's checkout; the account exists once the payment is confirmed.
export default async function StartPage({ searchParams }) {
  const sp = await searchParams;
  const picked = PLANS[sp.plan] ? sp.plan : null;
  const { user, org } = await getAppContext();

  if (!user) redirect(`/signup?next=${encodeURIComponent(picked ? `/start?plan=${picked}` : "/start")}`);
  if (org) redirect("/dashboard");

  const signOutForm = (
    <form action={signOut} className="text-ink-500">
      Signed in as {user.email} ·{" "}
      <SubmitButton className="font-medium text-brand-600 hover:underline">Use another account</SubmitButton>
    </form>
  );

  const card = (key, { chosen = false } = {}) => {
    const plan = PLANS[key];
    return (
      <form
        key={key}
        action={startTrial}
        className={`flex flex-col rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(14,42,46,0.05),0_6px_20px_-6px_rgba(14,42,46,0.08)] ring-1 ${chosen ? "ring-2 ring-brand-600" : "ring-ink-900/[0.08]"}`}
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
        <SubmitButton className={`${buttonClass(chosen || picked ? "primary" : "secondary")} mt-6 w-full`} pendingLabel="Opening the payment step…">
          {picked ? "Continue to payment" : "Start 14-day trial"}
        </SubmitButton>
      </form>
    );
  };

  // Came from a plan's own button: that plan, one click to the payment step.
  if (picked) {
    return (
      <AuthShell story={2}
        step={2}
        title={`Your ${PLANS[picked].label} trial`}
        subtitle="14 days free. Your card goes in on the next step, handled by Polar; the first charge is on day 15, and you can cancel from Settings any time before."
        footer={
          <div className="flex flex-col gap-3">
            <Link href="/start" className="font-medium text-brand-600 hover:underline">
              Choose a different plan
            </Link>
            {signOutForm}
          </div>
        }
      >
        <RecoverSubscription />
        <div className="mt-6">{card(picked, { chosen: true })}</div>
      </AuthShell>
    );
  }

  return (
    <AuthShell story={2}
      wide
      panel={false}
      step={2}
      title="Choose your plan"
      subtitle="Every plan has every feature — they differ in how many providers and people they hold. 14 days free: your card goes in now, the first charge is on day 15, and you can cancel from Settings any time before."
      footer={
        <div className="flex flex-col gap-3">
          <p className="text-xs text-ink-500">
            Payments are handled by Polar, our merchant of record.{" "}
            <Link href="/pricing" className="underline">
              Compare plans in detail
            </Link>
            .
          </p>
          {signOutForm}
        </div>
      }
    >
      <RecoverSubscription />
      <div className="mt-8 grid gap-4 md:grid-cols-3">{PLAN_ORDER.map((key) => card(key))}</div>
    </AuthShell>
  );
}
