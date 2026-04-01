"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const EMAIL = "mayurtamkhane96@gmail.com";

  useEffect(() => {
    ensureGsap();

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );
  }, []);

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMagnetic = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
    gsap.to(btnRef.current, { x, y, duration: 0.3, ease: "power2.out" });
  };

  const handleMagneticLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    
    // Magnetic squish animation
    gsap.to(btnRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative w-full py-32 px-6 md:px-12 z-20">
      <div className="mx-auto w-full max-w-7xl relative">
        
        <div 
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative"
        >
          {/* Subtle background glow behind the form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent-glow blur-[100px] pointer-events-none -z-10 rounded-full" />

          {/* Left Column (Info) */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center gap-10">
            <div className="flex flex-col gap-4">
              <span className="font-syne text-sm tracking-[0.2em] text-accent-neon uppercase">
                05. Contact
              </span>
              <h2 className="font-syne text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-none neon-text">
                Let's <br/> Collaborate
              </h2>
            </div>
            
            <p className="font-space-grotesk text-lg text-white/50 font-light max-w-md">
              Whether you have a specific project in mind, or just want to explore possibilities, my inbox is always open.
            </p>

            <div className="flex flex-col gap-6 w-full pt-8 border-t border-white/10 mt-4">
              <button 
                onClick={copyEmail}
                className="group flex items-center justify-between w-full p-6 rounded-2xl deep-glass deep-glass-hover transition-all duration-300 relative overflow-hidden text-left"
              >
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-neon to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 pointer-events-none" />
                <span className="font-space-grotesk text-lg text-white/80 group-hover:text-white transition-colors relative z-10">{EMAIL}</span>
                <span className="font-syne text-xs uppercase tracking-widest text-white/30 group-hover:text-accent-neon transition-colors relative z-10">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
              
              <div className="flex gap-4">
                <a href="https://github.com/MayurT96" target="_blank" rel="noreferrer" className="flex-1 p-4 text-center rounded-xl deep-glass deep-glass-hover text-white/70 text-sm font-space-grotesk uppercase tracking-widest transition-all">GitHub</a>
                <a href="https://www.linkedin.com/in/mayur-tamkhane-7a9726243" target="_blank" rel="noreferrer" className="flex-1 p-4 text-center rounded-xl deep-glass deep-glass-hover text-white/70 text-sm font-space-grotesk uppercase tracking-widest transition-all">LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-8 md:p-12 rounded-3xl deep-glass relative overflow-hidden group/form shadow-2xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="relative">
                  <input type="text" name="name" required placeholder="Name" disabled={status === "sending"} className="w-full bg-transparent border-b border-white/10 py-4 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-accent-neon transition-colors peer" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-accent-neon scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                </div>
                <div className="relative">
                  <input type="email" name="email" required placeholder="Email" disabled={status === "sending"} className="w-full bg-transparent border-b border-white/10 py-4 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-accent-neon transition-colors peer" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-accent-neon scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                </div>
              </div>
              
              <div className="relative">
                <textarea name="message" required placeholder="Message" rows={4} disabled={status === "sending"} className="w-full bg-transparent border-b border-white/10 py-4 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-accent-neon transition-colors peer resize-none" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-accent-neon scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
              </div>
              
              <div className="flex justify-end pt-8">
                <button 
                  ref={btnRef}
                  onMouseMove={handleMagnetic}
                  onMouseLeave={handleMagneticLeave}
                  type="submit" 
                  disabled={status === "sending"} 
                  className="relative px-8 py-4 rounded-full bg-accent text-white font-syne uppercase tracking-widest text-sm font-bold overflow-hidden group hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] hover:bg-accent-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10">
                    {status === "idle" && "Send Message"}
                    {status === "sending" && "Sending..."}
                    {status === "sent" && "Sent Successfully"}
                    {status === "error" && "Error. Try Again."}
                  </span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Minimal Footer */}
        <div className="mt-40 border-t border-white/10 pt-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-white/30 uppercase tracking-[0.2em] font-syne">
          <span>&copy; {new Date().getFullYear()} Mayur Tamkhane</span>
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-white/10" />
            <span className="text-accent-neon">Built with intent</span>
            <div className="w-8 h-px bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
