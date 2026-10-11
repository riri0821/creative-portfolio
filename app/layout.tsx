import type { Metadata, Viewport } from "next";
import { DotGothic16, Inter, Silkscreen } from "next/font/google";
import "./globals.css";

const pixel = Silkscreen({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-pixel" });
const dot = DotGothic16({ weight: "400", subsets: ["latin"], variable: "--font-dot" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Tamara · Portfolio",
  description: "Developer portfolio themed as a pastel 90s streamer desktop.",
};

export const viewport: Viewport = {
  themeColor: "#f096dc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixel.variable} ${dot.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
