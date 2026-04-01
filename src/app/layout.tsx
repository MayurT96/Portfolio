import type { Metadata } from "next";
import { Space_Grotesk, Syne, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app/AppShell";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mayur Tamkhane — Full Stack Developer",
    template: "%s — Mayur Tamkhane",
  },
  description:
    "Full Stack Developer building modern, high-performance web applications with clean architecture and refined UI/UX.",
  metadataBase: new URL("https://mayurtamkhane.dev"),
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
