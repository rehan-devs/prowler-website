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
    a: "After payment, you receive a license key in your email. Enter it in the desktop app on first launch. The license binds to your hardware automatically. For the All Devices plan, you can activate on unlimited machines.",
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
    a: "Apollo and Hunter are subscription databases with static data. Prowler scrapes live, real-time data from the source. You get fresh leads, not data that is months old. Plus it is a one-time purchase.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfer, EasyPaisa and JazzCash. After payment, send a screenshot through the order form and your license will be delivered within hours.",
  },
  {
    q: "Do subscriptions auto-renew?",
    a: "No. Subscriptions are manual. You pay each month and submit a renewal request through the same form. We send your renewed license before your current one expires.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes, we offer a 7-day refund if Prowler does not work on your system and our support team cannot resolve the issue. See our Refund Policy for full details.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-text-primary">{q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center"
        >
          <Plus size={12} className="text-text-secondary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-text-secondary text-sm leading-relaxed pb-5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-border bg-bg-surface px-4 py-1.5 rounded-full text-xs font-medium text-text-secondary uppercase tracking-widest mb-6">
            FAQ
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary">
            Common questions
          </h2>
        </div>

        <div className="card-surface p-6 md:p-8">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}