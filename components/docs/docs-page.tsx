"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Download,
  Key,
  Play,
  Globe,
  User,
  Brain,
  FileDown,
  HelpCircle,
  ChevronRight,
  Terminal,
  Monitor,
  Apple,
  Search,
} from "lucide-react";

const sections = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Play,
    content: GettingStarted,
  },
  {
    id: "installation",
    label: "Installation",
    icon: Download,
    content: Installation,
  },
  {
    id: "activation",
    label: "License Activation",
    icon: Key,
    content: Activation,
  },
  {
    id: "first-scrape",
    label: "Your First Scrape",
    icon: Search,
    content: FirstScrape,
  },
  {
    id: "directory-scraping",
    label: "Directory Scraping",
    icon: Globe,
    content: DirectoryScraping,
  },
  {
    id: "owner-enrichment",
    label: "Owner Enrichment",
    icon: User,
    content: OwnerEnrichment,
  },
  {
    id: "ai-configuration",
    label: "AI Configuration",
    icon: Brain,
    content: AiConfiguration,
  },
  {
    id: "export",
    label: "Exporting Data",
    icon: FileDown,
    content: ExportData,
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    icon: HelpCircle,
    content: Troubleshooting,
  },
];

function DocSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-invert max-w-none space-y-6">{children}</div>
  );
}

function DocH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold text-2xl text-text-primary mt-8 mb-4 first:mt-0">
      {children}
    </h2>
  );
}

function DocH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display font-semibold text-lg text-text-primary mt-6 mb-3">
      {children}
    </h3>
  );
}

function DocP({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text-secondary leading-relaxed text-sm">{children}</p>
  );
}

function DocCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-bg-elevated border border-border px-2 py-0.5 rounded text-accent-primary text-xs font-mono">
      {children}
    </code>
  );
}

function DocBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-bg-elevated border border-border rounded-xl p-4 overflow-x-auto text-xs font-mono text-text-secondary leading-relaxed">
      {children}
    </pre>
  );
}

function DocStep({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-7 h-7 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <p className="text-text-primary font-semibold text-sm mb-1">{title}</p>
        <div className="text-text-secondary text-sm">{children}</div>
      </div>
    </div>
  );
}

