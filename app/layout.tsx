import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prowler.io — Professional Lead Scraper",
  description:
    "Extract thousands of verified business leads from Google Maps, Yelp, Yellow Pages and more. Find owner contacts automatically with AI-powered enrichment.",
  keywords: [
    "lead scraper",
    "business leads",
    "email finder",
    "google maps scraper",
    "lead generation",
  ],
  openGraph: {
    title: "Prowler.io — Professional Lead Scraper",
    description:
      "Extract thousands of verified business leads. Find owner contacts with AI.",
    type: "website",
    url: "https://prowler.io",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-deep antialiased">{children}</body>
    </html>
  );
}