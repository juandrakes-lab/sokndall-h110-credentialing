import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PAYER_TYPES, PAYER_TYPE_LABELS } from "@/lib/enrollments";
import { updatePayer, deletePayer } from "../actions";

export default async function PayerDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: payer } = await supabase
    .from("payers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!payer) notFound();

  const updatePayerWithId = updatePayer.bind(null, id);
  const deletePayerWithId = deletePayer.bind(null, id);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Link href="/payers" className="text-sm text-brand-600 hover:underline">
        ← Back to payers
      </Link>

      <section className="rounded-lg border border-ink-200 bg-white p-5">
        <h1 className="mb-4 text-xl font-semibold text-ink-900">{payer.name}</h1>

        <form action={updatePayerWithId} className="flex flex-col gap-3">
          <input
            name="name"
            defaultValue={payer.name}
            required
            className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
          />
          <select
            name="payer_type"
            defaultValue={payer.payer_type}
            required
            className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
          >
            {PAYER_TYPES.map((type) => (
              <option key={type} value={type}>
                {PAYER_TYPE_LABELS[type]}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Save changes
          </button>
        </form>

        <form action={deletePayerWithId} className="mt-3">
          <button type="submit" className="text-sm text-status-expired hover:underline">
            Delete payer
          </button>
        </form>
      </section>
    </div>
  );
}
