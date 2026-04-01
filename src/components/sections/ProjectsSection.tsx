"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";

const PROJECTS = [
  {
    id: "portfolio",
    number: "01",
    title: "Portfolio 2025",
    description: "A minimal, high-end digital experience prioritizing typography, refined motion, and true 3D architecture.",
    tech: ["Next.js", "GSAP", "Three.js", "Tailwind CSS"],
    links: { repo: "https://github.com/MayurT96" }
  },
  {
    id: "ecommerce",
    number: "02",
    title: "E-Commerce OS",
    description: "A full-stack headless commerce solution featuring JWT authentication and robust state management.",
    tech: ["React", "Express.js", "MongoDB"],
    links: {}
  },
  {
    id: "ai-tools",
    number: "03",
    title: "AI Productivity Suite",
    description: "An interface integrating multiple LLM APIs for automated content generation and developer workflows.",
    tech: ["TypeScript", "REST APIs", "Node.js"],
    links: {}
  }
];

function TiltCard({ project }: { project: typeof PROJECTS[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !contentRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-10 to 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: "power2.out",
    });
    
    gsap.to(contentRef.current, {
      z: 50,
      scale: 1.05,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !contentRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    gsap.to(contentRef.current, {
      z: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="project-card-wrapper w-full relative h-[400px] md:h-[450px] rounded-3xl"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Background layer */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden transition-all duration-500 deep-glass deep-glass-hover">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-neon/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      </div>

      {/* Floating inner content layer translated in Z */}
      <div 
        ref={contentRef}
        className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
          <span className="font-space-grotesk text-sm text-white/40 tracking-[0.2em]">{project.number}</span>
          {project.links.repo ? (
            <a href={project.links.repo} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-accent-neon hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all bg-white/[0.02] pointer-events-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
             <span className="text-[10px] uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full pointer-events-auto shadow-inner">Private</span>
          )}
        </div>

        <div className="flex flex-col gap-4" style={{ transform: "translateZ(40px)" }}>
          <h3 className="font-syne text-3xl md:text-4xl text-white font-bold tracking-tight">{project.title}</h3>
          <p className="font-space-grotesk text-white/60 font-light max-w-md leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tech.map(t => (
              <span key={t} className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    
    const cards = document.querySelectorAll(".project-card-wrapper");
    gsap.set(cards, { opacity: 0, y: 100, rotateX: -15 });

    ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top 75%",
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "expo.out"
        });
      },
      once: true
    });
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative w-full py-32 px-6 md:px-12 z-20">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-24">
          <p className="font-syne text-sm tracking-[0.2em] text-accent-neon uppercase">
            03. Selected Works
          </p>
          <h2 className="font-syne text-4xl md:text-5xl lg:text-7xl text-white font-bold tracking-tight uppercase neon-text">
            Digital Craft
          </h2>
          <div className="w-px h-24 bg-gradient-to-b from-accent-neon to-transparent mt-4" />
        </div>

        <div ref={triggerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <TiltCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
