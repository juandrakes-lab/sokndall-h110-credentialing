"use client";

import { useEffect } from "react";

// While a side panel or sheet is open, the page behind it doesn't scroll (and
// its scrollbar goes away, with the width it took handed back as padding so
// nothing jumps sideways).
export default function ScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const before = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = before.overflow;
      html.style.paddingRight = before.paddingRight;
    };
  }, []);
  return null;
}
