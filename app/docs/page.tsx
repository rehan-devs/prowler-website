import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DocsPage } from "@/components/docs/docs-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — Prowler.io",
  description:
    "Complete guide to installing, activating and using Prowler.io.",
};

export default function Docs() {
  return (
    <main>
      <Navbar />
      <DocsPage />
      <Footer />
    </main>
  );
}