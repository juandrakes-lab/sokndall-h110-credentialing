import Stage from "@/components/app/showcase/Stage";

// A product shot on a marketing page: one scene (scenes.jsx) drawn on its fixed
// canvas and scaled to the figure's width. It replaces the low-fidelity
// schematics and the empty screen frames of the neo pages (2026-09-19, the
// founder's call once the app existed) — the app's own parts, in the app's
// type, set in their own box so neither stylesheet leaks into the other.
//
// backdrop: "ink" — the petrol tile with dotted rings (the access panel's), for
//           product screens on a light section;
//           "ground" — the app's soft petrol-to-paper wash, for diagrams;
//           "none" — no box, for a figure already on a dark panel (the hero).
export default function ProductShot({ scene: Scene, props = {}, w, h, backdrop = "ink", label, className = "" }) {
  const box =
    backdrop === "ink"
      ? "auth-panel rounded-[28px] shadow-[0_2px_6px_rgba(14,42,46,0.18),0_24px_48px_-24px_rgba(14,42,46,0.6)]"
      : backdrop === "ground"
        ? "app-ground-flat rounded-[28px] ring-1 ring-ink-900/[0.06]"
        : "";
  return (
    <figure className={`app-type relative m-0 w-full overflow-hidden ${box} ${className}`}>
      {/* Never below 55%: on a phone a wide scene crops at the right edge
          rather than shrinking to unreadable type. */}
      <Stage w={w} h={h} align="center" className="relative w-full" fluid minScale={0.55} label={label}>
        <Scene {...props} />
      </Stage>
    </figure>
  );
}
