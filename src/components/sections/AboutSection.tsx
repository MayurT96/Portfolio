"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    ensureGsap();
    
    // Staggered floating card timeline
    cardRefs.current.forEach((el, index) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 150, rotateX: -10, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.5,
            delay: index * 0.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    });
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative w-full min-h-[120vh] py-32 px-6 md:px-12 z-20">
      <div className="mx-auto w-full max-w-5xl relative">
        <div className="flex flex-col items-center text-center gap-4 mb-32">
          <p className="font-syne text-sm tracking-[0.2em] text-accent-neon uppercase">
            01. Background
          </p>
          <h2 className="font-syne text-4xl md:text-5xl lg:text-7xl text-white font-bold tracking-tight uppercase neon-text">
            About Me
          </h2>
          <div className="w-px h-24 bg-gradient-to-b from-accent-neon to-transparent mt-4" />
        </div>

        {/* Timeline Grid */}
        <div className="relative border-l border-white/10 ml-4 md:ml-12 pl-8 md:pl-16 flex flex-col gap-24">
          
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-accent-neon via-accent-glow to-transparent" />
          
          <div ref={el => { cardRefs.current[0] = el; }} className="relative p-8 md:p-12 deep-glass deep-glass-hover rounded-3xl w-full">
            <div className="absolute top-12 -left-10 md:-left-18 w-4 h-4 rounded-full bg-accent-neon shadow-[0_0_15px_rgba(56,189,248,0.8)] border-2 border-black" />
            <h3 className="font-syne text-2xl md:text-3xl font-bold text-white mb-4">Intentional Design</h3>
            <p className="font-space-grotesk text-white/70 leading-relaxed font-light">
              I am a full-stack developer with a focus on crafting high-end digital experiences. I believe that performance and design are not mutually exclusive, but rather depend on one another to create something exceptional.
            </p>
          </div>

          <div ref={el => { cardRefs.current[1] = el; }} className="relative p-8 md:p-12 deep-glass deep-glass-hover rounded-3xl w-full">
            <div className="absolute top-12 -left-10 md:-left-18 w-4 h-4 rounded-full bg-accent border-2 border-black" />
            <h3 className="font-syne text-2xl md:text-3xl font-bold text-white mb-4">Clean Architecture</h3>
            <p className="font-space-grotesk text-white/70 leading-relaxed font-light">
              My approach to development is rooted in simplicity and restraint. Whether architecting a robust MERN backend or fine-tuning WebGL animations, I prioritize clarity, maintainability, and user experience above all else. Every line of code, like every pixel, must serve a purpose.
            </p>
          </div>

          <div ref={el => { cardRefs.current[2] = el; }} className="relative p-8 md:p-12 deep-glass deep-glass-hover rounded-3xl w-full">
            <div className="absolute top-12 -left-10 md:-left-18 w-4 h-4 rounded-full bg-accent border-2 border-black" />
            <h3 className="font-syne text-2xl md:text-3xl font-bold text-white mb-4">Location & Status</h3>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-8 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-white/40 uppercase tracking-widest text-xs">Location</span>
                <span className="text-white">Nagpur, India</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/40 uppercase tracking-widest text-xs">Status</span>
                <span className="text-accent-neon">Open to opportunities</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
