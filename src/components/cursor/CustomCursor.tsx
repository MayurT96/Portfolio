"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    ensureGsap();
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    gsap.set([dot, ring], { x: cx, y: cy });

    const qDotX = gsap.quickTo(dot, "x", { duration: 0.07, ease: "power2.out" });
    const qDotY = gsap.quickTo(dot, "y", { duration: 0.07, ease: "power2.out" });
    const qRingX = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power3.out" });
    const qRingY = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      qDotX(e.clientX); qDotY(e.clientY);
      qRingX(e.clientX); qRingY(e.clientY);

      const isInteractive = (document.elementsFromPoint(e.clientX, e.clientY) as Element[])
        .some(el => el.matches("button, a, [role='button'], input, textarea"));
      ring.classList.toggle("cursor-hover", isInteractive);
    };

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.15, ease: "power2.out" });
    const onUp   = () => gsap.to(ring, { scale: 1,    duration: 0.3,  ease: "power3.out" });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup",   onUp,   { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup",   onUp);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        id="cursor-dot"
        aria-hidden="true"
        style={{ position: "fixed", top: 0, left: 0, transform: "translate(-50%,-50%)", zIndex: 9999, pointerEvents: "none" }}
      />
      <div
        ref={ringRef}
        id="cursor-ring"
        aria-hidden="true"
        style={{ position: "fixed", top: 0, left: 0, transform: "translate(-50%,-50%)", zIndex: 9998, pointerEvents: "none" }}
      />
    </>
  );
}
