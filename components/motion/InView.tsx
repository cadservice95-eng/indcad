"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Wrapper that flips `data-in="true"` once it scrolls into view (or
 * immediately). The CSS in globals.css keys reveal and SVG draw animations
 * off that attribute — no animation library required.
 */
export function InView({
  as: Tag = "div",
  className,
  children,
  immediate = false,
  threshold = 0.15,
  delay,
  ...rest
}: {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  immediate?: boolean;
  threshold?: number;
  delay?: number;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen || immediate) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen, immediate, threshold]);

  // Immediate scopes (hero) wait one frame so the start state paints first.
  useEffect(() => {
    if (!immediate) return;
    const id = requestAnimationFrame(() => setSeen(true));
    return () => cancelAnimationFrame(id);
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      data-in={seen ? "true" : "false"}
      style={delay !== undefined ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Scroll-reveal for a block of HTML content. */
export function Reveal({
  className,
  delay = 0,
  as,
  children,
}: {
  className?: string;
  delay?: number;
  as?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <InView as={as} delay={delay} className={cn("reveal", className)}>
      {children}
    </InView>
  );
}
