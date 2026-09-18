import Link from "next/link";
import { notFound } from "next/navigation";
import { canReach, getAppContext } from "@/lib/org";
import { practiceServiceAddress, providerIssues } from "@/lib/consistency";
import { daysUntil, formatDate } from "@/lib/credentials";
import {
  Badge,
  Card,
  CardHeader,
  ICONS,
  Icon,
  PageHeader,
  Ring,
  Tabs,
  buttonClass,
} from "@/components/app/ui";
import Disclosure from "@/components/app/Disclosure";
import DataCheck from "@/components/app/DataCheck";
import ChecklistCard from "@/components/app/ChecklistCard";
import DocumentList from "@/components/app/DocumentList";
import DocumentUploader from "@/components/app/DocumentUploader";
import { checklistFor } from "@/lib/checklist";
import { ENROLLMENT_STATUS_LABELS, ENROLLMENT_STATUS_TONES, PAYER_SELECT, cellKey, resolvePayer, sortPayers } from "@/lib/enrollments";
import { accountAccess } from "@/lib/billing";
import ReadOnlyNotice from "@/components/app/ReadOnlyNotice";
import {
  createCredential,
  deleteCredential,
  deleteProvider,
  recheckProviderNppes,
  updateCredential,
  updateProvider,
} from "../actions";
import ProviderForm from "../ProviderForm";
import CredentialForm from "./CredentialForm";
import CredentialItem from "./CredentialItem";
import SubmitButton from "@/components/app/SubmitButton";

const TYPE_ORDER = ["state_license", "dea", "malpractice", "board_cert", "caqh_attestation"];
const TAB_KEYS = ["credentials", "applications", "documents", "profile"];

