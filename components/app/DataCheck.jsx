import { Card, CardHeader, buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

function timeAgo(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// The consistency panel (alcance §3.9): every mismatch between what's on file
// and the NPI Registry, or between a provider and their practice.
export default function DataCheck({ issues, checkedAt, recheckAction, subject }) {
  const errors = issues.filter((i) => i.severity === "error").length;

  return (
    <Card>
      <CardHeader
        title="Data check"
        description={
          checkedAt
            ? `Compared with the NPI Registry on ${timeAgo(checkedAt)}.`
            : `Name, NPI and address of ${subject}, compared with the NPI Registry.`
        }
        actions={
          recheckAction && (
            <form action={recheckAction}>
              <SubmitButton className={buttonClass("secondary", "sm")}>
                Check again
              </SubmitButton>
            </form>
          )
        }
      />
      {issues.length === 0 ? (
        <p className="flex items-center gap-2 px-5 py-4 text-sm text-status-active">
          <span aria-hidden="true">✓</span> Everything matches the NPI Registry.
        </p>
      ) : (
        <ul className="divide-y divide-ink-100">
          {issues.map((issue) => (
            <li key={issue.title} className="flex gap-3 px-5 py-3">
              <span
                aria-hidden="true"
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  issue.severity === "error" ? "bg-status-expired" : "bg-status-expiring"
                }`}
              />
              <div>
                <p className={`text-sm font-medium ${issue.severity === "error" ? "text-status-expired" : "text-ink-900"}`}>
                  {issue.title}
                </p>
                <p className="text-sm text-ink-500">{issue.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {errors > 0 && (
        <p className="border-t border-ink-100 px-5 py-3 text-xs text-ink-500">
          Payers reject applications when these don&apos;t match. Fix the record here or at NPPES before submitting.
        </p>
      )}
    </Card>
  );
}
