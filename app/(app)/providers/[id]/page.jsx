import Link from "next/link";
import { notFound } from "next/navigation";
import { canReach, getAppContext } from "@/lib/org";
import { practiceServiceAddress, providerIssues } from "@/lib/consistency";
import { Badge, Card, CardHeader, PageHeader, buttonClass } from "@/components/app/ui";
import DataCheck from "@/components/app/DataCheck";
import ChecklistCard from "@/components/app/ChecklistCard";
import DocumentList from "@/components/app/DocumentList";
import DocumentUploader from "@/components/app/DocumentUploader";
import { checklistFor } from "@/lib/checklist";
import { PAYER_SELECT, resolvePayer } from "@/lib/enrollments";
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

export default async function ProviderPage({ params }) {
  const { id } = await params;
  const { supabase, org, role, practice } = await getAppContext();

  const [{ data: provider }, { data: credentials }, { data: siblings }, { data: docRows }, { data: members }, { data: writable }] = await Promise.all([
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
  const sorted = [...(credentials ?? [])].sort(
    (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type)
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={
          <Link href="/providers" className="hover:text-ink-900">
            ← Providers
          </Link>
        }
        title={`${provider.first_name} ${provider.last_name}`}
        description={[provider.specialty, provider.npi && `NPI ${provider.npi}`].filter(Boolean).join(" · ") || null}
        actions={
          <>
            {provider.status === "inactive" && <Badge tone="neutral">Inactive</Badge>}
            {readOnly && <Badge tone="amber">Read-only</Badge>}
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

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <Card>
            <CardHeader
              title="Credentials"
              description="Status is worked out from each expiration date — never set by hand."
            />
            {sorted.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-500">
                No credentials yet. Add the provider&apos;s license, DEA, malpractice policy, board
                certification and CAQH attestation below.
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
                    members={(members ?? []).filter((m) => canReach(m, provider.client_org_id))}
                    readOnly={readOnly}
                  />
                ))}
              </ul>
            )}
            {!readOnly && (
              <div className="border-t border-ink-100 bg-ink-50/60 px-5 py-5">
                <h3 className="mb-4 text-sm font-semibold text-ink-900">Add a credential</h3>
                <CredentialForm
                  action={createCredential.bind(null, id)}
                  caqhIntervalDays={org.caqh_reattestation_interval_days}
                    lastName={provider.last_name}
                    registryLicenses={registryLicenses}
                  members={(members ?? []).filter((m) => canReach(m, provider.client_org_id))}
                  submitLabel="Add credential"
                />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Documents" description="License copies, certificates, W-9, CV — attached to this provider." />
            <DocumentList documents={documents} readOnly={readOnly} emptyText="No documents yet. Upload the license, W-9, malpractice certificate and CV below." />
            {!readOnly && (
              <div className="border-t border-ink-100 bg-ink-50/60 px-5 py-5">
                <h3 className="mb-4 text-sm font-semibold text-ink-900">Upload a document</h3>
                <DocumentUploader providerId={id} defaultCategory={checklist.find((i) => !i.done && ["license", "w9", "malpractice", "cv"].includes(i.key))?.key ?? "license"} />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Profile" />
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
        </div>

        <div className="flex flex-col gap-8">
          <ChecklistCard items={checklist} />

          <DataCheck
            issues={issues}
            checkedAt={provider.nppes_checked_at}
            recheckAction={provider.npi && !readOnly ? recheckProviderNppes.bind(null, id) : null}
            subject="this provider"
          />

          {!accountEnded && (
          <Card className="px-5 py-4">
            <details>
              <summary className="cursor-pointer text-sm font-medium text-ink-700">Delete this provider</summary>
              <p className="mt-3 text-sm text-ink-500">
                This removes {provider.first_name} {provider.last_name} with all of their credentials, enrollments and documents. It can&apos;t be
                undone. If they just left the practice, mark them Inactive instead.
              </p>
              <form action={deleteProvider.bind(null, id)} className="mt-3">
                <SubmitButton className={buttonClass("danger", "sm")}>
                  Delete permanently
                </SubmitButton>
              </form>
            </details>
          </Card>
          )}
        </div>
      </div>
    </div>
  );
}
