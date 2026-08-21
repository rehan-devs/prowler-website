"use client";

import { motion } from "framer-motion";
import { InlineAnnotation } from "@/components/ui/visual-anchors";

const features = [
  {
    title: "Multi-Source Scraping",
    description:
      "Pull leads from Google Maps, Yelp, Yellow Pages, and 50+ directories simultaneously.",
    isAccent: false,
  },
  {
    title: "Universal Scraper",
    description:
      "Login to any directory with your credentials. Prowler extracts all listings automatically.",
    isAccent: false,
  },
  {
    title: "Owner Enrichment",
    description:
      "Finds business owner names, LinkedIn profiles, Facebook pages, and state registry data.",
    isAccent: false,
  },
  {
    title: "AI Fallback Engine",
    description: "When scraping fails, AI takes over to extract data flawlessly.",
    isAccent: true,
  },
  {
    title: "Encrypted Vault",
    description:
      "AES-256 encrypted storage for login credentials. Data never leaves your machine.",
    isAccent: false,
  },
  {
    title: "Flexible Export",
    description:
      "Export to CSV, Excel, JSON or directly into your CRM. Thousands of contacts in minutes.",
    isAccent: false,
  },
  {
    title: "Site Templates",
    description:
      "Save scraping configurations for any website. Run the exact same job tomorrow with one click.",
    isAccent: false,
  },
  {
    title: "Hardware Bound",
    description:
      "Your license is tied to your machine. No account needed, no privacy concerns.",
    isAccent: false,
  },
];

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-background relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-display-sm md:text-display-md text-foreground leading-[1.05] max-w-4xl">
            Built for{" "}
            <span className="accent-block">
              seriou
              <span className="relative">
                s
                <InlineAnnotation
                  text="no cloud. no BS."
                  delay={0.4}
                  path="M 0,0 Q 40,-35 95,-12"
                  svgStyles={{ top: "20%", left: "50%" }}
                  textStyles={{
                    top: "10px",
                    left: "100px",
                    transform: "rotate(-5deg)",
                  }}
                />
              </span>
            </span>
            <br />
            lead generators.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative flex flex-col p-8 rounded-2xl border transition-colors duration-300 ${
                feature.isAccent
                  ? "bg-accent border-accent text-white"
                  : "bg-white border-border text-foreground hover:border-accent"
              }`}
            >
              <h3 className="font-display font-black text-xl mb-3 tracking-tight leading-tight">
                {feature.isAccent && feature.title === "AI Fallback Engine" ? (
                  <span className="font-serif italic font-medium text-2xl">
                    When scraping fails, AI takes over.
                  </span>
                ) : (
                  feature.title
                )}
              </h3>
              {!(feature.isAccent && feature.title === "AI Fallback Engine") && (
                <p
                  className={`text-[15px] font-medium leading-relaxed ${
                    feature.isAccent ? "text-white/80" : "text-muted"
                  }`}
                >
                  {feature.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}