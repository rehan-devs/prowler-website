"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-32 bg-inverted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Start Today eyebrow removed */}

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-display-sm md:text-display-md text-inverted-foreground mb-12"
        >
          Stop searching.<br />
          Start <span className="accent-block">closing.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-4 bg-accent text-white pl-8 pr-2 py-2 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-[#4F52D6] transition-colors mb-12"
          >
            View Pricing
            <div className="w-10 h-10 bg-inverted rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
              <ArrowRight size={16} className="text-white" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[10px] md:text-[11px] font-bold text-inverted-muted uppercase tracking-[0.2em]"
        >
          <span>Pay once, own forever</span>
          <span className="w-1 h-1 bg-inverted-muted/50 rounded-full" />
          <span>License delivered in hours</span>
          <span className="w-1 h-1 bg-inverted-muted/50 rounded-full" />
          <span>Runs 100% offline</span>
        </motion.div>
      </div>
    </section>
  );
}