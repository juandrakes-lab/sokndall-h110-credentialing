import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { startTrial } from "@/lib/billing-actions";
import { ICONS, Icon } from "@/components/app/ui";
import { PLANS as SITE_PLANS } from "@/app/pricing/data";
import { signOut } from "@/app/(app)/actions";
import SubmitButton from "@/components/app/SubmitButton";
import RecoverSubscription from "./RecoverSubscription";
import { AuthShell } from "@/components/app/AuthParts";

export const metadata = { title: "Choose your plan — Sokndall", robots: { index: false, follow: false } };

// "[text](/route)" → "text": the site's inline links, as plain words here.
const plainText = (s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

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

  // The plan card of the public /pricing page, in the app's own classes: the
  // same copy (app/pricing/data.js), the round checks, the amber trial pill and
  // the dark tag on Practice. The button sits at the foot of every card, so the
  // three line up whatever their lists' lengths.
  const card = (key, { chosen = false } = {}) => {
    const plan = PLANS[key];
    const copy = SITE_PLANS.plans[PLAN_ORDER.indexOf(key)];
    const ring = chosen || (!picked && copy.highlighted) ? "ring-2 ring-brand-700" : "ring-1 ring-ink-900/[0.08]";
    return (
      <form
        key={key}
        action={startTrial}
        className={`relative flex flex-col rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(14,42,46,0.05),0_18px_40px_-18px_rgba(14,42,46,0.25)] ${ring}`}
      >
        <input type="hidden" name="plan" value={key} />
        {copy.tag && !picked && (
          <span className="absolute -top-3 left-6 rounded-full bg-brand-700 px-3 py-1 text-[0.6875rem] font-semibold text-white">{copy.tag}</span>
        )}
        <h2 className="text-lg font-semibold text-ink-900">{plan.label}</h2>
        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink-900">${plan.price}</span>
          <span className="text-sm text-ink-500">/month</span>
        </p>
        <p className="mt-5 text-sm font-semibold text-ink-900">{plainText(copy.desc)}</p>
        <ul className="mt-3 flex flex-col gap-2.5 text-sm text-ink-700">
          {copy.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white" aria-hidden="true">
                <Icon d={ICONS.check} className="h-3 w-3" strokeWidth={2.6} />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-7">
          <SubmitButton
            className="h-11 w-full rounded-full bg-accent-400 px-5 text-sm font-semibold text-ink-900 shadow-[0_1px_2px_rgba(14,42,46,0.14),0_8px_18px_-8px_rgba(14,42,46,0.32)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent-400)_88%,var(--color-brand-700))]"
            pendingLabel="Opening the payment step…"
          >
            {picked ? "Continue to payment" : "Start 14-day trial"} <span aria-hidden="true">↗</span>
          </SubmitButton>
        </div>
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
      <div className="mt-10 grid gap-5 md:grid-cols-3">{PLAN_ORDER.map((key) => card(key))}</div>
    </AuthShell>
  );
}
