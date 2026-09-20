import Shell from "@/components/neo/Shell";
import HeroPanel from "@/components/neo/HeroPanel";
import ProductShot from "@/components/app/showcase/ProductShot";
import { HERO } from "@/app/homeData";

// /styleguide/hero — the home hero's product shot, in the two versions being
// compared on 2026-09-19: A, the shot drawn 1:1 and running off the panel's
// right edge; B, the same shot tilted, as the founder's two references do.
// noindex, disallowed in robots, out of the sitemap, like the rest of
// /styleguide. Delete once one is chosen and the home carries it.
export const metadata = {
  title: "Hero variants — styleguide",
  robots: { index: false, follow: false },
};

const TILT = "perspective(2200px) rotateY(-13deg) rotateX(4deg) rotate(0.6deg)";

function Variant({ label, tilt }) {
  return (
    <>
      <p className="sk-sgvar">{label}</p>
      <HeroPanel
        variant="panel"
        current="/"
        title={HERO.title}
        sub={HERO.sub}
        primary={HERO.primary}
        secondary={HERO.secondary}
        bleed
        figure={
          <ProductShot
            scene="HeroDashboard"
            props={{ notes: HERO.indicators }}
            w={1120}
            h={700}
            bleed={660}
            tilt={tilt}
            narrow={{ scene: "NarrowDashboard", w: 420, h: 540 }}
            label="The Sokndall dashboard"
          />
        }
      />
    </>
  );
}

export default function HeroVariants() {
  return (
    <Shell>
      <Variant label="A · straight, bleeding off the right edge" />
      <Variant label="B · the same shot tilted (for comparison only)" tilt={TILT} />
    </Shell>
  );
}
