"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-linked progress for a tall section. Returns a ref for the outer
 * element (which receives --p) and the current stage index. `sticky` sections
 * use the full scroll distance on large screens; otherwise progress runs as
 * the section passes through the viewport.
 */
export function useScrollStage(count: number, sticky = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const isSticky = sticky && window.matchMedia("(min-width: 1024px)").matches;
      const raw = isSticky ? -r.top / Math.max(r.height - vh, 1) : (vh * 0.65 - r.top) / Math.max(r.height * 0.85, 1);
      const p = Math.min(0.999, Math.max(0, raw));
      el.style.setProperty("--p", p.toFixed(3));
      const s = Math.min(count - 1, Math.floor(p * count));
      setStage((prev) => (prev === s ? prev : s));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count, sticky]);

  return { ref, stage };
}
