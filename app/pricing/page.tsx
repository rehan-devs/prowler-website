import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PricingSection } from "@/components/pricing/pricing-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Prowler.io",
  description:
    "Choose your Prowler.io plan. One-time lifetime purchase or monthly subscription. Basic from $40.",
};

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <PricingSection />
      <Footer />
    </main>
  );
}