"use client";

import { useActionState, useState } from "react";
import { changeExtraProviders } from "@/lib/billing-actions";
import { buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import RefreshUntilConfirmed from "./RefreshUntilConfirmed";
import { EXTRA, PRACTICE_NUDGE_FROM, proratedNow } from "@/lib/extra-providers-rules";

const usd = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const day = (iso) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null);

// Settings → Billing, Practice and Billing Co (founder decision 2026-11-11):
// included, extra, the monthly total, and a control to change the number —
// with the exact amount and when it is charged shown before the click.
export default function ExtraProvidersCard({ plan, planPrice, otherMonthly = 0, current, used, peak, periodStart, periodEnd, trialing, pending }) {
  const rule = EXTRA[plan];
  const [extra, setExtra] = useState(current);
  const [state, action] = useActionState(changeExtraProviders, null);
  const max = rule.max === null ? 1000 : rule.max - rule.included;
  const min = Math.max(0, used - rule.included);
  const total = rule.included + extra;
  const monthly = planPrice + extra * rule.price + otherMonthly;
  const changed = extra !== current && !(pending !== null && pending !== undefined && rule.included + extra === pending);
  const up = extra > current;

  let when = null;
  if (changed && plan === "practice") {
    if (trialing) when = `Nothing is charged during the trial. From its end: ${usd(monthly)}/month.`;
    else if (up) when = `Charged now: ${usd(proratedNow(extra - current, periodStart, periodEnd))} for the ${extra - current} added, for the rest of this period (to ${day(periodEnd)}). Then ${usd(monthly)}/month.`;
    else when = `From your renewal on ${day(periodEnd)}: ${usd(monthly)}/month. Until then you keep ${rule.included + current}.`;
  }
  if (changed && plan === "billing_co") {
    const billed = Math.max(peak, extra);
    when = up
      ? `Active right away. On your next invoice (${day(periodEnd)}): ${billed} × $${rule.price} = ${usd(billed * rule.price)} for this month, then ${usd(extra * rule.price)} a month while you keep ${extra}.`
      : `This month is still billed at its highest, ${billed} × $${rule.price} = ${usd(billed * rule.price)}, on ${day(periodEnd)}. From the next month: ${usd(extra * rule.price)} a month.`;
  }

  return (
    <div id="providers" className="flex flex-col gap-3 rounded-lg border border-ink-200 p-4 scroll-mt-8">
      <div>
        <p className="text-sm font-semibold text-ink-900">Providers</p>
        <p className="mt-0.5 text-sm text-ink-700">
          {rule.included} included{current > 0 ? ` + ${current} extra` : ""} = {rule.included + current} · {used} in use
          {pending !== null && pending !== undefined && pending !== rule.included + current ? ` · ${pending} from ${day(periodEnd)}` : ""}
        </p>
        <p className="text-xs text-ink-500">
          Extra providers: ${rule.price}/month each{rule.max ? `, up to ${rule.max} in all` : ""}.{" "}
          {plan === "practice"
            ? "Adding is charged at once for the rest of the period; removing applies at renewal."
            : "Billed on your next invoice at the highest number you had that month."}
        </p>
        {plan === "billing_co" && peak > 0 && (
          <p className="mt-1 text-sm text-ink-900">
            Next invoice ({day(periodEnd)}): {peak} extra × ${rule.price} = <span className="font-semibold">{usd(peak * rule.price)}</span>
            {peak > current ? ` — the highest you had this month` : ""}.
          </p>
        )}
      </div>

      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-700">Extra providers</span>
          <button type="button" aria-label="One fewer" disabled={extra <= min} onClick={() => setExtra((n) => Math.max(min, n - 1))} className={`${buttonClass("secondary", "sm")} w-9 disabled:opacity-40`}>
            −
          </button>
          <input
            name="extra"
            type="number"
            min={min}
            max={max}
            value={extra}
            onChange={(e) => setExtra(Math.max(min, Math.min(max, Number.parseInt(e.target.value || "0", 10) || 0)))}
            className="h-9 w-16 rounded-md border border-ink-200 px-2 text-center text-sm tabular-nums"
          />
          <button type="button" aria-label="One more" disabled={extra >= max} onClick={() => setExtra((n) => Math.min(max, n + 1))} className={`${buttonClass("secondary", "sm")} w-9 disabled:opacity-40`}>
            +
          </button>
          <span className="text-sm text-ink-500">
            = {total} providers · {usd(monthly)}/month
          </span>
        </div>
        {min > 0 && extra === min && current > min && <p className="text-xs text-ink-500">{used} providers are active: mark some inactive to go lower.</p>}
        {when && <p className="text-sm text-ink-900">{when}</p>}
        {plan === "practice" && total >= PRACTICE_NUDGE_FROM && (
          <p className="rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-700">
            At {total} providers Practice is {usd(planPrice + extra * rule.price)}/month. Billing Co is $699 with 50 providers and 10 users — change plan
            below.
          </p>
        )}
        <SubmitButton disabled={!changed} pendingLabel="Saving…" className={`${buttonClass("primary", "sm")} self-start disabled:cursor-not-allowed disabled:opacity-50`}>
          {changed ? (up ? `Add ${extra - current} provider${extra - current === 1 ? "" : "s"}` : `Lower to ${total}`) : "Change the number to continue"}
        </SubmitButton>
        {state?.error && <p role="alert" className="text-sm text-status-expired">{state.error}</p>}
        {state?.done && state.waiting && current !== extra && (
          <RefreshUntilConfirmed
            waiting="Polar is confirming the change…"
            late="Polar hasn't confirmed yet. Reload this page in a minute; if nothing changed, check the billing portal."
          />
        )}
        {state?.done && (!state.waiting || current === extra) && !changed && <p className="text-sm text-status-active">Saved. Your limit is now {rule.included + current} providers.</p>}
      </form>
    </div>
  );
}
