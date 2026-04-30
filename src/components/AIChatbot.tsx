"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";
import gsap from "gsap";

const AIOrbScene = lazy(() => import("./AIOrbScene"));

const getSmartFallback = (input: string) => {
  const msg = input.toLowerCase().trim();
  if (/^(hey|hi|hello|yo|sup|what'?s up|hola)/i.test(msg))
    return "Hey there! 👋 I'm BunnyAI — Mayur's personal AI assistant. I can tell you about his skills, projects, or answer pretty much anything. What's on your mind?";
  if (msg.includes("who is mayur") || msg.includes("about mayur") || msg.includes("tell me about"))
    return "Mayur Tamkhane (Bunny96) is a passionate Fresher Web Developer from Dhule, Maharashtra. He builds slick animated UIs with React, Next.js, Three.js & GSAP. Currently hunting for Junior Dev or Intern roles — want to see his projects?";
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack") || msg.includes("know"))
    return "Mayur's core stack: React, Next.js, TypeScript, Three.js, GSAP on the frontend, and Node.js, Express, MongoDB (MERN) on the backend. He's also solid with Tailwind CSS and Framer Motion ✨";
  if (msg.includes("project") || msg.includes("work") || msg.includes("built") || msg.includes("portfolio"))
    return "His standout projects: 🌍 BunnyTravel (3D globe travel app), 🛒 E-Commerce Store (full-stack MERN), 📱 VPN Android App, and 📋 Kanban Task Manager. Check out the Projects section!";
  if (msg.includes("hire") || msg.includes("job") || msg.includes("available") || msg.includes("intern"))
    return "Yep — Mayur is actively looking for Junior Developer or Intern roles! Reach him at mayurtamkhane96@gmail.com or +91 7387553347.";
  if (msg.includes("contact") || msg.includes("email") || msg.includes("phone") || msg.includes("reach"))
    return "📧 mayurtamkhane96@gmail.com\n📱 +91 7387553347\n\nFeel free to reach out — Mayur responds fast!";
  if (msg.includes("who are you") || msg.includes("what are you") || msg.includes("bunnyai"))
    return "I'm BunnyAI — a smart AI assistant living inside Mayur's portfolio. Think of me as ChatGPT, but with insider knowledge about Mayur 😄";
  if (msg.includes("thank") || msg.includes("thanks"))
    return "Anytime! 😊 If you want to know more about Mayur's work, I'm right here.";
  return "Interesting question! My full AI capabilities need the API connection. Try asking about Mayur's skills, projects, or how to reach him 🚀";
};

interface Message { id: string | number; role: "ai" | "user"; text: string; }

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "ai", text: "Hey! 👋 I'm BunnyAI — Mayur's intelligent portfolio assistant. Ask me anything about his skills, projects, or literally any question. I'm basically ChatGPT with insider knowledge 😄" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // GSAP refs
  const headerRef = useRef<HTMLDivElement>(null);
  const quickPromptsRef = useRef<HTMLDivElement>(null);
  const dotEls = useRef<(HTMLDivElement | null)[]>([]);
  const dotsTween = useRef<gsap.core.Tween | null>(null);
  const animatedIds = useRef(new Set<string | number>());
  const fabGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // GSAP: FAB glow pulse
  useEffect(() => {
    if (!fabGlowRef.current || isOpen) return;
    const tw = gsap.to(fabGlowRef.current, { scale: 1.5, opacity: 0.08, duration: 1.8, ease: "sine.inOut", repeat: -1, yoyo: true });
    return () => { tw.kill(); };
  }, [isOpen]);

  // GSAP: Chat internals entrance
  useEffect(() => {
    if (!isOpen) return;
    const tl = gsap.timeline();
    if (headerRef.current) {
      tl.from(headerRef.current.querySelectorAll("[data-anim]"), { y: 18, opacity: 0, stagger: 0.08, duration: 0.5, ease: "power3.out" }, 0.15);
    }
    if (quickPromptsRef.current) {
      tl.from(quickPromptsRef.current.children, { x: -12, opacity: 0, stagger: 0.05, duration: 0.35, ease: "back.out(1.5)" }, 0.3);
    }
    return () => { tl.kill(); };
  }, [isOpen]);

  // GSAP: Typing dots bounce
  useEffect(() => {
    if (!isTyping) { dotsTween.current?.kill(); return; }
    const t = setTimeout(() => {
      const dots = dotEls.current.filter(Boolean) as HTMLDivElement[];
      if (dots.length === 3) {
        dotsTween.current = gsap.to(dots, { y: -7, duration: 0.35, ease: "power2.inOut", stagger: { each: 0.12, repeat: -1, yoyo: true } });
      }
    }, 50);
    return () => { clearTimeout(t); dotsTween.current?.kill(); };
  }, [isTyping]);

  // GSAP: Animate new message bubbles
  const animMsg = useCallback((el: HTMLDivElement | null, msg: Message) => {
    if (!el || animatedIds.current.has(msg.id)) return;
    animatedIds.current.add(msg.id);
    gsap.fromTo(el,
      { opacity: 0, y: 22, scale: 0.92, rotation: msg.role === "ai" ? -2 : 2 },
      { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.5, delay: msg.id === "init" ? 0.35 : 0, ease: "back.out(1.3)" }
    );
  }, []);

  const simulateTyping = (fullText: string) => {
    let cur = ""; const words = fullText.split(" "); let i = 0;
    const id = Date.now();
    setMessages(p => [...p, { id, role: "ai", text: "" }]);
    const iv = setInterval(() => {
      if (i < words.length) { cur += (i === 0 ? "" : " ") + words[i]; setMessages(p => p.map(m => m.id === id ? { ...m, text: cur } : m)); i++; }
      else { clearInterval(iv); setIsTyping(false); }
    }, 30);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now() + 1, role: "user", text: inputText };
    setMessages(p => [...p, userMsg]); setInputText(""); setIsTyping(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.text }));
      history.push({ role: "user", content: userMsg.text });
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const data = await res.json();
      if (data.error || !data.text) { setTimeout(() => simulateTyping(getSmartFallback(userMsg.text)), 400); return; }
      simulateTyping(data.text);
    } catch { setTimeout(() => simulateTyping(getSmartFallback(userMsg.text)), 400); }
  };

  const prompts = ["About Mayur", "His Projects", "Tech Stack", "Hire Him"];

  return (
    <>
      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(167,139,250,0.6)" }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: isOpen ? 0 : [0, -8, 0] }}
        transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" }, type: "spring", stiffness: 400, damping: 15 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: "fixed", bottom: 30, right: 30, width: 66, height: 66, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#763ced)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 35px rgba(124,58,237,0.5),inset 0 2px 4px rgba(255,255,255,0.3)", zIndex: 99999, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer" }}
      >
        {!isOpen && <div ref={fabGlowRef} style={{ position: "absolute", inset: -14, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.5) 0%,transparent 70%)", zIndex: -1 }} />}
        <AnimatePresence mode="wait">
          {isOpen ? <FiX size={28} key="x" /> : <FiMessageSquare size={28} key="m" />}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.82, y: 50 }}
            transition={{ type: "spring", damping: 22, stiffness: 320, mass: 0.8 }}
            style={{ position: "fixed", bottom: 110, right: 30, width: "min(400px,90vw)", height: 550, background: "rgba(10,10,25,0.88)", backdropFilter: "blur(24px)", borderRadius: 28, border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 30px 60px -12px rgba(0,0,0,0.6)", zIndex: 99998, overflow: "hidden", display: "flex", flexDirection: "column", transformOrigin: "bottom right" }}
          >
            {/* Header with 3D Orb */}
            <div ref={headerRef} style={{ padding: "22px 26px", background: "rgba(167,139,250,0.08)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div data-anim style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", overflow: "hidden" }}>
                  <Suspense fallback={<div style={{ width: 56, height: 56, borderRadius: "50%", background: "conic-gradient(from 0deg,#a78bfa,#7c3aed,#22d3ee,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", fontSize: 14 }}>AI</div>}>
                    <AIOrbScene isActive={isTyping} />
                  </Suspense>
                  <div style={{ position: "absolute", bottom: 2, right: 2, width: 13, height: 13, borderRadius: "50%", background: "#10b981", border: "2px solid #0a0a19", zIndex: 2 }} />
                </div>
                <div data-anim>
                  <h3 style={{ margin: 0, fontSize: 19, fontFamily: "'Playfair Display',serif", fontWeight: 700 }}>BunnyAI</h3>
                  <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Smart Portfolio Assistant</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  ref={(el) => animMsg(el, m)}
                  style={{
                    maxWidth: "85%", padding: "14px 18px", borderRadius: 20, fontSize: 14.5, lineHeight: 1.6,
                    alignSelf: m.role === "ai" ? "flex-start" : "flex-end",
                    background: m.role === "ai" ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#a78bfa,#7c3aed)",
                    color: m.role === "ai" ? "rgba(255,255,255,0.95)" : "white",
                    borderTopLeftRadius: m.role === "ai" ? 0 : 20,
                    borderTopRightRadius: m.role === "user" ? 0 : 20,
                    border: m.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
                    whiteSpace: "pre-wrap", wordBreak: "break-word", opacity: 0,
                  }}
                >{m.text}</div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.05)", padding: "14px 22px", borderRadius: "0 20px 20px 20px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 7, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} ref={el => { dotEls.current[i] = el; }}
                      style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#22d3ee)" }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div style={{ padding: "20px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div ref={quickPromptsRef} style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 16, scrollbarWidth: "none" }}>
                {prompts.map(s => (
                  <button key={s} onClick={() => setInputText(s)}
                    style={{ whiteSpace: "nowrap", padding: "8px 16px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontSize: 12, cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", transition: "all 0.2s" }}
                    onMouseEnter={e => gsap.to(e.currentTarget, { y: -3, scale: 1.05, background: "rgba(167,139,250,0.2)", duration: 0.25 })}
                    onMouseLeave={e => gsap.to(e.currentTarget, { y: 0, scale: 1, background: "rgba(255,255,255,0.06)", duration: 0.25 })}
                  >{s}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, background: "rgba(255,255,255,0.04)", borderRadius: 100, padding: "10px 10px 10px 22px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <input type="text" placeholder="Ask me anything..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                  style={{ background: "transparent", border: "none", color: "white", width: "100%", outline: "none", fontSize: 15 }} />
                <button onClick={handleSend}
                  onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.15, rotation: 10, background: "#8b5cf6", duration: 0.25 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, rotation: 0, background: "#a78bfa", duration: 0.25 })}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "#a78bfa", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 15px rgba(139,92,246,0.4)" }}
                ><FiSend size={20} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
