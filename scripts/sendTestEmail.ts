import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify that the connection works
  await transporter.verify();

  const info = await transporter.sendMail({
    from: `"Portfolio Test" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL_TO,
    subject: "🧪 Test email from your Portfolio app",
    text: "If you see this, your SMTP credentials work!",
    html: `<p>If you see this, your <strong>SMTP credentials</strong> work!</p>`,
  });

  console.log("✅ Test email sent! Message ID:", info.messageId);
}

main().catch((err) => {
  console.error("❌ Error sending test email:", err);
});
