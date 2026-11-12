import Link from "next/link";
import { PLANS, nextPlan } from "@/lib/plans";
import { getAppContext } from "@/lib/org";
import { buttonClass } from "@/components/app/ui";

// Inline upsell shown where the provider limit stops a new provider
// (alcance §4.3). Reading, editing and exporting what's loaded never stop.
// The owner goes straight to the plan change; a member is told who can.
export default async function LimitNotice({ org }) {
  const { role } = await getAppContext();
  const plan = PLANS[org.plan];
  const next = nextPlan(org.plan);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-status-expiring/30 bg-status-expiring-bg px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-ink-900">
        <p className="font-medium">
          Your {plan.label} plan includes {org.provider_limit} providers, and all {org.provider_limit} are in use.
        </p>
        <ul className="mt-1 flex flex-col gap-0.5 text-ink-700">
          <li>
            Free a seat: mark a provider you no longer credential as <span className="font-medium">Inactive</span> on their
            page. Their history stays.
          </li>
          {next && (
            <li>
              Move to {next.label}: up to {next.providerLimit} providers and {next.userLimit} users for ${next.price}/month
              (${next.perProvider} per provider).{role !== "owner" && " The account owner can change the plan."}
            </li>
          )}
        </ul>
      </div>
      {next && role === "owner" && (
        <Link href="/settings?tab=billing" className={`${buttonClass("primary", "sm")} shrink-0`}>
          Upgrade to {next.label}
        </Link>
      )}
    </div>
  );
}
