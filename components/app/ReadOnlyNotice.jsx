import Link from "next/link";

// Why something can't be edited, and the way out (alcance §4.5).
export default function ReadOnlyNotice({ text, owner }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-status-expiring/30 bg-status-expiring-bg px-5 py-4 text-sm text-ink-900 sm:flex-row sm:items-center sm:justify-between">
      <p>{text}</p>
      {owner ? (
        <Link href="/settings?tab=billing" className="shrink-0 font-medium text-brand-600 hover:underline">
          Plans and billing →
        </Link>
      ) : (
        <span className="shrink-0 text-ink-500">The account owner can change the plan.</span>
      )}
    </div>
  );
}
