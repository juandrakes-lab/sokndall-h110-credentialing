import { Badge, Card, CardHeader, buttonClass } from "@/components/app/ui";
import { formatDate } from "@/lib/credentials";
import { PLANS } from "@/lib/plans";
import { inviteMember, removeMember, revokeInvitation } from "./team-actions";
import { InviteForm } from "./TeamForms";

// Owner only: who's on the account, pending invitations, and the seat count
// against the plan (alcance §4.2 — Solo 1, Practice 3, Billing Co 10).
export default function TeamCard({ org, members, invitations, writable }) {
  const pending = invitations.filter((i) => !i.accepted_at && new Date(i.expires_at) > new Date());
  const seatsUsed = members.length + pending.length;
  const full = seatsUsed >= org.user_limit;
  const plan = PLANS[org.plan];

  return (
    <Card>
      <CardHeader
        title="Team"
        description={`${seatsUsed} of ${org.user_limit} user${org.user_limit === 1 ? "" : "s"} on your ${plan.label} plan (invitations count until they expire). Members can do everything except billing, plan changes, invitations and deleting the account.`}
      />
      <ul className="divide-y divide-ink-100 text-sm">
        {members.map((m) => (
          <li key={m.user_id} className="flex items-center justify-between gap-3 px-5 py-3">
            <span className="truncate text-ink-900">{m.email}</span>
            {m.role === "owner" ? (
              <Badge tone="brand">Owner</Badge>
            ) : (
              <details className="text-xs text-ink-500">
                <summary className="cursor-pointer list-none hover:text-ink-900 [&::-webkit-details-marker]:hidden">Remove</summary>
                <form action={removeMember.bind(null, m.user_id)} className="mt-1">
                  <button type="submit" className="font-medium text-status-expired hover:underline">
                    Yes, remove {m.email}
                  </button>
                </form>
              </details>
            )}
          </li>
        ))}
        {pending.map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-3 px-5 py-3">
            <span className="truncate text-ink-500">
              {i.email} · invited, link valid until {formatDate(i.expires_at.slice(0, 10))}
            </span>
            <form action={revokeInvitation.bind(null, i.id)}>
              <button type="submit" className={buttonClass("ghost", "sm")}>
                Cancel invitation
              </button>
            </form>
          </li>
        ))}
      </ul>
      <div className="border-t border-ink-100 px-5 py-5">
        {org.user_limit === 1 ? (
          <p className="text-sm text-ink-500">The Solo plan is for one person. Practice adds up to 3 users.</p>
        ) : full ? (
          <p className="text-sm text-ink-500">
            Every seat on your plan is taken or invited.
            {org.plan === "practice"
              ? " Billing Co includes 10 users."
              : " Adding users beyond the 10 included isn't available yet."}
          </p>
        ) : (
          <InviteForm action={inviteMember} disabled={!writable} />
        )}
      </div>
    </Card>
  );
}
