"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgressIndicator() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <div ref={barRef} id="scroll-progress" aria-hidden="true" />;
}
