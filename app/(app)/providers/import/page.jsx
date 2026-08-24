import ImportWizard from "@/components/ImportWizard";
import { PROVIDER_IMPORT_FIELDS } from "@/lib/providers";
import { importProviders } from "../actions";

export default function ImportProvidersPage() {
  return (
    <ImportWizard
      title="Import providers from CSV"
      description="Upload a CSV exported from Excel or Sheets, map its columns, and preview before importing."
      targetFields={PROVIDER_IMPORT_FIELDS}
      onImport={importProviders}
      doneHref="/providers"
      doneLabel="Back to providers"
    />
  );
}
