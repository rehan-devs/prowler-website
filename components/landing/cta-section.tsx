"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield } from "lucide-react";
import { ProwlerButton } from "@/components/ui/prowler-button";

export function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative card-surface p-12 md:p-20 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-purple/5 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 border border-accent-primary/30 bg-accent-primary/10 px-4 py-1.5 rounded-full text-xs font-medium text-accent-primary uppercase tracking-widest mb-8">
              Start Today
            </div>

            <h2 className="font-display font-bold text-4xl md:text-6xl text-text-primary mb-6">
              Stop searching.
              <br />
              <span className="text-gradient">Start closing.</span>
            </h2>

            <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
              Join 1,200+ businesses already using Prowler to build their
              prospect lists while competitors do it manually.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ProwlerButton
                size="lg"
                onClick={() => (window.location.href = "/pricing")}
              >
                View Pricing
                <ArrowRight size={16} className="ml-2 inline" />
              </ProwlerButton>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Shield size={14} />
                7-day refund guarantee
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}