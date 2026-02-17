import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-clash",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rohnit Shriyan | Software Engineer & AI Specialist",
  description:
    "Precision Engineering. Building sub-100ms experiences through optimized backends and intelligent systems.",
  keywords: [
    "Rohnit Shriyan",
    "Software Engineer",
    "AI Specialist",
    "Backend Optimization",
    "Full Stack Developer",
  ],
  authors: [{ name: "Rohnit Shriyan" }],
  openGraph: {
    title: "Rohnit Shriyan | Software Engineer & AI Specialist",
    description:
      "Precision Engineering. Building sub-100ms experiences through optimized backends and intelligent systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-background text-foreground noise`}
      >
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
