// /symplr-pricing — content for the competitor-pricing template shared by
// this page, /modio-health-pricing and /medtrainer-pricing. Section order is
// fixed by the copy source across all three: public pricing info → what the
// competitor does well → who it's right for → questions worth asking either
// way → Sokndall's price → FAQ.

export const KNOWN = [
  "symplr does not list prices for symplr Provider or any other module on its site. Pricing is quoted after a demo request, and terms are typically annual, negotiated per organization by module count, seat count and scope.",
  "There is no reliable published figure to cite here, from symplr or from independent sources — and that absence is the actual finding. A category where the entry price cannot be known without a sales conversation is a category built around a sales conversation.",
  "That is not unusual for enterprise software sold to health systems, and it is not necessarily a red flag on its own. Products in this category are configured per customer — which modules, how many seats, what integrations — closer to how a hospital buys an EHR than how a small practice buys a subscription. The sales cycle that comes with that is a real cost, separate from whatever number ends up on the contract: expect a discovery call, a follow-up scoping call, a proposal, and in many organizations, a procurement or legal review before signature. Budget weeks to months for that process, not days.",
];

export const STRENGTHS = [
  "symplr Provider handles credentialing, privileging, enrollment and committee workflow. Alongside it are workforce management, contract management, learning, vendor credentialing, directory and payer-side products. Organizations buy several and integrate them.",
  "That is a coherent product for a health system with a credentialing committee, delegated authority, and departments that need to share provider data. It is a lot of machinery for a practice with nine providers and one person handling this.",
];

// Rewritten and expanded — this used to be two sentences summarizing who
// symplr fits. It's now the page's most detailed section: each requirement
// gets defined and distinguished from what a small practice actually has,
// so "this is not for you" reads as demonstrated, not asserted.
export const FIT = [
  "A credentialing committee is not a formality — it is a standing group, often physicians and administrators, that meets on a schedule to review and vote on each provider's file before they can practice or bill. If your organization runs one, or is required to by an accrediting body, you need software built around that workflow: routing files for review, tracking votes, keeping minutes tied to each provider's record. That is what symplr Provider is for.",
  "Privileging is a related but separate need. It means maintaining delineated lists of specific procedures each provider is approved to perform, routed to department chairs for sign-off — a surgeon's privilege list looks nothing like a therapist's, and both have to be tracked, renewed, and auditable. A practice that credentials providers to bill payers does not have this need at all; a hospital does, structurally, regardless of size.",
  "Delegated credentialing is a formal arrangement where a payer allows an organization to credential providers on the payer's behalf, subject to regular audit. It exists almost exclusively at the health-system or large-group level, because payers only delegate to organizations that can pass that audit repeatedly.",
  "And if provider data has to flow automatically into an EHR, a claims system, and a public-facing directory at once, that is an integration requirement most small practices do not have — those three systems either do not exist separately in a nine-provider practice, or someone updates them by hand without much friction.",
  "If any of that describes your organization, this page will not change your mind, and it should not. The rest of it is for the much larger group of practices and billing companies for whom none of it applies yet.",
];

// New section, between Fit and Price: the same five questions apply whether
// the reader ends up on symplr, on Sokndall, or somewhere else — the point
// is that an enterprise sales call does not always surface them unprompted.
export const QUESTIONS = [
  "Whether you end up on symplr, on Sokndall, or on something else entirely, these are the questions that actually separate a good fit from a bad one, and enterprise sales calls do not always surface them unprompted.",
  "How many organizations your size are current customers, not just how many customers overall — a platform built for a five-hospital system can technically onboard a nine-provider practice, but the support experience and the product defaults are usually tuned for the larger customer.",
  "What implementation actually involves — data migration from your current system, staff training, and a realistic go-live date, not the fastest one they can promise.",
  "What happens to your data and your workflow if you cancel. Can you export everything, in what format, and how long does that take.",
  "Whether the quoted price includes support, or whether support tiers are a separate line item you find out about later.",
  "And specifically for a growing practice: what changes about the price or the contract if you add five providers next year. Enterprise contracts are often locked to a seat count or module scope set at signing, and changing it mid-contract is not always simple.",
];

export const PRICE_INTRO =
  "The honest comparison is not against enterprise credentialing software — that category includes privileging and committee workflow this does not do. It is against paying someone to keep your credentials current: outsourced maintenance runs $600 to $2,400 per provider per year in published industry estimates, or roughly $50 to $200 a month per provider. Sokndall tracks the same dates and applications without a person on the other end doing the work, which is the whole reason it costs less.";

export const FAQ_ITEMS = [
  {
    q: "Why doesn't symplr publish pricing?",
    a: "Enterprise software is usually priced per organization, by module and seat count. That is a normal model, and the trade-off is that you cannot compare without a call.",
  },
  {
    q: "Is Sokndall a replacement for symplr?",
    a: "For a health system, no. For a practice under fifty providers that needs dates and application statuses tracked, it covers that scope at a published price.",
  },
  {
    q: "Can I try Sokndall without talking to sales?",
    a: "Yes. That is the whole difference.",
  },
  {
    q: "How long does an enterprise credentialing sales cycle usually take?",
    a: "Expect weeks to months from first call to signed contract, not days — discovery, scoping, proposal, and often a procurement review sit between the demo and go-live.",
  },
  {
    q: "Does symplr work for a small practice at all?",
    a: "The product technically can. Whether it is worth the scope and cost depends entirely on whether you need committee workflow, privileging, or delegated credentialing — see the section above.",
  },
  {
    q: "What if my needs grow into what symplr offers?",
    a: "Nothing about starting with a simpler tracker locks you out of moving to enterprise software later. The data you build up — provider records, credential history — is yours to export.",
  },
];
