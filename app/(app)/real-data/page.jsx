import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { Card, PageHeader } from "@/components/app/ui";
import RealDataForm from "./RealDataForm";

export const metadata = { title: "Load your real data — Sokndall" };

// A demo's way out: the normal 14-day trial, and we do the import.
export default async function RealDataPage() {
  const { org } = await getAppContext();
  if (!org?.demo) redirect("/dashboard");
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <PageHeader
        title="Load your real data"
        description="Start the 14-day trial with your own account and send us your spreadsheet as it is, in any format. We do the import for you. Nothing from this demo is copied over."
      />
      <Card>
        <div className="px-5 py-6">
          <RealDataForm email={org.demo.contact_email ?? ""} />
        </div>
      </Card>
    </div>
  );
}
