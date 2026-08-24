import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PAYER_TYPE_LABELS } from "@/lib/enrollments";
import { deletePayer } from "./actions";

export default async function PayersPage() {
  const supabase = await createClient();

  const { data: payers, error } = await supabase
    .from("payers")
    .select("id, name, payer_type")
    .order("name", { ascending: true });

  if (error) {
    return <p className="text-status-expired">Failed to load payers: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-900">Payers</h1>
        <Link
          href="/payers/new"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          New payer
        </Link>
      </div>

      {payers.length === 0 ? (
        <p className="text-sm text-ink-500">
          No payers yet. Add the ones your providers enroll with.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-100 text-ink-500">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {payers.map((payer) => {
                const deletePayerWithId = deletePayer.bind(null, payer.id);
                return (
                  <tr key={payer.id} className="hover:bg-ink-50">
                    <td className="px-4 py-2">
                      <Link
                        href={`/payers/${payer.id}`}
                        className="font-medium text-brand-600 hover:underline"
                      >
                        {payer.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-ink-500">{PAYER_TYPE_LABELS[payer.payer_type]}</td>
                    <td className="px-4 py-2 text-right">
                      <form action={deletePayerWithId}>
                        <button type="submit" className="text-status-expired hover:underline">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
