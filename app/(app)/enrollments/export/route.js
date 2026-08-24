import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const supabase = await createClient();

  const [{ data: providers, error: providersError }, { data: payers, error: payersError }] =
    await Promise.all([
      supabase.from("providers").select("id, first_name, last_name").order("last_name"),
      supabase.from("payers").select("id, name").order("name"),
    ]);

  if (providersError || payersError) {
    return new Response((providersError ?? payersError).message, { status: 500 });
  }

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("provider_id, payer_id, status");

  if (enrollmentsError) {
    return new Response(enrollmentsError.message, { status: 500 });
  }

  const statusByCell = {};
  for (const e of enrollments ?? []) {
    statusByCell[`${e.provider_id}:${e.payer_id}`] = e.status;
  }

  const headers = ["provider", ...(payers ?? []).map((p) => p.name)];
  const rows = (providers ?? []).map((provider) => [
    `${provider.first_name} ${provider.last_name}`,
    ...(payers ?? []).map((payer) => statusByCell[`${provider.id}:${payer.id}`] ?? "not_started"),
  ]);

  const csv = toCsv(headers, rows);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="enrollments.csv"',
    },
  });
}
