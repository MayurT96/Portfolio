"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiMongodb, SiGreensock, SiThreedotjs } from "react-icons/si";
import { FiCpu } from "react-icons/fi";

const SKILLS = [
  { name: "React / Next.js", category: "Frontend", Icon: SiReact },
  { name: "TypeScript", category: "Language", Icon: SiTypescript },
  { name: "Tailwind CSS", category: "Styling", Icon: SiTailwindcss },
  { name: "Node.js", category: "Backend", Icon: SiNodedotjs },
  { name: "MongoDB", category: "Database", Icon: SiMongodb },
  { name: "GSAP", category: "Animation", Icon: SiGreensock },
  { name: "Three.js", category: "WebGL", Icon: SiThreedotjs },
  { name: "System Architecture", category: "Architecture", Icon: FiCpu },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    ensureGsap();

    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative w-full py-32 px-6 md:px-12 z-20">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-20">
          <p className="font-syne text-sm tracking-[0.2em] text-blue-400 uppercase">
            02. Core Toolkit
          </p>
          <h2 className="font-syne text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight uppercase">
            Technical Arsenal
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-blue-500 to-transparent" />
        </div>

        {/* Minimal Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {SKILLS.map((skill, index) => {
            const Icon = skill.Icon;
            return (
              <div
                key={index}
                ref={(el) => { cardsRef.current[index] = el }}
                className="group relative flex flex-col justify-between p-6 md:p-8 h-40 md:h-48 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 hover:border-blue-500/30 hover:bg-white/[0.04]"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-start z-10">
                  <span className="font-space-grotesk text-[10px] md:text-xs text-white/30 uppercase tracking-[0.15em] group-hover:text-blue-400 transition-colors duration-300">
                    {skill.category}
                  </span>
                  <Icon className="text-white/20 group-hover:text-white transition-colors duration-500 text-2xl md:text-3xl" />
                </div>

                <div className="z-10 mt-auto">
                  <h3 className="font-syne text-lg md:text-xl font-semibold text-white/70 group-hover:text-white transition-colors duration-300 tracking-tight">
                    {skill.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