export default async function ProviderPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const tab = TAB_KEYS.includes(sp?.tab) ? sp.tab : "credentials";
  const { supabase, org, role, practice } = await getAppContext();

  const [
    { data: provider },
    { data: credentials },
    { data: siblings },
    { data: docRows },
    { data: members },
    { data: writable },
    { data: payerRows },
    { data: enrollments },
  ] = await Promise.all([
    supabase.from("cred_providers").select("*").eq("id", id).maybeSingle(),
    supabase.from("cred_credentials").select("*").eq("provider_id", id).order("expiration_date", { ascending: true, nullsFirst: false }),
    supabase.from("cred_providers").select("id, first_name, last_name, npi"),
    supabase
      .from("cred_documents")
      .select(`*, cred_enrollments(cred_payers_org(${PAYER_SELECT}))`)
      .eq("provider_id", id)
      .order("created_at", { ascending: false }),
    supabase.rpc("cred_org_directory"),
    // Same rule the database enforces on every write (plan limit, subscription).
    supabase.rpc("cred_provider_writable", { p_provider_id: id }),
    supabase.from("cred_payers_org").select(PAYER_SELECT),
    supabase.from("cred_enrollments").select("id, payer_id, status, next_follow_up_date, submitted_date, effective_date").eq("provider_id", id),
  ]);

  if (!provider) notFound();
  // Licenses the provider declared in the NPI Registry, one per state.
  const registryLicenses = (provider?.nppes_data?.record?.taxonomies ?? [provider?.nppes_data?.record?.taxonomy].filter(Boolean)).filter((t) => t?.state && t?.license);
  const readOnly = writable === false;
  const accountEnded = !accountAccess(org).writable;

  const issues = providerIssues(provider, practice, siblings ?? []);
  const documents = (docRows ?? []).map((d) => ({
    ...d,
    payerName: d.cred_enrollments?.cred_payers_org ? resolvePayer(d.cred_enrollments.cred_payers_org).name : null,
  }));
  const checklist = checklistFor(provider, credentials ?? [], documents);
  const ready = checklist.filter((i) => i.done).length;
  const sorted = [...(credentials ?? [])].sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));
  const reachable = (members ?? []).filter((m) => canReach(m, provider.client_org_id));

  const payers = sortPayers((payerRows ?? []).map(resolvePayer));
  const byPayer = new Map((enrollments ?? []).map((e) => [e.payer_id, e]));
  const approved = (enrollments ?? []).filter((e) => e.status === "approved").length;
  const inFlight = (enrollments ?? []).filter((e) => ["submitted", "in_review", "info_requested"].includes(e.status)).length;

  const dated = (credentials ?? []).filter((c) => c.expiration_date).map((c) => daysUntil(c.expiration_date));
  const expired = dated.filter((d) => d < 0).length;
  const soon = dated.filter((d) => d >= 0 && d <= 30).length;

  const tabHref = (key) => (key === "credentials" ? `/providers/${id}` : `/providers/${id}?tab=${key}`);
  const tabs = [
    { key: "credentials", label: "Credentials", href: tabHref("credentials"), count: (credentials ?? []).length },
    { key: "applications", label: "Applications", href: tabHref("applications"), count: (enrollments ?? []).length },
    { key: "documents", label: "Documents", href: tabHref("documents"), count: documents.length },
    { key: "profile", label: "Profile", href: tabHref("profile") },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={
          <Link href="/providers" className="inline-flex items-center gap-1.5 hover:text-brand-600">
            <Icon d={ICONS.arrowRight} className="h-4 w-4 rotate-180" /> Providers
          </Link>
        }
        title={`${provider.first_name} ${provider.last_name}`}
        description={[provider.specialty, provider.npi && `NPI ${provider.npi}`, provider.caqh_id && `CAQH ${provider.caqh_id}`].filter(Boolean).join(" · ") || null}
        actions={
          <>
            {provider.status === "inactive" && <Badge tone="neutral">Inactive</Badge>}
            {readOnly && <Badge tone="amber">Read-only</Badge>}
            <Link href="/enrollments" className={buttonClass("secondary")}>
              Open the matrix
            </Link>
          </>
        }
      />

      {readOnly && (
        <ReadOnlyNotice
          owner={role === "owner"}
          text={
            accountEnded
              ? "Your subscription has ended, so this provider is read-only. You can still view and export everything."
              : `Your plan covers ${org.provider_limit} providers and this one was added after the first ${org.provider_limit}, so it's read-only. Delete providers you no longer need, or upgrade — nothing is deleted for you.`
          }
        />
      )}

      {/* Who this is, and where they stand — before any form. */}
      <Card className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:gap-8">
        <dl className="grid min-w-0 grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          {[
            ["NPI", provider.npi || "Not on file"],
            ["CAQH ID", provider.caqh_id || "Not on file"],
            ["Email", provider.email || "—"],
            ["Phone", provider.phone ? provider.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") : "—"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-xs text-ink-500">{label}</dt>
              <dd className="truncate font-medium text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-1 flex-wrap items-center gap-6 sm:justify-end">
          <div className="flex items-center gap-3">
            <Ring value={checklist.length ? ready / checklist.length : 0} size={64} tone={ready === checklist.length ? "green" : "amber"}>
              <span className="text-sm font-semibold tabular-nums text-ink-900">
                {ready}/{checklist.length}
              </span>
            </Ring>
            <div>
              <p className="text-sm font-semibold text-ink-900">Ready to enroll</p>
              <p className="text-xs text-ink-500">{ready === checklist.length ? "Everything payers ask for" : "Payers ask for all six"}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xl font-semibold leading-none tabular-nums text-ink-900">{(credentials ?? []).length}</p>
              <p className="mt-1 text-xs text-ink-700">Credentials</p>
              {(expired > 0 || soon > 0) && (
                <p className={`text-xs font-medium ${expired ? "text-status-expired" : "text-status-expiring"}`}>
                  {expired ? `${expired} expired` : `${soon} due ≤30 days`}
                </p>
              )}
            </div>
            <div>
              <p className="text-xl font-semibold leading-none tabular-nums text-ink-900">{approved}</p>
              <p className="mt-1 text-xs text-ink-700">Approved</p>
              {inFlight > 0 && <p className="text-xs text-ink-500">{inFlight} in flight</p>}
            </div>
            <div>
              <p className="text-xl font-semibold leading-none tabular-nums text-ink-900">{documents.length}</p>
              <p className="mt-1 text-xs text-ink-700">Documents</p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs} active={tab} Link={Link} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {tab === "credentials" && (
            <>
              {!readOnly && (
                <Disclosure label="Add a credential" title="Add a credential" className="self-start">
                  <CredentialForm
                    action={createCredential.bind(null, id)}
                    caqhIntervalDays={org.caqh_reattestation_interval_days}
                    lastName={provider.last_name}
                    registryLicenses={registryLicenses}
                    members={reachable}
                    submitLabel="Add credential"
                  />
                </Disclosure>
              )}
              <Card>
                <CardHeader
                  title="Credentials"
                  icon={ICONS.shield}
                  description="Status is worked out from each expiration date — never set by hand."
                />
                {sorted.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-ink-500">
                    No credentials yet. Add the provider&apos;s license, DEA, malpractice policy, board certification and CAQH attestation.
                  </p>
                ) : (
                  <ul className="divide-y divide-ink-100">
                    {sorted.map((c) => (
                      <CredentialItem
                        key={c.id}
                        credential={c}
                        updateAction={updateCredential.bind(null, c.id, id)}
                        deleteAction={deleteCredential.bind(null, c.id, id)}
                        caqhIntervalDays={org.caqh_reattestation_interval_days}
                        lastName={provider.last_name}
                        registryLicenses={registryLicenses}
                        members={reachable}
                        readOnly={readOnly}
                      />
                    ))}
                  </ul>
                )}
              </Card>
            </>
          )}

          {tab === "applications" && (
            <Card>
              <CardHeader
                title="Applications"
                icon={ICONS.enrollments}
                description="One row per payer on your list. Open one to change its status or log a call."
              />
              {payers.length === 0 ? (
                <p className="px-5 py-6 text-sm text-ink-500">
                  No payers on your list yet.{" "}
                  <Link href="/enrollments/payers" className="font-medium text-brand-600 hover:underline">
                    Choose the payers you work with
                  </Link>
                  .
                </p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {payers.map((payer) => {
                    const e = byPayer.get(payer.id);
                    const status = e?.status ?? "not_started";
                    return (
                      <li key={payer.id}>
                        <Link
                          href={`/enrollments?open=${cellKey(id, payer.id)}`}
                          className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-ink-50/70 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-ink-900">{payer.name}</p>
                            <p className="text-xs text-ink-700">
                              {e?.effective_date
                                ? `Effective ${formatDate(e.effective_date)}`
                                : e?.submitted_date
                                  ? `Submitted ${formatDate(e.submitted_date)}`
                                  : "Not started"}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            {e?.next_follow_up_date && <span className="text-xs text-ink-500">Follow up {formatDate(e.next_follow_up_date)}</span>}
                            <Badge tone={ENROLLMENT_STATUS_TONES[status]}>{ENROLLMENT_STATUS_LABELS[status]}</Badge>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          )}

          {tab === "documents" && (
            <>
              {!readOnly && (
                <Disclosure label="Upload a document" title="Upload a document" icon={ICONS.upload} className="self-start">
                  <DocumentUploader
                    providerId={id}
                    defaultCategory={checklist.find((i) => !i.done && ["license", "w9", "malpractice", "cv"].includes(i.key))?.key ?? "license"}
                  />
                </Disclosure>
              )}
              <Card>
                <CardHeader title="Documents" icon={ICONS.documents} description="License copies, certificates, W-9, CV — attached to this provider." />
                <DocumentList documents={documents} readOnly={readOnly} emptyText="No documents yet. Upload the license, W-9, malpractice certificate and CV." />
              </Card>
            </>
          )}

          {tab === "profile" && (
            <>
              <Card>
                <CardHeader title="Profile" icon={ICONS.user} description="Identity, specialty and contact details, as payers will read them." />
                <div className="px-5 py-5">
                  <ProviderForm
                    readOnly={readOnly}
                    action={updateProvider.bind(null, id)}
                    initial={Object.fromEntries(Object.entries(provider).map(([k, v]) => [k, v ?? ""]))}
                    registry={provider.nppes_data?.status === "found" ? provider.nppes_data.record : null}
                    practiceAddress={practiceServiceAddress(practice)}
                    submitLabel="Save changes"
                    editing
                  />
                </div>
              </Card>

              {!accountEnded && (
                <Card className="px-5 py-5">
                  <h3 className="text-[0.9375rem] font-semibold text-ink-900">Delete this provider</h3>
                  <p className="mt-1.5 text-sm text-ink-700">
                    This removes {provider.first_name} {provider.last_name} with all of their credentials, enrollments and documents. It can&apos;t be
                    undone. If they just left the practice, mark them Inactive instead.
                  </p>
                  <form action={deleteProvider.bind(null, id)} className="mt-4">
                    <SubmitButton className={buttonClass("danger", "sm")}>Delete permanently</SubmitButton>
                  </form>
                </Card>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <ChecklistCard items={checklist} />

          <DataCheck
            issues={issues}
            checkedAt={provider.nppes_checked_at}
            recheckAction={provider.npi && !readOnly ? recheckProviderNppes.bind(null, id) : null}
            subject="this provider"
          />
        </div>
      </div>
    </div>
  );
}
