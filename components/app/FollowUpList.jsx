import Link from "next/link";
import { Badge } from "@/components/app/ui";
import { formatDate } from "@/lib/credentials";
import {
  CHANNEL_LABELS,
  ENROLLMENT_STATUS_LABELS,
  ENROLLMENT_STATUS_TONES,
  cellKey,
  followUpLabel,
  stalledDays,
} from "@/lib/enrollments";

function withOpen(basePath, params, key) {
  const next = new URLSearchParams(params);
  next.set("open", key);
  return `${basePath}?${next.toString()}`;
}

// One row per enrollment for the follow-up queue and the stalled list. Each
// row opens the enrollment's side panel on the same page.
export default function FollowUpList({ items, lastContact, directory, basePath, params = {}, mode = "queue" }) {
  const owner = directory.find((d) => d.role === "owner");
  const who = (id) => (id ? directory.find((d) => d.user_id === id)?.name ?? "Former member" : owner?.name ?? "Owner");

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
              className="flex flex-col gap-2 px-5 py-3 hover:bg-ink-50/70 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-ink-900">
                    {e.provider.first_name} {e.provider.last_name}
                  </span>
                  <span className="text-ink-500">· {e.payer.name}</span>
                  <Badge tone={ENROLLMENT_STATUS_TONES[e.status]}>{ENROLLMENT_STATUS_LABELS[e.status]}</Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-ink-500">
                  {last
                    ? `Last contact ${formatDate(last.contact_date)} · ${CHANNEL_LABELS[last.channel]}${
                        last.reference_number ? ` · Ref. ${last.reference_number}` : ""
                      }${last.outcome ? ` — ${last.outcome}` : ""}`
                    : "No contact logged yet"}
                  {" · "}
                  {who(e.assigned_user_id)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-sm">
                {mode === "queue" && fu && (
                  <>
                    <span className="text-ink-500">{formatDate(e.next_follow_up_date)}</span>
                    <Badge tone={fu.tone}>{fu.text}</Badge>
                  </>
                )}
                {mode === "stalled" && stalled && <Badge tone="amber">{stalled} days without a status change</Badge>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
