"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Stage from "@/components/app/showcase/Stage";
import * as SCENES from "@/components/app/showcase/scenes";

// A product shot on a marketing page: a scene (scenes.jsx) drawn on its fixed
// canvas and scaled to the figure's width — only ever down, never up, so the
// type stays sharp. It sits on the section's own ground, with the window's own
// shadow and nothing around it.
//
// Scenes are named rather than passed: the pages that use a shot are server
// components, and a function cannot cross that boundary.
//
// `bleed`: the scene runs off the right edge of the figure instead of fitting
// inside it (the home hero), drawn 1:1. The number is the slice that must stay
// visible; the panel around the figure does the clipping. The narrow scene
// never bleeds.
//
// `narrow`: the scene to draw on a phone instead (below `narrow.upTo`, 640px
// of viewport — the viewport, not the figure: a hero figure is narrow on a
// laptop too, and there the whole screen is exactly what should be shown). A
// whole screen is unreadable on a phone, so the narrow variant is the part
// that matters — one card, a list, a panel — at a size that can be read.
//
// `backdrop="ground"`: the app's own background under the shot, in a rounded
// box with a hairline. It is what tells a figure apart from the page's own
// cards — a loose white card of the app, dropped on a white section beside
// white content cards, reads as a fourth content card. A figure that is a
// whole screen carries its own sidebar and top bar and needs no ground; a
// loose card, panel or email does. The founder's call, 2026-09-20.
export default function ProductShot({ scene, props = {}, w, h, narrow, mid, label, className = "", bleed = 0, backdrop = "none" }) {
  const box = useRef(null);
  const [ready, setReady] = useState(false);
  const [variant, setVariant] = useState(null);
  useLayoutEffect(() => {
    // Narrowest first: the first one whose query matches wins.
    const steps = [narrow, mid].filter(Boolean);
    if (!steps.length) {
      setReady(true);
      return undefined;
    }
    const mqs = steps.map((v, i) => window.matchMedia(`(max-width: ${v.upTo ?? (i === 0 ? 640 : 1023)}px)`));
    const read = () => {
      const i = mqs.findIndex((m) => m.matches);
      setVariant(i === -1 ? null : steps[i]);
      setReady(true);
    };
    read();
    mqs.forEach((m) => m.addEventListener("change", read));
    return () => mqs.forEach((m) => m.removeEventListener("change", read));
  }, [narrow, mid]);
  const small = variant === narrow && !!narrow;
  const Chosen = SCENES[variant ? variant.scene : scene];
  const cw = variant ? variant.w : w;
  const ch = variant ? variant.h : h;

  return (
    <figure
      ref={box}
      className={`app-type relative m-0 w-full ${
        backdrop === "ground"
          ? "app-ground-flat--calm rounded-[28px] p-3 sm:p-6 ring-1 ring-ink-900/[0.06]"
          : ""
      } ${className}`}
    >
      {ready && (
        <Stage
          w={cw}
          h={ch}
          align="center"
          className="relative w-full"
          fluid={!bleed || small}
          minScale={0.5}
          bleed={small ? 0 : bleed}
          label={label}
        >
          <Chosen {...props} />
        </Stage>
      )}
    </figure>
  );
}
