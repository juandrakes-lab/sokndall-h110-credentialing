import { createClient } from "@/lib/supabase/server";
import { AuthShell } from "@/components/app/AuthParts";
import { formatGeneratedAt } from "@/lib/reports";
import { scannerConfigured } from "@/lib/malware";
import UploadForm from "./UploadForm";

export const metadata = { title: "Upload your documents — Sokndall", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// The page a provider opens from an upload link (pedido 2026-10-19,
// función 2). No account. It shows who the link is for and lets them send
// files; it never shows or lists anything already stored.
export default async function UploadPage({ params }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data: rows } = await supabase.rpc("cred_upload_link_info", { p_token: token });
  const link = rows?.[0];

  if (!link) {
    return (
      <AuthShell panel={false} title="This upload link no longer works" subtitle="It has expired or was turned off. Ask the office that sent it for a new one." />
    );
  }

  return (
    <AuthShell
      panel={false}
      title={`Upload your documents, ${link.provider_first_name}`}
      subtitle={`${link.client_name} asked you for your credentialing documents. Your files go straight to their credentialing team for review.`}
    >
      <div className="mt-8 flex flex-col gap-4">
        {scannerConfigured() ? <UploadForm token={token} /> : <p className="text-sm text-ink-700">Uploads through links aren&apos;t switched on yet.</p>}
        <p className="text-xs text-ink-500">
          Only credentialing paperwork: licenses, DEA, malpractice certificate, board certification, W-9, CV, signed contracts. Never
          patient records. Nobody asks for your date of birth or ID numbers here. This link works until {formatGeneratedAt(link.expires_at)}.
        </p>
      </div>
    </AuthShell>
  );
}
