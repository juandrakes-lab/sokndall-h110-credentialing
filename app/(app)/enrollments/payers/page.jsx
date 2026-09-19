import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { PAYER_SELECT, PAYER_TYPE_LABELS, resolvePayer, sortPayers } from "@/lib/enrollments";
import { Badge, Card, CardHeader, PageHeader, buttonClass } from "@/components/app/ui";
import { addCatalogPayers, addOwnPayer, removePayer } from "../actions";
import { CatalogPicker, OwnPayerForm } from "./PayerPickers";
import SubmitButton from "@/components/app/SubmitButton";

export default async function PayersPage() {
  const { supabase, client, clients } = await getAppContext();

  const [{ data: payerRows }, { data: catalog }, { data: enrollments }] = await Promise.all([
    supabase.from("cred_payers_org").select(PAYER_SELECT),
    supabase.from("cred_payers_global").select("id, name, payer_type, state, revalidation_months").order("name"),
    supabase.from("cred_enrollments").select("payer_id"),
  ]);

  const payers = sortPayers((payerRows ?? []).map(resolvePayer));
  const inUse = new Map();
  for (const e of enrollments ?? []) inUse.set(e.payer_id, (inUse.get(e.payer_id) ?? 0) + 1);
  const added = new Set((payerRows ?? []).map((r) => r.payer_global_id).filter(Boolean));
  const available = (catalog ?? []).filter((p) => !added.has(p.id));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={<Link href="/enrollments" className="hover:text-ink-900">← Enrollments</Link>}
        title={clients.length > 1 ? `Payers · ${client.name}` : "Your payers"}
        description={
          clients.length > 1
            ? "The insurers and programs this client's providers enroll with. Each one is a column in this client's matrix — other clients keep their own list."
            : "The insurers and programs you enroll providers with. Each one is a column in the matrix."
        }
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader title="Add from our list" description={`${(catalog ?? []).length} U.S. payers with their usual revalidation cycle.`} />
          <div className="px-5 py-5">
            <CatalogPicker action={addCatalogPayers} catalog={available} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Add your own payer" description="A regional plan or anything not on our list." />
          <div className="px-5 py-5">
            <OwnPayerForm action={addOwnPayer} catalogNames={available.map((p) => p.name)} ownNames={payers.map((p) => p.name)} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title={`On your list · ${payers.length}`} />
        {payers.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-500">No payers yet — pick them above.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {payers.map((p) => {
              const count = inUse.get(p.id) ?? 0;
              return (
                <li key={p.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                    <p className="text-xs text-ink-500">
                      {PAYER_TYPE_LABELS[p.payer_type]} · revalidates every {p.revalidation_months} months
                      {!p.fromCatalog && " · your own payer"}
                    </p>
                  </div>
                  {count > 0 ? (
                    <span className="flex items-center gap-2" title="A payer with applications can't be removed — their history would go with it.">
                      <Badge tone="neutral">
                        {count} application{count > 1 ? "s" : ""}
                      </Badge>
                    </span>
                  ) : (
                    <form action={removePayer.bind(null, p.id)}>
                      <SubmitButton className={buttonClass("ghost", "sm")}>
                        Remove
                      </SubmitButton>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
