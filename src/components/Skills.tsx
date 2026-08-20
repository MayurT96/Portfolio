"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import GlitchText from "./GlitchText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaDocker, FaGithub, FaAws, FaJava, FaLock } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, SiMongodb, SiExpress, SiThreedotjs, SiFigma, SiPostgresql, SiFirebase, SiGraphql, SiVercel, SiPostman, SiSpringboot, SiHibernate, SiMysql, SiApachemaven, SiBootstrap, SiRender, SiIntellijidea } from "react-icons/si";

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
      { name: "JavaScript (ES6+)", icon: <SiJavascript /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "Bootstrap 5", icon: <SiBootstrap /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "HTML5 / CSS3", icon: <FaHtml5 /> },
      { name: "Three.js", icon: <SiThreedotjs /> },
    ]
  },
  {
    title: "Backend & Databases",
    icon: <SiSpringboot size={24} color="#22c55e" />,
    color: "#22c55e",
    description: "Architecting secure, scalable backend services, RESTful APIs, and database structures to power robust enterprise applications.",
    skills: [
      { name: "Java", icon: <FaJava /> },
      { name: "Spring Boot", icon: <SiSpringboot /> },
      { name: "Hibernate / JPA", icon: <SiHibernate /> },
      { name: "MySQL", icon: <SiMysql /> },
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Express.js", icon: <SiExpress /> },
      { name: "PostgreSQL", icon: <SiPostgresql /> },
      { name: "MongoDB", icon: <SiMongodb /> },
    ]
  },
  {
    title: "DevOps & Tools",
    icon: <FaGithub size={24} color="#a78bfa" />,
    color: "#a78bfa",
    description: "Leveraging industry-standard version control, deployment pipelines, cloud hosting, and professional developer tooling.",
    skills: [
      { name: "Git", icon: <FaGithub /> },
      { name: "GitHub", icon: <FaGithub /> },
      { name: "Vercel", icon: <SiVercel /> },
      { name: "Render", icon: <SiRender /> },
      { name: "Postman", icon: <SiPostman /> },
      { name: "IntelliJ IDEA", icon: <SiIntellijidea /> },
      { name: "Docker", icon: <FaDocker /> },
      { name: "AWS", icon: <FaAws /> },
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
    <section ref={containerRef} id="skills" style={{ padding: "clamp(60px, 8vw, 95px) clamp(16px, 5vw, 80px)", background: "rgba(255,255,255,.013)", position: "relative", overflow: "hidden", width: "100%", maxWidth: "100vw" }}>
      {/* Subtle Background Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(600px, 90vw)", height: "min(400px, 60vh)", background: "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>
        
        {/* Section Heading */}
        <div style={{ marginBottom: "clamp(32px, 5vw, 52px)" }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".3em", color: "#a78bfa", textTransform: "uppercase", marginBottom: 10 }}>
            <GlitchText trigger="inview" speed={16}>// skills</GlitchText>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(26px, 5vw, 48px)", color: "#fff", margin: 0, lineHeight: 1.15, letterSpacing: "-.02em" }}>
            <GlitchText trigger="inview" speed={18}>What I Work With</GlitchText>
          </h2>
          <div style={{ width: 38, height: 2, marginTop: 16, background: "linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius: 2, boxShadow: "0 0 10px #7c3aed" }} />
        </div>

        {/* Categories Grid (Glassmorphism Awwwards Style) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(18px, 3vw, 32px)", alignItems: "start", width: "100%" }}>
          {skillCategories.map((category, idx) => (
            <div 
              key={category.title}
              ref={el => { cardsRef.current[idx] = el; }}
              style={{
                background: "rgba(255,255,255,.025)",
                border: "1px solid rgba(255,255,255,.05)",
                borderRadius: 24,
                padding: "clamp(20px, 4vw, 32px) clamp(16px, 3.5vw, 24px)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
                transformStyle: "preserve-3d",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)",
                width: "100%",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                e.currentTarget.style.borderColor = category.color;
                e.currentTarget.style.background = "rgba(255,255,255,.035)";
                e.currentTarget.style.boxShadow = `0 20px 40px -10px ${category.color}33`;
                const glow = e.currentTarget.querySelector('.glow-blob') as HTMLElement;
                if(glow) { glow.style.opacity = "1"; glow.style.transform = "scale(1.5)"; }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.05)";
                e.currentTarget.style.background = "rgba(255,255,255,.025)";
                e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0,0,0,0.3)";
                const glow = e.currentTarget.querySelector('.glow-blob') as HTMLElement;
                if(glow) { glow.style.opacity = "0"; glow.style.transform = "scale(1)"; }
              }}
            >
              {/* Internal Glow on Hover */}
              <div 
                className="glow-blob"
                style={{
                  position: "absolute", top: -50, right: -50, width: 140, height: 140,
                  background: `radial-gradient(circle, ${category.color}33 0%, transparent 70%)`,
                  borderRadius: "50%", opacity: 0, transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
                  pointerEvents: "none"
                }} 
              />

              {/* Card Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
                  {category.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", margin: 0 }}>
                  {category.title}
                </h3>
              </div>

              {/* Description */}
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.6, marginBottom: 26, fontWeight: 300 }}>
                {category.description}
              </p>

              {/* Skills Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                {category.skills.map((skill) => (
                  <div 
                    key={skill.name}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 14px", borderRadius: 40,
                      background: "rgba(255,255,255,.03)", 
                      border: "1px solid rgba(255,255,255,.08)",
                      fontFamily: "'Poppins', sans-serif", fontSize: 11, color: "rgba(255,255,255,.65)",
                      transition: "all 0.3s ease",
                      cursor: "default"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = category.color;
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.background = `${category.color}15`;
                      e.currentTarget.style.boxShadow = `0 0 10px ${category.color}35`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,.65)";
                      e.currentTarget.style.background = "rgba(255,255,255,.03)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span style={{ color: category.color, display: "flex", alignItems: "center" }}>{skill.icon}</span>
                    <span style={{ paddingTop: 1 }}>{skill.name}</span>
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
