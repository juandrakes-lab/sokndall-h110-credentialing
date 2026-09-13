import Link from "next/link";
import { CREDENTIAL_IMPORT_FIELDS } from "@/lib/imports";
import { PageHeader } from "@/components/app/ui";
import ImportWizard from "@/components/ImportWizard";
import { importCredentials } from "../actions";

export default function ImportCredentialsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader
        eyebrow={<Link href="/import-export" className="hover:text-ink-900">← Import / Export</Link>}
        title="Import credentials"
        description="Each row is matched to a provider by NPI, or by first and last name. Types: state license, DEA, malpractice, board certification, CAQH."
      />
      <ImportWizard
        targetFields={CREDENTIAL_IMPORT_FIELDS}
        onImport={importCredentials}
        doneHref="/dashboard"
        doneLabel="See the dashboard"
        templateHref="/export/template-credentials"
      />
    </div>
  );
}
