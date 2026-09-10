import { COLOR_TOKENS, TYPE_ROLES, SPACE_STEPS } from "./tokens.reference";
import * as C from "./content";
import { NAV, FOOTER } from "@/components/system/navData";

import SiteHeader from "@/components/system/SiteHeader";
import SiteFooter from "@/components/system/SiteFooter";
import PageHeader from "@/components/system/PageHeader";
import Hero from "@/components/system/Hero";
import TableOfContents from "@/components/system/TableOfContents";

import ProseSection from "@/components/system/ProseSection";
import LabelledContentList from "@/components/system/LabelledContentList";
import NumberedSteps from "@/components/system/NumberedSteps";
import NegationList from "@/components/system/NegationList";
import DocumentChecklist from "@/components/system/DocumentChecklist";
import ErrorList from "@/components/system/ErrorList";

import SourcedFigure from "@/components/system/SourcedFigure";
import PriceAnchorSourced from "@/components/system/PriceAnchorSourced";
import SourcedPricingDisclosure from "@/components/system/SourcedPricingDisclosure";
import GoodFitSection from "@/components/system/GoodFitSection";
import StatedVsObserved from "@/components/system/StatedVsObserved";

import MatrixSchematic from "@/components/system/MatrixSchematic";
import StatusTable from "@/components/system/StatusTable";
import AlertLadder from "@/components/system/AlertLadder";
import FailureDeepDive from "@/components/system/FailureDeepDive";

import PricingTable from "@/components/system/PricingTable";
import PlanCardSet from "@/components/system/PlanCardSet";
import TrialTermsBlock from "@/components/system/TrialTermsBlock";
import DualCTA from "@/components/system/DualCTA";
import EmailCapture from "@/components/system/EmailCapture";

import FaqBlock from "@/components/system/FaqBlock";
import RelatedGuides from "@/components/system/RelatedGuides";
import Breadcrumbs from "@/components/system/Breadcrumbs";

export const metadata = {
  title: "Sokndall visual system",
  description: "Internal component catalog. Not a public page.",
  robots: { index: false, follow: false },
};

const W = {
  4: "w-1",
  8: "w-2",
  12: "w-3",
  16: "w-4",
  24: "w-6",
  32: "w-8",
  48: "w-12",
  64: "w-16",
  96: "w-24",
  128: "w-32",
};

function Group({ id, title, children }) {
  return (
    <section id={id} className="grid gap-10">
      <h2 className="t-h2 u-ink border-b u-hair pb-3">{title}</h2>
      <div className="grid gap-16">{children}</div>
    </section>
  );
}

