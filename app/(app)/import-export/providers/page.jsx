import Link from "next/link";
import { getAppContext, providerCount } from "@/lib/org";
import { PROVIDER_IMPORT_FIELDS } from "@/lib/imports";
import { PageHeader } from "@/components/app/ui";
import ImportWizard from "@/components/ImportWizard";
import LimitNotice from "@/components/app/LimitNotice";
import { importProviders } from "../actions";

export default async function ImportProvidersPage() {
  const { supabase, org } = await getAppContext();
  const used = await providerCount(supabase, org.id);
  const room = Math.max(0, org.provider_limit - used);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader
        eyebrow={<Link href="/import-export" className="hover:text-ink-900">← Import / Export</Link>}
        title="Import providers"
        description={`Your plan has room for ${room} more provider${room === 1 ? "" : "s"}. Rows beyond that are listed, not imported.`}
      />
      {room === 0 ? (
        <LimitNotice org={org} />
      ) : (
        <ImportWizard
          targetFields={PROVIDER_IMPORT_FIELDS}
          onImport={importProviders}
          doneHref="/providers"
          doneLabel="See providers"
          templateHref="/export/template-providers"
        />
      )}
    </div>
  );
}
