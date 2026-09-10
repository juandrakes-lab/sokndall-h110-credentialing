import Shell from "@/components/neo/Shell";
import EditorialTemplate, { EditorialCta } from "@/components/neo/Editorial";
import { MultiVendorComparison } from "@/components/neo/ComparisonBits";
import { PageHeader } from "@/components/neo/EditorialBits";

export const metadata = {
  title: "MultiVendorComparison — internal",
  description: "Internal component proving ground. Not a public page.",
  robots: { index: false, follow: false },
};

// Proving ground for MultiVendorComparison, which belongs to
// /best-credentialing-software and to no other route.
//
// That page has no approved copy yet, so it is not being shipped here. The
// component is, and it needs somewhere real to be looked at.
//
// Every statement below comes from COMPETIDORES_DATOS.md and from nothing
// else. Where that research found no published figure, the cell says so in
// words. Nothing here is estimated: the document's estimate and [NO OFICIAL]
// markers cover figures that need their basis stated in a sentence, and a
// table cell cannot carry one — those belong in SourcedPricingDisclosure.
//
// Two figures in the research are deliberately absent from this table, for the
// reason the research itself gives: the "$12,500 per user, one-time" figure on
// Capterra is for symplr Payer, a different product on a different unit, and
// the "$5,000 to train new MSPs" figure for CredentialStream is a training fee
// reported by one anonymous reviewer, not a licence price.
//
// /styleguide* is already in the robots DISALLOW list and out of the sitemap;
// the metadata above marks it noindex as well.

const VENDORS = [
  { name: "symplr Provider" },
  { name: "Modio Health" },
  { name: "MedTrainer" },
  { name: "CredentialStream" },
  { name: "Sokndall", self: true },
];

const CRITERIA = [
  {
    label: "Published list price",
    unit: "a figure on the vendor's own site",
    cells: [
      { notPublished: true },
      { notPublished: true },
      { notPublished: true },
      { notPublished: true },
      "$79 / $299 / $699",
    ],
  },
  {
    label: "What the price counts",
    unit: "the quantity the rate multiplies",
    cells: [
      { notPublished: true },
      { notPublished: true },
      "Users and modules",
      { notPublished: true },
      "Providers tracked — 3, 15 or 50 per plan",
    ],
  },
  {
    label: "Billing period",
    unit: "how often the charge repeats",
    cells: [
      { notPublished: true },
      { notPublished: true },
      { notPublished: true },
      { notPublished: true },
      "Monthly",
    ],
  },
  {
    label: "How you get a price",
    unit: "steps before a number appears",
    cells: [
      "Demo request",
      "Demo request",
      "Demo request or a call with sales",
      "Demo request",
      "It is on the pricing page",
    ],
  },
  {
    label: "Vendor-solicited reviews",
    unit: "as the review platform marks them",
    cells: [
      "Yes, on Capterra",
      "Yes on G2; Capterra not checked",
      "Yes, on Capterra",
      "Yes, on Capterra",
      "Not checked in this research",
    ],
  },
  {
    label: "Reviewer organization size",
    unit: "share of reviewers, by size",
    cells: [
      "117 reviews, no size breakdown",
      "29 on Capterra, 2 on G2",
      "77% small; 54% medium on G2",
      "42% enterprise on Capterra",
      "No third-party review base",
    ],
  },
];

const SOURCES = [
  {
    vendor: "symplr Provider",
    label: "symplr.com product page",
    href: "https://www.symplr.com/products/symplr-provider",
  },
  {
    vendor: "symplr Provider",
    label: "Capterra listing",
    href: "https://www.capterra.com/p/151924/symplr-provider/",
  },
  { vendor: "Modio Health", label: "modiohealth.com", href: "https://www.modiohealth.com/" },
  {
    vendor: "Modio Health",
    label: "Capterra reviews",
    href: "https://www.capterra.com/p/158338/Modio-Health/reviews/",
  },
  {
    vendor: "Modio Health",
    label: "G2 reviews",
    href: "https://www.g2.com/products/modio-health/reviews",
  },
  {
    vendor: "MedTrainer",
    label: "medtrainer.com credentialing page",
    href: "https://medtrainer.com/products/credentialing/",
  },
  {
    vendor: "MedTrainer",
    label: "Capterra listing",
    href: "https://www.capterra.com/p/176583/MedTrainer/",
  },
  {
    vendor: "CredentialStream",
    label: "Capterra listing",
    href: "https://www.capterra.com/p/172448/CredentialStream/",
  },
  {
    vendor: "All four",
    label: "G2 Health Care Credentialing category",
    href: "https://www.g2.com/categories/health-care-credentialing",
  },
  { vendor: "Sokndall", label: "This site's pricing page", href: "/pricing" },
];

