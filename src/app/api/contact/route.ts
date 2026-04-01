export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 },
      );
    }

    const { name, email, message } = parsed.data;

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_EMAIL_FROM,
    } = process.env;

    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] SMTP env loaded:", {
        SMTP_HOST: !!SMTP_HOST,
        SMTP_PORT: !!SMTP_PORT,
        SMTP_USER: !!SMTP_USER,
        SMTP_PASS: !!SMTP_PASS,
      });
    }

    const placeholders = [
      SMTP_USER === "your-email@gmail.com" ? "SMTP_USER" : null,
      SMTP_PASS === "your-app-password" ? "SMTP_PASS" : null,
    ].filter(Boolean);

    if (
      !SMTP_HOST ||
      !SMTP_PORT ||
      !SMTP_USER ||
      !SMTP_PASS ||
      placeholders.length > 0
    ) {
      const missing = [
        !SMTP_HOST && "SMTP_HOST",
        !SMTP_PORT && "SMTP_PORT",
        !SMTP_USER && "SMTP_USER",
        !SMTP_PASS && "SMTP_PASS",
      ].filter(Boolean);

      const invalid = placeholders;
      const issues = [...missing, ...invalid];

      console.warn(
        `[contact] SMTP env issue: ${issues.join(", ")}. Email not sent.`,
      );

      const baseMessage =
        "Email service is not configured on the server. Please add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS to your .env.local.";
      const placeholderMessage = invalid.length
        ? ` Also make sure ${invalid.join(" and ")} ${invalid.length > 1 ? "are" : "is"} valid and not placeholder values.`
        : "";

      return NextResponse.json(
        {
          ok: false,
          error: `${baseMessage}${placeholderMessage}`,
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      requireTLS: Number(SMTP_PORT) === 587,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const contactEmailTo = process.env.CONTACT_EMAIL_TO || "mayurtamkhane96@gmail.com";
    const fromAddress = CONTACT_EMAIL_FROM || SMTP_USER || contactEmailTo;

    await transporter.sendMail({
      from: fromAddress,
      to: contactEmailTo,
      subject: `New portfolio message from ${name}`,
      replyTo: email,
      text: `New message from your portfolio:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
      html: `<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#e5e7eb; background:#020617; padding:24px;">
  <h2 style="margin:0 0 12px;font-size:18px;color:#e5e7eb;">New message from your portfolio</h2>
  <p style="margin:0 0 4px;font-size:14px;"><strong>Name:</strong> ${name}</p>
  <p style="margin:0 0 12px;font-size:14px;"><strong>Email:</strong> ${email}</p>
  <p style="margin:0 0 6px;font-size:14px;"><strong>Message:</strong></p>
  <p style="white-space:pre-wrap;font-size:14px;line-height:1.6;">${message}</p>
</div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Error sending email", error);
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Something went wrong while sending your message."
        : error instanceof Error
        ? error.message
        : "Something went wrong while sending your message.";
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
}

