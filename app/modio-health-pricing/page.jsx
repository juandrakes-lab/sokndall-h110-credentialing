import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import { SourcedPricingDisclosure, PurchaseModelCompare, GoodFitSection } from "@/components/neo/ComparisonBits";
import * as data from "./data";

// `/modio-health-pricing` — page 14 of the v3.1 map, on EditorialTemplate
// variant="comparison". Same validated structure as its two siblings.
const ROUTE = "/modio-health-pricing";

export const metadata = editorialMetadata(ROUTE, data);

export default function ModioHealthPricingPage() {
  const { DISCLOSURE, PURCHASE, FIT } = data;
  return (
    <EditorialPage route={ROUTE} data={data} variant="comparison">
      <SourcedPricingDisclosure id={DISCLOSURE.id} lead={DISCLOSURE.lead} claims={DISCLOSURE.claims} />
      <PurchaseModelCompare
        id={PURCHASE.id}
        theirs={PURCHASE.theirs}
        theirsFirst
        rows={PURCHASE.rows}
        note={PURCHASE.note}
      />
      <GoodFitSection id={FIT.id} heading={FIT.heading} paras={FIT.paras} />
    </EditorialPage>
  );
}
