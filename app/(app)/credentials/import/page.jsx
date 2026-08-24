import ImportWizard from "@/components/ImportWizard";
import { CREDENTIAL_IMPORT_FIELDS } from "@/lib/credentials";
import { importCredentials } from "../actions";

export default function ImportCredentialsPage() {
  return (
    <ImportWizard
      title="Import credentials from CSV"
      description="Match each row to an existing provider by NPI or by first/last name, then map the credential columns."
      targetFields={CREDENTIAL_IMPORT_FIELDS}
      onImport={importCredentials}
      doneHref="/dashboard"
      doneLabel="Go to dashboard"
    />
  );
}
