import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  CREDENTIAL_TYPE_LABELS,
  STATUS_STYLES,
  bucketFor,
  daysUntil,
} from "@/lib/credentials";

const BUCKETS = [
  { key: "overdue", label: "Already expired", tone: "border-status-expired bg-status-expired-bg" },
  { key: "due_30", label: "Expiring in 30 days", tone: "border-ink-200 bg-white" },
  { key: "due_60", label: "Expiring in 60 days", tone: "border-ink-200 bg-white" },
  { key: "due_90", label: "Expiring in 90 days", tone: "border-ink-200 bg-white" },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: credentials, error } = await supabase
    .from("credentials")
    .select("id, type, identifier, expiration_date, status, providers(id, first_name, last_name)")
    .not("expiration_date", "is", null)
    .order("expiration_date", { ascending: true });

  if (error) {
    return <p className="text-status-expired">Failed to load dashboard: {error.message}</p>;
  }

  const grouped = { overdue: [], due_30: [], due_60: [], due_90: [] };
  for (const cred of credentials ?? []) {
    const bucket = bucketFor(cred.expiration_date);
    if (bucket) grouped[bucket].push(cred);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Upcoming expirations</h1>
        <p className="mt-1 text-sm text-ink-500">
          Credential status is derived automatically from expiration dates.
        </p>
      </div>

      {BUCKETS.map((bucket) => (
        <section key={bucket.key} className={`rounded-lg border p-4 ${bucket.tone}`}>
          <h2 className="mb-3 text-sm font-semibold text-ink-900">
            {bucket.label} ({grouped[bucket.key].length})
          </h2>

          {grouped[bucket.key].length === 0 ? (
            <p className="text-sm text-ink-500">Nothing here.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink-200">
              {grouped[bucket.key].map((cred) => {
                const days = daysUntil(cred.expiration_date);
                return (
                  <li key={cred.id} className="flex items-center justify-between py-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/providers/${cred.providers?.id}`}
                        className="font-medium text-ink-900 hover:text-brand-600"
                      >
                        {cred.providers?.first_name} {cred.providers?.last_name}
                      </Link>
                      <span className="text-ink-500">
                        {CREDENTIAL_TYPE_LABELS[cred.type]}
                        {cred.identifier ? ` — ${cred.identifier}` : ""}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[cred.status]}`}>
                        {cred.status}
                      </span>
                    </div>
                    <div className="text-ink-500">
                      {cred.expiration_date}{" "}
                      <span className="text-ink-500">
                        ({days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`})
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
