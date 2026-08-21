"use client";

import { motion } from "framer-motion";
import { InlineAnnotation } from "@/components/ui/visual-anchors";

interface LegalSection {
  title: string;
  content: string;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalPage({ title, lastUpdated, sections }: LegalPageProps) {
  // Define precise annotation anchored to the final period element
  const annotation = (
    <span className="hidden md:inline-block absolute top-1/2 left-full w-0 h-0 ml-1">
      <InlineAnnotation
        text="100% compliant"
        delay={0.6}
        path="M 0,0 Q 40,-45 95,-20"
        svgStyles={{ top: "0%", left: "0%" }}
        textStyles={{
          top: "-15px",
          left: "100px",
          transform: "rotate(6deg)",
        }}
      />
    </span>
  );

  const renderTitle = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("terms")) {
      return (
        <>
          Terms of{" "}
          <span className="accent-block">
            Service
            <span className="relative">
              .
              {annotation}
            </span>
          </span>
        </>
      );
    }
    if (lowerTitle.includes("privacy")) {
      return (
        <>
          Privacy{" "}
          <span className="accent-block">
            Policy
            <span className="relative">
              .
              {annotation}
            </span>
          </span>
        </>
      );
    }
    if (lowerTitle.includes("refund")) {
      return (
        <>
          Refund{" "}
          <span className="accent-block">
            Policy
            <span className="relative">
              .
              {annotation}
            </span>
          </span>
        </>
      );
    }
    return (
      <span className="accent-block">
        {title}
        <span className="relative">
          .
          {annotation}
        </span>
      </span>
    );
  };

  return (
    <section className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 relative"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted block mb-3">
            Legal Framework
          </span>
          <h1 className="text-display-sm md:text-display-md text-foreground mb-4 leading-none tracking-tight">
            {renderTitle()}
          </h1>
          <p className="text-muted text-sm font-bold uppercase tracking-wider">
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-border rounded-2xl p-8 shadow-sm"
            >
              <h2 className="font-display font-black text-xl text-foreground mb-4 tracking-tight">
                {section.title}
              </h2>
              <p className="text-muted font-medium leading-relaxed text-sm whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Support Prompt */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-muted text-xs font-bold uppercase tracking-widest">
            Have questions about our terms?
          </p>
          <a
            href="mailto:support@prowler.io"
            className="group inline-flex items-center gap-2 text-accent font-black text-sm uppercase tracking-wider hover:text-[#4F52D6] transition-colors"
          >
            Email Legal Support
            <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}