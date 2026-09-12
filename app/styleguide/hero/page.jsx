import Shell from "@/components/neo/Shell";
import HeroPanel from "@/components/neo/HeroPanel";
import Matrix from "@/components/neo/Matrix";
import { ScreenSlot, Indicator, HeroStrip } from "@/components/neo/LandingTemplate";
import { IconBan, IconDoc, IconGrid, IconCalendar, IconBell, IconClock } from "@/components/neo/icons";
import { PHOTOS } from "@/components/neo/photos";
import { HERO } from "@/app/homeData";

// /styleguide/hero — the home hero in the two versions still in the running
// (round 2 compared three; the split one was discarded in round 3). noindex, disallowed in
// robots, out of the sitemap, like the rest of /styleguide. Delete once one is
// chosen and the home carries it.
export const metadata = {
  title: "Hero variants — styleguide",
  robots: { index: false, follow: false },
};

const STRIP_ICONS = [IconBan, IconDoc, IconGrid, IconCalendar];

function Variant({ label, backdrop, photo }) {
  return (
    <>
      <p className="sk-sgvar">{label}</p>
      <HeroPanel
        variant="panel"
        current="/"
        backdrop={backdrop}
        photo={photo}
        title={HERO.title}
        sub={HERO.sub}
        primary={HERO.primary}
        secondary={HERO.secondary}
        figure={
          <ScreenSlot screen="Provider × payer matrix" ratio="4:3" tone="white" note={HERO.caption}>
            <Matrix
              compact
              rows={4}
              cols={4}
              infoCount={2}
              quietCount={2}
              reviewCount={4}
              providers={["P 01", "P 02", "P 03", "P 04"]}
              payers={["A", "B", "C", "D"]}
            />
          </ScreenSlot>
        }
        indicators={HERO.indicators.map((ind, i) => {
          const Icon = [IconBell, IconClock][i];
          return <Indicator key={ind.label} icon={<Icon />} value={ind.value} label={ind.label} />;
        })}
      >
        <HeroStrip
          items={HERO.strip.map((l, i) => {
            const Icon = STRIP_ICONS[i];
            return { label: l, icon: <Icon /> };
          })}
        />
      </HeroPanel>
    </>
  );
}

export default function HeroVariants() {
  return (
    <Shell>
      <Variant label="A — Line texture (current)" />
      <Variant label="B — Photo behind the panel, under an ink scrim" backdrop="photo" photo={PHOTOS.formsHands} />
    </Shell>
  );
}
