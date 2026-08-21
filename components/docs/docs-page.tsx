"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Download,
  Key,
  Search,
  Globe,
  User,
  Brain,
  FileDown,
  HelpCircle,
  Monitor,
  Apple,
  Terminal,
  Check,
  ChevronRight,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { InlineAnnotation } from "@/components/ui/visual-anchors";

/* ---------------- UI PRIMITIVES ---------------- */

function DocSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

function DocH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-black text-2xl text-foreground tracking-tight border-b border-border/60 pb-3 mt-10 first:mt-0">
      {children}
    </h2>
  );
}

function DocH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display font-black text-lg text-foreground tracking-tight mt-6 mb-3">
      {children}
    </h3>
  );
}

function DocP({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted text-sm font-medium leading-relaxed">
      {children}
    </p>
  );
}

function DocCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-white border border-border px-1.5 py-0.5 rounded font-mono text-accent text-xs font-bold">
      {children}
    </code>
  );
}

function DocBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-white border border-border rounded-xl p-4 overflow-x-auto font-mono text-xs text-foreground font-bold leading-relaxed">
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
    <div className="flex gap-4 items-start">
      <div className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="text-foreground font-black text-sm tracking-tight mb-1">
          {title}
        </h4>
        <div className="text-muted text-sm font-medium leading-relaxed">
          {children}
        </div>
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
    info: "bg-accent/5 border-accent/20 text-foreground",
    warning: "bg-amber-50 border-amber-200 text-amber-950",
    success: "bg-emerald-50 border-emerald-200 text-emerald-950",
  };
  const iconColor = {
    info: "text-accent",
    warning: "text-amber-800",
    success: "text-emerald-700",
  };
  return (
    <div className={`border rounded-xl p-4 flex gap-3 items-start ${styles[type]}`}>
      <AlertCircle size={16} className={`shrink-0 mt-0.5 ${iconColor[type]}`} />
      <div className="text-xs font-bold leading-normal">{children}</div>
    </div>
  );
}

