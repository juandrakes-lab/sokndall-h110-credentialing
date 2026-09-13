import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { formatDate, todayISO } from "@/lib/credentials";
import {
  CHANNEL_LABELS,
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_LABELS,
  ENROLLMENT_STATUS_TONES,
  PAYER_SELECT,
  PAYER_TYPE_LABELS,
  proposedFollowUp,
  resolvePayer,
  stalledDays,
} from "@/lib/enrollments";
import { Badge } from "@/components/app/ui";
import DocumentList from "@/components/app/DocumentList";
import DocumentUploader from "@/components/app/DocumentUploader";
import { checklistFor } from "@/lib/checklist";
import { deleteCommunication, logFollowUp, setEnrollmentStatus, updateEnrollmentDetails } from "./actions";
import { DetailsForm, FollowUpForm } from "./EnrollmentForms";

const ACTIVE_STATUS = {
  not_started: "border-ink-500 bg-ink-100 text-ink-900",
  submitted: "border-brand-600 bg-brand-50 text-brand-700",
  in_review: "border-sky-600 bg-sky-50 text-sky-800",
  info_requested: "border-status-expiring bg-status-expiring-bg text-status-expiring",
  approved: "border-status-active bg-status-active-bg text-status-active",
  denied: "border-status-expired bg-status-expired-bg text-status-expired",
};

function when(iso) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
}

