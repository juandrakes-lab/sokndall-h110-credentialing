import { Badge, Card, CardHeader, buttonClass, PersonPhoto } from "@/components/app/ui";
import { formatDate } from "@/lib/credentials";
import { PLANS } from "@/lib/plans";
import { EXTRA_USER_PRICE, INCLUDED_USERS, monthlyPrice } from "@/lib/seats";
import { inviteMember, removeMember, revokeInvitation, seatReady, setMemberClients } from "./team-actions";
import { InviteForm, MemberAccessForm } from "./TeamForms";
import SubmitButton from "@/components/app/SubmitButton";

// Owner only: who's on the account, pending invitations, and the seat count
// against the plan (alcance §4.2 — Solo 1, Practice 3, Billing Co 10).
export default function TeamCard({ org, members, invitations, writable, clients, seatChange }) {
  const pending = invitations.filter((i) => !i.accepted_at && new Date(i.expires_at) > new Date());
  const seatsUsed = members.length + pending.length;
  const full = seatsUsed >= org.user_limit;
  const plan = PLANS[org.plan];
  const billingCo = org.plan === "billing_co";
  const extraUsers = billingCo ? Math.max(0, org.user_limit - INCLUDED_USERS) : 0;
  const nameOf = new Map((clients ?? []).map((c) => [c.id, c.name]));
  const reach = (ids) =>
    !ids ? "All clients" : ids.map((id) => nameOf.get(id)).filter(Boolean).join(", ") || "No clients";

  return (
    <Card>
      <div id="team" className="scroll-mt-8" />
      <CardHeader
        title="Team"
        description={`${seatsUsed} of ${org.user_limit} user${org.user_limit === 1 ? "" : "s"} on your ${plan.label} plan (invitations count until they expire). Members can do everything except billing, plan changes, invitations and deleting the account.`}
      />
      {billingCo && (extraUsers > 0 || seatChange) && (
        <div className="border-b border-ink-100 px-5 py-3 text-sm text-ink-700">
          {extraUsers > 0 && (
            <p>
              {INCLUDED_USERS} users included + {extraUsers} additional × ${EXTRA_USER_PRICE}/month = ${monthlyPrice(org.user_limit)}/month.
            </p>
          )}
          {seatChange && (
            <p className="mt-1 text-status-expiring">
              From {formatDate(new Date(seatChange.at).toISOString().slice(0, 10))} your plan goes back to {seatChange.seats} users
              (${monthlyPrice(seatChange.seats)}/month). Until then the {seatChange.current} you&apos;ve paid for stay available.
            </p>
          )}
        </div>
      )}
      <ul className="divide-y divide-ink-100 text-sm">
        {members.map((m) => (
          <li key={m.user_id} className="px-5 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
              <PersonPhoto name={m.name} photo={m.photo} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink-900">{m.name}</p>
                {m.name !== m.email && <p className="truncate text-xs text-ink-500">{m.email}</p>}
                {clients && m.role !== "owner" && <p className="truncate text-xs text-ink-500">{reach(m.client_ids)}</p>}
              </div>
              </div>
              {m.role === "owner" ? (
                <Badge tone="brand">Owner</Badge>
              ) : (
                <details className="text-xs text-ink-500">
                  <summary className="cursor-pointer list-none hover:text-ink-900 [&::-webkit-details-marker]:hidden">Remove</summary>
                  <form action={removeMember.bind(null, m.user_id)} className="mt-1">
                    <SubmitButton className="font-medium text-status-expired hover:underline">
                      Yes, remove {m.name}
                    </SubmitButton>
                  </form>
                </details>
              )}
            </div>
            {clients && m.role !== "owner" && (
              <details className="mt-1 text-sm">
                <summary className="cursor-pointer text-xs font-medium text-brand-600 hover:underline">Change clients</summary>
                <MemberAccessForm
                  action={setMemberClients.bind(null, m.user_id)}
                  clients={clients}
                  initial={m.client_ids}
                  disabled={!writable}
                  idPrefix={`access-${m.user_id}`}
                />
              </details>
            )}
          </li>
        ))}
        {pending.map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-3 px-5 py-3">
            <span className="truncate text-ink-500">
              {i.email} · invited, link valid until {formatDate(i.expires_at.slice(0, 10))}
              {clients && ` · ${reach(i.client_ids)}`}
            </span>
            <form action={revokeInvitation.bind(null, i.id)}>
              <SubmitButton className={buttonClass("ghost", "sm")}>
                Cancel invitation
              </SubmitButton>
            </form>
          </li>
        ))}
      </ul>
      <div className="border-t border-ink-100 px-5 py-5">
        {org.user_limit === 1 ? (
          <p className="text-sm text-ink-500">The Solo plan is for one person. Practice adds up to 3 users.</p>
        ) : full && !billingCo ? (
          <p className="text-sm text-ink-500">
            Every seat on your plan is taken or invited. Billing Co includes 10 users, and more at ${EXTRA_USER_PRICE}/month each.
          </p>
        ) : (
          <InviteForm action={inviteMember} seatReady={seatReady} disabled={!writable} clients={clients} />
        )}
      </div>
    </Card>
  );
}
