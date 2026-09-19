import Stage from "@/components/app/showcase/Stage";

// A product shot on a marketing page: one scene (scenes.jsx) drawn on its fixed
// canvas and scaled to the figure's width. It replaces the low-fidelity
// schematics and the empty screen frames of the neo pages (2026-09-19, the
// founder's call once the app existed) — the app's own parts, in the app's
// type, set in their own box so neither stylesheet leaks into the other.
//
// No box of its own: the shot sits on the section's ground like the schematic
// it replaced, with the app window's own shadow. It is drawn at its canvas size
// at most — a shot is only ever scaled down, never up (upscaled type blurs).
export default function ProductShot({ scene: Scene, props = {}, w, h, label, className = "" }) {
  return (
    <figure className={`app-type relative m-0 w-full ${className}`}>
      {/* Never below 40%: on a phone a wide scene crops at the right edge
          rather than shrinking to unreadable type. */}
      <Stage w={w} h={h} align="center" className="relative w-full overflow-x-clip" fluid minScale={0.4} label={label}>
        <Scene {...props} />
      </Stage>
    </figure>
  );
}
