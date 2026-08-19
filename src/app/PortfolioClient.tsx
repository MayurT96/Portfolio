// @ts-nocheck
"use client";





import { useState, useEffect, useRef } from "react";
import Skills from "../components/Skills";
import AIChatbot from "../components/AIChatbot";
import Fireworks from "../components/background/Fireworks";
import GlitchText from "../components/GlitchText";

function useInView(thr) {
  const t = thr === undefined ? 0.1 : thr;
  const ref = useRef(null);
  const s = useState(false); const vis = s[0]; const setVis = s[1];
  useEffect(function () {
    const obs = new IntersectionObserver(function (en) { if (en[0].isIntersecting) setVis(true); }, { threshold: t });
    if (ref.current) obs.observe(ref.current);
    return function () { obs.disconnect(); };
  }, [t]);
  return [ref, vis];
}

function Typewriter(props) {
  const words = props.words;
  const s1 = useState(""); const txt = s1[0]; const setTxt = s1[1];
  const s2 = useState(0); const wi = s2[0]; const setWi = s2[1];
  const s3 = useState(false); const del = s3[0]; const setDel = s3[1];
  useEffect(function () {
    const word = words[wi % words.length];
    const id = setTimeout(function () {
      if (!del) {
        const n = word.slice(0, txt.length + 1); setTxt(n);
        if (n.length === word.length) setTimeout(function () { setDel(true); }, 2000);
      } else {
        const n2 = word.slice(0, txt.length - 1); setTxt(n2);
        if (n2.length === 0) { setDel(false); setWi(function (i) { return i + 1; }); }
      }
    }, del ? 35 : 85);
    return function () { clearTimeout(id); };
  });
  return (
    <span>
      <span style={{ color: "#a78bfa" }}>{txt}</span>
      <span style={{ animation: "blink 1s step-end infinite", color: "#7c3aed" }}>|</span>
    </span>
  );
}

function Cursor() {
  const ring = useRef(null);
  const trails = useRef([null,null,null,null,null]);
  const rx = useRef(0); const ry = useRef(0); const mx = useRef(0); const my = useRef(0);
  const tx = useRef([0,0,0,0,0]); const ty = useRef([0,0,0,0,0]);
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const hasMoved = useRef(false);

  useEffect(function () {
    const onM = function (e) { 
      mx.current = e.clientX; 
      my.current = e.clientY; 
      // Fix fly-in glitch: Initialize position on first move
      if (!hasMoved.current) {
        rx.current = mx.current;
        ry.current = my.current;
        for(let i=0; i<5; i++) {
          tx.current[i] = mx.current;
          ty.current[i] = my.current;
        }
        hasMoved.current = true;
      }

      // Link/Button Detection
      let target = e.target;
      let hover = false;
      while (target && target !== document.body) {
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.getAttribute('role') === 'button' || target.style.cursor === 'pointer') {
          hover = true;
          break;
        }
        target = target.parentElement;
      }
      setIsHovering(hover);
    };
    window.addEventListener("mousemove", onM);
    
    let raf;
    function tick() {
      const dx = mx.current - rx.current;
      const dy = my.current - ry.current;
      
      // Smoothing
      rx.current += dx * 0.15;
      ry.current += dy * 0.15;
      
      const speed = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      // Dynamic scaling based on speed + hover state
      const baseScale = isHovering ? 1.8 : 1;
      const sx = Math.min(2.5, baseScale + speed * 0.015);
      const sy = Math.max(0.3, baseScale - speed * 0.005);
      
      if (ring.current) {
        ring.current.style.transform = "translate(" + (rx.current - 18) + "px," + (ry.current - 18) + "px) rotate(" + angle + "deg) scale(" + sx + "," + sy + ")";
        ring.current.style.borderColor = isHovering ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.45)";
        ring.current.style.background = isHovering ? "rgba(255, 255, 255, 0.08)" : "transparent";
      }

      tx.current[0] += (mx.current - tx.current[0]) * 0.35;
      ty.current[0] += (my.current - ty.current[0]) * 0.35;
      for(let i=1; i<5; i++) {
        tx.current[i] += (tx.current[i-1] - tx.current[i]) * 0.45;
        ty.current[i] += (ty.current[i-1] - ty.current[i]) * 0.45;
      }
      for(let j=0; j<5; j++) {
        if (trails.current[j]) {
          trails.current[j].style.transform = "translate(" + (tx.current[j] - 2) + "px," + (ty.current[j] - 2) + "px)";
          trails.current[j].style.opacity = isHovering ? "0" : (0.5 - j*0.08).toString();
        }
      }
      raf = requestAnimationFrame(tick);
    }
    tick();

    const onD = function() { setIsMouseDown(true); };
    const onU = function() { setIsMouseDown(false); };
    window.addEventListener("mousedown", onD);
    window.addEventListener("mouseup", onU);
    
    return function () { 
      window.removeEventListener("mousemove", onM); 
      window.removeEventListener("mousedown", onD); 
      window.removeEventListener("mouseup", onU); 
      cancelAnimationFrame(raf); 
    };
  }, [isHovering]);

  // Hide custom cursor on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <div style={{ pointerEvents: "none", zIndex: 10000000, mixBlendMode: "difference" }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} ref={el => trails.current[i] = el} style={{ 
          position: "fixed", top: 0, left: 0, width: 6, height: 6, 
          borderRadius: "50%", background: "#fff", filter: "blur(2px)", 
          pointerEvents: "none", transition: "opacity 0.4s",
          opacity: 0
        }} />
      ))}
      <div ref={ring} style={{ 
        position: "fixed", top: 0, left: 0, width: 36, height: 36, 
        borderRadius: "50%", border: "2px solid #fff", 
        pointerEvents: "none", transition: "border-color 0.3s, background 0.3s",
        boxShadow: "0 0 15px rgba(255,255,255,0.2)"
      }} />
    </div>
  );
}


