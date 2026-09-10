import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import * as data from "./data";

// `/behavioral-health-credentialing` — page 6 of the v3.1 map, on
// EditorialTemplate. One section per payer; content in ./data.js.
const ROUTE = "/behavioral-health-credentialing";

export const metadata = editorialMetadata(ROUTE, data);

export default function BehavioralHealthCredentialingPage() {
  return <EditorialPage route={ROUTE} data={data} />;
}
