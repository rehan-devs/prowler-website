"use client";

import { motion } from "framer-motion";
import { InlineAnnotation, StatBubble } from "@/components/ui/visual-anchors";
import { AnimatedButton } from "@/components/ui/animated-button";

const sources = [
  "GOOGLE MAPS",
  "YELP",
  "YELLOW PAGES",
  "BING PLACES",
  "LINKEDIN",
  "FACEBOOK",
  "INSTAGRAM",
  "STATE REGISTRIES",
];

export function HeroSection() {
  return (
    <section className="relative pt-12 md:pt-16 pb-0 overflow-hidden bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[70vh] flex flex-col items-center justify-center">
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <StatBubble
            value="10,247"
            label="Leads Extracted"
            type="count"
            rotation="-6deg"
            className="top-[15%] left-[5%]"
            delay={0.4}
          />
          <StatBubble
            value="97%"
            label="Accuracy Rate"
            type="count"
            rotation="4deg"
            className="top-[10%] right-[8%]"
            delay={0.6}
          />
          <StatBubble
            value="2.3s"
            label="Avg Scrape Time"
            type="progress"
            rotation="6deg"
            className="bottom-[35%] left-[8%]"
            delay={0.8}
          />
          <StatBubble
            value="50+"
            label="Data Sources"
            type="count"
            rotation="-4deg"
            className="bottom-[40%] right-[10%]"
            delay={1.0}
          />
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center text-center z-10 relative mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-sm md:text-display-md lg:text-[6.5rem] leading-[0.95] tracking-[-0.04em] text-foreground font-black mb-8"
          >
            <span className="relative">
              F
              <InlineAnnotation
                text="built for pros"
                delay={1.2}
                path="M 0,0 Q -50,-70 -120,-45"
                svgStyles={{ top: "10%", left: "0%" }}
                textStyles={{
                  top: "-58px",
                  left: "-210px",
                  transform: "rotate(-8deg)",
                }}
              />
            </span>
            ind{" "}
            <span className="accent-block">
              lead
              <span className="relative">
                s.
                <InlineAnnotation
                  text="runs locally"
                  delay={1.4}
                  path="M 0,0 Q 45,-40 100,-18"
                  svgStyles={{ top: "5%", left: "60%" }}
                  textStyles={{
                    top: "-10px",
                    left: "105px",
                    transform: "rotate(5deg)",
                  }}
                />
              </span>
            </span>
            <br />
            Close deals.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg md:text-xl max-w-xl mb-10 font-medium leading-relaxed"
          >
            Prowler scrapes verified business contacts from 50+ directories. Runs
            entirely on your desktop.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <AnimatedButton href="/pricing" variant="accent">
              Get Prowler
            </AnimatedButton>

            <span className="hidden md:block absolute top-1/2 -right-2 w-0 h-0">
              <InlineAnnotation
                text="no monthly fees"
                delay={1.6}
                path="M 0,0 Q 50,45 110,30"
                svgStyles={{ top: "0%", left: "0%" }}
                textStyles={{
                  top: "22px",
                  left: "100px",
                  transform: "rotate(-4deg)",
                }}
              />
            </span>
          </motion.div>
        </div>
      </div>

      <div className="relative z-20 bg-background border-t border-border mt-12 md:mt-16 pb-12">
        <div className="flex overflow-hidden py-6 bg-background">
          <div className="flex w-max animate-marquee">
            {[...sources, ...sources, ...sources].map((source, i) => (
              <div key={i} className="flex items-center">
                <span className="text-2xl md:text-3xl font-display font-black text-muted/20 whitespace-nowrap px-8 uppercase tracking-tight">
                  {source}
                </span>
                <span className="w-2 h-2 rounded-full bg-accent/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}