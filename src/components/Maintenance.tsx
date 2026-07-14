"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiMail, FiCpu, FiSettings, FiActivity } from "react-icons/fi";
import AmbientBackground from "@/components/background/AmbientBackground";

const TERMINAL_LOGS = [
  "Initializing neural interface...",
  "Syncing digital workspace clusters...",
  "Compiling next-gen design tokens...",
  "Refactoring high-performance assets...",
  "Deploying quantum layout modules...",
  "Injecting custom animations...",
  "Optimizing interaction pathways...",
  "Calibrating system parameters...",
  "Securing communications pipeline...",
  "Systems operational. Waiting for reload..."
];

export default function Maintenance() {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [dots, setDots] = useState("");

  // Cycle pulsating dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Terminal ticker effect
  useEffect(() => {
    if (currentLogIndex < TERMINAL_LOGS.length) {
      const delay = Math.random() * 1200 + 600; // random delay between logs
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev.slice(-3), TERMINAL_LOGS[currentLogIndex]]);
        setCurrentLogIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Loop logs or show final status
      const timer = setTimeout(() => {
        setLogs([]);
        setCurrentLogIndex(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentLogIndex]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black px-6 py-12 overflow-hidden select-none">
      {/* Dynamic Starfield Canvas Background */}
      <AmbientBackground />

      {/* Decorative Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        {/* Glowing Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/20 backdrop-blur-md text-[10px] md:text-xs font-mono uppercase tracking-widest text-indigo-400 mb-8 shadow-[0_0_20px_rgba(79,70,229,0.15)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Upgrade In Progress
        </motion.div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white mb-6 uppercase leading-[1.1]">
          Crafting Something{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-400 bg-300% animate-gradient-shift">
            Extraordinary
          </span>
        </h1>

        {/* Message */}
        <p className="text-sm md:text-base font-sans text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Hi! I&apos;m <span className="text-neutral-200 font-semibold">Mayur</span>. I am currently upgrading my portfolio with exciting new features, projects, and a fully polished user experience. 
          The website is temporarily undergoing scheduled maintenance to push these updates. 
          I will be back online shortly!
        </p>

        {/* Interactive Simulated Terminal Logs */}
        <div className="w-full max-w-lg mx-auto bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-5 mb-10 text-left font-mono text-xs text-neutral-500 shadow-2xl backdrop-blur-xl relative group">
          <div className="absolute top-3 right-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
          </div>
          <div className="flex items-center gap-2 text-indigo-400/80 font-bold mb-3 border-b border-neutral-900 pb-2">
            <FiCpu className="animate-spin-slow text-sm" />
            <span>UPGRADE_CONSOLE.LOG</span>
          </div>
          <div className="space-y-1.5 min-h-[72px] flex flex-col justify-end">
            <AnimatePresence initial={false}>
              {logs.map((log, idx) => (
                <motion.div
                  key={log + idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="text-indigo-500/50 select-none">&gt;</span>
                  <span className={idx === logs.length - 1 ? "text-neutral-300" : "text-neutral-500"}>
                    {log}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Status Pinger */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-500 mb-12">
          <FiActivity className="text-indigo-400 animate-pulse" />
          <span>Status: Calibrating engines{dots}</span>
        </div>

        {/* Divider */}
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-neutral-700 to-transparent mx-auto mb-10" />

        {/* Social Connection Channels */}
        <div className="flex items-center justify-center gap-5">
          <motion.a
            href="https://github.com/MayurT96"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-all text-xs font-mono text-neutral-400"
          >
            <FaGithub className="text-base" />
            <span>GitHub</span>
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/mayur-tamkhane-7a9726243"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-all text-xs font-mono text-neutral-400"
          >
            <FaLinkedinIn className="text-base text-sky-400" />
            <span>LinkedIn</span>
          </motion.a>

          <motion.a
            href="mailto:mayurtamkhane96@gmail.com"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-all text-xs font-mono text-neutral-400"
          >
            <FiMail className="text-base text-indigo-400" />
            <span>Email</span>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
