import { Card, CardHeader, buttonClass } from "@/components/app/ui";
import { PLANS, PLAN_ORDER, downgradeBlockers } from "@/lib/plans";
import { accountAccess } from "@/lib/billing";
import { formatDate } from "@/lib/credentials";
import { changePlan, openBillingPortal, resubscribe } from "@/lib/billing-actions";
import RefreshUntilConfirmed from "./RefreshUntilConfirmed";
import { EXTRA_USER_PRICE, INCLUDED_USERS, monthlyPrice } from "@/lib/seats";
import SubmitButton from "@/components/app/SubmitButton";
import AccessMessage from "@/components/app/AccessMessage";
import LocalDateTime from "@/components/app/LocalDateTime";

const day = (iso) => (iso ? formatDate(new Date(iso).toISOString().slice(0, 10)) : null);

// Owner only (alcance §4.3): plan, trial or renewal date, plan changes, and the
// Polar portal for card, invoices and cancellation.
export default function BillingCard({ org, providersUsed, usage, requestedPlan, resubscribed, planError }) {
  const access = accountAccess(org);
  const current = PLANS[org.plan];
  const target = PLANS[requestedPlan];
  const linkPending = resubscribed && (access.state === "ended" || !org.polar_subscription_id);

  return (
    <Card>
      <div id="billing" className="scroll-mt-8" />
      <CardHeader
        title="Billing"
        description="Payments are handled by Polar. Change plans here; update your card, see invoices or cancel in the billing portal."
        actions={
          org.polar_subscription_id && access.state !== "ended" ? (
            <form action={openBillingPortal}>
              <SubmitButton className={buttonClass("secondary", "sm")}>
                Billing portal
              </SubmitButton>
            </form>
          ) : null
        }
      />
      <div className="flex flex-col gap-5 px-5 py-5">
        <div>
          <p className="text-base font-semibold text-ink-900">
            {current.label} · ${org.plan === "billing_co" ? monthlyPrice(org.user_limit) : current.price}/month
          </p>
          {org.plan === "billing_co" && org.user_limit > INCLUDED_USERS && (
            <p className="text-xs text-ink-500">
              ${current.price} + {org.user_limit - INCLUDED_USERS} additional user{org.user_limit - INCLUDED_USERS === 1 ? "" : "s"} × $
              {EXTRA_USER_PRICE}
            </p>
          )}
          <p className="mt-0.5 text-sm text-ink-500">
            {access.message ? <AccessMessage access={access} /> :
              (org.current_period_end ? `Renews on ${day(org.current_period_end)}.` : "Active.")}
          </p>
          {linkPending && (
            <RefreshUntilConfirmed
              waiting="Checkout complete. Waiting for Polar to confirm it…"
              late="Polar hasn't confirmed yet. This page updates when you reload it; if it doesn't within a few minutes, check the billing portal."
            />
          )}
          {resubscribed && !linkPending && (
            <p className="mt-2 text-sm text-status-active">Your subscription is active again.</p>
          )}
          {target && requestedPlan !== org.plan && (
            <RefreshUntilConfirmed
              waiting={`Changing to ${target.label}. Waiting for Polar to confirm it…`}
              late={`Polar hasn't confirmed the change to ${target.label} yet. Reload this page in a minute; if nothing changed, check the billing portal.`}
            />
          )}
          {planError && (
            <p className="mt-2 text-sm text-status-expired">
              Polar didn&apos;t accept the plan change, and nothing was changed. Try again in a minute; if it keeps
              happening, use the help button and we&apos;ll sort it out.
            </p>
          )}
          {target && requestedPlan === org.plan && (
            <p className="mt-2 text-sm text-status-active">
              Done — you&apos;re now on {target.label}. Your new limits apply right away.
            </p>
          )}
        </div>

        {!org.polar_subscription_id && org.trial_ends_at ? (
          <form action={resubscribe} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="plan" value={org.plan} />
            <SubmitButton className={buttonClass("primary")} pendingLabel="Opening the payment step…">
              {access.writable ? "Add a card" : `Add a card and continue ($${current.price}/month)`}
            </SubmitButton>
            <span className="text-sm text-ink-500">
              {access.writable ? (
                <>
                  Nothing is charged now. The first charge of ${current.price} is when the trial ends (
                  <LocalDateTime iso={org.trial_ends_at} />
                  ), then monthly.
                </>
              ) : (
                `You're charged $${current.price} now, then monthly. Everything you had becomes editable again.`
              )}
            </span>
          </form>
        ) : !org.polar_subscription_id ? (
          <form action={resubscribe} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="plan" value={org.plan} />
            <SubmitButton className={buttonClass("primary")}>
              Start your 14-day {current.label} trial
            </SubmitButton>
            <span className="text-sm text-ink-500">
              This account has no subscription yet. Everything you entered stays as it is.
            </span>
          </form>
        ) : access.state === "ended" ? (
          <form action={resubscribe} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="plan" value={org.plan} />
            <SubmitButton className={buttonClass("primary")}>
              Restart {current.label} (${current.price}/month)
            </SubmitButton>
            <span className="text-sm text-ink-500">Everything you had is still here and becomes editable again.</span>
          </form>
        ) : target && requestedPlan !== org.plan ? null : (
          <div className="flex flex-col gap-3">
          {org.cancel_at_period_end && (
            <p className="text-sm text-ink-500">
              Choosing a plan below also undoes your cancellation: the subscription carries on instead of ending on{" "}
              {day(org.current_period_end)}.
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {PLAN_ORDER.filter((k) => k !== org.plan).map((key) => {
              const plan = PLANS[key];
              const upgrade = PLAN_ORDER.indexOf(key) > PLAN_ORDER.indexOf(org.plan);
              const blockers = upgrade ? [] : downgradeBlockers(key, usage);
              return (
                <form key={key} action={changePlan} className="flex flex-col gap-2 rounded-lg border border-ink-200 p-4">
                  <input type="hidden" name="plan" value={key} />
                  <p className="text-sm font-semibold text-ink-900">
                    {plan.label} · ${plan.price}/month
                  </p>
                  <p className="text-xs text-ink-500">
                    Up to {plan.providerLimit} providers · {plan.userLimit} user{plan.userLimit === 1 ? "" : "s"}{plan.extraUserPrice ? ` (+$${plan.extraUserPrice}/month each after)` : ""} · {plan.storageLabel}
                  </p>
                  {blockers.length > 0 && (
                    <div className="text-xs text-status-expiring">
                      <p className="font-medium">Before switching to {plan.label}:</p>
                      <ul className="mt-0.5 list-disc pl-4">
                        {blockers.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                      <p className="mt-0.5 text-ink-500">We never delete anything for you. Once these are done, the switch is available here.</p>
                    </div>
                  )}
                  <SubmitButton disabled={blockers.length > 0} className={`${buttonClass(upgrade ? "primary" : "secondary", "sm")} mt-auto self-start disabled:cursor-not-allowed disabled:opacity-50`}>
                    {upgrade ? `Upgrade to ${plan.label}` : `Switch to ${plan.label}`}
                  </SubmitButton>
                </form>
              );
            })}
          </div>
          </div>
        )}
      </div>
    </Card>
  );
}
