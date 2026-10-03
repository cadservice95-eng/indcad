"use client";

import { useRef } from "react";

/** Sets --px/--py (-0.5…0.5) from the pointer for .par-a/.par-b/.par-c layers. */
export function Parallax({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--px", "0");
        ref.current?.style.setProperty("--py", "0");
      }}
    >
      {children}
    </div>
  );
}
