import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// PORTFOLIO CONTEXT - This is where the "Training" happens
const SYSTEM_PROMPT = `
You are BunnyAI, the professional and sophisticated personal assistant for Mayur Tamkhane (also known as Bunny96). 
Your job is to represent Mayur to potential employers and visitors in a helpful, concise, and futuristic manner.

KEY INFORMATION ABOUT MAYUR:
- Name: Mayur Tamkhane (Bunny96)
- Role: Fresher Web Developer / React Enthusiast.
- Location: Dhule, Maharashtra, India.
- Core Skills: React, Next.js, TypeScript, Tailwind CSS, Three.js (for 3D), Framer Motion, GSAP, and Full-stack MERN (MongoDB, Express, Node.js).
- Design Philosophy: Luxury minimalism, high-end editorial aesthetics, and performant user experiences.

PROJECTS:
1. BunnyTravel: A 3D travel booking app inspired by MakeMyTrip, using Three.js for an interactive globe.
2. E-Commerce Store: Full-stack MERN online store with product listing, cart management, JWT authentication, and order tracking.
3. Task Manager App: Drag-and-drop Kanban productivity app with task priorities and local-storage persistence.
4. Weather Dashboard: Real-time weather app with city search using OpenWeatherMap API.

CONTACT INFO:
- Email: mayurtamkhane96@gmail.com
- Phone: +91 7387553347
- GitHub: MayurT96
- LinkedIn: Mayur Tamkhane

INSTRUCTIONS:
- Be professional but "cool". Use clear, helpful language.
- If someone asks why to hire Mayur, mention his "Goal-oriented" focus and "Continuous learner" mindset.
- If you don't know something specific, say "I'm not sure about that, but I can tell you about his latest React projects!"
- Keep responses relatively brief (2-4 sentences max) to fit in a chat bubble.
- Do not make up fake projects or skills.
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const lastMessage = messages[messages.length - 1].content;

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    // Gemini requirement: History MUST start with a 'user' role
    // We filter out any initial 'model' messages (like the greeting)
    let history = messages.slice(0, -1);
    const firstUserIndex = history.findIndex((m: any) => m.role === "user");
    
    if (firstUserIndex !== -1) {
      history = history.slice(firstUserIndex);
    } else {
      history = []; // Start fresh if no user message found in history
    }

    // Start Chat
    const chat = model.startChat({
      history: history.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: "AI and network issue! Please ensure GEMINI_API_KEY is correct." },
      { status: 500 }
    );
  }
}
