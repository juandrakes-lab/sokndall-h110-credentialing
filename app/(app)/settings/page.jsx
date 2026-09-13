import { getAppContext, providerCount } from "@/lib/org";
import { practiceIssues } from "@/lib/consistency";
import { PLANS } from "@/lib/plans";
import { recheckPracticeNppes, savePractice } from "@/lib/practice-actions";
import { Card, CardHeader, PageHeader } from "@/components/app/ui";
import DataCheck from "@/components/app/DataCheck";
import PracticeForm from "@/components/app/PracticeForm";
import { updateOrganization } from "./actions";
import OrganizationForm from "./OrganizationForm";

export default async function SettingsPage() {
  const { supabase, org, role, practice } = await getAppContext();
  const used = await providerCount(supabase, org.id);
  const plan = PLANS[org.plan];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" />

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Practice"
            description="Legal name, group NPI, TIN and addresses — what every payer application asks for."
          />
          <div className="px-5 py-6">
            <PracticeForm action={savePractice} practice={practice} submitLabel="Save practice" />
          </div>
        </Card>

        <div className="flex flex-col gap-8">
          <DataCheck
            issues={practiceIssues(practice)}
            checkedAt={practice.nppes_checked_at}
            recheckAction={practice.group_npi ? recheckPracticeNppes : null}
            subject="the practice"
          />

          <Card>
            <CardHeader title="Plan" />
            <dl className="divide-y divide-ink-100 text-sm">
              {[
                ["Plan", `${plan.label} · $${plan.price}/month`],
                ["Providers", `${used} of ${org.provider_limit} in use`],
                ["Users", `${org.user_limit}`],
                ["Document storage", plan.storageLabel],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-ink-500">{label}</dt>
                  <dd className="text-right font-medium text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Account" />
        <div className="px-5 py-6">
          <OrganizationForm action={updateOrganization} org={org} canEdit={role === "owner"} />
        </div>
      </Card>
    </div>
  );
}