function Spec({ name, policy, note, children }) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="t-small u-ink">{name}</span>
        <span className="t-small u-muted">image: {policy}</span>
      </div>
      {note && <p className="t-small u-muted max-w-2xl">{note}</p>}
      <div className="border u-hair rounded p-6 bg-paper-2">{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="bg-paper u-ink">
      <div className="mx-auto max-w-5xl px-6 py-16 grid gap-24">
        {/* ---------------------------------------------------------------- */}
        <header className="grid gap-4">
          <h1 className="t-h1 u-ink">Sokndall visual system</h1>
          <p className="t-body-editorial u-muted max-w-2xl">
            Every component in CATALOGO_SISTEMA.md §3, rendered with real
            content from the copy. This is a catalog, not a page to imitate.
            Radius is one 4px token, borders are 1px, there are no shadows, and
            amber appears only on a primary CTA or a state that needs action.
          </p>
          <p className="t-small u-muted max-w-2xl">
            Pending §6 decisions the styleguide exists to settle: the sans
            typeface (4 candidates, none installed yet), the StatedVsObserved
            treatment, the logo, and how the matrix behaves on mobile.
          </p>
        </header>

        {/* ==== SCALES ==================================================== */}
        <section id="scales" className="grid gap-10">
          <h2 className="t-h2 u-ink border-b u-hair pb-3">Scales</h2>

          <div className="grid gap-4">
            <h3 className="t-h3 u-ink">Colour</h3>
            <ul className="grid gap-3 md:grid-cols-2">
              {COLOR_TOKENS.map((t) => (
                <li key={t.name} className="grid gap-2 border u-hair rounded p-3">
                  <div className={`${t.cls} h-16 w-full border u-hair rounded`} />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="t-small u-ink">{t.name}</span>
                    <span className="mono-data u-muted">{t.hex}</span>
                  </div>
                  <span className="t-small u-muted">{t.use}</span>
                </li>
              ))}
            </ul>
            <p className="t-small u-muted max-w-2xl">
              The 11 badge states (5 credential, 6 enrollment) inherit their
              ramp from the handoff §5.4 and are imported unchanged — not
              redefined here.
            </p>
          </div>

          <div className="grid gap-4">
            <h3 className="t-h3 u-ink">Type</h3>
            <ul className="grid gap-4">
              {TYPE_ROLES.map((t) => (
                <li key={t.role} className="grid gap-1 border-t u-hair pt-4">
                  <span className={`${t.cls} u-ink`}>
                    {t.role === "mono-data"
                      ? "0123456789  ·  34 days  ·  $299"
                      : "The renewals are not the hard part. The waiting is."}
                  </span>
                  <span className="t-small u-muted">
                    {t.role} · {t.size} · {t.leading}
                    {t.note ? ` · ${t.note}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4">
            <h3 className="t-h3 u-ink">Spacing</h3>
            <ul className="grid gap-2">
              {SPACE_STEPS.map((s) => (
                <li key={s.px} className="flex items-center gap-4">
                  <span className="mono-data u-muted inline-block w-8 text-right">
                    {s.px}
                  </span>
                  <span className={`${W[s.px]} h-3 bg-ink block`} />
                </li>
              ))}
            </ul>
            <p className="t-small u-muted">
              4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 — nothing else.
            </p>
          </div>
        </section>

        {/* ==== 3.1 PAGE STRUCTURE ====================================== */}
        <Group id="g-3-1" title="3.1 Page structure">
          <Spec
            name="SiteHeader"
            policy="prohibida"
            note="Sticky on every page. Bottom hairline, never a shadow. Scroll-reactive hairline deferred (needs client JS) — see NOTAS."
          >
            <SiteHeader nav={NAV.items} trialHref={NAV.trialHref} />
          </Spec>

          <Spec
            name="SiteFooter"
            policy="prohibida"
            note="Link columns + legal. Absorbs part of the required internal linking."
          >
            <SiteFooter columns={FOOTER.columns} legal={FOOTER.legal} />
          </Spec>

          <Spec
            name="PageHeader — variant: editorial"
            policy="obligatoria (editorial)"
            note="Real image absent → grey FLOAT placeholder at 16:9, treatment labelled."
          >
            <PageHeader
              as="h3"
              variant="editorial"
              title={C.PAGE_HEADER_EDITORIAL.title}
              subhead={C.PAGE_HEADER_EDITORIAL.subhead}
              meta={C.PAGE_HEADER_EDITORIAL.meta}
            />
          </Spec>

          <Spec
            name="PageHeader — variant: comparison"
            policy="justificada (comparison)"
            note="Image omitted here; the price is the content on a comparison page."
          >
            <PageHeader
              as="h3"
              variant="comparison"
              title={C.PAGE_HEADER_COMPARISON.title}
              subhead={C.PAGE_HEADER_COMPARISON.subhead}
            />
          </Spec>

          <Spec
            name="Hero"
            policy="obligatoria"
            note="Landing only. Real image absent → grey BLEED placeholder at 1:1. On the home this slot is the MatrixSchematic instead."
          >
            <Hero
              as="h3"
              title={C.HERO.title}
              subhead={C.HERO.subhead}
              primary={C.HERO.primary}
              secondary={C.HERO.secondary}
              microcopy={C.HERO.microcopy}
            />
          </Spec>

          <Spec
            name="TableOfContents"
            policy="prohibida"
            note="Client (scroll spy); every link is in the server HTML. Active state is ink weight + dark hairline, never amber."
          >
            <div className="max-w-xs">
              <TableOfContents items={C.TOC} />
            </div>
          </Spec>
        </Group>

        {/* ==== 3.2 PROSE & CONTENT STRUCTURE ========================== */}
        <Group id="g-3-2" title="3.2 Prose and content structure">
          <Spec
            name="ProseSection"
            policy="justificada"
            note="The one component where the agent decides per page. Shown without an image: a documental photo here would compete with the benefit sections and the copy is abstract."
          >
            <ProseSection as="h3" heading={C.PROSE.heading}>
              {C.PROSE.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </ProseSection>
          </Spec>

          <Spec name="LabelledContentList" policy="prohibida" note="Label left with hairline separators. Not a grid of cards.">
            <LabelledContentList as="h3" heading={C.LABELLED.heading} items={C.LABELLED.items} />
          </Spec>

          <Spec name="NumberedSteps" policy="prohibida" note="Numbered only because it genuinely is a sequence. The 01/02 column is mono; durations are prose.">
            <NumberedSteps as="h3" heading={C.NUMBERED.heading} steps={C.NUMBERED.steps} />
          </Spec>

          <Spec name="NegationList" policy="prohibida" note="'What we do not do'. No image by decision — a diagram would compete with the benefit sections.">
            <NegationList
              as="h3"
              heading={C.NEGATION.heading}
              intro={C.NEGATION.intro}
              items={C.NEGATION.items}
              closing={C.NEGATION.closing}
            />
          </Spec>

          <Spec name="DocumentChecklist" policy="prohibida">
            <DocumentChecklist as="h3" heading={C.DOCUMENTS.heading} items={C.DOCUMENTS.items} />
          </Spec>

          <Spec name="ErrorList" policy="prohibida" note="Error + consequence. Source copy rendered these as bare bullets; consequences composed from adjacent copy — see NOTAS.">
            <ErrorList as="h3" heading={C.ERRORS.heading} items={C.ERRORS.items} />
          </Spec>
        </Group>

        {/* ==== 3.3 EVIDENCE & HONESTY ================================= */}
        <Group id="g-3-3" title="3.3 Evidence and honesty — the differential core">
          <Spec name="SourcedFigure" policy="prohibida" note="Inline in the paragraph. Link underlined, brand colour; estimate marker is text.">
            <p className="t-body-editorial u-ink max-w-2xl">
              {C.SOURCED_FIGURE.before}
              <SourcedFigure source={C.SOURCED_FIGURE.src1}>
                {C.SOURCED_FIGURE.fig1}
              </SourcedFigure>
              {C.SOURCED_FIGURE.mid}
              <SourcedFigure source={C.SOURCED_FIGURE.src2} estimate sourceRel="noopener nofollow">
                {C.SOURCED_FIGURE.fig2}
              </SourcedFigure>
              {C.SOURCED_FIGURE.after}
            </p>
          </Spec>

          <Spec name="PriceAnchorSourced" policy="prohibida" note="`unit` is a required prop — it throws without it. The figure is inline (not mono: not a column).">
            <PriceAnchorSourced
              as="h3"
              heading={C.PRICE_ANCHOR.heading}
              claim={C.PRICE_ANCHOR.claim}
              figure={C.PRICE_ANCHOR.figure}
              unit={C.PRICE_ANCHOR.unit}
              source={C.PRICE_ANCHOR.source}
              calculation={C.PRICE_ANCHOR.calculation}
            />
          </Spec>

          <Spec name="SourcedPricingDisclosure" policy="prohibida" note="A claim can carry 'no public figure — the absence is the finding' instead of a link.">
            <SourcedPricingDisclosure
              as="h3"
              heading={C.PRICING_DISCLOSURE.heading}
              lead={C.PRICING_DISCLOSURE.lead}
              claims={C.PRICING_DISCLOSURE.claims}
            />
          </Spec>

          <Spec name="GoodFitSection" policy="prohibida" note="Treatment identical to body prose — no card, no surface. A card here reads as a performative concession.">
            <GoodFitSection as="h3" heading={C.GOOD_FIT.heading}>
              {C.GOOD_FIT.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </GoodFitSection>
          </Spec>

          <Spec name="StatedVsObserved" policy="prohibida" note="No reference — project's own form (§6.2). Two labelled rows, hairline-divided; observed is plain body, never a pull-quote.">
            <StatedVsObserved
              as="h3"
              heading={C.STATED_OBSERVED.heading}
              stated={C.STATED_OBSERVED.stated}
              statedSource={C.STATED_OBSERVED.statedSource}
              observed={C.STATED_OBSERVED.observed}
            />
          </Spec>
        </Group>

        {/* ==== 3.4 PRODUCT & STATE =================================== */}
        <Group id="g-3-4" title="3.4 Product and state">
          <Spec name="MatrixSchematic" policy="es la imagen" note="Real <table>, hairline grid, mono day counts. Not styled to look like a screenshot. Two cells need action → two amber marks.">
            <MatrixSchematic
              as="h3"
              heading={C.MATRIX.heading}
              note={C.MATRIX.note}
              providers={C.MATRIX.providers}
              payers={C.MATRIX.payers}
              cells={C.MATRIX.cells}
            />
          </Spec>

          <Spec name="StatusTable" policy="prohibida" note="Six statuses. 'Info requested' row emphasised by surface change, not border weight; one amber mark.">
            <StatusTable as="h3" heading={C.STATUS_TABLE.heading} rows={C.STATUS_TABLE.rows} />
          </Spec>

          <Spec name="AlertLadder" policy="prohibida" note="90 is deliberately neutral — no colour. Amber only on 14 and 7 (action now).">
            <AlertLadder as="h3" heading={C.ALERT_LADDER.heading} steps={C.ALERT_LADDER.steps} />
          </Spec>

          <Spec name="FailureDeepDive" policy="justificada" note="Own hierarchy via a left rule, not a card. Image absent → grey FLOAT placeholder.">
            <FailureDeepDive
              as="h3"
              heading={C.FAILURE.heading}
              mechanism={C.FAILURE.mechanism}
              symptom={C.FAILURE.symptom}
              catchEarly={C.FAILURE.catchEarly}
            />
          </Spec>
        </Group>

        {/* ==== 3.5 CONVERSION ======================================= */}
        <Group id="g-3-5" title="3.5 Conversion">
          <Spec name="PricingTable" policy="prohibida" note="Vertical list of 3 rows, not cards. Middle row: exactly 'Most complete for a group practice'. Price column is mono.">
            <PricingTable
              as="h3"
              heading={C.PRICING_TABLE.heading}
              rows={C.PRICING_TABLE.rows}
              cta={C.PRICING_TABLE.cta}
            />
          </Spec>

          <Spec name="PlanCardSet" policy="prohibida" note="Expanded plan view for /pricing. Only the labelled plan gets a primary (amber) CTA.">
            <PlanCardSet as="h3" heading={C.PLAN_CARDS.heading} plans={C.PLAN_CARDS.plans} />
          </Spec>

          <Spec name="TrialTermsBlock" policy="prohibida" note="Body size, not fine print — saying it small is the behaviour the product criticises.">
            <TrialTermsBlock as="h3" heading={C.TRIAL_TERMS.heading} items={C.TRIAL_TERMS.items} />
          </Spec>

          <Spec name="DualCTA" policy="prohibida" note="On informational pages the primary is the template download, never /pricing.">
            <DualCTA
              primary={C.DUAL_CTA.primary}
              secondary={C.DUAL_CTA.secondary}
              note={C.DUAL_CTA.note}
            />
          </Spec>

          <Spec name="EmailCapture — variant: embedded" policy="prohibida" note="Above the fold, page 4. Offer + label + microcopy all in the server HTML.">
            <EmailCapture
              variant="embedded"
              heading={C.EMAIL_CAPTURE.heading}
              buttonLabel={C.EMAIL_CAPTURE.buttonLabel}
              microcopy={C.EMAIL_CAPTURE.microcopy}
            />
          </Spec>

          <Spec name="EmailCapture — variant: sidebar" policy="prohibida" note="Right sidebar, page 16 (the only 90-day-gate metric).">
            <div className="max-w-xs">
              <EmailCapture
                variant="sidebar"
                heading="Get the aetna behavioral health checklist"
                buttonLabel="Send it to me"
                microcopy={C.EMAIL_CAPTURE.microcopy}
              />
            </div>
          </Spec>
        </Group>

        {/* ==== 3.6 NAVIGATION & CLOSE =============================== */}
        <Group id="g-3-6" title="3.6 Navigation and close">
          <Spec name="FaqBlock" policy="prohibida" note="Client accordion; every answer is rendered into the server HTML (hidden). Emits FAQPage schema with the on-screen questions.">
            <FaqBlock as="h3" heading={C.FAQ.heading} items={C.FAQ.items} />
          </Spec>

          <Spec name="RelatedGuides" policy="justificada" note="3 links, descriptive anchors. Thumbnails only if real art exists — omitted here.">
            <RelatedGuides as="h3" heading={C.RELATED.heading} items={C.RELATED.items} />
          </Spec>

          <Spec name="Breadcrumbs" policy="prohibida" note="Subfolder pages. Separator is '/', never an arrow. Emits BreadcrumbList schema.">
            <Breadcrumbs items={C.BREADCRUMBS} />
          </Spec>
        </Group>
      </div>
    </div>
  );
}
