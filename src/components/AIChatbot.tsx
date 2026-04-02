"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";

const BOT_PERSONA = {
  name: "BunnyAI",
  owner: "Mayur Tamkhane (Bunny96)",
  bio: "I am a custom-trained assistant for Mayur Tamkhane — a passionate Fresher Web Developer from Dhule, Maharashtra.",
  knowledge: {
    skills: "Mayur specializes in React, Next.js, Three.js, TypeScript, and the MERN stack (MongoDB, Express, Node.js).",
    projects: "He built BunnyTravel (3D Globe app), a full-stack E-Commerce Store, and a Task Manager Kanban app.",
    contact: "You can reach him at mayurtamkhane96@gmail.com or call +91 7387553347.",
    hire: "Mayur is hungry to learn and focuses on shipping real-world products. He is currently open to Junior or Intern roles!"
  }
};

const getSmartFallback = (input: string) => {
  const msg = input.toLowerCase();
  
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return `Hey! I'm ${BOT_PERSONA.name}. I'm here to tell you everything about Mayur's skills and projects. Try asking about his "React skills" or "BunnyTravel"!`;
  }
  
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack") || msg.includes("know")) {
    return BOT_PERSONA.knowledge.skills;
  }
  
  if (msg.includes("project") || msg.includes("work") || msg.includes("build") || msg.includes("portfolio")) {
    return `He has built some impressive things like: ${BOT_PERSONA.knowledge.projects}. You can see them in the Projects section!`;
  }

  if (msg.includes("job") || msg.includes("hire") || msg.includes("available") || msg.includes("intern")) {
    return BOT_PERSONA.knowledge.hire;
  }
  
  if (msg.includes("contact") || msg.includes("email") || msg.includes("phone") || msg.includes("reach")) {
    return BOT_PERSONA.knowledge.contact;
  }

  if (msg.includes("travel") || msg.includes("bunnytravel") || msg.includes("3d") || msg.includes("globe")) {
    return "BunnyTravel is a 3D travel booking app Mayur built using Three.js and React. It's inspired by MakeMyTrip and features a really cool interactive 3D globe!";
  }

  if (msg.includes("who are you") || msg.includes("what is this")) {
    return BOT_PERSONA.bio;
  }

  return "That's a good question! I'm trained on Mayur's portfolio. I can tell you about his MERN stack skills, his GitHub projects, or how to get in touch with him. Want to hear more?";
};

interface Message {
  id: string | number;
  role: "ai" | "user";
  text: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "ai", text: "Hi! I'm BunnyAI. I've been trained on Mayur's entire portfolio. Ask me anything!" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const simulateTyping = (fullText: string) => {
    let currentText = "";
    const words = fullText.split(" ");
    let i = 0;
    
    const msgId = Date.now();
    setMessages(prev => [...prev, { id: msgId, role: "ai", text: "" }]);
    
    const interval = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? "" : " ") + words[i];
        setMessages(prev => prev.map((m) => 
          (m.id === msgId) ? { ...m, text: currentText } : m
        ));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 35);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;
    
    const userMsg: Message = { id: Date.now() + 1, role: "user", text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const messageHistory = messages.map(m => ({ role: m.role, content: m.text }));
      messageHistory.push({ role: "user", content: userMsg.text });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messageHistory })
      });

      const data = await res.json();
      
      // If API key is missing or fails, use the SMART FALLBACK
      if (data.error || !data.text) {
        setTimeout(() => simulateTyping(getSmartFallback(userMsg.text)), 500);
        return;
      }

      simulateTyping(data.text);
    } catch (err) {
      // Fallback on network error
      setTimeout(() => simulateTyping(getSmartFallback(userMsg.text)), 500);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(167, 139, 250, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: isOpen ? 0 : [0, -10, 0] }}
        transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", bottom: "30px", right: "30px", width: "66px", height: "66px",
          borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa 0%, #763ced 100%)",
          color: "white", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 12px 35px rgba(124, 58, 237, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
          zIndex: 99999, border: "1px solid rgba(255, 255, 255, 0.25)", cursor: "pointer"
        }}
      >
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ position: "absolute", inset: -12, borderRadius: "50%", background: "radial-gradient(circle, rgba(167, 139, 250, 0.45) 0%, transparent 70%)", zIndex: -1 }}
          />
        )}
        <AnimatePresence mode="wait">
          {isOpen ? <FiX size={28} key="x" /> : <FiMessageSquare size={28} key="m" />}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100, x: 50 }}
            style={{
              position: "fixed", bottom: "110px", right: "30px", width: "min(400px, 90vw)", height: "550px",
              background: "rgba(10, 10, 25, 0.85)", backdropFilter: "blur(24px)", borderRadius: "28px",
              border: "1px solid rgba(255, 255, 255, 0.12)", boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.6)",
              zIndex: 99998, overflow: "hidden", display: "flex", flexDirection: "column"
            }}
          >
            <div style={{ padding: "26px", background: "rgba(167, 139, 250, 0.08)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px", color: "white" }}>B</div>
                  <div style={{ position: "absolute", bottom: 1, right: 1, width: "13px", height: "13px", borderRadius: "50%", background: "#10b981", border: "2px solid #0a0a19" }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "19px", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>BunnyAI</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}>Intelligent Portfolio Guide</p>
                </div>
              </div>
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12, x: m.role === "ai" ? -12 : 12 }} animate={{ opacity: 1, y: 0, x: 0 }}
                  style={{
                    maxWidth: "85%", padding: "14px 18px", borderRadius: "20px", fontSize: "14.5px", lineHeight: "1.6",
                    alignSelf: m.role === "ai" ? "flex-start" : "flex-end",
                    background: m.role === "ai" ? "rgba(255, 255, 255, 0.05)" : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                    color: m.role === "ai" ? "rgba(255, 255, 255, 0.95)" : "white",
                    borderTopLeftRadius: m.role === "ai" ? 0 : "20px", borderTopRightRadius: m.role === "user" ? 0 : "20px",
                    border: m.role === "ai" ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                  }}>
                  {m.text}
                </motion.div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: "flex-start", background: "rgba(255, 255, 255, 0.05)", padding: "14px 20px", borderRadius: "0 20px 20px 20px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)" }}>Thinking...</motion.div>
                </div>
              )}
            </div>

            <div style={{ padding: "20px 24px 24px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "16px" }}>
                {["About Mayur", "Tech Stack", "BunnyTravel", "Contact Info"].map(s => (
                  <motion.button key={s} whileHover={{ y: -2, background: "rgba(167, 139, 250, 0.15)" }} whileTap={{ scale: 0.95 }} onClick={() => { setInputText(s); }}
                    style={{ whiteSpace: "nowrap", padding: "8px 16px", borderRadius: "100px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: "12px", cursor: "pointer" }}>{s}</motion.button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "100px", padding: "10px 10px 10px 22px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  style={{ background: "transparent", border: "none", color: "white", width: "100%", outline: "none", fontSize: "15px" }} />
                <motion.button whileHover={{ scale: 1.1, background: "#8b5cf6" }} whileTap={{ scale: 0.9 }} onClick={handleSend}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#a78bfa", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><FiSend size={20} /></motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
