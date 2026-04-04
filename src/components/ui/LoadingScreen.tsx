"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function LoadingScreen() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBgRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable scroll during load
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
        document.body.style.overflow = "";
      },
    });

    const progress = { val: 0 };
    
    tl.to(progress, {
      val: 100,
      duration: 2.2,
      ease: "power3.inOut",
      onUpdate: () => {
        if (percentageRef.current) {
          percentageRef.current.innerText = `${Math.round(progress.val)}%`;
        }
      }
    });

    tl.to(progressFillRef.current, {
      scaleX: 1,
      duration: 2.2,
      ease: "power3.inOut",
    }, 0)
    .to(textRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: "power2.in",
    }, "-=0.2")
    .to(progressBgRef.current, {
      opacity: 0,
      duration: 0.5,
    }, "-=0.5")
    .to(containerRef.current, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      duration: 1.2,
      ease: "power2.inOut",
    }, "-=0.2");

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, []);

  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center pointer-events-none"
    >
      <div ref={textRef} className="flex flex-col items-center gap-8 w-full max-w-sm px-8">
        <div className="flex justify-between w-full font-syne text-xs tracking-[0.3em] text-white/50 uppercase">
          <span>Booting</span>
          <span ref={percentageRef} className="text-accent-neon">0%</span>
        </div>
        
        <div ref={progressBgRef} className="w-full h-[2px] bg-white/5 overflow-hidden rounded-full shadow-[0_0_15px_rgba(56,189,248,0.1)]">
          <div
            ref={progressFillRef}
            className="w-full h-full bg-accent-neon origin-left scale-x-0 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
          />
        </div>
      </div>
    </div>
  );
}
