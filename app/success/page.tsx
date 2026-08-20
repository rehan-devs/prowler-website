import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SuccessContent } from "@/components/success/success-content";

export default function SuccessPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}