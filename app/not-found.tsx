"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { InlineAnnotation } from "@/components/ui/visual-anchors";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden text-center">
      
      {/* Background visual elements */}
      <div className="max-w-xl mx-auto flex flex-col items-center z-10">
        
        {/* Brand Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-8 shadow-sm"
        >
          <Zap size={24} className="text-white" />
        </motion.div>

        {/* 404 Heading with Inline Annotation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-black text-[7rem] md:text-[9rem] leading-[0.9] tracking-[-0.04em] text-foreground mb-6"
        >
          40
          <span className="relative inline-block">
            4
            <span className="hidden sm:block absolute top-0 right-0 w-0 h-0">
              <InlineAnnotation
                text="lead not found"
                delay={0.5}
                path="M 0,0 Q 45,-40 100,-18"
                svgStyles={{ top: "10%", left: "60%" }}
                textStyles={{
                  top: "-12px",
                  left: "105px",
                  transform: "rotate(5deg)",
                }}
              />
            </span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted text-lg md:text-xl font-medium max-w-md mb-10 leading-relaxed"
        >
          This page does not exist. It may have been removed, renamed, or{" "}
          <span className="accent-block">scraped away.</span>
        </motion.p>

        {/* Back to Home Button (Matches the hero button) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatedButton href="/" variant="accent">
            Back to Home
          </AnimatedButton>
        </motion.div>

        {/* Trust row footer metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-16"
        >
          <span>Prowler.io Desktop</span>
          <span className="w-1 h-1 bg-muted/50 rounded-full" />
          <span>Offline Architecture</span>
          <span className="w-1 h-1 bg-muted/50 rounded-full" />
          <span>Local Data Only</span>
        </motion.div>

      </div>
    </div>
  );
}