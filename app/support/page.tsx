import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SupportPage } from "@/components/support/support-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — Prowler.io",
  description: "Get help with Prowler.io. Contact support or browse common questions.",
};

export default function Support() {
  return (
    <main>
      <Navbar />
      <SupportPage />
      <Footer />
    </main>
  );
}