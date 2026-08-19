"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import GlitchText from "./GlitchText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaDocker, FaGithub, FaAws, FaJava, FaLock } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, SiMongodb, SiExpress, SiThreedotjs, SiFigma, SiPostgresql, SiFirebase, SiGraphql, SiVercel, SiPostman, SiSpringboot, SiHibernate, SiMysql, SiApachemaven } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: "Frontend Development",
    icon: <FaReact size={24} color="#38bdf8" />,
    color: "#38bdf8",
    description: "Crafting immersive, high-performance user interfaces and responsive web layouts with clean animations and modern typography.",
    skills: [
      { name: "React.js", icon: <FaReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "JavaScript", icon: <SiJavascript /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "Three.js", icon: <SiThreedotjs /> },
    ]
  },
  {
    title: "Backend & Databases",
    icon: <FaNodeJs size={24} color="#22c55e" />,
    color: "#22c55e",
    description: "Architecting secure, scalable backend services, RESTful APIs, and database structures to power robust applications.",
    skills: [
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Express.js", icon: <SiExpress /> },
      { name: "Java", icon: <FaJava /> },
      { name: "Spring Boot", icon: <SiSpringboot /> },
      { name: "Spring Security", icon: <FaLock /> },
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "MySQL", icon: <SiMysql /> },
      { name: "PostgreSQL", icon: <SiPostgresql /> },
    ]
  },
  {
    title: "DevOps & Tools",
    icon: <FaGithub size={24} color="#a78bfa" />,
    color: "#a78bfa",
    description: "Leveraging industry-standard version control, deployment pipelines, cloud hosting, and design collaboration platforms.",
    skills: [
      { name: "Git", icon: <FaGithub /> },
      { name: "GitHub", icon: <FaGithub /> },
      { name: "Docker", icon: <FaDocker /> },
      { name: "Vercel", icon: <SiVercel /> },
      { name: "AWS", icon: <FaAws /> },
      { name: "Postman", icon: <SiPostman /> },
      { name: "Figma", icon: <SiFigma /> },
    ]
  }
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation for cards
      gsap.fromTo(cardsRef.current, 
        { 
          y: 70, 
          opacity: 0,
          rotationX: 8
        }, 
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.1,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="skills" style={{ padding: "clamp(50px, 7vw, 90px) clamp(16px, 4vw, 80px)", background: "rgba(255,255,255,.01)", position: "relative", overflow: "hidden", width: "100%", maxWidth: "100vw" }}>
      {/* Subtle Background Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(500px, 80vw)", height: "min(350px, 50vh)", background: "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>
        
        {/* Section Heading */}
        <div style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
          <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: ".25em", color: "#a78bfa", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>
            <GlitchText trigger="inview" speed={16}>// skills & tech</GlitchText>
          </div>
          <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(24px, 4.5vw, 44px)", color: "#fff", margin: 0, lineHeight: 1.15, letterSpacing: "-.02em" }}>
            <GlitchText trigger="inview" speed={18}>What I Work With</GlitchText>
          </h2>
          <div style={{ width: 34, height: 2, marginTop: 12, background: "linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius: 2, boxShadow: "0 0 10px #7c3aed" }} />
        </div>

        {/* Categories Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(16px, 2.5vw, 26px)", alignItems: "start", width: "100%" }}>
          {skillCategories.map((category, idx) => (
            <div 
              key={category.title}
              ref={el => { cardsRef.current[idx] = el; }}
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.01) 100%)",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 20,
                padding: "clamp(18px, 3.5vw, 28px) clamp(16px, 3vw, 24px)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 30px -10px rgba(0,0,0,0.4)",
                width: "100%",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = category.color + "66";
                e.currentTarget.style.boxShadow = `0 16px 36px -10px ${category.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
                e.currentTarget.style.boxShadow = "0 8px 30px -10px rgba(0,0,0,0.4)";
              }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", flexShrink: 0 }}>
                  {category.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontSize: "clamp(17px, 2.5vw, 20px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", margin: 0 }}>
                  {category.title}
                </h3>
              </div>

              {/* Description */}
              <p style={{ fontFamily: "var(--font-space-grotesk), 'Inter', sans-serif", fontSize: 12.5, color: "rgba(255,255,255,.5)", lineHeight: 1.6, marginBottom: 18, fontWeight: 400 }}>
                {category.description}
              </p>

              {/* Skills Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {category.skills.map((skill) => (
                  <div 
                    key={skill.name}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "6px 12px", borderRadius: 30,
                      background: "rgba(255,255,255,.03)", 
                      border: "1px solid rgba(255,255,255,.08)",
                      fontFamily: "var(--font-space-grotesk), 'Inter', sans-serif", fontSize: 11.5, color: "rgba(255,255,255,.75)",
                      transition: "all 0.25s ease",
                      cursor: "default"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = category.color + "88";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.background = `${category.color}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,.75)";
                      e.currentTarget.style.background = "rgba(255,255,255,.03)";
                    }}
                  >
                    <span style={{ color: category.color, display: "flex", alignItems: "center", fontSize: 13 }}>{skill.icon}</span>
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
