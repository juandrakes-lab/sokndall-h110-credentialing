import Link from "next/link";
import { createProvider } from "../actions";

export default function NewProviderPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink-900">New provider</h1>

      <form action={createProvider} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            name="first_name"
            required
            placeholder="First name"
            className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
          />
          <input
            name="last_name"
            required
            placeholder="Last name"
            className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
          />
        </div>
        <input
          name="npi"
          placeholder="NPI"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
        />
        <input
          name="caqh_id"
          placeholder="CAQH ID"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
        />
        <input
          name="specialty"
          placeholder="Specialty"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
        />
        <textarea
          name="notes"
          placeholder="Notes"
          rows={3}
          className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Create provider
          </button>
          <Link
            href="/providers"
            className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
