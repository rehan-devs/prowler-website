import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LegalPage } from "@/components/legal/legal-page";

export default function Refund() {
  return (
    <main>
      <Navbar />
      <LegalPage
        title="Refund Policy"
        lastUpdated="August 2026"
        sections={refundContent}
      />
      <Footer />
    </main>
  );
}

const refundContent = [
  {
    title: "7-Day Refund Guarantee",
    content:
      "We offer a full refund within 7 days of purchase if Prowler.io does not work on your system and our support team is unable to resolve the issue. This guarantee exists because we believe the software should work as described.",
  },
  {
    title: "Eligible Refund Reasons",
    content:
      "The software does not install or launch on your supported operating system. The software produces zero results across multiple sources after support assistance. The software is fundamentally different from what was advertised.",
  },
  {
    title: "Non-Eligible Refund Reasons",
    content:
      "Change of mind after the license key has been delivered and activated. The software works but results are fewer than expected (scraping results vary by niche). Incompatibility with unsupported operating systems or Python versions. Subscription renewals after the subscription period has started.",
  },
  {
    title: "How to Request a Refund",
    content:
      "Email support@prowler.io with your order details (the email you used to purchase), your reason for requesting a refund, and screenshots of any errors you encountered. We will respond within 2 business days.",
  },
  {
    title: "Refund Processing",
    content:
      "Approved refunds are processed within 5 business days via the same payment method used for purchase. Bank transfers may take additional time depending on your bank. Upon refund, your license key will be deactivated.",
  },
  {
    title: "Subscription Cancellations",
    content:
      "You can cancel your subscription at any time by not renewing. Since subscriptions are manual (you pay each month), simply do not submit a renewal payment. Your license will expire at the end of the current billing period.",
  },
];