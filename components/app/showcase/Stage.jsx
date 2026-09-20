"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Scales a scene's fixed canvas (w × h) to the room its box has, so a scene is
// drawn once and fits any size sharp, never overlapping what sits around it.
// `align` anchors the canvas left (the stories, bleeding off the right edge)
// or centred (a product shot in a figure).
//
// `bleed` (the home hero): the scene is drawn at 1:1 and runs off the right
// edge of its box, clipped by the panel around it — the way to show a screen
// large without upscaling it. The number is the width that must stay visible
// inside the box; below it the scene scales down so that slice always fits.
//
// `tilt`: a 3D transform on the canvas, for the styleguide comparison only.
// Product shots do not tilt — a transformed canvas rasterises soft, which is
// the whole reason PRODUCT_SHOTS.md forbids it.
//
// `fluid` (product shots): the box's height follows the scale its width gives,
// capped at 1 (never drawn larger than designed — upscaled type blurs). Below
// `minScale` the scene stops shrinking — on a phone a full-width scene would
// drop to unreadable type — and anchors left, so the far side runs off the edge.
export default function Stage({ w, h, align = "left", className = "relative min-h-0 flex-1", label, fluid = false, minScale = 0, bleed = 0, tilt = "", children }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0);
  const [floor, setFloor] = useState(false);
  useLayoutEffect(() => {
    const el = box.current;
    const fit = () => {
      if (bleed) {
        setFloor(false);
        setScale(Math.min(1, el.clientWidth / bleed));
      } else if (fluid) {
        const s = el.clientWidth / w;
        setFloor(s < minScale);
        setScale(Math.min(1, Math.max(s, minScale)));
      } else {
        setScale(Math.min(el.clientWidth / w, el.clientHeight / h));
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, fluid, minScale, bleed]);
  const centred = align === "center" && !floor && !bleed;
  const style = fluid || bleed ? (scale ? { height: h * scale } : { aspectRatio: `${w} / ${h}` }) : undefined;
  // Only clipped when the scene is wider than its box (a phone): otherwise the
  // clip would cut the window's shadow at the section's edges.
  return (
    <div ref={box} className={`${className}${floor ? " overflow-x-clip" : ""}`} style={style} role={label ? "img" : undefined} aria-label={label}>
      <div
        className={`absolute top-1/2 ${centred ? "left-1/2" : "left-0"}`}
        style={{
          width: w,
          height: h,
          transform: `${centred ? "translate(-50%, -50%)" : "translateY(-50%)"} scale(${scale})${tilt ? ` ${tilt}` : ""}`,
          transformOrigin: centred ? "center" : "left center",
          opacity: scale ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
