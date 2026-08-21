import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LegalPage } from "@/components/legal/legal-page";

export default function Privacy() {
  return (
    <main>
      <Navbar />
      <LegalPage
        title="Privacy Policy"
        lastUpdated="August 2026"
        sections={privacyContent}
      />
      <Footer />
    </main>
  );
}

const privacyContent = [
  {
    title: "1. What We Collect",
    content:
      "When you purchase Prowler.io, we collect your email address and payment screenshot for order fulfillment. We store a cryptographic hash of your license key (never the key itself). We log basic license validation events including hardware ID hashes for license enforcement.",
  },
  {
    title: "2. What We Do Not Collect",
    content:
      "We never collect the leads or business data you scrape. All scraped data stays on your local machine. We do not track your usage patterns, the searches you run, or the websites you visit. We do not collect browsing history or personal files.",
  },
  {
    title: "3. How We Use Your Data",
    content:
      "Your email is used solely to deliver your license key and respond to support requests. We do not sell, rent or share your personal information with third parties. We do not send marketing emails without consent.",
  },
  {
    title: "4. License Validation",
    content:
      "When Prowler.io validates your license, it sends a hash of your license key and a hardware fingerprint to our servers. This fingerprint is derived from hardware identifiers but cannot be used to identify you personally.",
  },
  {
    title: "5. Data Storage",
    content:
      "Order information is stored in a secured database (Supabase) hosted in the European Union. Payment screenshots are stored for 90 days then deleted. We use industry-standard encryption for data at rest and in transit.",
  },
  {
    title: "6. Your Rights",
    content:
      "You may request deletion of your personal data at any time by emailing support@prowler.io. We will delete your email, order records and license records within 14 days. Note that deleting your data will deactivate your license.",
  },
  {
    title: "7. Cookies",
    content:
      "The Prowler.io website uses no tracking cookies. We use a single session cookie for the admin panel only. We do not use Google Analytics, Facebook Pixel or any third-party tracking.",
  },
  {
    title: "8. Contact",
    content:
      "For privacy-related requests, email support@prowler.io with the subject Privacy Request. We respond within 5 business days.",
  },
];