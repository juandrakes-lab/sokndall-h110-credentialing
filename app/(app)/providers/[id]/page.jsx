import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CREDENTIAL_TYPE_LABELS, CREDENTIAL_TYPES, STATUS_STYLES } from "@/lib/credentials";
import {
  updateProvider,
  deleteProvider,
  createCredential,
  deleteCredential,
} from "../actions";

export default async function ProviderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!provider) notFound();

  const { data: credentials } = await supabase
    .from("credentials")
    .select("*")
    .eq("provider_id", id)
    .order("expiration_date", { ascending: true, nullsFirst: false });

  const updateProviderWithId = updateProvider.bind(null, id);
  const deleteProviderWithId = deleteProvider.bind(null, id);
  const createCredentialWithId = createCredential.bind(null, id);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link href="/providers" className="text-sm text-brand-600 hover:underline">
          ← Back to providers
        </Link>
      </div>

      <section className="rounded-lg border border-ink-200 bg-white p-5">
        <h1 className="mb-4 text-xl font-semibold text-ink-900">
          {provider.first_name} {provider.last_name}
        </h1>

        <form action={updateProviderWithId} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="first_name"
              defaultValue={provider.first_name}
              required
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
            <input
              name="last_name"
              defaultValue={provider.last_name}
              required
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="npi"
              defaultValue={provider.npi ?? ""}
              placeholder="NPI"
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
            <input
              name="caqh_id"
              defaultValue={provider.caqh_id ?? ""}
              placeholder="CAQH ID"
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="specialty"
              defaultValue={provider.specialty ?? ""}
              placeholder="Specialty"
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
            <input
              name="email"
              type="email"
              defaultValue={provider.email ?? ""}
              placeholder="Email"
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
          </div>
          <select
            name="status"
            defaultValue={provider.status}
            className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <textarea
            name="notes"
            defaultValue={provider.notes ?? ""}
            placeholder="Notes"
            rows={3}
            className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Save changes
            </button>
          </div>
        </form>

        <form action={deleteProviderWithId} className="mt-3">
          <button type="submit" className="text-sm text-status-expired hover:underline">
            Delete provider
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink-900">Credentials</h2>

        <div className="mb-6 overflow-hidden rounded-lg border border-ink-200 bg-white">
          {!credentials || credentials.length === 0 ? (
            <p className="p-4 text-sm text-ink-500">No credentials yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-100 text-ink-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Identifier</th>
                  <th className="px-4 py-2 font-medium">State</th>
                  <th className="px-4 py-2 font-medium">Issued</th>
                  <th className="px-4 py-2 font-medium">Expires</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {credentials.map((c) => {
                  const deleteCredentialWithId = deleteCredential.bind(null, id, c.id);
                  return (
                    <tr key={c.id}>
                      <td className="px-4 py-2">{CREDENTIAL_TYPE_LABELS[c.type]}</td>
                      <td className="px-4 py-2 text-ink-500">{c.identifier ?? "—"}</td>
                      <td className="px-4 py-2 text-ink-500">{c.state ?? "—"}</td>
                      <td className="px-4 py-2 text-ink-500">{c.issue_date ?? "—"}</td>
                      <td className="px-4 py-2 text-ink-500">{c.expiration_date ?? "—"}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <form action={deleteCredentialWithId}>
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
          )}
        </div>

        <div className="rounded-lg border border-ink-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">Add credential</h3>
          <form action={createCredentialWithId} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <select
              name="type"
              required
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            >
              {CREDENTIAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {CREDENTIAL_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            <input
              name="identifier"
              placeholder="Identifier / license #"
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
            <input
              name="state"
              placeholder="State"
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
            <label className="flex flex-col gap-1 text-xs text-ink-500">
              Issue date
              <input
                name="issue_date"
                type="date"
                className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink-500">
              Expiration date
              <input
                name="expiration_date"
                type="date"
                className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
              />
            </label>
            <input
              name="notes"
              placeholder="Notes"
              className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
            />
            <button
              type="submit"
              className="col-span-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 sm:col-span-3"
            >
              Add credential
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
