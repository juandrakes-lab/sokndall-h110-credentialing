import Link from "next/link";

export const metadata = { title: "Demo ended — Sokndall", robots: { index: false, follow: false } };

const COPY = {
  unopened: "This demo link wasn't opened within 7 days, so it has expired.",
  deleted: "This demo ended and its sample data has been deleted.",
  unknown: "This demo link isn't valid any more.",
  error: "We couldn't open this demo right now. Try the link again in a minute.",
};

// Where an ended, revoked or broken demo link lands.
export default async function DemoEnded({ searchParams }) {
  const { why } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center app-ground app-type px-5">
      <div className="max-w-md text-center">
        <p className="text-lg font-semibold tracking-tight text-brand-700">Sokndall</p>
        <h1 className="mt-6 text-xl font-semibold text-ink-900">This demo isn&apos;t available</h1>
        <p className="mt-2 text-sm text-ink-500">{COPY[why] ?? COPY.unknown}</p>
        <p className="mt-2 text-sm text-ink-500">
          Reply to whoever sent you the link if you&apos;d like another look, or start a trial with your own data.
        </p>
        <Link href="/signup" className="mt-6 inline-block rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
          Start a 14-day trial
        </Link>
      </div>
    </main>
  );
}
