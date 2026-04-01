"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  r: number; a: number;
};

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const COUNT = 55;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Soft mouse influence
    const mouse = { x: -1000, y: -1000 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Seed particles
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.08,
        r:  Math.random() * 1.4 + 0.4,
        a:  Math.random() * 0.2 + 0.06,
      });
    }

    let raf: number;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Very gentle mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (1 - dist / 120) * 0.018;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping keeps velocity in check
        p.vx *= 0.998;
        p.vy *= 0.998;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