// Side panel for one provider × payer cell (alcance §3.13): change status,
// log a follow-up, set the next one — without leaving the page behind it.
export default async function EnrollmentPanel({ providerId, payerId, closeHref }) {
  const { supabase, user } = await getAppContext();

  const [{ data: provider }, { data: payerRow }, { data: enrollment }, { data: members }, { data: credentials }, { data: documents }, { data: writable }] =
    await Promise.all([
      supabase.from("cred_providers").select("id, first_name, last_name, npi, nppes_data").eq("id", providerId).maybeSingle(),
      supabase.from("cred_payers_org").select(PAYER_SELECT).eq("id", payerId).maybeSingle(),
      supabase.from("cred_enrollments").select("*").eq("provider_id", providerId).eq("payer_id", payerId).maybeSingle(),
      supabase.rpc("cred_org_directory"),
      supabase.from("cred_credentials").select("type, expiration_date").eq("provider_id", providerId),
      supabase.from("cred_documents").select("*").eq("provider_id", providerId).order("created_at", { ascending: false }),
      supabase.rpc("cred_provider_writable", { p_provider_id: providerId }),
    ]);
  const readOnly = writable === false;

  if (!provider || !payerRow) return null;
  const payer = resolvePayer(payerRow);

  const [{ data: events }, { data: comms }] = enrollment
    ? await Promise.all([
        supabase.from("cred_enrollment_events").select("*").eq("enrollment_id", enrollment.id),
        supabase.from("cred_communications").select("*").eq("enrollment_id", enrollment.id),
      ])
    : [{ data: [] }, { data: [] }];

  const directory = members ?? [];
  const emailOf = (id) => directory.find((m) => m.user_id === id)?.email ?? "Former member";
  const owner = directory.find((m) => m.role === "owner");
  const status = enrollment?.status ?? "not_started";
  const stalled = enrollment ? stalledDays(enrollment) : null;

  const timeline = [
    ...(events ?? []).map((e) => ({ kind: "status", at: e.created_at, ...e })),
    ...(comms ?? []).map((c) => ({ kind: "contact", at: c.created_at, ...c })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  const statusAction = setEnrollmentStatus.bind(null, providerId, payerId);
  const missing = checklistFor(provider, credentials ?? [], documents ?? []).filter((i) => !i.done);
  const enrollmentDocs = enrollment ? (documents ?? []).filter((d) => d.enrollment_id === enrollment.id) : [];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <Link href={closeHref} scroll={false} aria-label="Close" className="absolute inset-0 bg-ink-900/20" />
      <aside
        role="dialog"
        aria-label={`${provider.first_name} ${provider.last_name} — ${payer.name}`}
        className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink-100 bg-white px-6 py-4">
          <div className="min-w-0">
            <p className="text-sm text-ink-500">
              {payer.name} · {PAYER_TYPE_LABELS[payer.payer_type]}
            </p>
            <h2 className="text-lg font-semibold text-ink-900">
              {provider.first_name} {provider.last_name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge tone={ENROLLMENT_STATUS_TONES[status]}>{ENROLLMENT_STATUS_LABELS[status]}</Badge>
              {stalled && <Badge tone="amber">Stalled · no status change in {stalled} days</Badge>}
              {enrollment?.next_follow_up_date && (
                <span className="text-xs text-ink-500">Next follow-up {formatDate(enrollment.next_follow_up_date)}</span>
              )}
            </div>
          </div>
          <Link href={closeHref} scroll={false} className="rounded-lg px-2 py-1 text-xl leading-none text-ink-500 hover:bg-ink-100 hover:text-ink-900" aria-label="Close">
            ×
          </Link>
        </header>

        <div className="flex flex-col gap-8 px-6 py-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Status</h3>
            {readOnly && (
              <p className="mb-3 rounded-lg border border-status-expiring/30 bg-status-expiring-bg px-4 py-3 text-sm text-ink-900">
                Read-only: this provider is over your plan&apos;s limit, or the subscription has ended. You can still see
                everything here.
              </p>
            )}
            <form action={statusAction} className="flex flex-wrap gap-2">
              <fieldset disabled={readOnly} className="contents">
              {ENROLLMENT_STATUSES.map((s) => (
                <button
                  key={s}
                  type="submit"
                  name="status"
                  value={s}
                  aria-pressed={s === status}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    s === status ? ACTIVE_STATUS[s] : "border-ink-200 bg-white text-ink-700 hover:border-ink-500"
                  }`}
                >
                  {ENROLLMENT_STATUS_LABELS[s]}
                </button>
              ))}
              </fieldset>
            </form>
            <p className="mt-2 text-xs text-ink-500">Every change is saved to the history below with your name and the time.</p>
            {missing.length > 0 && ["not_started", "denied"].includes(status) && (
              <div className="mt-4 rounded-lg border border-status-expiring/30 bg-status-expiring-bg px-4 py-3 text-sm">
                <p className="font-medium text-ink-900">Before you submit, this provider is missing:</p>
                <p className="mt-0.5 text-ink-700">{missing.map((i) => i.label).join(" · ")}</p>
                <Link href={`/providers/${providerId}`} className="mt-1 inline-block font-medium text-brand-600 hover:underline">
                  Complete the provider&apos;s file →
                </Link>
              </div>
            )}
          </section>

          {!readOnly && (
          <section className="rounded-xl border border-ink-200 bg-ink-50/60 p-5">
            <h3 className="mb-4 text-sm font-semibold text-ink-900">Log a follow-up</h3>
            <FollowUpForm key={`${providerId}.${payerId}`} action={logFollowUp.bind(null, providerId, payerId)} today={todayISO()} proposed={proposedFollowUp()} />
          </section>
          )}

          <section>
            <h3 className="mb-4 text-sm font-semibold text-ink-900">Application details</h3>
            <fieldset disabled={readOnly} className="contents">
            <DetailsForm
              key={`${providerId}.${payerId}:${status}:${(comms ?? []).length}`}
              action={updateEnrollmentDetails.bind(null, providerId, payerId)}
              enrollment={enrollment}
              members={directory}
              ownerEmail={owner?.email ?? user.email}
              payerMonths={payer.revalidation_months}
            />
            </fieldset>
            {enrollment?.revalidation_due_date && (
              <p className="mt-3 text-sm text-ink-700">
                Revalidation due <span className="font-medium">{formatDate(enrollment.revalidation_due_date)}</span>
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-1 text-sm font-semibold text-ink-900">Documents for this application</h3>
            <p className="mb-3 text-xs text-ink-500">Signed contracts, approval letters and anything the payer sent or asked for.</p>
            <div className="-mx-5 rounded-lg">
              <DocumentList documents={enrollmentDocs} readOnly={readOnly} emptyText="Nothing attached to this application yet." />
            </div>
            {readOnly ? null : enrollment ? (
              <div className="mt-3">
                <DocumentUploader key={enrollment.id} providerId={providerId} enrollmentId={enrollment.id} defaultCategory="contract" />
              </div>
            ) : (
              <p className="text-xs text-ink-500">Set a status first, then attach documents here.</p>
            )}
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-ink-900">History</h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-ink-500">Nothing recorded yet.</p>
            ) : (
              <ol className="flex flex-col gap-4 border-l border-ink-200 pl-5">
                {timeline.map((item) =>
                  item.kind === "status" ? (
                    <li key={`s-${item.id}`} className="relative">
                      <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-ink-500" aria-hidden="true" />
                      <p className="text-sm text-ink-900">
                        {item.from_status
                          ? `${ENROLLMENT_STATUS_LABELS[item.from_status]} → ${ENROLLMENT_STATUS_LABELS[item.to_status]}`
                          : item.to_status === "not_started"
                            ? "Enrollment opened"
                            : `Opened as ${ENROLLMENT_STATUS_LABELS[item.to_status]}`}
                      </p>
                      <p className="text-xs text-ink-500">
                        {item.changed_by ? emailOf(item.changed_by) : "System"} · {when(item.created_at)}
                      </p>
                    </li>
                  ) : (
                    <li key={`c-${item.id}`} className="relative">
                      <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-600" aria-hidden="true" />
                      <p className="text-sm font-medium text-ink-900">
                        {CHANNEL_LABELS[item.channel]} · {formatDate(item.contact_date)}
                        {item.contact_person && ` · ${item.contact_person}`}
                      </p>
                      {item.reference_number && (
                        <p className="text-sm text-ink-700">
                          Ref. <span className="font-mono">{item.reference_number}</span>
                        </p>
                      )}
                      {item.outcome && <p className="text-sm text-ink-700">{item.outcome}</p>}
                      {item.requested && <p className="text-sm text-status-expiring">They asked for: {item.requested}</p>}
                      <div className="flex items-center gap-3 text-xs text-ink-500">
                        <span>
                          {item.created_by ? emailOf(item.created_by) : "—"} · {when(item.created_at)}
                        </span>
                        <details>
                          <summary className="cursor-pointer list-none hover:text-ink-900 [&::-webkit-details-marker]:hidden">Delete</summary>
                          <form action={deleteCommunication.bind(null, item.id)} className="mt-1">
                            <button type="submit" className="font-medium text-status-expired hover:underline">
                              Yes, delete this entry
                            </button>
                          </form>
                        </details>
                      </div>
                    </li>
                  )
                )}
              </ol>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
