"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X, Minus } from "lucide-react";

const competitors = [
  { name: "Prowler.io", highlight: true },
  { name: "Apollo.io", highlight: false },
  { name: "Hunter.io", highlight: false },
  { name: "ZoomInfo", highlight: false },
];

const features = [
  {
    feature: "Google Maps Scraping",
    values: [true, false, false, false],
  },
  {
    feature: "Owner Social Profiles",
    values: [true, "partial", false, true],
  },
  {
    feature: "Directory Login Scraping",
    values: [true, false, false, false],
  },
  {
    feature: "AI-Powered Fallback",
    values: [true, false, false, false],
  },
  {
    feature: "One-Time Payment",
    values: [true, false, false, false],
  },
  {
    feature: "Runs Offline",
    values: [true, false, false, false],
  },
  {
    feature: "No Data Sent to Cloud",
    values: [true, false, false, false],
  },
  {
    feature: "Unlimited Exports",
    values: [true, false, "partial", false],
  },
  {
    feature: "Starting Price",
    values: ["$40", "$49/mo", "$49/mo", "$299/mo"],
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-accent-success/20 flex items-center justify-center">
          <Check size={12} className="text-accent-success" />
        </div>
      </div>
    );
  if (value === false)
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-accent-hot/10 flex items-center justify-center">
          <X size={12} className="text-accent-hot/60" />
        </div>
      </div>
    );
  if (value === "partial")
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-accent-gold/10 flex items-center justify-center">
          <Minus size={12} className="text-accent-gold/60" />
        </div>
      </div>
    );
  return (
    <div className="text-center text-sm font-semibold text-text-primary">
      {value}
    </div>
  );
}

export function ComparisonSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-border bg-bg-surface px-4 py-1.5 rounded-full text-xs font-medium text-text-secondary uppercase tracking-widest mb-6">
            How We Compare
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
            Why pros choose{" "}
            <span className="text-gradient">Prowler</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stop paying monthly subscriptions for tools that do half the job.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="card-surface overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-text-muted text-sm font-medium w-48">
                    Feature
                  </th>
                  {competitors.map((comp) => (
                    <th
                      key={comp.name}
                      className={`p-4 text-center text-sm font-semibold ${
                        comp.highlight
                          ? "text-accent-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {comp.highlight && (
                        <div className="inline-flex items-center gap-1 bg-accent-primary/10 border border-accent-primary/30 px-2 py-0.5 rounded-full text-xs mb-1">
                          Best Value
                        </div>
                      )}
                      <div>{comp.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-border last:border-0 ${
                      i % 2 === 0 ? "bg-bg-elevated/30" : ""
                    }`}
                  >
                    <td className="p-4 text-text-secondary text-sm">
                      {row.feature}
                    </td>
                    {row.values.map((val, j) => (
                      <td
                        key={j}
                        className={`p-4 ${
                          j === 0 ? "bg-accent-primary/5" : ""
                        }`}
                      >
                        <CellValue value={val} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}