function Preloader(props) {
  const s1 = useState(0); const pct = s1[0]; const setPct = s1[1];
  const s2 = useState(false); const out = s2[0]; const setOut = s2[1];
  useEffect(function () {
    let v = 0;
    var id = setInterval(function () {
      v += Math.random() * 8 + 3;
      if (v >= 100) { v = 100; clearInterval(id); setTimeout(function () { setOut(true); setTimeout(props.onDone, 500); }, 400); }
      setPct(Math.floor(v));
    }, 50);
    return function () { clearInterval(id); };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#06060f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 99999, opacity: out ? 0 : 1, transition: "opacity .5s", pointerEvents: out ? "none" : "all" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: ".35em", color: "#a78bfa", marginBottom: 30, textTransform: "uppercase" }}>Initializing</div>
      <div style={{ width: 200, height: 1, background: "rgba(255,255,255,.07)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: pct + "%", background: "linear-gradient(90deg,#6366f1,#a78bfa)", transition: "width .08s", boxShadow: "0 0 10px #7c3aed" }} />
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: "rgba(255,255,255,.2)", marginTop: 14 }}>{pct}%</div>
    </div>
  );
}

function Navbar(props) {
  const links = ["About", "Skills", "Projects", "Contact"];
  const s = useState(null); const hov = s[0]; const setHov = s[1];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(14px,4vw,80px)", background: props.scrolled ? "rgba(6,6,15,.92)" : "transparent", backdropFilter: props.scrolled ? "blur(22px)" : "none", WebkitBackdropFilter: props.scrolled ? "blur(22px)" : "none", borderBottom: props.scrolled ? "1px solid rgba(255,255,255,.06)" : "none", transition: "all .4s", width: "100%", maxWidth: "100vw", boxSizing: "border-box" }}>
      <GlitchText as="div" trigger="mount" delay={200} speed={22} style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(16px, 4vw, 19px)", background: "linear-gradient(120deg,#fff,rgba(167,139,250,.8))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Bunny96</GlitchText>
      <div className="nav-links-container" style={{ display: "flex", gap: "clamp(6px,2vw,36px)", alignItems: "center" }}>
        {links.map(function (l) {
          const isMain = l === "About" || l === "Projects";
          return <a key={l} href={"#" + l.toLowerCase()} onMouseEnter={function () { setHov(l); }} onMouseLeave={function () { setHov(null); }}
            className={"nav-link" + (isMain ? " active-on-mobile" : "")}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: hov === l ? "#fff" : "rgba(255,255,255,.55)", textDecoration: "none", transition: "color .25s", cursor: "none" }}>{l}</a>;
        })}
        <a href="https://github.com/MayurT96" target="_blank" rel="noopener noreferrer"
          className="nav-link active-on-mobile"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: ".08em", padding: "5px 12px", borderRadius: 40, border: "1px solid rgba(167,139,250,.35)", color: "rgba(167,139,250,.85)", textDecoration: "none", transition: "all .25s", cursor: "none" }}
          onMouseEnter={function (e) { e.currentTarget.style.background = "rgba(139,92,246,.12)"; e.currentTarget.style.color = "#c4b5fd"; }}
          onMouseLeave={function (e) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(167,139,250,.85)"; }}>
          GitHub
        </a>
      </div>
    </nav>
  );
}

function Fade(props) {
  const v = useInView(0.12); const ref = v[0]; const vis = v[1];
  const base = { 
    opacity: vis ? 1 : 0, 
    transform: vis ? "translateY(0)" : "translateY(40px)", 
    transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)" 
  };
  return <section id={props.id} ref={ref} style={Object.assign({}, base, props.style || {})}>{props.children}</section>;
}

