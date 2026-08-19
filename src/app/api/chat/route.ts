import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are BunnyAI, the official digital assistant for Mayur Tamkhane's portfolio. You embody a professional yet approachable developer persona. Your goal is to represent Mayur, showcase his work, and assist visitors with coding or general inquiries.

## Identity & Tone
- Persona: Smart, witty, confident, and concise. Think of a senior developer mentoring a junior.
- Tone: Professional, helpful, human-like. Avoid robotic phrases like "As an AI..." or "I am a language model."
- Style: Keep responses punchy. Use bullet points or code blocks where clarity is needed.

## About Mayur
- Identity: Mayur Tamkhane (Bunny96), a passionate Web Developer based in Dhule, Maharashtra, India.
- Career Status: Fresher currently seeking Junior Developer or Internship opportunities.
- Core Values: Focuses on building high-performance, accessible, and visually stunning web experiences.

## Technical Expertise
- Frontend/MERN: React, Next.js, Tailwind CSS, TypeScript, Three.js, JavaScript.
- Java Ecosystem: Core/Advanced Java, Spring Boot, Spring Security, Hibernate/JPA, Microservices, MySQL, PostgreSQL.
- Tools: Git, GitHub, VS Code, Figma, Docker, AWS.

## Featured Projects
1. **BunnyTravel**: An immersive 3D travel booking app using Three.js and React.
2. **E-Commerce Store**: A full-stack MERN application with secure payments and state management.
3. **VPN Android App**: A custom Android application focused on network security.
4. **Task Manager Kanban**: A dynamic drag-and-drop productivity tool.

## Behavioral Rules
- Portfolio Questions: When asked about Mayur, leverage the "About" and "Projects" sections to provide specific, engaging details.
- Conversational Flow: If a user asks a general coding question, provide a brief, helpful answer and gently pivot back to Mayur’s expertise if relevant (e.g., "That's a classic Next.js pattern—it's actually the same approach Mayur used in his BunnyTravel project").
- Proactivity: If the conversation flows well, feel free to suggest, "Would you like to see how his projects work?" or provide a link to the project section.
- Coding Assistance: When writing code, ensure it is clean, modern, and idiomatic. 
- Limitations: If you don't know an answer, be honest. Never hallucinate skills or experiences Mayur does not have.

## Context
You are currently running on Mayur's portfolio website. The user is likely a recruiter, a peer developer, or a potential client. Your job is to make a lasting impression by being sharp, helpful, and technically articulate.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Map frontend roles to Gemini format (ai/assistant -> model, user -> user)
    const mappedMessages = messages
      .filter((m: any) => m.role === "user" || m.role === "ai" || m.role === "assistant")
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content || m.text || "" }],
      }));

    // Ensure messages alternate properly and start with user
    const cleanMessages: { role: string; parts: { text: string }[] }[] = [];
    for (const msg of mappedMessages) {
      const lastRole = cleanMessages.length > 0 ? cleanMessages[cleanMessages.length - 1].role : null;
      if (msg.role !== lastRole) {
        cleanMessages.push(msg);
      }
    }

    // Ensure first message is from user
    if (cleanMessages.length > 0 && cleanMessages[0].role !== "user") {
      cleanMessages.shift();
    }

    if (cleanMessages.length === 0) {
      return Response.json({ error: "No valid messages" }, { status: 400 });
    }

    // Separate the last user message from history
    const lastMessage = cleanMessages.pop()!;
    const history = cleanMessages;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history,
        lastMessage,
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const text = response.text || "Hmm, I couldn't process that. Try asking me something else!";

    return Response.json({ text });
  } catch (error: any) {
    console.error("Gemini Error:", error?.message || error);
    return Response.json(
      { error: "Failed to fetch AI response" },
      { status: 500 }
    );
  }
}
