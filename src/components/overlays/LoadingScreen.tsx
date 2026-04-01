"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureGsap();

    const overlay = overlayRef.current;
    const name = nameRef.current;
    const line = lineRef.current;

    if (!overlay || !name || !line) { setVisible(false); return; }

    // Set initial states
    gsap.set(name, { opacity: 0, y: 12 });
    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline();

    tl
      .to(name, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.3)
      .to(line, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0.5)
      .to(overlay, {
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
        onComplete: () => setVisible(false),
      }, 2.0);

    return () => { tl.kill(); };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "var(--bg)" }}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-5 items-start">
        <div
          ref={nameRef}
          style={{
            fontFamily: "var(--font-syne)",
            fontSize: "1.5rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          Mayur Tamkhane
        </div>
        <div
          ref={lineRef}
          style={{
            height: "1px",
            width: "100%",
            background: "var(--border-hi)",
          }}
        />
      </div>
    </div>
  );
}
