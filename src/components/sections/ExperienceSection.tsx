"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";

const EXPERIENCE = [
  {
    role: "Full Stack Developer",
    company: "Independent / Freelance",
    year: "2023 — Present",
    desc: "Architecting and developing custom end-to-end web applications. Focusing on robust MERN backends, responsive UI, and premium motion experiences without compromising performance."
  },
  {
    role: "Continuous Education",
    company: "Self-Directed Learning",
    year: "2022 — 2023",
    desc: "Intensive focus on modern JavaScript ecosystems, clean code principles, and advanced CSS methodologies. Explored core computer science concepts through practical application."
  }
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    ensureGsap();

    // Line drawing animation
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        },
      }
    );

    // Staggered node reveal
    itemsRef.current.forEach((el, index) => {
      if (!el) return;
      const dot = el.querySelector(".timeline-dot");
      const content = el.querySelector(".timeline-content");

      gsap.fromTo(
        dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        content,
        { x: 30, opacity: 0, filter: "blur(4px)" },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
          },
        }
      );
    });
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative w-full py-32 px-6 md:px-12 z-20">
      <div className="mx-auto w-full max-w-4xl relative">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-24">
          <p className="font-syne text-sm tracking-[0.2em] text-blue-400 uppercase">
            04. Experience
          </p>
          <h2 className="font-syne text-4xl md:text-5xl lg:text-7xl text-white font-bold tracking-tight uppercase">
            Professional Path
          </h2>
          <div className="w-px h-24 bg-gradient-to-b from-blue-500 to-transparent mt-4" />
        </div>

        {/* Timeline Container */}
        <div className="relative pl-8 md:pl-0">
          
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5">
            <div 
              ref={lineRef}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent origin-top"
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {EXPERIENCE.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  ref={(el) => { itemsRef.current[index] = el }}
                  className="relative flex flex-col md:flex-row items-start md:items-center w-full"
                >
                  
                  {/* Dot */}
                  <div className="timeline-dot absolute left-[-29px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#020617] border-2 border-blue-500 z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

                  {/* Content (Alternates left/right on desktop) */}
                  <div className={`timeline-content w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right md:ml-0' : 'md:pl-16 md:-mr-0 md:ml-auto'}`}>
                    <div className="group flex flex-col gap-2 p-6 rounded-2xl bg-white/[0.01] border border-white/10 hover:border-blue-500/30 transition-colors duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className={`flex flex-col gap-1 ${isEven ? 'md:items-end' : 'items-start'}`}>
                        <span className="font-space-grotesk text-sm text-blue-400 font-medium tracking-wider">{exp.year}</span>
                        <h3 className="font-syne text-2xl text-white font-bold">{exp.role}</h3>
                        <span className="text-xs uppercase tracking-widest text-white/40 mb-3">{exp.company}</span>
                      </div>
                      
                      <p className="font-space-grotesk text-white/60 leading-relaxed font-light">
                        {exp.desc}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