/* ---------------- SECTIONS ---------------- */

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
          { icon: Monitor, os: "Windows", req: "Windows 10 or 11, 64-bit" },
          { icon: Apple, os: "macOS", req: "macOS 12 Monterey or later" },
          { icon: Terminal, os: "Linux", req: "Ubuntu 20.04+ or Debian 11+" },
        ].map(({ icon: Icon, os, req }) => (
          <div key={os} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <Icon size={18} className="text-accent mb-3" />
            <p className="text-foreground font-black text-sm tracking-tight">{os}</p>
            <p className="text-muted text-xs font-bold mt-1 uppercase tracking-wider">{req}</p>
          </div>
        ))}
      </div>

      <DocAlert type="warning">
        Python 3.12 is required on all platforms. The scraping engine runs on
        Python. Install it from{" "}
        <a href="https://python.org" className="underline" target="_blank" rel="noopener noreferrer">
          python.org
        </a>{" "}
        before installing Prowler.io.
      </DocAlert>

      <DocH3>Quick Start</DocH3>
      <div className="space-y-4">
        <DocStep number={1} title="Purchase a license">
          Go to the{" "}
          <a href="/pricing" className="text-accent hover:underline font-bold">
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
          &quot;Add Python to PATH&quot; during installation on Windows.
        </DocStep>
        <DocStep number={4} title="Install Prowler.io">
          Download the installer for your OS from the{" "}
          <a href="/download" className="text-accent hover:underline font-bold">
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
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Monitor size={14} className="text-accent" />
            <p className="text-foreground font-black text-sm tracking-tight">Windows</p>
          </div>
          <ol className="space-y-2 text-muted text-sm font-medium leading-relaxed mb-3">
            <li>1. Download Python 3.12 from python.org/downloads</li>
            <li>2. Run the installer</li>
            <li>3. Check the box &quot;Add Python 3.12 to PATH&quot; before clicking Install</li>
            <li>4. Verify installation — open Command Prompt and run:</li>
          </ol>
          <DocBlock>python --version</DocBlock>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Apple size={14} className="text-accent" />
            <p className="text-foreground font-black text-sm tracking-tight">macOS</p>
          </div>
          <DocP>Install via Homebrew (recommended) or the official installer:</DocP>
          <div className="mt-3">
            <DocBlock>{`brew install python@3.12
python3.12 --version`}</DocBlock>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={14} className="text-accent" />
            <p className="text-foreground font-black text-sm tracking-tight">Linux</p>
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
          <div key={os} className="bg-white border border-border rounded-xl p-5">
            <p className="text-foreground font-black text-sm mb-3 tracking-tight">{os}</p>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="text-muted text-sm font-medium flex gap-3">
                  <span className="text-accent font-mono text-xs mt-0.5 flex-shrink-0 font-bold">
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
        <a href="mailto:support@prowler.io" className="text-accent hover:underline font-bold">
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
          <div key={error} className="bg-white border border-border rounded-xl p-5">
            <p className="text-foreground text-sm font-black mb-1 tracking-tight">{error}</p>
            <p className="text-muted text-sm font-medium leading-relaxed">{fix}</p>
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
          Fill in the search fields: Business Type (e.g., &quot;plumber&quot;), Location
          (e.g., &quot;Houston, TX&quot;), and the number of results you want.
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
            className="bg-white border border-border rounded-lg px-3 py-2 text-muted text-xs font-bold flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
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
        Respect each website&apos;s terms of service.
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
            className="bg-white border border-border rounded-lg px-3 py-2 text-muted text-xs font-bold flex items-center gap-2"
          >
            <Globe size={10} className="text-accent flex-shrink-0" />
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
          { source: "LinkedIn", data: "Owner name, job title, LinkedIn profile URL" },
          { source: "Facebook", data: "Personal or business Facebook page" },
          { source: "Instagram", data: "Business Instagram handle" },
          { source: "State Registries", data: "Registered agent name, business address" },
          { source: "Website", data: "Team page, About page, contact email" },
          { source: "Domain WHOIS", data: "Registrant name and email (when public)" },
        ].map(({ source, data }) => (
          <div key={source} className="bg-white border border-border rounded-xl p-4">
            <p className="text-foreground font-black text-sm mb-1 tracking-tight">{source}</p>
            <p className="text-muted text-xs font-medium leading-relaxed">{data}</p>
          </div>
        ))}
      </div>

      <DocH3>Running Enrichment</DocH3>
      <div className="space-y-4">
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
      <div className="space-y-4">
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
      <div className="space-y-4">
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
          <div key={format} className="bg-white border border-border rounded-xl p-5">
            <p className="text-foreground font-black text-xl mb-2 tracking-tight">{format}</p>
            <p className="text-muted text-xs font-medium mb-3 leading-relaxed">{desc}</p>
            <p className="text-accent text-[10px] font-black uppercase tracking-widest">{best}</p>
          </div>
        ))}
      </div>

      <DocH3>How to Export</DocH3>
      <div className="space-y-4">
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
          <div key={problem} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <p className="text-foreground font-black text-sm mb-3 tracking-tight">{problem}</p>
            <ul className="space-y-2">
              {solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-muted text-sm font-medium leading-relaxed">
                  <ChevronRight size={14} className="text-accent mt-0.5 flex-shrink-0" />
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
        <a href="mailto:support@prowler.io" className="text-accent hover:underline font-bold">
          support@prowler.io
        </a>
        . Include your OS, Prowler version, and a description of the problem.
        We respond within 24 hours.
      </DocP>
    </DocSection>
  );
}

/* ---------------- SECTIONS REGISTRY ---------------- */

