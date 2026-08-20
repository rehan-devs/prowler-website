"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Map,
  Globe,
  User,
  Brain,
  Shield,
  Download,
  Zap,
  Database,
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Multi-Source Scraping",
    description:
      "Pull leads from Google Maps, Yelp, Yellow Pages, Bing Places and 50+ business directories simultaneously.",
    color: "#667eea",
    tag: "Core",
  },
  {
    icon: Globe,
    title: "Universal Directory Scraper",
    description:
      "Login to any directory site with your credentials. Prowler learns the layout and extracts all listings automatically.",
    color: "#764ba2",
    tag: "Advanced",
  },
  {
    icon: User,
    title: "Owner Enrichment",
    description:
      "Finds business owner names, LinkedIn profiles, Facebook pages, Instagram handles and state registry data.",
    color: "#ff6464",
    tag: "Enrichment",
  },
  {
    icon: Brain,
    title: "AI Fallback Engine",
    description:
      "When standard scraping hits a wall, OpenAI and Claude step in to extract data from difficult pages.",
    color: "#38ef7d",
    tag: "AI",
  },
  {
    icon: Shield,
    title: "Encrypted Credential Vault",
    description:
      "AES-256 encrypted storage for all your login credentials. Your data never leaves your machine.",
    color: "#f7e479",
    tag: "Security",
  },
  {
    icon: Download,
    title: "Flexible Export",
    description:
      "Export to CSV, Excel, JSON or directly into your CRM. Thousands of contacts ready in minutes.",
    color: "#ff69b4",
    tag: "Export",
  },
  {
    icon: Zap,
    title: "Site Learner Templates",
    description:
      "Save scraping configurations for any website. Run the same job tomorrow with one click.",
    color: "#47C9FF",
    tag: "Automation",
  },
  {
    icon: Database,
    title: "Hardware-Bound License",
    description:
      "Your license is tied to your machine. No account needed, no cloud dependency, no privacy concerns.",
    color: "#667eea",
    tag: "Privacy",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative card-surface p-6 hover:border-border-glow transition-all duration-300 hover:-translate-y-1"
    >
      {/* Tag */}
      <div className="absolute top-4 right-4">
        <span className="text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded-full border border-border">
          {feature.tag}
        </span>
      </div>

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: `${feature.color}15` }}
      >
        <Icon size={18} style={{ color: feature.color }} />
      </div>

      {/* Content */}
      <h3 className="font-display font-semibold text-text-primary text-lg mb-2">
        {feature.title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed">
        {feature.description}
      </p>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${feature.color}08 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-border bg-bg-surface px-4 py-1.5 rounded-full text-xs font-medium text-text-secondary uppercase tracking-widest mb-6">
            Everything You Need
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl text-text-primary mb-4">
            Built for serious
            <br />
            <span className="text-gradient">lead generators</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Not a watered-down browser extension. A full desktop application
            with real scraping power.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}