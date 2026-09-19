import Link from "next/link";
import { Avatar, Badge, STATUS_FILL } from "@/components/app/ui";
import { formatDate } from "@/lib/credentials";
import { CHANNEL_LABELS, ENROLLMENT_STATUS_LABELS, cellKey, followUpLabel, stalledDays } from "@/lib/enrollments";

function withOpen(basePath, params, key) {
  const next = new URLSearchParams(params);
  next.set("open", key);
  return `${basePath}?${next.toString()}`;
}

// One row per enrollment for the follow-up queue and the stalled list, in
// three weights: who and which payer; where it stands and when we last
// called, small; how late it is, on the right. The call notes live in the
// side panel each row opens.
export default function FollowUpList({ items, lastContact, directory, basePath, params = {}, mode = "queue" }) {
  const owner = directory.find((d) => d.role === "owner");
  const firstName = (name) => String(name ?? "").split(/[\s@]/)[0];
  const who = (id) => (id ? directory.find((d) => d.user_id === id)?.name ?? "Former member" : owner?.name ?? "Owner");
  const team = directory.length > 1;

  return (
    <ul className="divide-y divide-ink-100">
      {items.map((e) => {
        const last = lastContact.get(e.id);
        const fu = e.next_follow_up_date ? followUpLabel(e.next_follow_up_date) : null;
        const stalled = stalledDays(e);
        return (
          <li key={e.id}>
            <Link
              href={withOpen(basePath, params, cellKey(e.provider_id, e.payer_id))}
              scroll={false}
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ink-50/70"
            >
              <Avatar name={`${e.provider.first_name} ${e.provider.last_name}`} />
              <div className="min-w-0 flex-1">
                {/* On a phone the payer gets its own line — it's who to call. */}
                <p className="sm:truncate">
                  <span className="font-semibold text-ink-900">
                    {e.provider.first_name} {e.provider.last_name}
                  </span>
                  <span className="block text-sm text-ink-700 sm:inline">
                    <span className="hidden sm:inline"> · </span>
                    {e.payer.name}
                  </span>
                </p>
                <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-ink-500">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STATUS_FILL[e.status] }} aria-hidden="true" />
                  <span className="shrink-0 font-medium text-ink-700">{ENROLLMENT_STATUS_LABELS[e.status]}</span>
                  <span className="truncate">
                    {" · "}
                    {last ? `Last ${CHANNEL_LABELS[last.channel].toLowerCase()} ${formatDate(last.contact_date)}` : "No contact yet"}
                    {team && ` · Responsible: ${firstName(who(e.assigned_user_id))}`}
                  </span>
                </p>
                {e.pending_request && (
                  <p className="mt-1 line-clamp-2 text-xs font-medium text-status-expiring">Payer asked for: {e.pending_request}</p>
                )}
              </div>
              <div className="shrink-0">
                {mode === "queue" && fu && <Badge tone={fu.tone}>{fu.text}</Badge>}
                {mode === "stalled" && stalled && <Badge tone="amber">{stalled} days quiet</Badge>}
                {mode === "requests" && <Badge tone="amber">{e.pending_request ? "Waiting on you" : "Request not written down"}</Badge>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
