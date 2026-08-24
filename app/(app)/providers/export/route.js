import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const supabase = await createClient();

  const { data: providers, error } = await supabase
    .from("providers")
    .select("first_name, last_name, npi, caqh_id, specialty, email, status, notes")
    .order("last_name");

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const headers = ["first_name", "last_name", "npi", "caqh_id", "specialty", "email", "status", "notes"];
  const csv = toCsv(
    headers,
    (providers ?? []).map((p) => headers.map((h) => p[h]))
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="providers.csv"',
    },
  });
}
