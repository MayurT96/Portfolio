"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap, ScrollToPlugin } from "@/lib/gsap";

const NAV_ITEMS = [
  { id: "about",      label: "About" },
  { id: "skills",     label: "Skills" },
  { id: "projects",   label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact" },
];

export default function TopNav() {
  const [active, setActive]       = useState<string>("");
  const [atTop, setAtTop]         = useState(true);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Shrink on scroll */
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section */
  useEffect(() => {
    const targets = NAV_ITEMS.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(entries => {
      const best = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (best?.target?.id) setActive(best.target.id);
    }, { threshold: [0.2, 0.5] });
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, []);

  /* Entrance */
  useEffect(() => {
    ensureGsap();
    if (!navRef.current) return;
    gsap.from(navRef.current, { opacity: 0, y: -20, duration: 1, ease: "expo.out", delay: 2.5 });
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    ensureGsap();
    gsap.registerPlugin(ScrollToPlugin);
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    gsap.to(window, { scrollTo: { y, autoKill: false }, duration: 1.2, ease: "expo.inOut" });
    setMenuOpen(false);
  };

  const handleMagnetic = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    gsap.to(btnRef.current, { x, y, duration: 0.3, ease: "power2.out" });
  };

  const handleMagneticLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <header
      ref={navRef}
      className={`fixed left-0 top-0 z-[70] w-full transition-all duration-500 border-b ${
        atTop ? "border-transparent bg-transparent" : "border-white/10 bg-[#020617]/80 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Logo / Name */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="Back to top"
        >
          <span className="font-syne text-sm font-bold tracking-tighter text-white group-hover:text-blue-400 transition-colors">MT</span>
          <span className="w-px h-3 bg-white/20" />
          <span className="font-space-grotesk text-xs uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">Portfolio</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map(n => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className="relative px-4 py-2 font-space-grotesk text-xs uppercase tracking-[0.15em] focus:outline-none transition-colors duration-300"
              style={{
                color: active === n.id ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            >
              {n.label}
              {active === n.id && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-4 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <button
            ref={btnRef}
            onMouseMove={handleMagnetic}
            onMouseLeave={handleMagneticLeave}
            type="button"
            onClick={() => scrollTo("contact")}
            className="relative px-6 py-2.5 rounded-full border border-white/20 font-syne text-xs uppercase tracking-widest text-white/70 hover:text-white overflow-hidden group transition-colors"
          >
            <div className="absolute inset-0 bg-blue-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">Get in touch</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-white/50 hover:text-white focus:outline-none"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 space-y-1">
          {NAV_ITEMS.map(n => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className="w-full text-left py-4 border-b border-white/5 font-syne text-sm uppercase tracking-[0.15em] transition-colors"
              style={{
                color: active === n.id ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            >
              <span className="text-white/20 mr-4 text-xs">0{NAV_ITEMS.indexOf(n) + 1}</span>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
