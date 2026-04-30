"use client";

import { useEffect, useRef } from "react";

/**
 * LUXURY FIREWORKS - Adapted from Caleb Miller's Fireworks
 * Colors refined for Indigo/Purple/Gold Luxury Aesthetic
 */

// --- UTILS ---
const MyMath = {
  random: (min: number, max: number) => Math.random() * (max - min) + min,
  randomChoice: (arr: any[]) => arr[Math.floor(Math.random() * arr.length)],
  pointDist: (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },
  pointAngle: (x1: number, y1: number, x2: number, y2: number) => {
    return Math.atan2(y2 - y1, x2 - x1);
  },
  clamp: (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))
};

const PI_2 = Math.PI * 2;
const GRAVITY = 0.9;

const LUXURY_COLORS = {
  Indigo: "#4338ca", // Deeper indigo
  Purple: "#7c3aed", // Richer purple
  Gold:   "#b45309", // Bronze-gold
  White:  "#cbd5e1", // Slate-white
  Blue:   "#0ea5e9"
};

const COLOR_CODES = Object.values(LUXURY_COLORS);
const INVISIBLE = "_INVISIBLE_";

// --- CLASSES (Simplified for React) ---
class Star {
  static airDrag = 0.98;
  static airDragHeavy = 0.992;
  
  visible = true;
  heavy = false;
  x: number; y: number;
  prevX: number; prevY: number;
  color: string;
  speedX: number; speedY: number;
  life: number; fullLife: number;
  sparkFreq = 0;
  sparkTimer = 0;
  onDeath: ((star: Star) => void) | null = null;
  secondColor: string | null = null;
  transitionTime = 0;
  colorChanged = false;

  constructor(x: number, y: number, color: string, angle: number, speed: number, life: number, speedOffX = 0, speedOffY = 0) {
    this.x = x; this.y = y;
    this.prevX = x; this.prevY = y;
    this.color = color;
    this.speedX = Math.sin(angle) * speed + speedOffX;
    this.speedY = Math.cos(angle) * speed + speedOffY;
    this.life = life;
    this.fullLife = life;
  }
}

class Spark {
  static airDrag = 0.9;
  x: number; y: number;
  prevX: number; prevY: number;
  color: string;
  speedX: number; speedY: number;
  life: number;

  constructor(x: number, y: number, color: string, angle: number, speed: number, life: number) {
    this.x = x; this.y = y;
    this.prevX = x; this.prevY = y;
    this.color = color;
    this.speedX = Math.sin(angle) * speed;
    this.speedY = Math.cos(angle) * speed;
    this.life = life;
  }
}

