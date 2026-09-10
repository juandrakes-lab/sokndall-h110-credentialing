/**
 * Every external source the marketing copy cites, in one registry.
 *
 * A page never writes an external URL by hand: it cites `[text](src:key)` in its
 * copy (see `rich.jsx`) or passes `SOURCES.key` to a component. Two reasons:
 *
 *   1. `rel` is decided once per source. on-page-seo.md §7: competitors and
 *      directories of competitor reviews take `nofollow`; official sources
 *      (CMS, payers, state agencies) do not. The copy files mark which is
 *      which, and this is where that marking lives.
 *   2. Some copy names a source by its domain only and never gave the document
 *      URL. Those entries carry `pending: true` and point at the publisher's
 *      root, so the citation is visible and attributable today and the exact
 *      document is a one-line change here later. Nothing is invented: every
 *      domain below is the one the copy names. The build report lists them.
 */
const SOURCES = {
  /* ---- official: CMS, payers, state agencies — follow ---- */
  cmsRevalidation: {
    label: "CMS",
    href: "https://www.hhs.gov/guidance/document/provider-enrollment-and-certification-revalidations-renewing-your-enrollment-0",
  },
  cmsPecos: {
    label: "CMS PECOS",
    href: "https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/chain-ownership-system-pecos",
  },
  carelonJoin: {
    label: "Carelon Behavioral Health",
    href: "https://www.carelonbehavioralhealth.com/providers/join-our-network",
  },
  carelonContact: {
    label: "Carelon Behavioral Health",
    href: "https://www.carelonbehavioralhealth.com/",
    pending: true,
  },
  marylandCaqh: {
    label: "Maryland Department of Health",
    href: "https://health.maryland.gov/",
    pending: true,
  },
  evernorth: {
    label: "Evernorth behavioral provider resource library",
    href: "https://chk.static.evernorth.com/",
    pending: true,
  },
  umrOptum: {
    label: "UMR, UnitedHealthcare",
    href: "https://www.umr.com/",
    pending: true,
  },
  optumSanDiego: {
    label: "Optum San Diego",
    href: "https://www.optumsandiego.com/",
    pending: true,
  },
  bcbsNebraska: {
    label: "BCBS Nebraska",
    href: "https://www.nebraskablue.com/",
    pending: true,
  },
  dataspring: {
    label: "DataSpring",
    href: "https://www.dataspring.com/blog",
  },

  /* ---- independent third parties — follow ---- */
  clinicalDocsAetna: {
    label: "Clinical Docs Library",
    href: "https://clinicaldocslibrary.com/insurance-billing/credentialing-with-aetna/",
  },
  behaveHealth: {
    label: "BehaveHealth",
    href: "https://www.behavehealth.com/",
    pending: true,
  },
  contractingProviders: {
    label: "Contracting Providers",
    href: "https://contractingproviders.com/",
    pending: true,
  },
  rcmgen: {
    label: "RCMGen",
    href: "https://rcmgen.com/",
    pending: true,
  },
  hireGaynell: {
    label: "HireGaynell",
    href: "https://hiregaynell.com/",
    pending: true,
  },

  /* ---- services and software vendors: competitors — nofollow ---- */
  medicotech: {
    label: "Medicotech",
    href: "https://medicotechllc.com/physician-credentialing-cost/",
    nofollow: true,
  },
  medwave: {
    label: "Medwave",
    href: "https://medwave.io/2026/03/how-much-does-medical-credentialing-cost/",
    nofollow: true,
  },
  zedtreeo: {
    label: "Zedtreeo",
    href: "https://zedtreeo.com/blog/medical-credentialing-outsourcing",
    nofollow: true,
  },
  homrcm: {
    label: "HOM RCM",
    href: "https://homrcm.com/blogs/provider-credentialing-and-enrollment-guide",
    nofollow: true,
  },
  assured: {
    label: "Assured",
    href: "https://www.withassured.com/blog/how-long-does-provider-credentialing-take",
    nofollow: true,
  },
  credyapp: {
    label: "CredyApp",
    href: "https://credyapp.com/BlogItem/medicare-pecos-revalidation-2026-how-to-avoid-billing-deactivation/",
    nofollow: true,
  },
  medsoleMedicare: {
    label: "MedSole",
    href: "https://medsolercm.com/blog/medicare-provider-enrollment-2026-guide",
    nofollow: true,
  },
  medsole: {
    label: "MedSole",
    href: "https://medsolercm.com/",
    nofollow: true,
    pending: true,
  },
  drCredentialing: {
    label: "DrCredentialing",
    href: "https://www.drcredentialing.com/",
    nofollow: true,
    pending: true,
  },
  medtrainerBlog: {
    label: "MedTrainer blog",
    href: "https://medtrainer.com/blog/average-cost-to-credential-a-physician-provider-2/",
    nofollow: true,
  },
  medtrainerProduct: {
    label: "MedTrainer product FAQ",
    href: "https://medtrainer.com/products/credentialing/",
    nofollow: true,
  },
  symplrProvider: {
    label: "symplr Provider product page",
    href: "https://www.symplr.com/products/symplr-provider",
    nofollow: true,
  },
  modio: {
    label: "modiohealth.com",
    href: "https://www.modiohealth.com/",
    nofollow: true,
  },

  /* ---- review directories of competitors — nofollow ---- */
  capterraSymplr: {
    label: "Capterra, symplr Provider",
    href: "https://www.capterra.com/p/151924/symplr-provider/",
    nofollow: true,
  },
  capterraSymplrPayer: {
    label: "Capterra, symplr Payer",
    href: "https://www.capterra.com/p/241150/symplr-payer/",
    nofollow: true,
  },
  capterraMedtrainer: {
    label: "Capterra, MedTrainer",
    href: "https://www.capterra.com/p/176583/MedTrainer/",
    nofollow: true,
  },
  capterraModio: {
    label: "Capterra, Modio Health",
    href: "https://www.capterra.com/p/158338/Modio-Health/reviews/",
    nofollow: true,
  },
  g2Modio: {
    label: "G2, Modio Health",
    href: "https://www.g2.com/products/modio-health/reviews",
    nofollow: true,
  },
  capterraCredentialStream: {
    label: "Capterra, CredentialStream",
    href: "https://www.capterra.com/p/172448/CredentialStream/",
    nofollow: true,
  },
  g2Category: {
    label: "G2 category ranking",
    href: "https://www.g2.com/categories/health-care-credentialing",
    nofollow: true,
  },
};

export default SOURCES;
