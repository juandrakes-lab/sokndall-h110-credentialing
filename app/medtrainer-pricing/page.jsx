import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import { SourcedPricingDisclosure, PurchaseModelCompare, GoodFitSection } from "@/components/neo/ComparisonBits";
import * as data from "./data";

// `/medtrainer-pricing` — page 12 of the v3.1 map, on EditorialTemplate
// variant="comparison". Body in the copy's order: disclosure → purchase model
// → who MedTrainer is right for; then the template's fixed tail.
const ROUTE = "/medtrainer-pricing";

export const metadata = editorialMetadata(ROUTE, data);

export default function MedTrainerPricingPage() {
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