export default function Fireworks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailsCanvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !trailsCanvasRef.current) return;
    
    const mainCtx = canvasRef.current.getContext("2d")!;
    const trailsCtx = trailsCanvasRef.current.getContext("2d")!;
    
    let stageW = window.innerWidth;
    let stageH = window.innerHeight;
    
    const activeStars: Record<string, Star[]> = { [INVISIBLE]: [] };
    COLOR_CODES.forEach(c => activeStars[c] = []);
    
    const activeSparks: Record<string, Spark[]> = { [INVISIBLE]: [] };
    COLOR_CODES.forEach(c => activeSparks[c] = []);
    
    const resize = () => {
      stageW = window.innerWidth;
      stageH = window.innerHeight;
      [canvasRef.current, trailsCanvasRef.current].forEach(c => {
        if (c) {
          c.width = stageW * window.devicePixelRatio;
          c.height = stageH * window.devicePixelRatio;
          c.getContext("2d")!.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
      });
    };
    resize();
    window.addEventListener("resize", resize);

    const addStar = (x: number, y: number, color: string, angle: number, speed: number, life: number, offX = 0, offY = 0) => {
      const s = new Star(x, y, color, angle, speed, life, offX, offY);
      if (activeStars[color]) activeStars[color].push(s);
      return s;
    };

    const addSpark = (x: number, y: number, color: string, angle: number, speed: number, life: number) => {
      const s = new Spark(x, y, color, angle, speed, life);
      if (activeSparks[color]) activeSparks[color].push(s);
    };

    const createBurst = (count: number, x: number, y: number, color: string, spread: number, life: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * PI_2;
        const speed = Math.random() * (spread / 100);
        addStar(x, y, color, angle, speed, life + Math.random() * life * 0.2);
      }
    };

    const launchShell = () => {
      const x = MyMath.random(stageW * 0.2, stageW * 0.8);
      const y = stageH;
      const targetY = MyMath.random(stageH * 0.1, stageH * 0.4);
      const color = MyMath.randomChoice(COLOR_CODES);
      const velocity = Math.pow((y - targetY) * 0.04, 0.64);
      
      const comet = addStar(x, y, color, Math.PI, velocity, velocity * 400);
      comet.heavy = true;
      comet.onDeath = (s) => {
        const burstCount = stageW < 768 ? 20 : 45;
        createBurst(burstCount, s.x, s.y, color, 300, 1000);
      };
    };

    let lastLaunch = 0;
    let raf: number;

    const tick = (now: number) => {
      const delta = 16; 

      const launchDelay = stageW < 768 ? 7000 : 3500;
      if (now - lastLaunch > launchDelay) {
        launchShell();
        lastLaunch = now;
      }

      // Physics logic
      [...COLOR_CODES, INVISIBLE].forEach(color => {
        const stars = activeStars[color];
        for (let i = stars.length - 1; i >= 0; i--) {
          const s = stars[i];
          s.life -= delta;
          if (s.life <= 0) {
            if (s.onDeath) s.onDeath(s);
            stars.splice(i, 1);
          } else {
            s.prevX = s.x; s.prevY = s.y;
            s.x += s.speedX; s.y += s.speedY;
            const drag = s.heavy ? Star.airDragHeavy : Star.airDrag;
            s.speedX *= drag; s.speedY *= drag;
            s.speedY += delta / 1000 * GRAVITY;
          }
        }

        const sparks = activeSparks[color];
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.life -= delta;
          if (s.life <= 0) sparks.splice(i, 1);
          else {
            s.prevX = s.x; s.prevY = s.y;
            s.x += s.speedX; s.y += s.speedY;
            s.speedX *= Spark.airDrag;
            s.speedY *= Spark.airDrag;
            s.speedY += delta / 1000 * GRAVITY;
          }
        }
      });

      // Trails render
      trailsCtx.globalCompositeOperation = "source-over";
      trailsCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
      trailsCtx.fillRect(0, 0, stageW, stageH);
      trailsCtx.globalCompositeOperation = "lighten";

      COLOR_CODES.forEach(color => {
        const stars = activeStars[color];
        trailsCtx.strokeStyle = color;
        trailsCtx.lineWidth = 2;
        trailsCtx.beginPath();
        stars.forEach(s => {
          if (s.color !== INVISIBLE) {
            trailsCtx.moveTo(s.x, s.y);
            trailsCtx.lineTo(s.prevX, s.prevY);
          }
        });
        trailsCtx.stroke();
      });

      // Main render (Heads)
      mainCtx.clearRect(0, 0, stageW, stageH);
      COLOR_CODES.forEach(color => {
        mainCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
        activeStars[color].forEach(s => {
          if (s.color !== INVISIBLE) {
            mainCtx.beginPath();
            mainCtx.arc(s.x, s.y, 0.8, 0, PI_2);
            mainCtx.fill();
          }
        });
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const handlePointerDown = (e: PointerEvent) => {
      // Manual launch on click
      const x = e.clientX;
      const y = stageH;
      const targetY = e.clientY;
      const color = MyMath.randomChoice(COLOR_CODES);
      const velocity = Math.pow((y - targetY) * 0.04, 0.64);
      const comet = addStar(x, y, color, Math.PI, velocity, velocity * 400);
      comet.heavy = true;
      comet.onDeath = (s) => {
        const burstCount = stageW < 768 ? 25 : 55;
        createBurst(burstCount, s.x, s.y, color, 350, 1200);
      };
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointerDown);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <canvas ref={trailsCanvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "screen", opacity: 0.35 }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }} />
    </div>
  );
}
