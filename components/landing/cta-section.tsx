"use client";

import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";

export function CtaSection() {
  return (
    <section className="py-32 bg-inverted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
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
          className="mb-12"
        >
          <AnimatedButton href="/pricing" variant="accent">
            View Pricing
          </AnimatedButton>
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