function DocAlert({
  type,
  children,
}: {
  type: "info" | "warning" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info: "bg-accent-primary/10 border-accent-primary/30 text-accent-primary",
    warning: "bg-accent-gold/10 border-accent-gold/30 text-accent-gold",
    success: "bg-accent-success/10 border-accent-success/30 text-accent-success",
  };
  return (
    <div className={`border rounded-xl p-4 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}

function GettingStarted() {
  return (
    <DocSection>
      <DocH2>Welcome to Prowler.io</DocH2>
      <DocP>
        Prowler.io is a desktop application that scrapes verified business leads
        from Google Maps, Yelp, Yellow Pages, Bing Places and 50+ other
        directories. It runs entirely on your machine — your data never leaves
        your computer.
      </DocP>

      <DocH3>System Requirements</DocH3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Monitor,
            os: "Windows",
            req: "Windows 10 or 11, 64-bit",
          },
          {
            icon: Apple,
            os: "macOS",
            req: "macOS 12 Monterey or later",
          },
          {
            icon: Terminal,
            os: "Linux",
            req: "Ubuntu 20.04+ or Debian 11+",
          },
        ].map(({ icon: Icon, os, req }) => (
          <div
            key={os}
            className="bg-bg-elevated border border-border rounded-xl p-4"
          >
            <Icon size={18} className="text-accent-primary mb-2" />
            <p className="text-text-primary font-semibold text-sm">{os}</p>
            <p className="text-text-muted text-xs mt-1">{req}</p>
          </div>
        ))}
      </div>

      <DocAlert type="warning">
        Python 3.12 is required on all platforms. The scraping engine runs on
        Python. Install it from{" "}
        <a
          href="https://python.org"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          python.org
        </a>{" "}
        before installing Prowler.io.
      </DocAlert>

      <DocH3>Quick Start</DocH3>
      <div className="space-y-4">
        <DocStep number={1} title="Purchase a license">
          Go to the{" "}
          <a href="/pricing" className="text-accent-primary hover:underline">
            Pricing page
          </a>
          , choose your plan, and complete the payment.
        </DocStep>
        <DocStep number={2} title="Receive your license key">
          After payment verification (usually within hours), you will receive an
          email with your license key in the format{" "}
          <DocCode>PROWL-XXXX-XXXX-XXXX-XXXX</DocCode>.
        </DocStep>
        <DocStep number={3} title="Install Python 3.12">
          Download and install Python 3.12 from python.org. Make sure to check
          "Add Python to PATH" during installation on Windows.
        </DocStep>
        <DocStep number={4} title="Install Prowler.io">
          Download the installer for your OS from the{" "}
          <a href="/download" className="text-accent-primary hover:underline">
            Download page
          </a>{" "}
          and run it.
        </DocStep>
        <DocStep number={5} title="Activate your license">
          Launch Prowler.io and enter your license key when prompted.
        </DocStep>
        <DocStep number={6} title="Start scraping">
          Choose a source, enter your search criteria, and click Start.
        </DocStep>
      </div>
    </DocSection>
  );
}

function Installation() {
  return (
    <DocSection>
      <DocH2>Installation Guide</DocH2>

      <DocH3>Step 1 — Install Python 3.12</DocH3>
      <DocP>
        Prowler.io requires Python 3.12 to power its scraping engine. Follow
        the instructions for your operating system.
      </DocP>

      <div className="space-y-4">
        <div className="bg-bg-elevated border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Monitor size={14} className="text-accent-primary" />
            <p className="text-text-primary font-semibold text-sm">Windows</p>
          </div>
          <ol className="space-y-2 text-text-secondary text-sm">
            <li>1. Download Python 3.12 from python.org/downloads</li>
            <li>2. Run the installer</li>
            <li>
              3. Check the box "Add Python 3.12 to PATH" before clicking
              Install
            </li>
            <li>
              4. Verify installation — open Command Prompt and run:
            </li>
          </ol>
          <DocBlock>python --version</DocBlock>
        </div>

        <div className="bg-bg-elevated border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Apple size={14} className="text-accent-primary" />
            <p className="text-text-primary font-semibold text-sm">macOS</p>
          </div>
          <DocP>
            Install via Homebrew (recommended) or the official installer:
          </DocP>
          <DocBlock>{`brew install python@3.12
python3.12 --version`}</DocBlock>
        </div>

        <div className="bg-bg-elevated border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={14} className="text-accent-primary" />
            <p className="text-text-primary font-semibold text-sm">Linux</p>
          </div>
          <DocBlock>{`sudo apt update
sudo apt install python3.12 python3.12-venv python3.12-pip
python3.12 --version`}</DocBlock>
        </div>
      </div>

      <DocH3>Step 2 — Install Prowler.io</DocH3>

      <div className="space-y-3">
        {[
          {
            os: "Windows",
            steps: [
              "Download Prowler.io-Setup.exe from the Download page",
              "Run the installer (you may see a Windows SmartScreen warning — click More info then Run anyway)",
              "Follow the installation wizard",
              "Launch Prowler.io from the Start Menu or Desktop shortcut",
            ],
          },
          {
            os: "macOS",
            steps: [
              "Download Prowler.io.dmg from the Download page",
              "Open the DMG file",
              "Drag Prowler.io to your Applications folder",
              "Right-click the app and select Open (required on first launch)",
              "Click Open in the security dialog",
            ],
          },
          {
            os: "Linux",
            steps: [
              "Download prowler-io.deb from the Download page",
              "Run: sudo dpkg -i prowler-io.deb",
              "If dependency errors occur: sudo apt-get install -f",
              "Launch with: prowler-io or find it in your Applications menu",
            ],
          },
        ].map(({ os, steps }) => (
          <div key={os} className="bg-bg-elevated border border-border rounded-xl p-4">
            <p className="text-text-primary font-semibold text-sm mb-3">{os}</p>
            <ol className="space-y-1.5">
              {steps.map((step, i) => (
                <li key={i} className="text-text-secondary text-sm flex gap-2">
                  <span className="text-accent-primary font-mono text-xs mt-0.5 flex-shrink-0">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

function Activation() {
  return (
    <DocSection>
      <DocH2>License Activation</DocH2>
      <DocP>
        Your license key is in the format{" "}
        <DocCode>PROWL-XXXX-XXXX-XXXX-XXXX</DocCode>. It was emailed to you
        after payment verification.
      </DocP>

      <DocH3>Activating on First Launch</DocH3>
      <div className="space-y-4">
        <DocStep number={1} title="Launch Prowler.io">
          Open the application. You will see the license activation screen on
          first launch.
        </DocStep>
        <DocStep number={2} title="Enter your license key">
          Type or paste your license key exactly as shown in your email. The
          format is <DocCode>PROWL-XXXX-XXXX-XXXX-XXXX</DocCode>.
        </DocStep>
        <DocStep number={3} title="Click Activate">
          Prowler.io will connect to the license server to validate your key.
          This requires an internet connection for first activation only.
        </DocStep>
        <DocStep number={4} title="Start using Prowler.io">
          After successful activation, you will be taken to the main dashboard.
          The app works fully offline after activation.
        </DocStep>
      </div>

      <DocAlert type="info">
        Your license is bound to your hardware after first activation. If you
        need to move to a new computer, contact support and we will reset the
        binding within 24 hours.
      </DocAlert>

      <DocH3>Changing Computers</DocH3>
      <DocP>
        If you have an Unlimited Devices plan, you can activate on any number of
        machines. If you have a 1 Device plan and need to switch machines,
        contact us at{" "}
        <a
          href="mailto:support@prowler.io"
          className="text-accent-primary hover:underline"
        >
          support@prowler.io
        </a>{" "}
        with your license key and we will reset it.
      </DocP>

      <DocH3>Common Activation Errors</DocH3>
      <div className="space-y-3">
        {[
          {
            error: "Invalid license key",
            fix: "Double-check you copied the full key including the PROWL- prefix. Make sure there are no extra spaces.",
          },
          {
            error: "License already bound to another machine",
            fix: "Contact support to reset your hardware binding. Include your email and the last 4 characters of your key.",
          },
          {
            error: "License expired",
            fix: "Renew your subscription by submitting a renewal request on the pricing page.",
          },
          {
            error: "Network error during activation",
            fix: "Check your internet connection. Disable any VPN or firewall that may be blocking the connection.",
          },
        ].map(({ error, fix }) => (
          <div key={error} className="bg-bg-elevated border border-border rounded-xl p-4">
            <p className="text-accent-hot text-sm font-medium mb-1">{error}</p>
            <p className="text-text-secondary text-sm">{fix}</p>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

function FirstScrape() {
  return (
    <DocSection>
      <DocH2>Your First Scrape</DocH2>
      <DocP>
        This guide walks you through scraping your first batch of leads from
        Google Maps — the most popular source.
      </DocP>

      <div className="space-y-4">
        <DocStep number={1} title="Select a source">
          In the main dashboard, click on Google Maps from the source selector
          at the top.
        </DocStep>
        <DocStep number={2} title="Enter search criteria">
          Fill in the search fields: Business Type (e.g., "plumber"), Location
          (e.g., "Houston, TX"), and the number of results you want.
        </DocStep>
        <DocStep number={3} title="Configure filters (optional)">
          You can filter by rating, number of reviews, whether the business has
          a website, and more. Leave defaults for your first run.
        </DocStep>
        <DocStep number={4} title="Start the job">
          Click the Start button. Prowler will open a browser window in the
          background and begin extracting data.
        </DocStep>
        <DocStep number={5} title="Monitor progress">
          Watch the live progress panel. You will see leads appearing in
          real-time as they are extracted.
        </DocStep>
        <DocStep number={6} title="Export your results">
          When the job completes, click Export and choose CSV, Excel or JSON.
        </DocStep>
      </div>

      <DocAlert type="success">
        Tip: Start with a smaller job (100-500 leads) to get familiar with the
        tool before running large batches.
      </DocAlert>

      <DocH3>What Data Is Extracted</DocH3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {[
          "Business Name",
          "Phone Number",
          "Email Address",
          "Website URL",
          "Street Address",
          "City / State / ZIP",
          "Google Rating",
          "Review Count",
          "Business Category",
          "Operating Hours",
          "Google Maps URL",
          "Social Media Links",
        ].map((item) => (
          <div
            key={item}
            className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-secondary text-xs flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </DocSection>
  );
}

function DirectoryScraping() {
  return (
    <DocSection>
      <DocH2>Directory Scraping</DocH2>
      <DocP>
        The Universal Directory Scraper lets you extract data from any business
        directory — including those that require login credentials.
      </DocP>

      <DocAlert type="warning">
        Only use this feature with directories you have legitimate access to.
        Respect each website's terms of service.
      </DocAlert>

      <DocH3>Supported Directories (Built-in)</DocH3>
      <div className="grid grid-cols-2 gap-2">
        {[
          "Yelp",
          "Yellow Pages",
          "Bing Places",
          "Angi (Angie's List)",
          "HomeAdvisor",
          "Houzz",
          "Thumbtack",
          "Bark.com",
          "Clutch.co",
          "G2",
          "Capterra",
          "TripAdvisor",
        ].map((dir) => (
          <div
            key={dir}
            className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-secondary text-xs flex items-center gap-2"
          >
            <Globe size={10} className="text-accent-primary flex-shrink-0" />
            {dir}
          </div>
        ))}
      </div>

      <DocH3>Adding Custom Directories</DocH3>
      <div className="space-y-4">
        <DocStep number={1} title="Go to Directory Scraper tab">
          Select Universal Directory from the source selector.
        </DocStep>
        <DocStep number={2} title="Enter the URL">
          Paste the URL of the directory listing page you want to scrape.
        </DocStep>
        <DocStep number={3} title="Add login credentials (if required)">
          If the site requires login, enter your credentials in the secure
          credential vault. They are stored with AES-256 encryption.
        </DocStep>
        <DocStep number={4} title="Use Site Learner">
          Click Analyze Page. Prowler will detect the data fields automatically.
          Confirm the mapping and save it as a template.
        </DocStep>
        <DocStep number={5} title="Run and save template">
          Start the scrape. Save the template so you can reuse it for this
          directory without reconfiguring.
        </DocStep>
      </div>
    </DocSection>
  );
}

function OwnerEnrichment() {
  return (
    <DocSection>
      <DocH2>Owner Enrichment</DocH2>
      <DocP>
        Owner Enrichment finds the personal contact information of business
        owners — not just generic business emails, but the actual decision
        makers.
      </DocP>

      <DocH3>What It Finds</DocH3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          {
            source: "LinkedIn",
            data: "Owner name, job title, LinkedIn profile URL",
          },
          {
            source: "Facebook",
            data: "Personal or business Facebook page",
          },
          {
            source: "Instagram",
            data: "Business Instagram handle",
          },
          {
            source: "State Registries",
            data: "Registered agent name, business address",
          },
          {
            source: "Website",
            data: "Team page, About page, contact email",
          },
          {
            source: "Domain WHOIS",
            data: "Registrant name and email (when public)",
          },
        ].map(({ source, data }) => (
          <div key={source} className="bg-bg-elevated border border-border rounded-xl p-4">
            <p className="text-text-primary font-semibold text-sm mb-1">
              {source}
            </p>
            <p className="text-text-muted text-xs">{data}</p>
          </div>
        ))}
      </div>

      <DocH3>Running Enrichment</DocH3>
      <div className="space-y-3">
        <DocStep number={1} title="Complete a scrape job">
          Run any standard scrape to get your initial lead list.
        </DocStep>
        <DocStep number={2} title="Select leads to enrich">
          Select individual leads or the entire batch.
        </DocStep>
        <DocStep number={3} title="Click Enrich Owners">
          Prowler will run enrichment in the background. This takes longer than
          standard scraping — expect 5-30 seconds per lead.
        </DocStep>
        <DocStep number={4} title="Review and export">
          Enriched data appears as additional columns in your export.
        </DocStep>
      </div>

      <DocAlert type="info">
        Enrichment accuracy varies by industry. B2B niches like contractors,
        medical, and legal typically have 70-90% owner match rates.
      </DocAlert>
    </DocSection>
  );
}

function AiConfiguration() {
  return (
    <DocSection>
      <DocH2>AI Configuration</DocH2>
      <DocP>
        Prowler uses OpenAI (GPT-4) or Anthropic (Claude) as a fallback when
        standard scraping cannot extract data from a page. This dramatically
        improves success rates on complex or dynamic websites.
      </DocP>

      <DocH3>Setting Up OpenAI</DocH3>
      <div className="space-y-3">
        <DocStep number={1} title="Get an API key">
          Go to platform.openai.com, create an account, and generate an API key.
        </DocStep>
        <DocStep number={2} title="Add to Prowler settings">
          In Prowler, go to Settings → AI Configuration → OpenAI API Key.
        </DocStep>
        <DocStep number={3} title="Test the connection">
          Click Test Key. You should see a success confirmation.
        </DocStep>
      </div>

      <DocH3>Setting Up Claude (Anthropic)</DocH3>
      <div className="space-y-3">
        <DocStep number={1} title="Get an API key">
          Go to console.anthropic.com and generate an API key.
        </DocStep>
        <DocStep number={2} title="Add to Prowler settings">
          Go to Settings → AI Configuration → Anthropic API Key.
        </DocStep>
      </div>

      <DocAlert type="info">
        AI fallback is used automatically when needed — you do not need to
        configure anything for it to activate. Adding an API key just improves
        results on difficult pages.
      </DocAlert>

      <DocH3>AI Usage and Costs</DocH3>
      <DocP>
        AI is only used as a fallback, not for every request. Typical usage is
        0.1 to 0.5 API calls per 100 leads scraped. At OpenAI pricing, this
        costs roughly $0.01 to $0.05 per 1000 leads.
      </DocP>
    </DocSection>
  );
}

function ExportData() {
  return (
    <DocSection>
      <DocH2>Exporting Data</DocH2>

      <DocH3>Export Formats</DocH3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            format: "CSV",
            desc: "Universal format. Import into any CRM, Excel, Google Sheets.",
            best: "Best for: CRM imports",
          },
          {
            format: "Excel (.xlsx)",
            desc: "Native Excel format with formatted columns and auto-filters.",
            best: "Best for: Reporting",
          },
          {
            format: "JSON",
            desc: "Machine-readable format for developers and API integrations.",
            best: "Best for: Developers",
          },
        ].map(({ format, desc, best }) => (
          <div key={format} className="bg-bg-elevated border border-border rounded-xl p-4">
            <p className="text-text-primary font-bold text-lg mb-1">
              {format}
            </p>
            <p className="text-text-secondary text-xs mb-2">{desc}</p>
            <p className="text-accent-primary text-xs">{best}</p>
          </div>
        ))}
      </div>

      <DocH3>How to Export</DocH3>
      <div className="space-y-3">
        <DocStep number={1} title="Complete a scrape job">
          Wait for the job to finish or stop it manually when you have enough
          leads.
        </DocStep>
        <DocStep number={2} title="Optional — filter results">
          Use the built-in filters to remove duplicates or leads missing key
          fields.
        </DocStep>
        <DocStep number={3} title="Click Export">
          Click the Export button in the top right of the results panel.
        </DocStep>
        <DocStep number={4} title="Choose format and location">
          Select your format and where to save the file.
        </DocStep>
      </div>

      <DocAlert type="success">
        All exports are saved locally on your machine. No data is sent to any
        server.
      </DocAlert>
    </DocSection>
  );
}

function Troubleshooting() {
  return (
    <DocSection>
      <DocH2>Troubleshooting</DocH2>

      <div className="space-y-4">
        {[
          {
            problem: "App will not launch",
            solutions: [
              "Make sure Python 3.12 is installed and in your PATH",
              "Try running as administrator (Windows) or with sudo (Linux)",
              "Check that your antivirus is not blocking Prowler",
              "Reinstall the application",
            ],
          },
          {
            problem: "Scrape job stuck at 0%",
            solutions: [
              "Check your internet connection",
              "The target website may be blocking automated requests — try a different source",
              "Disable VPN if active",
              "Restart the application and try again",
            ],
          },
          {
            problem: "Browser window not opening",
            solutions: [
              "Playwright browsers may need to be installed — the app does this automatically on first run",
              "On Linux: sudo apt-get install libnss3 libatk-bridge2.0-0 libcups2 libxcomposite1",
              "Restart the application",
            ],
          },
          {
            problem: "License activation fails",
            solutions: [
              "Check your internet connection — activation requires online validation",
              "Verify your key is typed correctly (format: PROWL-XXXX-XXXX-XXXX-XXXX)",
              "Contact support if the error persists",
            ],
          },
          {
            problem: "Emails not being found",
            solutions: [
              "Some businesses do not list emails publicly — this is expected",
              "Enable Owner Enrichment to find additional contact methods",
              "Try the AI fallback option in Settings",
            ],
          },
        ].map(({ problem, solutions }) => (
          <div key={problem} className="card-surface p-5">
            <p className="text-text-primary font-semibold mb-3">{problem}</p>
            <ul className="space-y-2">
              {solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                  <ChevronRight
                    size={12}
                    className="text-accent-primary mt-0.5 flex-shrink-0"
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <DocH3>Still Need Help?</DocH3>
      <DocP>
        Contact our support team at{" "}
        <a
          href="mailto:support@prowler.io"
          className="text-accent-primary hover:underline"
        >
          support@prowler.io
        </a>
        . Include your OS, Prowler version, and a description of the problem.
        We respond within 24 hours.
      </DocP>
    </DocSection>
  );
}

export function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const current = sections.find((s) => s.id === activeSection)!;
  const ContentComponent = current.content;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0 py-12">
            <div className="sticky top-24">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-4 px-3">
                Documentation
              </p>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                        isActive
                          ? "bg-accent-primary/15 text-accent-primary"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                      }`}
                    >
                      <Icon size={14} />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Mobile section picker */}
          <div className="md:hidden w-full pt-6 pb-2">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full bg-bg-surface border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <main className="flex-1 py-12 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h1 className="font-display font-bold text-3xl text-text-primary">
                    {current.label}
                  </h1>
                </div>
                <ContentComponent />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}