function SH(props) {
  return (
    <div style={{ marginBottom: "clamp(32px, 5vw, 52px)" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 10, letterSpacing: ".3em", color: "#a78bfa", textTransform: "uppercase", marginBottom: 10 }}>
        <GlitchText trigger="inview" speed={16}>{props.tag}</GlitchText>
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(26px, 5vw, 48px)", color: "#fff", margin: 0, lineHeight: 1.15, letterSpacing: "-.02em" }}>{props.children}</h2>
      <div style={{ width: 38, height: 2, marginTop: 16, background: "linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius: 2, boxShadow: "0 0 10px #7c3aed" }} />
    </div>
  );
}

function PCard(props) {
  const p = props.p; const ref = useRef(null);
  const sh = useState(false); const hov = sh[0]; const setHov = sh[1];
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });

  return (
    <div ref={ref}
      onMouseEnter={function () { setHov(true); setGlare((prev) => ({ ...prev, o: 1 })); }}
      onMouseLeave={function () { 
        setHov(false); 
        setGlare((prev) => ({ ...prev, o: 0 }));
        if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"; 
      }}
      onMouseMove={function (e) {
        if (!ref.current) return;
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        // Premium Apple-like 3D tilt
        const tiltX = (0.5 - y) * 12;
        const tiltY = (x - 0.5) * 12;
        ref.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        
        // Dynamic Glare
        setGlare({ x: x * 100, y: y * 100, o: 1 });
      }}
      style={{ 
        position: "relative",
        background: "rgba(255,255,255,.02)", 
        border: "1px solid " + (hov ? "rgba(167,139,250,.4)" : "rgba(255,255,255,.05)"), 
        borderRadius: 22, 
        overflow: "hidden", 
        transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2), border-color 0.4s ease, box-shadow 0.4s ease", 
        transformStyle: "preserve-3d", 
        boxShadow: hov ? "0 20px 40px -10px rgba(124,58,237,.2)" : "0 4px 20px rgba(0,0,0,.3)",
        width: "100%",
        boxSizing: "border-box"
      }}>
      
      {/* Dynamic Cursor Glare */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(167,139,250, 0.15) 0%, transparent 60%)`,
        opacity: glare.o,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
        zIndex: 10
      }} />

      <div style={{ height: 165, background: "linear-gradient(135deg," + p.c1 + "18," + p.c2 + "12)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ fontSize: 52, filter: "drop-shadow(0 4px 14px " + p.c1 + "55)", transform: "translateZ(30px)", transition: "transform 0.4s ease" }}>{p.emoji}</div>
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 11 }}>
          <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ padding: "3px 9px", borderRadius: 20, background: "rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.65)", fontFamily: "'Playfair Display', serif", fontSize: 10, textDecoration: "none", cursor: "none" }}
            onMouseEnter={function (e) { e.currentTarget.style.color = "#fff"; }} onMouseLeave={function (e) { e.currentTarget.style.color = "rgba(255,255,255,.65)"; }}>GitHub ↗</a>
          {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" style={{ padding: "3px 9px", borderRadius: 20, background: p.c1 + "30", border: "1px solid " + p.c1 + "50", color: p.c1, fontFamily: "'Playfair Display', serif", fontSize: 10, textDecoration: "none", cursor: "pointer" }}>Live ↗</a>}
        </div>
      </div>
      <div style={{ padding: "clamp(16px, 3.5vw, 22px)" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 18, color: "#fff", margin: "0 0 7px", letterSpacing: "-.01em" }}><GlitchText trigger="inview" speed={20}>{p.title}</GlitchText></h3>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.65, margin: "0 0 16px", fontWeight: 300 }}>{p.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {p.stack.map(function (s) { return <span key={s} style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, fontFamily: "'Playfair Display', serif", background: p.c1 + "14", border: "1px solid " + p.c1 + "2a", color: p.c1 }}>{s}</span>; })}
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const sf = useState({ name: "", email: "", message: "" }); const form = sf[0]; const setForm = sf[1];
  const ss = useState("idle"); const status = ss[0]; const setStatus = ss[1];
  const sff = useState(null); const ff = sff[0]; const setFf = sff[1];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { setStatus("ef"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setStatus("ee"); return; }
    setStatus("sending");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,         // Tera state variable name
          email: form.email,       // Tera state variable email
          message: form.message,   // Tera state variable message
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => {
          alert("Message MySQL me save ho gaya! 🎉");
        }, 50);
      } else {
        setStatus("es");
        setTimeout(() => {
          alert("Error aaya: " + (data.error || "Failed to send"));
        }, 50);
      }
    } catch (error) {
      setStatus("es");
      setTimeout(() => {
        alert("Error aaya: Failed to send");
      }, 50);
    }
  };

  function iS(f) {
    return { width: "100%", maxWidth: "100%", padding: "12px 16px", background: "rgba(255,255,255,.04)", border: "1px solid " + (ff === f ? "rgba(167,139,250,.5)" : "rgba(255,255,255,.08)"), borderRadius: 11, color: "#fff", fontSize: 15, fontFamily: "'Playfair Display', serif", outline: "none", transition: "border-color .25s, box-shadow .25s", boxSizing: "border-box", boxShadow: ff === f ? "0 0 0 3px rgba(124,58,237,.12)" : "none", fontWeight: 300 };
  }

  if (status === "ok") return (
    <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeup .5s both" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 22, color: "#fff", marginBottom: 8 }}>Message sent!</h3>
      <p style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,.45)", lineHeight: 1.7, fontSize: 14, fontWeight: 300 }}>I'll get back to you at <strong style={{ color: "#a78bfa", fontWeight: 500 }}>mayurtamkhane96@gmail.com</strong> soon.</p>
      <button onClick={function () { setStatus("idle"); }} style={{ marginTop: 24, padding: "9px 24px", borderRadius: 40, border: "1px solid rgba(167,139,250,.3)", background: "transparent", color: "#a78bfa", fontFamily: "'Playfair Display', serif", fontSize: 12, letterSpacing: ".1em", cursor: "pointer" }}>Send another →</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      {[["name", "Name", "text", "Your name"], ["email", "Email", "email", "your@email.com"]].map(function (fi) {
        return (
          <div key={fi[0]} style={{ width: "100%" }}>
            <label style={{ display: "block", fontFamily: "'Playfair Display', serif", fontSize: 10, letterSpacing: ".18em", color: "rgba(255,255,255,.3)", textTransform: "uppercase", marginBottom: 7 }}>{fi[1]}</label>
            <input type={fi[2]} name={fi[0]} value={form[fi[0]]} placeholder={fi[3]} required style={iS(fi[0])}
              onChange={function (e) { const k = fi[0]; setForm(function (f) { const n = {}; n[k] = e.target.value; return Object.assign({}, f, n); }); }}
              onFocus={function () { setFf(fi[0]); }} onBlur={function () { setFf(null); }} />
          </div>
        );
      })}
      <div style={{ width: "100%" }}>
        <label style={{ display: "block", fontFamily: "'Playfair Display', serif", fontSize: 10, letterSpacing: ".18em", color: "rgba(255,255,255,.3)", textTransform: "uppercase", marginBottom: 7 }}>Message</label>
        <textarea name="message" required rows={4} value={form.message} placeholder="Tell me about the role or project…" style={Object.assign({}, iS("message"), { resize: "vertical", minHeight: 110 })}
          onChange={function (e) { setForm(function (f) { return Object.assign({}, f, { message: e.target.value }); }); }}
          onFocus={function () { setFf("message"); }} onBlur={function () { setFf(null); }} />
      </div>
      {status === "ef" && <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#f87171", padding: "9px 14px", borderRadius: 9, background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.18)" }}>⚠ Please fill all fields.</div>}
      {status === "ee" && <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#f87171", padding: "9px 14px", borderRadius: 9, background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.18)" }}>⚠ Please enter a valid email.</div>}
      {status === "es" && <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#f87171", padding: "9px 14px", borderRadius: 9, background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.18)" }}>⚠ Failed to send — email me at <a href="mailto:mayurtamkhane96@gmail.com" style={{ color: "#a78bfa" }}>mayurtamkhane96@gmail.com</a></div>}
      <button type="submit" disabled={status === "sending"} style={{ padding: "13px 28px", borderRadius: 40, border: "none", background: status === "sending" ? "rgba(99,102,241,.35)" : "linear-gradient(135deg,#6366f1,#a78bfa)", color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, letterSpacing: ".08em", cursor: status === "sending" ? "default" : "pointer", transition: "opacity .25s, transform .25s", alignSelf: "flex-start" }}
        onMouseEnter={function (e) { if (status !== "sending") { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,.4)"; } }}
        onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
        {status === "sending" ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}

function FloatingResume() {
  const [hov, setHov] = useState(false);
  const [status, setStatus] = useState("RESUME");
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Play sound
    if (typeof Audio !== "undefined") {
      const audio = new Audio("/fahhhhh.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }

    // Show 'Not Uploaded' status
    setStatus("NOT UPLOADED");
    setTimeout(() => {
      setStatus("RESUME");
    }, 2500);
  };

  return (
    <a 
      href="#" 
      onClick={handleClick}
      style={{
        position: "fixed",
        left: "clamp(12px, 3vw, 40px)",
        bottom: "clamp(16px, 3vw, 40px)",
        zIndex: 9998,
        padding: "10px 20px",
        borderRadius: 40,
        background: status === "NOT UPLOADED" ? "rgba(239, 68, 68, 0.1)" : "rgba(6, 6, 15, 0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${status === "NOT UPLOADED" ? "rgba(239, 68, 68, 0.5)" : (hov ? "rgba(167,139,250,0.7)" : "rgba(167,139,250,0.2)")}`,
        color: status === "NOT UPLOADED" ? "#f87171" : (hov ? "#fff" : "rgba(255,255,255,0.7)"),
        fontFamily: "'Playfair Display', serif",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        boxShadow: hov ? "0 10px 40px -10px rgba(167,139,250,0.5)" : "0 4px 20px -5px rgba(0,0,0,0.5)",
        transform: hov ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
        cursor: hov ? "pointer" : "none"
      }}
      className="floating-resume"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: status === "NOT UPLOADED" ? "rgba(239, 68, 68, 0.2)" : (hov ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.08)"),
        transition: "background 0.4s",
        color: status === "NOT UPLOADED" ? "#f87171" : (hov ? "#fff" : "#a78bfa"),
        flexShrink: 0
      }}>
        {status === "NOT UPLOADED" ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.3s", transform: hov ? "translateY(2px)" : "translateY(0)" }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        )}
      </div>
      <span>{status}</span>
    </a>
  );
}

