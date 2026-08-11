export const runtime = "nodejs";

import { NextResponse } from "next/server";
// @ts-ignore
import { db } from "../../../../lib/db";
import nodemailer from "nodemailer";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Database query timed out")), ms))
  ]);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { name, email, message } = json;

    const contactName = name || "Anonymous";
    const contactEmail = email || "No Email";
    const contactMessage = message || "No Message";

    // 1. Direct MySQL me save karo (wrapped in try/catch and timeout so it doesn't block emails in production)
    const isProd = process.env.NODE_ENV === "production";
    const dbHost = process.env.DB_HOST;
    const isLocalDB = dbHost === "localhost" || dbHost === "127.0.0.1";

    if (isProd && isLocalDB) {
      console.warn("⚠️ Skipping MySQL database logging in production because DB_HOST is localhost.");
    } else {
      try {
        await withTimeout(
          db.query(
            "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
            [contactName, contactEmail, contactMessage]
          ),
          2000
        );
        console.log("✅ Message saved to MySQL Workbench successfully!");
      } catch (dbError) {
        console.error("❌ MySQL database error in contact route:", dbError);
      }
    }

    // 2. Email notification send karo
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailTo = process.env.CONTACT_EMAIL_TO;
    const emailFrom = process.env.CONTACT_EMAIL_FROM || smtpUser;

    if (smtpUser && smtpPass && emailTo) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // TLS
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Format local time in IST
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const sentAtIST = new Intl.DateTimeFormat("en-IN", timeOptions).format(new Date());

      const htmlEmail = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Message</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0f19;
              color: #f3f4f6;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #0f172a;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #1e293b;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              padding: 24px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 22px;
              font-weight: 700;
              letter-spacing: -0.025em;
              color: #ffffff;
            }
            .header p {
              margin: 6px 0 0 0;
              font-size: 14px;
              color: #d1fae5;
            }
            .content {
              padding: 24px 24px;
            }
            .grid {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            }
            .grid td {
              padding: 12px 0;
              border-bottom: 1px solid #1e293b;
              font-size: 14px;
            }
            .label {
              font-weight: 600;
              color: #94a3b8;
              width: 25%;
            }
            .value {
              color: #f1f5f9;
            }
            .message-box {
              background-color: #1e293b;
              border: 1px solid #334155;
              border-radius: 8px;
              padding: 16px;
              color: #f8fafc;
              font-size: 14px;
              line-height: 1.6;
              white-space: pre-wrap;
              margin-top: 10px;
            }
            .footer {
              background-color: #020617;
              padding: 16px 20px;
              text-align: center;
              font-size: 11px;
              color: #64748b;
              border-top: 1px solid #1e293b;
            }
            .footer a {
              color: #10b981;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ New Message Received</h1>
              <p>Someone filled out the contact form on your portfolio</p>
            </div>
            <div class="content">
              <table class="grid">
                <tr>
                  <td class="label">👤 Name</td>
                  <td class="value"><strong>${contactName}</strong></td>
                </tr>
                <tr>
                  <td class="label">📧 Email</td>
                  <td class="value"><a href="mailto:${contactEmail}" style="color: #10b981; text-decoration: none;">${contactEmail}</a></td>
                </tr>
                <tr>
                  <td class="label">📅 Date</td>
                  <td class="value">${sentAtIST}</td>
                </tr>
              </table>
              
              <div style="font-size: 14px; font-weight: 600; color: #94a3b8; margin-top: 20px;">💬 Message:</div>
              <div class="message-box">${contactMessage}</div>
            </div>
            <div class="footer">
              <p>Sent by your Next.js Portfolio app | <a href="https://mayurtamkhane.dev" target="_blank">mayurtamkhane.dev</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"Portfolio Contact Form" <${emailFrom}>`,
        to: emailTo,
        subject: `✉️ New message from ${contactName} (${contactEmail})`,
        html: htmlEmail,
      });

      console.log(`✉️ Contact message email sent to ${emailTo}!`);
    } else {
      console.warn("⚠️ SMTP credentials or CONTACT_EMAIL_TO are missing from .env.local.");
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("❌ Error in contact API:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}