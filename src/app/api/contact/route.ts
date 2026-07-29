export const runtime = "nodejs";

import { NextResponse } from "next/server";
// @ts-ignore
import { db } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { name, email, message } = json;

    // Direct MySQL me save karo
    await db.query(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [name || "Anonymous", email || "No Email", message || "No Message"]
    );

    console.log("✅ Message saved to MySQL Workbench successfully!");

    // Frontend ko direct Success response bhej do!
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("❌ MySQL Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}