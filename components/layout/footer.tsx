import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Pricing", href: "/pricing" },
    { label: "Download", href: "/download" },
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
  ],
  Support: [
    { label: "Help Center", href: "/support" },
    { label: "Contact", href: "/support#contact" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Refund Policy", href: "/legal/refund" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-text-primary text-lg">
                Prowler<span className="text-accent-primary">.io</span>
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Professional lead scraping software. Find thousands of verified
              business contacts in minutes.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-semibold text-text-primary text-sm mb-4 uppercase tracking-widest">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-muted hover:text-text-secondary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} Prowler.io. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Built for serious lead generators.
          </p>
        </div>
      </div>
    </footer>
  );
}