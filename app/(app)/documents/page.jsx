import { getAppContext } from "@/lib/org";
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_KEYS, formatBytes } from "@/lib/documents";
import { PAYER_SELECT, resolvePayer } from "@/lib/enrollments";
import { PLANS } from "@/lib/plans";
import { Card, CardHeader, ICONS, PageHeader, StatCard, StatRow, buttonClass, inputClass } from "@/components/app/ui";
import Disclosure from "@/components/app/Disclosure";
import DocumentList from "@/components/app/DocumentList";
import DocumentUploader from "@/components/app/DocumentUploader";
import SubmitButton from "@/components/app/SubmitButton";

// Every provider document in one place (alcance §3.8), searchable by name and
// filterable by provider and kind, with the plan's storage use on top.
export default async function DocumentsPage({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const provider = typeof sp.provider === "string" ? sp.provider : "";
  const category = DOCUMENT_CATEGORIES[sp.category] ? sp.category : "";

  const { supabase, org } = await getAppContext();

  let query = supabase
    .from("cred_documents")
    .select(`*, provider:cred_providers(first_name, last_name), cred_enrollments(cred_payers_org(${PAYER_SELECT}))`)
    .order("created_at", { ascending: false });
  if (q) query = query.ilike("file_name", `%${q.replace(/[%_]/g, "")}%`);
  if (provider) query = query.eq("provider_id", provider);
  if (category) query = query.eq("category", category);

  const [{ data: rows }, { data: providers }, { data: used }, { count: allDocuments }] = await Promise.all([
    query,
    supabase.from("cred_providers").select("id, first_name, last_name").order("last_name"),
    supabase.rpc("cred_storage_used_bytes", { p_org_id: org.id }),
    supabase.from("cred_documents").select("id", { count: "exact", head: true }),
  ]);

  const documents = (rows ?? []).map((d) => ({
    ...d,
    payerName: d.cred_enrollments?.cred_payers_org ? resolvePayer(d.cred_enrollments.cred_payers_org).name : null,
  }));
  const limit = org.storage_limit_mb * 1024 * 1024;
  const share = Math.min(1, (used ?? 0) / limit);
  const filtered = Boolean(q || provider || category);
  const exportQs = new URLSearchParams(Object.entries({ q, provider, category }).filter(([, v]) => v)).toString();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Documents"
        description="Every provider document, attached to its provider or application. Provider paperwork only — never anything with patient information."
        actions={
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
          <a href={`/export/documents${exportQs ? `?${exportQs}` : ""}`} className={buttonClass("secondary")}>
            Export CSV
          </a>
        }
      />

      <StatRow>
        <StatCard label="Documents on file" value={allDocuments ?? 0} icon={ICONS.documents} hint="Across every provider of this client." />
        <StatCard
          label="Storage used"
          value={formatBytes(used ?? 0)}
          suffix={`of ${PLANS[org.plan].storageLabel}`}
          icon={ICONS.shield}
          tone={share > 0.9 ? "red" : "brand"}
          meter={share}
          hint="Up to 10 MB per file."
        />
      </StatRow>

      <Disclosure label="Upload a document" title="Upload a document" icon={ICONS.upload} variant="primary" className="self-start" defaultOpen={sp.upload === "1"}>
        <DocumentUploader providers={providers ?? []} compact />
      </Disclosure>

      <Card className="overflow-hidden">
        <CardHeader
          title="All documents"
          icon={ICONS.documents}
          description={filtered ? "Filtered." : "Newest first."}
          actions={
            <form className="flex flex-col gap-2 sm:flex-row" action="/documents">
              <label className="sr-only" htmlFor="doc-q">
                Search by file name
              </label>
              <input id="doc-q" name="q" type="search" defaultValue={q} placeholder="Search by file name" className={`${inputClass} sm:w-52`} />
              <label className="sr-only" htmlFor="doc-p">
                Provider
              </label>
              <select id="doc-p" name="provider" defaultValue={provider} className={`${inputClass} sm:w-44`}>
                <option value="">All providers</option>
                {(providers ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.last_name}, {p.first_name}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="doc-c">
                Kind
              </label>
              <select id="doc-c" name="category" defaultValue={category} className={`${inputClass} sm:w-44`}>
                <option value="">All kinds</option>
                {DOCUMENT_CATEGORY_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {DOCUMENT_CATEGORIES[key]}
                  </option>
                ))}
              </select>
              <SubmitButton className={buttonClass("secondary")}>Search</SubmitButton>
            </form>
          }
        />
        <DocumentList
          documents={documents}
          showProvider
          emptyText={filtered ? "No document matches." : "No documents yet. Upload one above, or from a provider's page."}
        />
      </Card>
    </div>
  );
}
