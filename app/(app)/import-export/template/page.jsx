import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { Card, CardHeader, ICONS, PageHeader } from "@/components/app/ui";
import TemplateImportForm from "./TemplateImportForm";

// The free Sokndall template, uploaded as is (D4): all four tabs in one .xlsx.
export default async function ImportTemplatePage() {
  const { client, multiClient } = await getAppContext();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        eyebrow={<Link href="/import-export" className="hover:text-ink-900">← Import / Export</Link>}
        title="Import the Sokndall template"
        description="Providers, credentials, CAQH and payer enrollment, from the free spreadsheet, without editing it first."
      />
      <Card>
        <CardHeader
          icon={ICONS.importExport}
          title={multiClient && client ? `Importing into ${client.name}` : "Upload the file"}
          description="In Google Sheets: File › Download › Microsoft Excel (.xlsx). If you downloaded the Excel file from our email, upload that."
        />
        <TemplateImportForm />
      </Card>
    </div>
  );
}
