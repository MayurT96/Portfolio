"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    // Fast precise dot
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });

    // Slightly delayed glow blob
    const glowX = gsap.quickTo(glow, "x", { duration: 0.45, ease: "power3.out" });
    const glowY = gsap.quickTo(glow, "y", { duration: 0.45, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      glowX(e.clientX);
      glowY(e.clientY);
    };

    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", onMouseMove);

    // Attach hover listeners to interactive elements
    const attachHover = () => {
      const interactives = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button'], .magnetic"
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnter);
        el.addEventListener("mouseleave", onMouseLeave);
      });
    };

    attachHover();
    const interval = setInterval(attachHover, 1000);

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      clearInterval(interval);
      document.body.style.cursor = "auto";
      const interactives = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button'], .magnetic"
      );
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Intense center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-screen transition-all duration-300 ease-out ${
          isHovering ? "w-0 h-0 opacity-0" : "w-2 h-2 bg-white"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* Cinematic Glow Blob */}
      <div
        ref={glowRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-screen transition-all duration-300 ease-out ${
          isHovering
            ? "w-24 h-24 bg-white/10 blur-[1px] border-[0.5px] border-white/20"
            : "w-64 h-64 bg-accent-glow blur-3xl opacity-50"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}
