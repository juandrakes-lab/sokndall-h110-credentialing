import Link from "next/link";
import { getAppContext, providerCount } from "@/lib/org";
import { practiceServiceAddress } from "@/lib/consistency";
import { Card, PageHeader } from "@/components/app/ui";
import LimitNotice from "@/components/app/LimitNotice";
import { createProvider } from "../actions";
import ProviderForm from "../ProviderForm";

export default async function NewProviderPage() {
  const { supabase, org, practice } = await getAppContext();
  const used = await providerCount(supabase, org.id);
  const atLimit = used >= org.provider_limit;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <PageHeader
        eyebrow={
          <Link href="/providers" className="hover:text-ink-900">
            ← Providers
          </Link>
        }
        title="New provider"
        description={`${used} of ${org.provider_limit} providers on your plan are in use.`}
      />

      {atLimit ? (
        <LimitNotice org={org} />
      ) : (
        <Card className="px-5 py-6 sm:px-8">
          <ProviderForm
            action={createProvider}
            practiceAddress={practiceServiceAddress(practice)}
            limitNotice={<LimitNotice org={org} />}
            submitLabel="Create provider"
            cancelHref="/providers"
          />
        </Card>
      )}
    </div>
  );
}
