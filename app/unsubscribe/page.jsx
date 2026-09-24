import Link from "next/link";
import { redirect } from "next/navigation";
import { unsubscribe } from "@/lib/template-lead-actions";
import { buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

export const metadata = {
  title: "Unsubscribe | Sokndall",
  robots: { index: false, follow: false },
};

// The link at the foot of the template email. It asks for one click rather
// than unsubscribing on open, because mail scanners open links on their own
// and would unsubscribe people who never clicked. Mail clients' own
// "Unsubscribe" button posts to /api/unsubscribe and needs no page at all.
export default async function UnsubscribePage({ searchParams }) {
  const { t: token, done } = await searchParams;

  async function confirm() {
    "use server";
    const ok = await unsubscribe(token);
    redirect(`/unsubscribe?done=${ok ? "1" : "0"}`);
  }

  const body =
    done === "1" ? (
      <>
        <h1 className="text-2xl font-semibold text-ink-900">You&apos;re unsubscribed</h1>
        <p className="mt-2 text-sm text-ink-500">We won&apos;t email this address about the template again.</p>
      </>
    ) : done === "0" || !token ? (
      <>
        <h1 className="text-2xl font-semibold text-ink-900">That link didn&apos;t work</h1>
        <p className="mt-2 text-sm text-ink-500">
          It may be incomplete. Reply to the email you received and we&apos;ll take the address off by hand.
        </p>
      </>
    ) : (
      <>
        <h1 className="text-2xl font-semibold text-ink-900">Unsubscribe</h1>
        <p className="mt-2 text-sm text-ink-500">Stop all emails about the credentialing template to this address.</p>
        <form action={confirm} className="mt-5">
          <SubmitButton className={buttonClass("primary")}>Unsubscribe</SubmitButton>
        </form>
      </>
    );

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-ink-200 bg-white p-6">
        {body}
        <p className="mt-6 text-sm">
          <Link href="/" className="text-ink-500 underline">
            sokndall.com
          </Link>
        </p>
      </div>
    </main>
  );
}