export default function App() {
  const sr = useState(false); const ready = sr[0]; const setReady = sr[1];
  const sc = useState(false); const scrolled = sc[0]; const setScrolled = sc[1];
  const sh = useState(false); const heroIn = sh[0]; const setHeroIn = sh[1];
  useEffect(function () {
    const h = function () { 
      const sy = window.scrollY;
      setScrolled(sy > 40);
    };
    window.addEventListener("scroll", h, { passive: true });
    return function () { 
      window.removeEventListener("scroll", h); 
    };
  }, []);
  useEffect(function () { if (ready) setTimeout(function () { setHeroIn(true); }, 100); }, [ready]);

  const projects = [
    { emoji: "🌍", title: "BunnyTravel", c1: "#38bdf8", c2: "#6366f1", desc: "A responsive travel booking website inspired by MakeMyTrip — featuring Three.js 3D animations, an interactive globe, and mobile-optimised layouts.", stack: ["React", "Three.js", "Tailwind", "Framer Motion"], github: "https://github.com/MayurT96", live: null },
    { emoji: "🛒", title: "E-Commerce Store", c1: "#4ade80", c2: "#38bdf8", desc: "Full-stack MERN online store with product listing, cart management, JWT authentication, and order tracking.", stack: ["MongoDB", "Express", "React", "Node.js", "JWT"], github: "https://github.com/MayurT96", live: null },
    { emoji: "📱", title: "VPN Android App", c1: "#f43f5e", c2: "#8b5cf6", desc: "A secure and robust VPN application for Android devices, providing private and unrestricted internet access.", stack: ["Android", "Java", "Kotlin"], github: "https://github.com/MayurT96/VPN-android-app", live: null },
    { emoji: "📝", title: "Task Manager App", c1: "#a78bfa", c2: "#f472b6", desc: "Drag-and-drop Kanban productivity app with task priorities, due dates, and local-storage persistence.", stack: ["React", "CSS Modules", "LocalStorage"], github: "https://github.com/MayurT96", live: null },
  ];

  const traits = [
    { icon: "🎯", label: "Goal-oriented", desc: "I focus on shipping working products, not just writing code." },
    { icon: "📚", label: "Continuous learner", desc: "Deepening skills in Next.js, TypeScript, and system design." },
    { icon: "🤝", label: "Collaborative", desc: "Comfortable in teams — I ask questions and welcome feedback." },
    { icon: "🔍", label: "Detail-focused", desc: "I care about clean, readable code and polished experiences." },
  ];

  const contacts = [
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, label: "Email", val: "mayurtamkhane96@gmail.com", href: "mailto:mayurtamkhane96@gmail.com" },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>, label: "Phone", val: <span style={{ fontFamily: "'Poppins', sans-serif" }}>+91 7387553347</span>, href: "tel:+917387553347" },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, label: "LinkedIn", val: "Mayur Tamkhane", href: "https://www.linkedin.com/in/mayur-tamkhane-7a9726243" },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>, label: "GitHub", val: "MayurT96", href: "https://github.com/MayurT96" },
  ];

  const P = "clamp(14px,4vw,80px)";
  const glass = { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, backdropFilter: "blur(12px)" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Sora:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; overflow-x:hidden; width:100%; max-width:100vw; -webkit-text-size-adjust:100%; }
        body { background:#06060f; color:#fff; overflow-x:hidden; width:100%; max-width:100vw; cursor:none; font-family:'Playfair Display', serif; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(167,139,250,.4); border-radius:2px; }
        a { cursor:none; }
        input,textarea { caret-color:#a78bfa; }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeup { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.35} 50%{transform:translate(-50%,-50%) scale(1.12);opacity:.65} }
        @keyframes sbar   { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }
        @media(max-width:768px){
          .two-col { grid-template-columns:1fr !important; gap:28px !important; }
          .proj-grid { grid-template-columns:1fr !important; gap:18px !important; }
          .trait-grid { grid-template-columns:1fr 1fr !important; gap:10px !important; }
          .hero-links { flex-direction:column !important; gap:10px !important; width: 100% !important; max-width: 320px !important; margin: 16px auto 0 !important; align-items: stretch !important; }
          .hero-link-item { font-size: 11.5px !important; justify-content: flex-start !important; word-break: break-all !important; }
          .nav-links-container { gap: 6px !important; }
          .nav-link { font-size: 10px !important; padding: 4px 8px !important; letter-spacing: 0.04em !important; }
          .floating-resume { padding: 8px 14px !important; font-size: 9.5px !important; left: 12px !important; bottom: 20px !important; gap: 6px !important; }
        }
        @media(max-width:480px){
          .trait-grid { grid-template-columns:1fr !important; }
          .nav-link { display: none !important; }
          .nav-link.active-on-mobile { display: inline-block !important; font-size: 9.5px !important; padding: 4px 8px !important; }
          .hero-links { max-width: 290px !important; }
          .hero-link-item { font-size: 11px !important; }
          html, body { overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; }
        }
        @media (pointer: coarse), (max-width: 768px) {
          body, a, button, [role="button"], input, textarea, select { cursor: auto !important; }
        }
      `}</style>

      {!ready && <Preloader onDone={function () { setReady(true); }} />}

      {ready && (
        <div style={{ position: "relative", zIndex: 0, width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
          <Cursor />
          {/* Background Layers */}
          <div style={{ position: "fixed", inset: 0, zIndex: -10, background: "#06060f" }} />
          <div style={{ position: "fixed", inset: 0, zIndex: -9, pointerEvents: "none" }}>
            <Fireworks />
          </div>
          <div style={{ position: "fixed", inset: 0, zIndex: -8, pointerEvents: "none", background: "radial-gradient(ellipse 65% 48% at 50% -2%,rgba(99,102,241,.18),transparent 62%),radial-gradient(ellipse 48% 38% at 95% 98%,rgba(139,92,246,.12),transparent 58%)" }} />
          
          <AIChatbot />
          <FloatingResume />

          <div style={{ position: "relative", zIndex: 1, pointerEvents: "auto", width: "100%", maxWidth: "100vw" }}>
            <Navbar scrolled={scrolled} />

            {/* ── HERO ── */}
            <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(85px,12vh,120px) " + P + " 40px", position: "relative", overflow: "hidden", width: "100%", maxWidth: "100vw" }}>
              <div style={{ position: "absolute", width: "min(500px,80vw)", height: "min(500px,80vw)", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.1) 0%,transparent 68%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", animation: "pulse 6s ease-in-out infinite", pointerEvents: "none" }} />
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(24px)", transition: "opacity 1s .1s, transform 1s .1s", width: "100%", maxWidth: 1080, margin: "0 auto" }}>

                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 40, border: "1px solid rgba(167,139,250,.25)", background: "rgba(124,58,237,.07)", fontFamily: "'Playfair Display', serif", fontSize: 11, color: "#a78bfa", letterSpacing: ".14em", marginBottom: 24 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "blink 2.5s infinite" }} />
                  <GlitchText trigger="mount" delay={400} speed={20} style={{ fontSize: 11, color: "#a78bfa", letterSpacing: ".14em", fontFamily: "'Playfair Display', serif" }}>OPEN TO OPPORTUNITIES</GlitchText>
                </div>

                <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: "clamp(30px,9vw,96px)", lineHeight: 1.0, letterSpacing: "-.03em", background: "linear-gradient(145deg, #ffffff 20%, #e2e8f0 55%, #c4b5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8, wordBreak: "break-word" }}>
                  <GlitchText trigger="mount" delay={600} speed={18}>Mayur</GlitchText><br /><span style={{ fontStyle: "italic", fontWeight: 400 }}><GlitchText trigger="mount" delay={900} speed={18}>Tamkhane.</GlitchText></span>
                </h1>

                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(14px,3vw,21px)", color: "rgba(255,255,255,.52)", margin: "16px 0 12px", minHeight: 28, fontWeight: 300 }}>
                  <Typewriter words={["Fresher Web Developer", "React Enthusiast", "Building Real Projects", "Open to Work"]} />
                </div>

                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(13px,2vw,16px)", color: "rgba(255,255,255,.35)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.75, fontWeight: 300, padding: "0 8px" }}>
                  A passionate developer learning modern web tech — focused on writing clean code and shipping real, useful projects.
                </p>

                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
                  <a href="#projects" style={{ padding: "11px 26px", borderRadius: 40, background: "linear-gradient(135deg,#6366f1,#a78bfa)", color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 12.5, letterSpacing: ".08em", textDecoration: "none", transition: "transform .25s, box-shadow .25s", boxShadow: "0 4px 22px rgba(99,102,241,.35)", cursor: "none" }}
                    onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 36px rgba(99,102,241,.55)"; }}
                    onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 22px rgba(99,102,241,.35)"; }}>
                    View Projects →
                  </a>
                  <a href="#contact" style={{ padding: "11px 26px", borderRadius: 40, border: "1px solid rgba(255,255,255,.13)", color: "rgba(255,255,255,.68)", fontFamily: "'Playfair Display', serif", fontSize: 12.5, letterSpacing: ".08em", textDecoration: "none", transition: "all .25s", cursor: "none" }}
                    onMouseEnter={function (e) { e.currentTarget.style.borderColor = "rgba(167,139,250,.45)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={function (e) { e.currentTarget.style.borderColor = "rgba(255,255,255,.13)"; e.currentTarget.style.color = "rgba(255,255,255,.68)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    Get in Touch
                  </a>
                </div>

                <div className="hero-links" style={{ display: "flex", gap: "16px 24px", justifyContent: "center", flexWrap: "wrap", marginTop: 4 }}>
                  {[
                    [<svg key="em" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, "mayurtamkhane96@gmail.com", "mailto:mayurtamkhane96@gmail.com"], 
                    [<svg key="ph" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>, <span style={{ fontFamily: "'Poppins', sans-serif" }}>+91 7387553347</span>, "tel:+917387553347"], 
                    [<svg key="li" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, "LinkedIn", "https://www.linkedin.com/in/mayur-tamkhane-7a9726243"], 
                    [<svg key="gh" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>, "GitHub", "https://github.com/MayurT96"]
                  ].map(function (it) {
                    return <a key={it[1]} href={it[2]} target={it[2].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="hero-link-item"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: 12.5, color: "rgba(255,255,255,.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: 8, transition: "color .25s", cursor: "none" }}
                      onMouseEnter={function (e) { 
                        e.currentTarget.style.color = "#a78bfa"; 
                        const ic = e.currentTarget.querySelector('.icon-circle');
                        if (ic) { ic.style.background = "rgba(167,139,250,.1)"; ic.style.borderColor = "rgba(167,139,250,.3)"; ic.style.transform = "scale(1.08)"; }
                      }} 
                      onMouseLeave={function (e) { 
                        e.currentTarget.style.color = "rgba(255,255,255,.45)"; 
                        const ic = e.currentTarget.querySelector('.icon-circle');
                        if (ic) { ic.style.background = "rgba(255,255,255,.03)"; ic.style.borderColor = "rgba(255,255,255,.08)"; ic.style.transform = "scale(1)"; }
                      }}>
                      <span className="icon-circle" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", transition: "all .3s cubic-bezier(0.23, 1, 0.32, 1)", flexShrink: 0 }}>
                        {it[0]}
                      </span>
                      <span style={{ wordBreak: "break-all" }}>{it[1]}</span>
                    </a>;
                  })}
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, opacity: heroIn ? .38 : 0, transition: "opacity 1s 2s", pointerEvents: "none" }}>
                <div style={{ width: 1, height: 36, background: "linear-gradient(180deg,#a78bfa,transparent)", animation: "sbar 2.4s ease-in-out infinite", pointerEvents: "none" }} />
              </div>
            </section>

            {/* ── ABOUT ── */}
            <Fade id="about" style={{ padding: "clamp(60px,8vw,95px) " + P, width: "100%", maxWidth: "100vw" }}>
              <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
                <SH tag="// about me"><GlitchText trigger="inview" speed={22}>A Little About Me</GlitchText></SH>
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,76px)", alignItems: "start", width: "100%" }}>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(14px,1.7vw,17px)", color: "rgba(255,255,255,.7)", lineHeight: 1.88, marginBottom: 18, fontWeight: 400 }}>
                      Hi, I'm <span style={{ color: "#a78bfa", fontWeight: 600 }}><GlitchText trigger="inview" delay={100} speed={18}>Mayur</GlitchText></span> — a fresher web developer from Dhule, Maharashtra, passionate about building clean, functional, and visually appealing web applications.
                    </p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(13px,1.4vw,15px)", color: "rgba(255,255,255,.42)", lineHeight: 1.9, marginBottom: 20, fontWeight: 300 }}>
                      I'm currently focused on mastering the MERN stack and modern frontend technologies. I believe in learning by building — every project teaches me something new.
                    </p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(13px,1.4vw,15px)", color: "rgba(255,255,255,.42)", lineHeight: 1.9, fontWeight: 300 }}>
                      I'm looking for my first professional opportunity where I can contribute meaningfully, grow alongside experienced developers, and solve real problems with code.
                    </p>
                    <div style={{ display: "flex", gap: "clamp(16px,4vw,36px)", marginTop: 28, flexWrap: "wrap" }}>
                      {[["4", "Projects Built"], ["6+", "Months Learning"], ["∞", "Curiosity"]].map(function (it) {
                        return <div key={it[1]}>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(24px,4vw,36px)", background: "linear-gradient(135deg,#a78bfa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{it[0]}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 10, color: "rgba(255,255,255,.26)", letterSpacing: ".1em", marginTop: 2 }}>{it[1]}</div>
                        </div>;
                      })}
                    </div>
                  </div>
                  <div className="trait-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" }}>
                    {traits.map(function (tr) {
                      return <div key={tr.label} style={Object.assign({}, glass, { padding: "18px 16px", transition: "transform .25s, border-color .25s", width: "100%", boxSizing: "border-box" })}
                        onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(167,139,250,.2)"; }}
                        onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; }}>
                        <div style={{ fontSize: 22, marginBottom: 9 }}>{tr.icon}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 13, color: "#fff", marginBottom: 5 }}><GlitchText trigger="inview" speed={20}>{tr.label}</GlitchText></div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: "rgba(255,255,255,.36)", lineHeight: 1.55, fontWeight: 300 }}>{tr.desc}</div>
                      </div>;
                    })}
                  </div>
                </div>
              </div>
            </Fade>

            {/* ── SKILLS ── */}
            <Skills />

            {/* ── PROJECTS ── */}
            <Fade id="projects" style={{ padding: "clamp(60px,8vw,95px) " + P, width: "100%", maxWidth: "100vw" }}>
              <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
                <SH tag="// projects"><GlitchText trigger="inview" speed={22}>Things I've Built</GlitchText></SH>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(13px,1.4vw,15px)", color: "rgba(255,255,255,.36)", marginBottom: "clamp(24px,4vw,44px)", lineHeight: 1.8, maxWidth: 520, fontWeight: 300 }}>
                  Personal projects I've built to practice and apply what I've learned. These show how I think and approach problems.
                </p>

                <div className="proj-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "clamp(16px,3vw,20px)", width: "100%" }}>
                  {projects.map(function (p) { 
                    return <PCard key={p.title} p={p} />; 
                  })}
                </div>
                <div style={{ marginTop: 36, textAlign: "center" }}>
                  <a href="https://github.com/MayurT96" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, letterSpacing: ".12em", color: "rgba(255,255,255,.3)", textDecoration: "none", padding: "9px 22px", borderRadius: 40, border: "1px solid rgba(255,255,255,.07)", transition: "all .25s", cursor: "none", display: "inline-block" }}
                    onMouseEnter={function (e) { e.currentTarget.style.color = "#a78bfa"; e.currentTarget.style.borderColor = "rgba(167,139,250,.28)"; }}
                    onMouseLeave={function (e) { e.currentTarget.style.color = "rgba(255,255,255,.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; }}>
                    See all on GitHub →
                  </a>
                </div>
              </div>
            </Fade>

            {/* ── CONTACT ── */}
            <Fade id="contact" style={{ padding: "clamp(60px,8vw,95px) " + P + " 60px", background: "rgba(99,102,241,.022)", width: "100%", maxWidth: "100vw" }}>
              <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
                <SH tag="// contact"><GlitchText trigger="inview" speed={22}>Let's Connect</GlitchText></SH>
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,76px)", alignItems: "start", width: "100%" }}>
                  <div style={{ width: "100%" }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(13px,1.5vw,16px)", color: "rgba(255,255,255,.55)", lineHeight: 1.88, marginBottom: 28, fontWeight: 300 }}>
                      I'm actively looking for my <span style={{ color: "#a78bfa", fontWeight: 500 }}>first developer role</span> — internships, junior positions, or freelance work. Let's build something together.
                    </p>
                    {contacts.map(function (c) {
                      return <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.02)", marginBottom: 10, textDecoration: "none", transition: "all .25s", cursor: "none", width: "100%", boxSizing: "border-box" }}
                        onMouseEnter={function (e) { e.currentTarget.style.borderColor = "rgba(167,139,250,.25)"; e.currentTarget.style.background = "rgba(124,58,237,.05)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                        onMouseLeave={function (e) { e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; e.currentTarget.style.background = "rgba(255,255,255,.02)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#c4b5fd", flexShrink: 0 }}>{c.icon}</span>
                        <div style={{ overflow: "hidden", minWidth: 0 }}>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 10, letterSpacing: ".14em", color: "rgba(255,255,255,.26)", textTransform: "uppercase", marginBottom: 2 }}>{c.label}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 400, wordBreak: "break-all" }}>{c.val}</div>
                        </div>
                      </a>;
                    })}
                  </div>
                  <div style={Object.assign({}, glass, { padding: "clamp(18px,4vw,38px)", width: "100%", boxSizing: "border-box" })}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 19, color: "#fff", marginBottom: 5, letterSpacing: "-.01em" }}><GlitchText trigger="inview" speed={22}>Send a message</GlitchText></div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: "rgba(255,255,255,.28)", marginBottom: 22, fontWeight: 300 }}>I'll reply within 24 hours.</div>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </Fade>

            {/* ── LUXURY CREDIT ── */}
            <div style={{ padding: "80px 0 40px", textAlign: "center", position: "relative", width: "100%", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "200px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.15), transparent)" }} />
              <div style={{ position: "relative", zIndex: 1, display: "inline-block", padding: "0 16px" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
                  Handcrafted with 
                  <span style={{ margin: "0 8px", fontSize: 12, color: "#a78bfa", filter: "drop-shadow(0 0 5px rgba(167,139,250,0.5))", verticalAlign: "middle", animation: "pulse 2s ease-in-out infinite" }}>
                    ♥
                  </span>
                  by <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Bunny96</span>
                </div>
                <div style={{ marginTop: 8, height: "1px", width: "30px", background: "#a78bfa", margin: "8px auto 0", opacity: 0.3 }} />
              </div>
            </div>

            {/* ── FOOTER ── */}
            <footer style={{ padding: "24px " + P, borderTop: "1px solid rgba(255,255,255,.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, width: "100%", maxWidth: "100vw", boxSizing: "border-box" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12.5, color: "rgba(255,255,255,.22)", fontWeight: 300 }}>
                © 2026 <span style={{ color: "#a78bfa", fontWeight: 500 }}>Mayur Tamkhane</span>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[["GitHub", "https://github.com/MayurT96"], ["LinkedIn", "https://www.linkedin.com/in/mayur-tamkhane-7a9726243"], ["Email", "mailto:mayurtamkhane96@gmail.com"]].map(function (it) {
                  return <a key={it[0]} href={it[1]} target={it[1].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, letterSpacing: ".08em", color: "rgba(255,255,255,.22)", textDecoration: "none", transition: "color .2s", cursor: "none" }}
                    onMouseEnter={function (e) { e.currentTarget.style.color = "#a78bfa"; }} onMouseLeave={function (e) { e.currentTarget.style.color = "rgba(255,255,255,.22)"; }}>{it[0]}</a>;
                })}
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
