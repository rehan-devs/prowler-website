"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Globe, Search, Users } from "lucide-react";
import Link from "next/link";
import Velaris from "@/components/ui/velaris";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { ProwlerButton } from "@/components/ui/prowler-button";

const floatingBadges = [
  { icon: MapPin, label: "Google Maps", color: "#667eea", delay: 0 },
  { icon: Globe, label: "Yellow Pages", color: "#764ba2", delay: 0.2 },
  { icon: Search, label: "Bing Places", color: "#ff6464", delay: 0.4 },
  { icon: Users, label: "Owner Finder", color: "#38ef7d", delay: 0.6 },
];

export function HeroSection() {
  return (
    <HeroHighlight containerClassName="min-h-screen">
      <Velaris
        bg="#05050a"
        colors={["#667eea", "#764ba2", "#1a1a2e", "#0d0d14"]}
        speed={1.2}
        grain={0.35}
        height="100vh"
        className="absolute inset-0"
      >
        <div />
      </Velaris>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 border border-border-glow bg-bg-surface/80 backdrop-blur px-4 py-2 rounded-full text-xs font-medium text-text-secondary uppercase tracking-widest mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-success" />
          Professional Lead Generation Software
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-text-primary max-w-5xl leading-tight mb-6"
        >
          Find Your Next{" "}
          <span className="shine-text">10,000 Customers</span>{" "}
          Tonight
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-text-secondary text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        >
          Prowler scrapes verified business leads from Google Maps, Yelp, Yellow
          Pages and 50+ directories. Finds owner names, emails and social
          profiles automatically.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <ProwlerButton
            size="lg"
            onClick={() => (window.location.href = "/pricing")}
          >
            Get Prowler Now
          </ProwlerButton>
          <Link
            href="/download"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium group"
          >
            Free Trial Available
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>

        {/* Source badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          {floatingBadges.map(({ icon: Icon, label, color, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + delay, type: "spring" }}
              className="flex items-center gap-2 bg-bg-surface/80 backdrop-blur border border-border px-3 py-2 rounded-full text-xs text-text-secondary"
            >
              <Icon size={12} style={{ color }} />
              {label}
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: "spring" }}
            className="flex items-center gap-2 bg-bg-surface/80 backdrop-blur border border-border px-3 py-2 rounded-full text-xs text-text-secondary"
          >
            + 50 more sources
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-3 gap-8 max-w-lg w-full"
        >
          {[
            { value: "50+", label: "Data Sources" },
            { value: "10k+", label: "Leads Per Hour" },
            { value: "97%", label: "Accuracy Rate" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-3xl text-gradient mb-1">
                {value}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border border-border rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-accent-primary rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </HeroHighlight>
  );
}