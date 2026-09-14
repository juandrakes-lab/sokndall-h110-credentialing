import { getAppContext } from "@/lib/org";
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_KEYS, formatBytes } from "@/lib/documents";
import { PAYER_SELECT, resolvePayer } from "@/lib/enrollments";
import { PLANS } from "@/lib/plans";
import { Card, CardHeader, PageHeader, buttonClass, inputClass } from "@/components/app/ui";
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

  const [{ data: rows }, { data: providers }, { data: used }] = await Promise.all([
    query,
    supabase.from("cred_providers").select("id, first_name, last_name").order("last_name"),
    supabase.rpc("cred_storage_used_bytes", { p_org_id: org.id }),
  ]);

  const documents = (rows ?? []).map((d) => ({
    ...d,
    payerName: d.cred_enrollments?.cred_payers_org ? resolvePayer(d.cred_enrollments.cred_payers_org).name : null,
  }));
  const limit = org.storage_limit_mb * 1024 * 1024;
  const share = Math.min(100, ((used ?? 0) / limit) * 100);
  const filtered = Boolean(q || provider || category);
  const exportQs = new URLSearchParams(Object.entries({ q, provider, category }).filter(([, v]) => v)).toString();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Documents"
        description="Every provider document, attached to its provider or application."
        actions={
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
          <a href={`/export/documents${exportQs ? `?${exportQs}` : ""}`} className={buttonClass("secondary")}>
            Export CSV
          </a>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <form className="flex flex-col gap-3 border-b border-ink-100 px-5 py-4 sm:flex-row" action="/documents">
            <label className="sr-only" htmlFor="doc-q">Search by file name</label>
            <input id="doc-q" name="q" type="search" defaultValue={q} placeholder="Search by file name" className={inputClass} />
            <label className="sr-only" htmlFor="doc-p">Provider</label>
            <select id="doc-p" name="provider" defaultValue={provider} className={`${inputClass} sm:w-48`}>
              <option value="">All providers</option>
              {(providers ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.last_name}, {p.first_name}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="doc-c">Kind</label>
            <select id="doc-c" name="category" defaultValue={category} className={`${inputClass} sm:w-48`}>
              <option value="">All kinds</option>
              {DOCUMENT_CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {DOCUMENT_CATEGORIES[key]}
                </option>
              ))}
            </select>
            <SubmitButton className={buttonClass("secondary")}>
              Search
            </SubmitButton>
          </form>
          <DocumentList
            documents={documents}
            showProvider
            emptyText={filtered ? "No document matches." : "No documents yet. Upload one on the right, or from a provider's page."}
          />
        </Card>

        <div className="flex flex-col gap-8">
          <Card className="px-5 py-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink-900">Storage</span>
              <span className="text-ink-500">
                {formatBytes(used ?? 0)} of {PLANS[org.plan].storageLabel}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
              <div
                className={`h-full rounded-full ${share > 90 ? "bg-status-expired" : "bg-brand-600"}`}
                style={{ width: `${Math.max(share, used ? 1 : 0)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-500">Up to 10 MB per file.</p>
          </Card>

          <Card>
            <CardHeader title="Upload" />
            <div className="px-5 py-5">
              <DocumentUploader providers={providers ?? []} compact />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
