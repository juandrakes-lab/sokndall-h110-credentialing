import { Card, CardHeader, buttonClass } from "@/components/app/ui";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { accountAccess } from "@/lib/billing";
import { formatDate } from "@/lib/credentials";
import { changePlan, openBillingPortal, resubscribe } from "@/lib/billing-actions";
import RefreshUntilConfirmed from "./RefreshUntilConfirmed";

const day = (iso) => (iso ? formatDate(new Date(iso).toISOString().slice(0, 10)) : null);

// Owner only (alcance §4.3): plan, trial or renewal date, plan changes, and the
// Polar portal for card, invoices and cancellation.
export default function BillingCard({ org, providersUsed, requestedPlan, resubscribed }) {
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
              <button type="submit" className={buttonClass("secondary", "sm")}>
                Billing portal
              </button>
            </form>
          ) : null
        }
      />
      <div className="flex flex-col gap-5 px-5 py-5">
        <div>
          <p className="text-base font-semibold text-ink-900">
            {current.label} · ${current.price}/month
          </p>
          <p className="mt-0.5 text-sm text-ink-500">
            {access.message ??
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
          {target && requestedPlan === org.plan && (
            <p className="mt-2 text-sm text-status-active">
              Done — you&apos;re now on {target.label}. Your new limits apply right away.
            </p>
          )}
        </div>

        {!org.polar_subscription_id ? (
          <form action={resubscribe} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="plan" value={org.plan} />
            <button type="submit" className={buttonClass("primary")}>
              Start your 14-day {current.label} trial
            </button>
            <span className="text-sm text-ink-500">
              This account has no subscription yet. Everything you entered stays as it is.
            </span>
          </form>
        ) : access.state === "ended" ? (
          <form action={resubscribe} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="plan" value={org.plan} />
            <button type="submit" className={buttonClass("primary")}>
              Restart {current.label} (${current.price}/month)
            </button>
            <span className="text-sm text-ink-500">Everything you had is still here and becomes editable again.</span>
          </form>
        ) : target && requestedPlan !== org.plan ? null : (
          <div className="grid gap-3 sm:grid-cols-2">
            {PLAN_ORDER.filter((k) => k !== org.plan).map((key) => {
              const plan = PLANS[key];
              const upgrade = PLAN_ORDER.indexOf(key) > PLAN_ORDER.indexOf(org.plan);
              const overLimit = Math.max(0, providersUsed - plan.providerLimit);
              return (
                <form key={key} action={changePlan} className="flex flex-col gap-2 rounded-lg border border-ink-200 p-4">
                  <input type="hidden" name="plan" value={key} />
                  <p className="text-sm font-semibold text-ink-900">
                    {plan.label} · ${plan.price}/month
                  </p>
                  <p className="text-xs text-ink-500">
                    Up to {plan.providerLimit} providers · {plan.userLimit} user{plan.userLimit === 1 ? "" : "s"} · {plan.storageLabel}
                  </p>
                  {!upgrade && overLimit > 0 && (
                    <p className="text-xs text-status-expiring">
                      You have {providersUsed} providers: the {overLimit} added most recently would become read-only until
                      you delete some or upgrade again. Nothing is deleted.
                    </p>
                  )}
                  <button type="submit" className={`${buttonClass(upgrade ? "primary" : "secondary", "sm")} mt-auto self-start`}>
                    {upgrade ? `Upgrade to ${plan.label}` : `Switch to ${plan.label}`}
                  </button>
                </form>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
