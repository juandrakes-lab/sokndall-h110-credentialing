import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProvidersPage() {
  const supabase = await createClient();

  const { data: providers, error } = await supabase
    .from("providers")
    .select("id, first_name, last_name, npi, specialty, email, status")
    .order("last_name", { ascending: true });

  if (error) {
    return <p className="text-status-expired">Failed to load providers: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-900">Providers</h1>
        <div className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page */}
          <a
            href="/providers/export"
            className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Export CSV
          </a>
          <Link
            href="/providers/import"
            className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Import CSV
          </Link>
          <Link
            href="/providers/new"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            New provider
          </Link>
        </div>
      </div>

      {providers.length === 0 ? (
        <p className="text-sm text-ink-500">
          No providers yet. Add one manually or import a CSV.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-100 text-ink-500">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">NPI</th>
                <th className="px-4 py-2 font-medium">Specialty</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50">
                  <td className="px-4 py-2">
                    <Link href={`/providers/${p.id}`} className="font-medium text-brand-600 hover:underline">
                      {p.first_name} {p.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-ink-500">{p.npi ?? "—"}</td>
                  <td className="px-4 py-2 text-ink-500">{p.specialty ?? "—"}</td>
                  <td className="px-4 py-2 text-ink-500">{p.email ?? "—"}</td>
                  <td className="px-4 py-2 text-ink-500">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
