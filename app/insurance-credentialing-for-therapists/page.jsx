import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import * as data from "./data";

// `/insurance-credentialing-for-therapists` — page 5 of the v3.1 map, on
// EditorialTemplate. Body, email box, FAQ and close are all in ./data.js.
const ROUTE = "/insurance-credentialing-for-therapists";

export const metadata = editorialMetadata(ROUTE, data);

export default function InsuranceCredentialingForTherapistsPage() {
  return <EditorialPage route={ROUTE} data={data} />;
}
