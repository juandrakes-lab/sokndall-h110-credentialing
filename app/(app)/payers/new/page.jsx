import Link from "next/link";
import { PAYER_TYPES, PAYER_TYPE_LABELS } from "@/lib/enrollments";
import { createPayer } from "../actions";

export default function NewPayerPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink-900">New payer</h1>

      <form action={createPayer} className="flex flex-col gap-3">
        <input
          name="name"
          required
          placeholder="Payer name"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
        />
        <select
          name="payer_type"
          required
          defaultValue="commercial"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
        >
          {PAYER_TYPES.map((type) => (
            <option key={type} value={type}>
              {PAYER_TYPE_LABELS[type]}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Create payer
          </button>
          <Link
            href="/payers"
            className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
