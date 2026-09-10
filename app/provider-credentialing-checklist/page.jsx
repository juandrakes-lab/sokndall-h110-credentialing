import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import * as data from "./data";

// `/provider-credentialing-checklist` — page 10 of the v3.1 map, on
// EditorialTemplate. The checklist renders as DocumentChecklist; content in
// ./data.js.
const ROUTE = "/provider-credentialing-checklist";

export const metadata = editorialMetadata(ROUTE, data);

export default function ProviderCredentialingChecklistPage() {
  return <EditorialPage route={ROUTE} data={data} />;
}
