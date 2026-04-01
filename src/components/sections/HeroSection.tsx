"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import ThreeBackground from "@/components/background/ThreeBackground";
import Magnetic from "@/components/ui/Magnetic";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef1 = useRef<HTMLHeadingElement>(null);
  const headlineRef2 = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();

    // GSAP Timeline setup for cinematic reveal
    const tl = gsap.timeline({ delay: 3.2 }); // wait for loading screen + buffer

    gsap.set(
      [headlineRef1.current, headlineRef2.current, subtextRef.current, ctaRef.current],
      { yPercent: 120, opacity: 0 }
    );
    gsap.set(lineRef.current, { scaleX: 0 });

    tl.to(
      [headlineRef1.current, headlineRef2.current],
      {
        yPercent: 0,
        opacity: 1,
        duration: 2.5,
        ease: "expo.out",
        stagger: 0.15,
      }
    )
      .to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power4.inOut",
        },
        "-=1.8"
      )
      .to(
        [subtextRef.current, ctaRef.current],
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=1.2"
      );

    // Deep Parallax on scroll
    gsap.to(containerRef.current, {
      yPercent: 40,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col justify-end pb-[15vh] px-8 md:px-16 overflow-hidden">
      <ThreeBackground />

      <div ref={containerRef} className="z-10 w-full max-w-7xl mx-auto flex flex-col items-start">
        <div className="overflow-hidden">
          <h1
            ref={headlineRef1}
            className="font-syne text-[14vw] md:text-[9.5vw] leading-[0.8] font-bold text-white tracking-tighter uppercase pointer-events-none neon-text"
          >
            Mayur
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1
            ref={headlineRef2}
            className="font-syne text-[14vw] md:text-[9.5vw] leading-[0.85] font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-neon to-accent tracking-tighter uppercase pointer-events-none drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
          >
            Tamkhane
          </h1>
        </div>

        <div className="mt-16 w-full flex flex-col md:flex-row md:items-end justify-between gap-10 pt-10 relative">
          <div
            ref={lineRef}
            className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-accent-dim via-accent-glow to-transparent origin-left"
          />

          <div className="overflow-hidden max-w-xl">
            <p
              ref={subtextRef}
              className="font-space-grotesk text-lg md:text-xl text-muted font-light leading-relaxed"
            >
              Creative Developer engineer of Awwwards-caliber digital experiences
              built on clean architecture, immersive 3D, and highly interactive motion.
            </p>
          </div>

          <div ref={ctaRef} className="flex gap-6 items-center">
            <Magnetic>
              <a href="#projects" className="magnetic px-8 py-4 rounded-full deep-glass deep-glass-hover text-sm tracking-[0.2em] uppercase font-syne text-white transition-all">
                View Work
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
