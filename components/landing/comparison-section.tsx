"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const competitors = [
  { name: "PROWLER.IO", isProwler: true },
  { name: "APOLLO.IO", isProwler: false },
  { name: "HUNTER.IO", isProwler: false },
  { name: "ZOOMINFO", isProwler: false },
];

const features = [
  { feature: "Google Maps Scraping", values: [true, false, false, false] },
  { feature: "Owner Social Profiles", values: [true, "Partial", false, true] },
  { feature: "Directory Login Scraping", values: [true, false, false, false] },
  { feature: "AI-Powered Fallback", values: [true, false, false, false] },
  { feature: "Runs Offline", values: [true, false, false, false] },
  { feature: "Data Sent to Cloud", values: [false, true, true, true] },
  { feature: "Export Limits", values: ["Unlimited", "Strict", "Credits", "Strict"] },
  { feature: "Starting Price", values: ["$40", "$588/yr", "$408/yr", "$3k+/yr"] },
];

function CellValue({ value, isProwler }: { value: boolean | string, isProwler: boolean }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isProwler ? 'bg-accent' : 'bg-foreground'}`}>
          <Check size={14} className="text-white" strokeWidth={3} />
        </div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center text-muted font-bold">
        &mdash;
      </div>
    );
  }
  return (
    <div className={`text-center text-[15px] font-black ${isProwler ? 'text-accent' : 'text-muted'}`}>
      {value}
    </div>
  );
}

export function ComparisonSection() {
  return (
    <section id="why-us" className="py-20 md:py-24 bg-background relative z-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <h2 className="text-display-sm md:text-display-md text-foreground mb-6">
            The <span className="accent-block">smarter</span> way to find leads.
          </h2>
          <p className="text-muted text-lg font-medium max-w-2xl">
            Stop paying monthly subscriptions for cloud tools that restrict your exports and sell your data.
          </p>
        </div>

        {/* Table Container - Clean White */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-border rounded-2xl overflow-hidden relative shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-6 w-64 border-b border-border bg-white"></th>
                  {competitors.map((comp) => (
                    <th
                      key={comp.name}
                      className={`p-6 text-center border-b border-border w-40 relative ${
                        comp.isProwler ? "bg-accent/5 border-l-2 border-l-accent" : "bg-white"
                      }`}
                    >
                      <div className={`inline-flex flex-col items-center uppercase tracking-widest text-[11px] font-black ${
                        comp.isProwler ? "text-accent" : "text-muted"
                      }`}>
                        {comp.name}
                        {comp.isProwler && <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-foreground">
                {features.map((row, i) => (
                  <tr key={row.feature} className="border-b border-border/50 last:border-0 hover:bg-background/50 transition-colors">
                    <td className="px-6 py-6 font-bold text-[15px] bg-white text-foreground/90">
                      {row.feature}
                    </td>
                    {row.values.map((val, j) => (
                      <td key={j} className={`px-6 py-6 ${j === 0 ? "bg-accent/5 border-l-2 border-l-accent/50" : "bg-white"}`}>
                        <CellValue value={val} isProwler={j === 0} />
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