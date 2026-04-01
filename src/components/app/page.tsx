"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeScene from "@/components/ThreeScene";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        setScroll(self.progress);
      },
    });
  }, []);

  return (
    <>
      {/* 🔥 3D Background */}
      <ThreeScene scroll={scroll} />

      {/* 🔥 Scroll content */}
      <div className="h-[300vh] flex items-center justify-center text-white text-4xl">
        Scroll Down 🔥
      </div>
    </>
  );
}