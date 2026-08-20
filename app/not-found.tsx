"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-8">
          <Zap size={28} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-7xl text-text-primary mb-4">
          404
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          This page does not exist. Maybe it got scraped away.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-accent text-white rounded-xl font-semibold text-sm tracking-wide uppercase hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] transition-all"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}