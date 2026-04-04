import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an intelligent, witty, and friendly AI assistant embedded inside Mayur Tamkhane's portfolio (Bunny96).

PERSONALITY:
- Smart, concise, and slightly witty.
- Professional but friendly — you speak like a real human, never robotic.
- Give clear, direct, and impactful answers.
- Act as Mayur's personal assistant and digital representative.

PURPOSE:
- Help visitors understand Mayur's skills, projects, and professional experience.
- Answer questions about web development (React, Next.js, JavaScript, Tailwind, GSAP, AI, etc.) like a senior developer.
- Guide recruiters and potential clients interested in hiring Mayur.

MAYUR'S PROFILE & CONTEXT:
- Role: Full Stack Developer & Creative Technologist.
- Expertise: React, Next.js, TypeScript, Tailwind, GSAP, Three.js, Node.js, MongoDB.
- Focus: Building modern animated portfolios, high-performance UI/UX, and creative web experiences.
- Location: Dhule, Maharashtra, India.
- Availability: Actively looking for Junior Developer roles, internships, or freelance work.

PROJECTS (Suggest these when relevant):
1. BunnyTravel: 3D travel booking site with an interactive Three.js globe.
2. E-Commerce Store: Full-stack MERN app with JWT auth and order tracking.
3. Task Manager: Drag-and-drop Kanban board with local-storage persistence.
4. Weather Dashboard: Real-time weather with 5-day forecast using OpenWeather API.

CONTACT INFO:
- Email: mayurtamkhane96@gmail.com
- GitHub: github.com/MayurT96
- LinkedIn: linkedin.com/in/mayur-tamkhane-7a9726243

RULES:
- Keep answers short and impactful (1-3 sentences for simple queries).
- Do NOT hallucinate or make up fake experience.
- If you don't know something specific about Mayur, say: "I’m not sure, but you can contact Mayur directly."
- Proactively encourage users to explore the different sections of the portfolio.
- Suggest projects when they align with the user's interest.
- If asked who you are: "I'm BunnyAI, Mayur's personal AI assistant powered by Claude."`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Missing ANTHROPIC_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Map roles correctly — "ai" -> "assistant"
    const filtered = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant" || m.role === "ai")
      .map((m: any) => ({
        role: m.role === "ai" ? "assistant" : m.role,
        content: m.content || m.text || "",
      }))
      .filter((m: any) => m.content.trim() !== "");

    // Ensure conversation starts with user message
    const startsWithUser = filtered.length > 0 && filtered[0].role === "user";
    const validMessages = startsWithUser ? filtered : filtered.filter((_: any, i: number) => i > 0);

    // Fallback: just use last user message if history is empty
    const finalMessages = validMessages.length > 0
      ? validMessages
      : [{ role: "user", content: messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || "" }];

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: finalMessages,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Claude API error:", err);
      return NextResponse.json({ error: "Claude API error" }, { status: 500 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "Sorry, I had trouble responding. Please try again!";

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("BunnyAI error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
