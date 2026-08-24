import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/org";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const org = await getCurrentOrg();
    redirect(org ? "/dashboard" : "/onboarding");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-semibold text-ink-900">
        Credentialing and enrollment tracking, without the sales call.
      </h1>
      <p className="max-w-xl text-ink-500">
        Track provider credentials and payer enrollments in one place. No PHI,
        no implementation project — just sign up and load your roster.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-md bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
        >
          Get started
        </Link>
        <Link
          href="/pricing"
          className="rounded-md border border-ink-200 px-5 py-2.5 font-medium text-ink-700 hover:bg-ink-50"
        >
          See pricing
        </Link>
      </div>
    </main>
  );
}
