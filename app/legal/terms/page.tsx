import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LegalPage } from "@/components/legal/legal-page";

export default function Terms() {
  return (
    <main>
      <Navbar />
      <LegalPage
        title="Terms of Service"
        lastUpdated="January 2025"
        sections={termsContent}
      />
      <Footer />
    </main>
  );
}

const termsContent = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By purchasing and using Prowler.io, you agree to these Terms of Service. If you do not agree, do not use the software. These terms may be updated at any time. Continued use after changes constitutes acceptance.",
  },
  {
    title: "2. License Grant",
    content:
      "Upon purchase, you receive a non-transferable, non-exclusive license to use Prowler.io on the number of devices specified in your plan. Lifetime licenses grant perpetual use of the version purchased. Subscription licenses are valid while your subscription is active.",
  },
  {
    title: "3. Permitted Use",
    content:
      "You may use Prowler.io to collect publicly available business information for legitimate business purposes such as sales prospecting, market research and lead generation. You are responsible for complying with applicable laws in your jurisdiction, including data protection regulations.",
  },
  {
    title: "4. Prohibited Use",
    content:
      "You may not use Prowler.io to collect personal data in violation of GDPR, CCPA or other privacy laws. You may not use the software to send spam, engage in illegal activities, scrape data you do not have permission to access, or resell the software or license keys.",
  },
  {
    title: "5. License Restrictions",
    content:
      "You may not reverse engineer, decompile or disassemble Prowler.io. You may not transfer your license to another person or entity. License keys are for personal or business use only and may not be shared or resold.",
  },
  {
    title: "6. Limitation of Liability",
    content:
      "Prowler.io is provided as-is. We make no warranties about the accuracy of data scraped or the availability of the software. We are not liable for any damages arising from your use of the software, including loss of profits or data.",
  },
  {
    title: "7. Service Availability",
    content:
      "The desktop application works offline after initial activation. License validation requires periodic internet connectivity. We reserve the right to suspend licenses that violate these terms.",
  },
  {
    title: "8. Governing Law",
    content:
      "These terms are governed by applicable law. Any disputes shall be resolved through good-faith negotiation before pursuing legal remedies.",
  },
];