// The contents list and the FAQ exist because the template requires them, and
// they are written for this page rather than borrowed: it is an internal
// proving ground, so its questions are about the component, not about a
// purchase. The route is noindex and in the robots DISALLOW list, so the
// FAQPage-shaped content here is not competing for anything.
const CONTENTS = [
  { id: "matrix", label: "Four vendors, one set of criteria" },
  { id: "price", label: "The price section" },
  { id: "faq", label: "Questions" },
];

const FAQ_ITEMS = [
  {
    q: "Why does a table cell never sit empty?",
    a: "A blank cell in a comparison table reads as a missing feature, which is a claim nobody made. Passing { notPublished: true } renders the words “Not published”; leaving a cell undefined throws at render.",
  },
  {
    q: "Why is nothing in the table estimated?",
    a: "An estimate needs its basis stated in a sentence, and a table cell cannot carry one. Estimates belong in SourcedPricingDisclosure, where each is marked and carries its basis. The component throws on any cell that is neither a sentence nor the not-published marker.",
  },
  {
    q: "Why are there no logos?",
    a: "A vendor is its name, in text. A table of logos argues by brand recognition rather than by the criteria, and the component has no image prop at all, so the rule cannot be worked around.",
  },
  {
    q: "Where does this page get its facts?",
    a: "From the competitor research document and from nothing else. Two figures in that research are deliberately absent here: a one-time per-user price for a different symplr product, and a training fee reported by a single anonymous reviewer.",
  },
];

export default function MultiVendorComparisonProof() {
  return (
    <Shell>
      <EditorialTemplate
        variant="comparison"
        contents={CONTENTS}
        header={
          <PageHeader
            title="MultiVendorComparison, rendered against the research"
            standfirst="Internal proving ground. The component ships for /best-credentialing-software; that page's copy does not exist yet, so this route renders it against the competitor research, which is the only source any cell below draws on."
            category="Internal"
            date="2026-09-06"
            dateLabel="Checked"
          />
        }
        price={{
          heading: "The price section, which the template renders unconditionally",
          paras: [
            "Included here because it is not a prop: the template renders this section whether or not a page asks for it. A page that quotes what competitors cost and not what we cost is the move this site argues against, so it cannot be omitted by forgetting to pass it.",
          ],
        }}
        faq={FAQ_ITEMS}
        cta={
          <EditorialCta
            body="The CTA is here because the template requires one. A comparison page that sets out its own price and then stops has argued without asking, which is the one shape this template does not allow."
            primary={{ href: "/login", label: "Start 14-day trial" }}
            secondary={{ href: "/pricing", label: "See what is included" }}
          />
        }
      >
        <MultiVendorComparison
          id="matrix"
          heading="Four vendors, one set of criteria"
          lead="Names in text, no logos and no screenshots. Every criterion states the unit it is measured in, because a price per seat and a price per provider tracked are not the same quantity."
          vendors={VENDORS}
          criteria={CRITERIA}
          caption="Checked September 6, 2026. Where a vendor does not publish something the cell says so in words: none of the four publishes a price on its own site, and that absence is the finding rather than a gap in the table. Nothing here is estimated. KLAS scores are behind a login and could not be read, so no KLAS figure appears in any cell. Three details are too long for a cell and belong here instead: MedTrainer states that its pricing is based on utilization and scales with users and modules; the incentivized reviews carry a “Vendor Referred — Incentive Offered” badge on Capterra, and the Modio figure is one of only two reviews it has on G2; symplr’s published customer stories are all hospitals and health systems, which is the only size signal it gives."
          sources={SOURCES}
        />
      </EditorialTemplate>
    </Shell>
  );
}
