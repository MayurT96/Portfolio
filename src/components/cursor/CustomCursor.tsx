"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    ensureGsap();
    const dot = dotRef.current;
    if (!dot) return;

    const qDotX = gsap.quickTo(dot, "x", { duration: 0.1 });
    const qDotY = gsap.quickTo(dot, "y", { duration: 0.1 });

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    // 🔥 FIRE SPARK FUNCTION
    const createFireSpark = (x: number, y: number) => {
      const spark = document.createElement("div");

      spark.style.position = "fixed";
      spark.style.left = x + "px";
      spark.style.top = y + "px";
      spark.style.width = "6px";
      spark.style.height = "6px";
      spark.style.borderRadius = "50%";
      spark.style.pointerEvents = "none";
      spark.style.zIndex = "9999";

      // 🔥 Fire gradient color
      spark.style.background =
        "radial-gradient(circle, #fffb00, #ff7b00, #ff0000)";
      spark.style.boxShadow =
        "0 0 10px #ff7b00, 0 0 20px #ff0000";

      document.body.appendChild(spark);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 40 + 20;

      gsap.to(spark, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 20, // 🔥 upward fire motion
        scale: 0,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => spark.remove(),
      });
    };

    const onMove = (e: PointerEvent) => {
      qDotX(e.clientX);
      qDotY(e.clientY);

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // 🔥 Speed based sparks
      if (speed > 3) {
        for (let i = 0; i < 3; i++) {
          createFireSpark(e.clientX, e.clientY);
        }
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="w-2 h-2 bg-white rounded-full fixed top-0 left-0 z-[9999]"
      style={{ transform: "translate(-50%, -50%)" }}
    />
  );
}