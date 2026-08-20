"use client";

import { motion } from "framer-motion";

interface LegalSection {
  title: string;
  content: string;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalPage({ title, lastUpdated, sections }: LegalPageProps) {
  return (
    <section className="min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-text-muted text-sm mb-2 uppercase tracking-widest">
            Legal
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
            {title}
          </h1>
          <p className="text-text-muted text-sm">
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="font-display font-semibold text-text-primary text-xl mb-3">
                {section.title}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-text-muted text-sm">
            Questions? Email{" "}
            <a
              href="mailto:support@prowler.io"
              className="text-accent-primary hover:underline"
            >
              support@prowler.io
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}