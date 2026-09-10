import EditorialPage, { editorialMetadata } from "@/components/neo/EditorialPage";
import { MultiVendorComparison } from "@/components/neo/ComparisonBits";
import { EditorialSection, renderSections } from "@/components/neo/editorialRender";
import * as data from "./data";

// `/best-credentialing-software` — page 3 of the v3.1 map, on
// EditorialTemplate variant="comparison". The category table is its one
// MultiVendorComparison; the copy gives that section a contents entry
// ("What the five products cost") and no H2, so it is the anchor target
// without a heading of its own.
const ROUTE = "/best-credentialing-software";

export const metadata = editorialMetadata(ROUTE, data);

export default function BestCredentialingSoftwarePage() {
  return (
    <EditorialPage route={ROUTE} data={data} variant="comparison">
      <EditorialSection section={data.WHY} />
      <MultiVendorComparison
        id={data.TABLE.id}
        vendors={data.TABLE.vendors}
        criteria={data.TABLE.criteria}
        caption={data.TABLE.caption}
        sources={data.TABLE.sources}
      />
      {renderSections(data.SECTIONS_AFTER_TABLE)}
    </EditorialPage>
  );
}
