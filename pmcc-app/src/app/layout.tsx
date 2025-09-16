import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { UserMenu } from "@/components/UserMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poor Man's Covered Call (PMCC)",
  description: "Track and discover PMCC opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-dvh flex flex-col">
          <header className="glass sticky top-0 z-10">
            <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
              <Link href="/" className="text-white text-lg font-medium tracking-wide">
                PMCC
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Link href="/" className="muted hover:text-white">Dashboard</Link>
                <Link href="/positions" className="muted hover:text-white">Positions</Link>
                <Link href="/ideas" className="muted hover:text-white">Ideas</Link>
              </nav>
              <div className="flex-1" />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
          <footer className="mx-auto w-full max-w-7xl px-6 py-8 muted text-xs">
            Not financial advice. Data via Yahoo Finance. Built with Next.js.
          </footer>
        </div>
      </body>
    </html>
  );
}
