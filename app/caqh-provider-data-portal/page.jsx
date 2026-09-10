import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import * as data from "./data";

// `/caqh-provider-data-portal` — page 8 of the v3.1 map, on EditorialTemplate.
// The rebrand and the CAQH-number lookup family; content in ./data.js.
const ROUTE = "/caqh-provider-data-portal";

export const metadata = editorialMetadata(ROUTE, data);

export default function CaqhProviderDataPortalPage() {
  return <EditorialPage route={ROUTE} data={data} />;
}
