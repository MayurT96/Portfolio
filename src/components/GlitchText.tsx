"use client";

import React, { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!?<>/\\|[]{}";

interface GlitchTextProps {
  children: string;
  style?: React.CSSProperties;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  trigger?: "mount" | "inview";
  speed?: number;
}

export default function GlitchText({
  children,
  style,
  className,
  as: Tag = "span",
  delay = 0,
  trigger = "inview",
  speed = 28,
}: GlitchTextProps) {
  const [displayed, setDisplayed] = useState(trigger === "mount" ? "" : children);
  const ref = useRef<HTMLElement>(null);
  const hasRun = useRef(false);

  const runScramble = () => {
    if (hasRun.current) return;
    hasRun.current = true;
    const target = children;
    const totalFrames = target.length * 2.2;
    let frame = 0;
    const interval = setInterval(() => {
      const revealed = Math.floor((frame / totalFrames) * target.length);
      const scrambled = target.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < revealed) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      setDisplayed(scrambled);
      frame++;
      if (frame > totalFrames + 8) {
        clearInterval(interval);
        setDisplayed(target);
      }
    }, speed);
  };

  useEffect(() => {
    if (trigger === "mount") {
      const t = setTimeout(runScramble, delay);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(runScramble, delay);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // @ts-ignore
  return <Tag ref={ref} className={className} style={{ ...style, fontVariantNumeric: "tabular-nums" }}>{displayed || children}</Tag>;
}
