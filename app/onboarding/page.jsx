import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/org";
import { createOrganization } from "./actions";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const org = await getCurrentOrg();
  if (org) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Name your organization</h1>
        <p className="mt-1 text-sm text-ink-500">
          This is your practice or billing company. You can invite teammates later.
        </p>
      </div>

      <form action={createOrganization} className="flex flex-col gap-3">
        <input
          name="name"
          required
          placeholder="e.g. Riverside Family Medicine"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Create organization
        </button>
      </form>
    </main>
  );
}
