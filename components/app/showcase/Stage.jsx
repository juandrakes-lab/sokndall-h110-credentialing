"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Scales a scene's fixed canvas (w × h) to the room its box has, so a scene is
// drawn once and fits any size sharp, never overlapping what sits around it.
// `align` anchors the canvas left (the stories, bleeding off the right edge)
// or centred (a product shot in a figure).
//
// `fluid` (product shots): the box's height follows the scale its width gives,
// capped at 1 (never drawn larger than designed — upscaled type blurs). Below
// `minScale` the scene stops shrinking — on a phone a full-width scene would
// drop to unreadable type — and anchors left, so the far side runs off the edge.
export default function Stage({ w, h, align = "left", className = "relative min-h-0 flex-1", label, fluid = false, minScale = 0, children }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0);
  const [floor, setFloor] = useState(false);
  useLayoutEffect(() => {
    const el = box.current;
    const fit = () => {
      if (fluid) {
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
  }, [w, h, fluid, minScale]);
  const centred = align === "center" && !floor;
  const style = fluid ? (scale ? { height: h * scale } : { aspectRatio: `${w} / ${h}` }) : undefined;
  return (
    <div ref={box} className={className} style={style} role={label ? "img" : undefined} aria-label={label}>
      <div
        className={`absolute top-1/2 ${centred ? "left-1/2" : "left-0"}`}
        style={{
          width: w,
          height: h,
          transform: `${centred ? "translate(-50%, -50%)" : "translateY(-50%)"} scale(${scale})`,
          transformOrigin: centred ? "center" : "left center",
          opacity: scale ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
