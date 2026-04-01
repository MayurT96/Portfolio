"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";

// Icons
const MoonIcon = () => (
  <svg
    width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg
    width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1"   x2="12" y2="3" />
    <line x1="12" y1="21"  x2="12" y2="23" />
    <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1"  y1="12" x2="3"  y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
  </svg>
);

export default function ThemeToggle() {
  const [theme, setTheme]     = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Read saved preference on mount
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) ?? "dark";
    setTheme(saved);
    applyTheme(saved);
    setMounted(true);
  }, []);

  function applyTheme(t: Theme) {
    document.documentElement.setAttribute("data-theme", t === "dark" ? "" : t);
    localStorage.setItem(STORAGE_KEY, t);
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  // Avoid SSR mismatch — render nothing until client-side
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={{
        /* Position */
        position:  "fixed",
        bottom:    "clamp(1.25rem, 3vw, 2rem)",
        right:     "clamp(1.25rem, 3vw, 2rem)",
        zIndex:    9980,

        /* Size */
        width:  "2.6rem",
        height: "2.6rem",
        borderRadius: "50%",

        /* Glassmorphism */
        background:    hovered
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.06)",
        border:        `1px solid ${hovered ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)"}`,
        backdropFilter:         "blur(16px) saturate(160%)",
        WebkitBackdropFilter:   "blur(16px) saturate(160%)",
        boxShadow:     hovered
          ? "0 6px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)"
          : "0 3px 14px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",

        /* Content */
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        color: isDark ? "rgba(255,255,255,0.65)" : "rgba(10,10,20,0.6)",

        /* Interaction */
        cursor:     "pointer",
        outline:    "none",
        userSelect: "none",

        /* Smooth transitions — ONLY on this element */
        transition: [
          "background 0.25s ease",
          "border-color 0.25s ease",
          "box-shadow 0.25s ease",
          "color 0.25s ease",
          "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
        ].join(", "),

        transform: hovered ? "scale(1.1)" : "scale(1)",
      }}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
