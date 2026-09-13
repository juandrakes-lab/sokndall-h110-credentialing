import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BUCKET } from "@/lib/documents";

// Opens a document: RLS decides whether the row is visible, Storage policies
// whether the file is, and the link handed out expires in 60 seconds.
export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("cred_documents")
    .select("storage_path, file_name")
    .eq("id", id)
    .maybeSingle();
  if (!doc) return new NextResponse("Not found", { status: 404 });

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(doc.storage_path, 60);
  if (error || !data?.signedUrl) return new NextResponse("Not found", { status: 404 });

  return NextResponse.redirect(data.signedUrl);
}
