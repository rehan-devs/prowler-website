"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const footerLinks = {
  Product: [
    { label: "Pricing", href: "/pricing" },
    { label: "Download", href: "/download" },
    { label: "Documentation", href: "/docs" },
  ],
  Support: [
    { label: "Help Center", href: "/support" },
    { label: "Contact Us", href: "/support#contact" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Refund Policy", href: "/legal/refund" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-inverted text-inverted-foreground pt-20 md:pt-32 pb-6 md:pb-12 rounded-t-[2.5rem] mt-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-1.5 group mb-6 inline-flex">
              <span className="font-display font-black text-3xl tracking-tight">
                PROWLER
              </span>
              <div className="bg-accent text-white text-[12px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                .io
              </div>
            </Link>
            <p className="text-inverted-muted text-lg max-w-sm font-medium leading-relaxed">
              Professional lead scraping software. Find thousands of verified business contacts in minutes, straight from your desktop.
            </p>
          </div>

          {/* Links Cols */}
          {Object.entries(footerLinks).map(([section, links], i) => (
            <motion.div 
              key={section}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h4 className="text-[11px] font-bold tracking-[0.15em] text-inverted-muted uppercase mb-6">
                {section}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-inverted-foreground/80 hover:text-accent font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-inverted pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-inverted-muted text-sm font-medium">
            &copy; {new Date().getFullYear()} Prowler.io. All rights reserved.
          </p>
          <p className="text-inverted-muted text-sm font-medium">
            Built for serious lead generators.
          </p>
        </div>
      </div>

      {/* Massive Brand Watermark - Reduced Height */}
      <div className="w-full overflow-hidden flex justify-center mt-12 pointer-events-none select-none h-[12vw] md:h-[10vw]">
        <span className="text-[18vw] md:text-[14vw] leading-[0.75] font-display font-black text-white/5 tracking-tighter mix-blend-overlay">
          PROWLER
        </span>
      </div>
    </footer>
  );
}