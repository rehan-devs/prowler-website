import type { Metadata } from "next";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ScrollManager } from "@/components/layout/scroll-manager"; // ← Import here
import "./globals.css";

export const metadata: Metadata = {
  title: "Prowler — Professional Lead Scraper",
  description: "Extract verified business leads from 50+ directories. Find owner contacts automatically with AI-powered enrichment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <ScrollManager /> {/* ← Add here */}
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}