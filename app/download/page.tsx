import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DownloadSection } from "@/components/download/download-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download — Prowler.io",
  description: "Download the Prowler.io desktop app for Windows, Mac or Linux.",
};

export default function DownloadPage() {
  return (
    <main>
      <Navbar />
      <DownloadSection />
      <Footer />
    </main>
  );
}