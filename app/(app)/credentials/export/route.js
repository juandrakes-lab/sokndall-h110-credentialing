import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const supabase = await createClient();

  const { data: credentials, error } = await supabase
    .from("credentials")
    .select(
      "type, identifier, state, issue_date, expiration_date, status, notes, providers(first_name, last_name, npi)"
    )
    .order("expiration_date", { ascending: true, nullsFirst: false });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const headers = [
    "provider_first_name",
    "provider_last_name",
    "provider_npi",
    "type",
    "identifier",
    "state",
    "issue_date",
    "expiration_date",
    "status",
    "notes",
  ];
  const csv = toCsv(
    headers,
    (credentials ?? []).map((c) => [
      c.providers?.first_name,
      c.providers?.last_name,
      c.providers?.npi,
      c.type,
      c.identifier,
      c.state,
      c.issue_date,
      c.expiration_date,
      c.status,
      c.notes,
    ])
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="credentials.csv"',
    },
  });
}
