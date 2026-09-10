import Footer from "@/components/neo/Footer";
import HeroPanel from "@/components/neo/HeroPanel";

/**
 * LandingTemplate — the six product and commercial pages: `/`, `/pricing`,
 * `/credentialing-spreadsheet-template`, `/payer-enrollment-software`,
 * `/credentialing-tracking-software`, `/for-billing-companies`.
 *
 * This is the shell, and the shell is all it is: the blue hero panel at the
 * top, an ordered run of sections in the middle, the footer at the foot. The
 * sections themselves come from `landingSections.jsx` and every one of them
 * takes its content as props.
 *
 * **Why this file did not exist until now, stated so the mistake is not
 * repeated.** The section kit was parameterised from the start, but `Landing`
 * hardcoded the home's content into the only file that composed them, and the
 * kit sat in a directory called `home`. Between those two facts the repo read
 * as though the home were a one-off with nothing reusable in it, and a later
 * audit concluded exactly that. Nothing had to be rebuilt to fix it — the
 * content came out of the composition and the composition became this.
 *
 * **What the six pages share and what they do not.** They share the tokens,
 * the section kit, the band rhythm of light and dark, and this shell. They do
 * not share what goes inside. `Matrix` on two product pages does not carry the
 * same providers or the same numbers: it carries what that page has to show,
 * inside the same piece. Two pages of this template ending up with identical
 * figures is the signal that they were copied rather than assembled.
 *
 * The hero is a prop rather than a slot because every page of this template
 * has one and its notch/nav mechanics are not a per-page decision. Pass
 * `hero={{...}}` for the standard panel, or `heroSlot` for a hero that needs
 * to be composed by hand — the home's, whose figure is the enrollment matrix.
 */
export default function LandingTemplate({ current, hero, heroSlot, children }) {
  if (!hero && !heroSlot) {
    throw new Error(
      "LandingTemplate: a page needs either `hero` or `heroSlot`. Every page of this template opens on the blue panel; there is no variant without one."
    );
  }

  return (
    <>
      {heroSlot || (
        <HeroPanel
          current={current}
          title={hero.title}
          sub={hero.sub}
          primary={hero.primary}
          secondary={hero.secondary}
          figure={hero.figure}
        >
          {hero.children}
        </HeroPanel>
      )}

      {children}

      <Footer />
    </>
  );
}

/** The section kit, re-exported so a page has one import for the template and
 *  the pieces that go in it. */
export {
  SplitListSection,
  QuadSection,
  DiagramSection,
  FigureBandSection,
  PlanSection,
  IconRowSection,
  PanelSection,
  CtaSection,
} from "@/components/neo/landingSections";

export { Band, SectionHead, ReservedSlot, RowCard } from "@/components/neo/landingPrimitives";
