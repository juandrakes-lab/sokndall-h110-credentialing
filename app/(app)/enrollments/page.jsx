import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusCell from "./StatusCell";
import MatrixFilters from "./MatrixFilters";

export default async function EnrollmentsPage({ searchParams }) {
  const { payer: payerFilter, status: statusFilter } = await searchParams;
  const supabase = await createClient();

  const [{ data: providers, error: providersError }, { data: allPayers, error: payersError }] =
    await Promise.all([
      supabase.from("providers").select("id, first_name, last_name").order("last_name"),
      supabase.from("payers").select("id, name, payer_type").order("name"),
    ]);

  if (providersError || payersError) {
    return (
      <p className="text-status-expired">
        Failed to load matrix: {providersError?.message ?? payersError?.message}
      </p>
    );
  }

  const payers = payerFilter ? allPayers.filter((p) => p.id === payerFilter) : allPayers;

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("provider_id, payer_id, status");

  if (enrollmentsError) {
    return <p className="text-status-expired">Failed to load matrix: {enrollmentsError.message}</p>;
  }

  const statusByCell = {};
  for (const e of enrollments ?? []) {
    statusByCell[`${e.provider_id}:${e.payer_id}`] = e.status;
  }

  const visibleProviders = statusFilter
    ? providers.filter((p) =>
        payers.some((payer) => (statusByCell[`${p.id}:${payer.id}`] ?? "not_started") === statusFilter)
      )
    : providers;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Enrollments</h1>
          <p className="mt-1 text-sm text-ink-500">
            Click a status chip to update it. Every change is logged automatically.
          </p>
        </div>
        <div className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page */}
          <a
            href="/enrollments/export"
            className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Export CSV
          </a>
          <Link
            href="/payers/new"
            className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Add payer
          </Link>
        </div>
      </div>

      <MatrixFilters payers={allPayers} />

      {providers.length === 0 || allPayers.length === 0 ? (
        <p className="text-sm text-ink-500">
          Add at least one provider and one payer to see the matrix.
        </p>
      ) : (
        <div className="overflow-auto rounded-lg border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-100 text-ink-500">
              <tr>
                <th className="sticky left-0 z-10 bg-ink-100 px-4 py-2 font-medium">Provider</th>
                {payers.map((payer) => (
                  <th key={payer.id} className="min-w-[160px] px-4 py-2 font-medium">
                    {payer.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {visibleProviders.map((provider) => (
                <tr key={provider.id}>
                  <td className="sticky left-0 z-10 bg-white px-4 py-2 font-medium text-ink-900">
                    <Link href={`/providers/${provider.id}`} className="hover:text-brand-600">
                      {provider.first_name} {provider.last_name}
                    </Link>
                  </td>
                  {payers.map((payer) => (
                    <td key={payer.id} className="px-4 py-2">
                      <StatusCell
                        providerId={provider.id}
                        payerId={payer.id}
                        status={statusByCell[`${provider.id}:${payer.id}`] ?? "not_started"}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