const sections = [
  { id: "getting-started", label: "Getting Started", icon: Play, content: GettingStarted },
  { id: "installation", label: "Installation", icon: Download, content: Installation },
  { id: "activation", label: "License Activation", icon: Key, content: Activation },
  { id: "first-scrape", label: "Your First Scrape", icon: Search, content: FirstScrape },
  { id: "directory-scraping", label: "Directory Scraping", icon: Globe, content: DirectoryScraping },
  { id: "owner-enrichment", label: "Owner Enrichment", icon: User, content: OwnerEnrichment },
  { id: "ai-configuration", label: "AI Configuration", icon: Brain, content: AiConfiguration },
  { id: "export", label: "Exporting Data", icon: FileDown, content: ExportData },
  { id: "troubleshooting", label: "Troubleshooting", icon: HelpCircle, content: Troubleshooting },
];

/* ---------------- MAIN PAGE ---------------- */

export function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const current = sections.find((s) => s.id === activeSection)!;
  const ContentComponent = current.content;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Hero */}
        <div className="mb-16 border-b border-border pb-10 relative">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} className="text-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              Product Knowledge Base
            </span>
          </div>
          <h1 className="text-display-sm md:text-display-md font-display font-black text-foreground tracking-tight leading-none">
            Technical{" "}
            <span className="relative inline-block">
              guides
              <span className="hidden md:block absolute top-0 right-0 w-0 h-0">
                <InlineAnnotation
                  text="everything you need"
                  delay={0.6}
                  path="M 0,0 Q 45,-40 105,-18"
                  svgStyles={{ top: "5%", left: "80%" }}
                  textStyles={{
                    top: "-12px",
                    left: "115px",
                    transform: "rotate(5deg)",
                  }}
                />
              </span>
            </span>{" "}
            &amp; <span className="accent-block">tutorials.</span>
          </h1>
          <p className="text-muted text-base font-medium mt-6 max-w-2xl">
            Everything you need to install, activate and master Prowler.io — from a first-time scrape to advanced enrichment configurations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
            <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted px-3 mb-3 mt-1">
                Contents
              </p>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all text-left ${
                        isActive
                          ? "bg-accent text-white"
                          : "text-muted hover:text-foreground hover:bg-background/70"
                      }`}
                    >
                      <Icon size={14} />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Support Card */}
            <div className="mt-4 bg-inverted border border-inverted rounded-2xl p-6 text-inverted-foreground">
              <p className="text-[10px] font-bold uppercase tracking-widest text-inverted-muted mb-2">
                Need help?
              </p>
              <p className="font-display font-black text-lg tracking-tight mb-3 leading-tight">
                Talk to a real human.
              </p>
              <a
                href="/support"
                className="inline-block text-xs font-black uppercase text-accent hover:underline tracking-widest"
              >
                Contact Support &rarr;
              </a>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 bg-white border border-border rounded-2xl p-8 md:p-12 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8 pb-6 border-b border-border/60 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <current.icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1 block">
                      Prowler Docs
                    </span>
                    <h2 className="font-display font-black text-2xl md:text-3xl text-foreground tracking-tight leading-none">
                      {current.label}
                    </h2>
                  </div>
                </div>

                <ContentComponent />

                {/* Nav between sections */}
                <div className="mt-16 pt-8 border-t border-border/60 flex items-center justify-between gap-4">
                  {(() => {
                    const currentIdx = sections.findIndex((s) => s.id === activeSection);
                    const prev = sections[currentIdx - 1];
                    const next = sections[currentIdx + 1];
                    return (
                      <>
                        {prev ? (
                          <button
                            onClick={() => setActiveSection(prev.id)}
                            className="group flex flex-col items-start gap-1 text-left"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                              &larr; Previous
                            </span>
                            <span className="text-sm font-black text-foreground group-hover:text-accent transition-colors tracking-tight">
                              {prev.label}
                            </span>
                          </button>
                        ) : (
                          <div />
                        )}
                        {next ? (
                          <button
                            onClick={() => setActiveSection(next.id)}
                            className="group flex flex-col items-end gap-1 text-right"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                              Next &rarr;
                            </span>
                            <span className="text-sm font-black text-foreground group-hover:text-accent transition-colors tracking-tight">
                              {next.label}
                            </span>
                          </button>
                        ) : (
                          <div />
                        )}
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
}