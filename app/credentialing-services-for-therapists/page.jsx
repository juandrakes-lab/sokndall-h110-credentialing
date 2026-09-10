import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import * as data from "./data";

// `/credentialing-services-for-therapists` — page 15 of the v3.1 map, on
// EditorialTemplate. Under a 90-day measurement gate (see ./data.js).
const ROUTE = "/credentialing-services-for-therapists";

export const metadata = editorialMetadata(ROUTE, data);

export default function CredentialingServicesForTherapistsPage() {
  return <EditorialPage route={ROUTE} data={data} />;
}
