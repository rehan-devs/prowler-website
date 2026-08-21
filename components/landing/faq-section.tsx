"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Does Prowler.io work on Windows, Mac and Linux?",
    a: "Yes. Prowler.io is a desktop application that runs natively on Windows 10+, macOS 12+ and Ubuntu/Debian Linux. You need Python 3.12 installed as a dependency.",
  },
  {
    q: "How does the license system work?",
    a: "After payment, you receive a license key by email. Enter it in the desktop app on first launch. The license binds to your hardware automatically. All Devices plans can activate on unlimited machines.",
  },
  {
    q: "Is my data private? Do you store my scraped leads?",
    a: "Completely private. All scraped data stays on your machine. Prowler never uploads your leads, credentials or search queries anywhere. The only server contact is for license validation.",
  },
  {
    q: "What if I change computers?",
    a: "Contact us with your license key and old/new machine details. We reset the hardware binding within 24 hours. All Devices plan holders can activate immediately without any request.",
  },
  {
    q: "How is Prowler different from Apollo or Hunter?",
    a: "Apollo and Hunter are subscription databases with static data. Prowler scrapes live, real-time data from the source. You get fresh leads, not data that is months old. Plus it can be a one-time purchase.",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-inverted-muted/30"
    >
      <button
        className="w-full flex items-center justify-between py-8 text-left gap-6 group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-display font-black text-lg md:text-xl text-inverted-foreground tracking-tight group-hover:text-accent transition-colors">
          {q}
        </span>
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform duration-300 ${
            open
              ? "border-accent rotate-45 text-accent"
              : "border-inverted-muted text-inverted-muted group-hover:border-inverted-foreground group-hover:text-inverted-foreground"
          }`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-inverted-muted text-lg leading-relaxed font-medium pb-8 max-w-3xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  return (
    <section className="section-padding bg-inverted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-20">
          {/* FAQS eyebrow removed */}
          <h2 className="text-display-sm md:text-display-md text-inverted-foreground">
            Common questions.
          </h2>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}