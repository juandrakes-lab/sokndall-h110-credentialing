import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import * as data from "./data";

// `/caqh-reattestation` — page 7 of the v3.1 map, on EditorialTemplate.
// Rebuilt on the v3.1 copy; content in ./data.js.
const ROUTE = "/caqh-reattestation";

export const metadata = editorialMetadata(ROUTE, data);

export default function CaqhReattestationPage() {
  return <EditorialPage route={ROUTE} data={data} />;
}
