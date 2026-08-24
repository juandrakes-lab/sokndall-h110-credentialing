import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const supabase = await createClient();

  const { data: payers, error } = await supabase
    .from("payers")
    .select("name, payer_type")
    .order("name");

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const headers = ["name", "payer_type"];
  const csv = toCsv(
    headers,
    (payers ?? []).map((p) => headers.map((h) => p[h]))
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="payers.csv"',
    },
  });
}
