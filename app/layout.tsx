import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kathava.lk | Multilingual AI Voice Agents for Sri Lankan Businesses",
  description: "Give your business a voice (literally). Scalable, multilingual AI voice agents in Sinhala, Tamil, and English for retail, support, and verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}
