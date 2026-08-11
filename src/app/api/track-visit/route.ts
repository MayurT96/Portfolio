export const runtime = "nodejs";

import { NextResponse } from "next/server";
// @ts-ignore
import { db } from "../../../../lib/db";
import nodemailer from "nodemailer";

function parseUserAgent(uaString: string) {
  const ua = uaString.toLowerCase();
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let device = "Desktop";

  if (ua.includes("mobi") || ua.includes("android") || ua.includes("iphone") || ua.includes("ipad")) {
    device = ua.includes("ipad") || (ua.includes("android") && !ua.includes("mobile")) ? "Tablet" : "Mobile";
  }

  if (ua.includes("chrome") && !ua.includes("chromium") && !ua.includes("edg") && !ua.includes("opr")) {
    browser = "Google Chrome";
  } else if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")) {
    browser = "Apple Safari";
  } else if (ua.includes("firefox")) {
    browser = "Mozilla Firefox";
  } else if (ua.includes("edg")) {
    browser = "Microsoft Edge";
  } else if (ua.includes("opr") || ua.includes("opera")) {
    browser = "Opera";
  }

  if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("macintosh") || ua.includes("mac os")) {
    os = "macOS";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  }

  return { browser, os, device };
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { referrer, screenResolution } = json;

    // Get visitor's IP address
    let ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
             request.headers.get("x-real-ip") || 
             "127.0.0.1";
             
    // Handle localhost/testing environment
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    const isLocal = ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.");
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const { browser, os, device } = parseUserAgent(userAgent);

    // Fetch geolocation info
    let geo: any = null;
    if (!isLocal) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
        if (geoRes.ok) {
          geo = await geoRes.json();
        }
      } catch (geoErr) {
        console.error("❌ Geolocation API error:", geoErr);
      }
    }

    const country = geo?.country || (isLocal ? "Localhost (India)" : "Unknown");
    const region = geo?.regionName || (isLocal ? "Localhost (Maharashtra)" : "Unknown");
    const city = geo?.city || (isLocal ? "Localhost (Mumbai)" : "Unknown");
    const zip = geo?.zip || (isLocal ? "Localhost" : "Unknown");
    const isp = geo?.isp || (isLocal ? "Local ISP" : "Unknown");
    const lat = geo?.lat;
    const lon = geo?.lon;

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
    const visitedAtIST = new Intl.DateTimeFormat("en-IN", timeOptions).format(new Date());

    // 1. MySQL database insert (wrapped in try/catch to make sure database errors don't stop the email)
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS portfolio_visits (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ip_address VARCHAR(45) NOT NULL,
          country VARCHAR(100) DEFAULT 'Unknown',
          region VARCHAR(100) DEFAULT 'Unknown',
          city VARCHAR(100) DEFAULT 'Unknown',
          zip_code VARCHAR(20) DEFAULT 'Unknown',
          isp VARCHAR(150) DEFAULT 'Unknown',
          latitude VARCHAR(50),
          longitude VARCHAR(50),
          referrer TEXT,
          user_agent TEXT,
          screen_resolution VARCHAR(50),
          visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        INSERT INTO portfolio_visits (
          ip_address, country, region, city, zip_code, isp, latitude, longitude, referrer, user_agent, screen_resolution
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        ip,
        country,
        region,
        city,
        zip,
        isp,
        lat ? String(lat) : null,
        lon ? String(lon) : null,
        referrer || "Direct",
        userAgent,
        screenResolution || "Unknown"
      ]);
      console.log("✅ Visit successfully saved to MySQL database!");
    } catch (dbError) {
      console.error("❌ MySQL Error in portfolio_visits:", dbError);
    }

    // 2. Email notification using nodemailer
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

      // Email formatting and subject
      const subjectLabel = isLocal ? "[Local Test] " : "";
      const subject = `👁️ ${subjectLabel}New Portfolio Visit from ${city}, ${country}`;

      const googleMapsUrl = lat && lon ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}` : null;
      
      const htmlEmail = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Portfolio Visit</title>
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
              background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
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
              color: #e0e7ff;
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
              width: 35%;
            }
            .value {
              color: #f1f5f9;
            }
            .geo-badge {
              display: inline-block;
              background-color: #312e81;
              color: #c7d2fe;
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 600;
            }
            .map-btn {
              display: inline-block;
              background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
              color: #ffffff !important;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
              padding: 12px 24px;
              border-radius: 8px;
              text-align: center;
              box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
              margin-top: 10px;
              width: calc(100% - 48px);
            }
            .map-btn:hover {
              opacity: 0.95;
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
              color: #818cf8;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👁️ Portfolio View Detected</h1>
              <p>${isLocal ? "Development Environment Test Notification" : "Someone is looking at your portfolio site"}</p>
            </div>
            <div class="content">
              <table class="grid">
                <tr>
                  <td class="label">📍 Location</td>
                  <td class="value">
                    <span class="geo-badge">${city}, ${region}, ${country}</span>
                  </td>
                </tr>
                <tr>
                  <td class="label">🌐 IP Address</td>
                  <td class="value"><code>${ip}</code></td>
                </tr>
                <tr>
                  <td class="label">🏢 ISP (Provider)</td>
                  <td class="value">${isp}</td>
                </tr>
                <tr>
                  <td class="label">📅 Time (IST)</td>
                  <td class="value">${visitedAtIST}</td>
                </tr>
                <tr>
                  <td class="label">💻 Device Type</td>
                  <td class="value">${device} (${os})</td>
                </tr>
                <tr>
                  <td class="label">🌐 Browser</td>
                  <td class="value">${browser}</td>
                </tr>
                <tr>
                  <td class="label">🔗 Referrer</td>
                  <td class="value" style="word-break: break-all;">${referrer}</td>
                </tr>
                <tr>
                  <td class="label">🖥️ Resolution</td>
                  <td class="value">${screenResolution}</td>
                </tr>
              </table>
              
              ${googleMapsUrl ? `
                <div style="text-align: center;">
                  <a href="${googleMapsUrl}" target="_blank" class="map-btn">📍 View Location on Google Maps</a>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Sent by your Next.js Portfolio app | <a href="https://mayurtamkhane.dev" target="_blank">mayurtamkhane.dev</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"Portfolio Alerts" <${emailFrom}>`,
        to: emailTo,
        subject: subject,
        html: htmlEmail,
      });

      console.log(`✉️ Visitor notification email sent to ${emailTo}!`);
    } else {
      console.warn("⚠️ SMTP credentials or CONTACT_EMAIL_TO are missing from .env.local.");
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("❌ Error in track-visit route:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
