import Link from "next/link";
import { forbidden } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { addClient } from "@/lib/client-actions";
import { accountAccess } from "@/lib/billing";
import { Card, PageHeader } from "@/components/app/ui";
import PracticeForm from "@/components/app/PracticeForm";
import ReadOnlyNotice from "@/components/app/ReadOnlyNotice";

export const metadata = { title: "Add client — Sokndall" };

// Billing Co: each client is a practice you credential for, set up exactly like
// the first one at onboarding.
export default async function NewClientPage() {
  const { org, role, multiClient } = await getAppContext();
  if (!multiClient || role !== "owner") forbidden();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={
          <Link href="/clients" className="hover:text-ink-900">
            ← Clients
          </Link>
        }
        title="Add client"
        description="The client's practice: legal name, group NPI, TIN and addresses — what every payer application asks for. Enter the group NPI first and check it; Sokndall fills in the rest from the NPI Registry."
      />
      {accountAccess(org).writable ? (
        <Card className="px-5 py-6 sm:px-8">
          <PracticeForm action={addClient} submitLabel="Add client" />
        </Card>
      ) : (
        <ReadOnlyNotice text={accountAccess(org).message} owner />
      )}
    </div>
  );
}
