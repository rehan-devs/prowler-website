"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, Apple, Terminal, AlertCircle } from "lucide-react";
import { InlineAnnotation } from "@/components/ui/visual-anchors";
import { AnimatedButton } from "@/components/ui/animated-button";

type OS = "windows" | "mac" | "linux";

const osData = {
  windows: {
    icon: Monitor,
    label: "Windows",
    version: "Windows 10 / 11 (64-bit)",
    file: "Prowler.io-Setup.exe",
    size: "84.2 MB",
    instructions: [
      "Download the custom Windows package installer below.",
      "Ensure Python 3.12+ is configured and installed on system path.",
      "Launch Prowler.io-Setup.exe and bypass Windows SmartScreen warnings.",
      "Enter your hardware licensing token upon initial sandbox initialization.",
    ],
  },
  mac: {
    icon: Apple,
    label: "macOS",
    version: "Apple Silicon & Intel (macOS 12+)",
    file: "Prowler.io.dmg",
    size: "91.5 MB",
    instructions: [
      "Download the Apple Disk Image file below.",
      "Verify homebrew version or install standalone Python 3.12 binaries.",
      "Mount disk image, drag Prowler app block to applications.",
      "Perform Control-click on binary interface to allow unidentified developers.",
    ],
  },
  linux: {
    icon: Terminal,
    label: "Linux",
    version: "Ubuntu 20.04+ / Debian Stable",
    file: "prowler-io.deb",
    size: "78.1 MB",
    instructions: [
      "Fetch the raw debian architecture package below.",
      "Confirm Python package installation: sudo apt install python3.12-venv.",
      "Run standard terminal install scripts: sudo dpkg -i prowler-io.deb.",
      "Launch using executable prowler-io directly inside bash command line.",
    ],
  },
};

function detectOS(): OS {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("linux")) return "linux";
  return "windows";
}

export function DownloadSection() {
  const [activeOS, setActiveOS] = useState<OS>("windows");

  useEffect(() => {
    setActiveOS(detectOS());
  }, []);

  const current = osData[activeOS];
  const Icon = current.icon;

  return (
    <section className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-4">
            Stable Desktop Releases
          </span>
          <h1 className="text-display-sm md:text-display-md text-foreground mb-4 leading-none tracking-tight">
            Prowler{" "}
            <span className="relative inline-block">
              for
              <span className="hidden md:block absolute top-0 right-0 w-0 h-0">
                <InlineAnnotation
                  text="version 1.0.0 is live"
                  delay={0.6}
                  path="M 0,0 Q 45,-40 100,-18"
                  svgStyles={{ top: "5%", left: "80%" }}
                  textStyles={{
                    top: "-12px",
                    left: "110px",
                    transform: "rotate(5deg)",
                  }}
                />
              </span>
            </span>{" "}
            <span className="accent-block">desktop.</span>
          </h1>
          <p className="text-muted text-base font-medium max-w-xl mx-auto">
            Zero cloud telemetry. Local sandbox execution. Complete domain ownership of your data files.
          </p>
        </motion.div>

        {/* Custom Pill Toggle Selector */}
        <div className="flex justify-center mb-8">
          <div className="relative flex bg-white border border-border rounded-full p-1 shadow-sm">
            {(Object.keys(osData) as OS[]).map((os) => {
              const OsIcon = osData[os].icon;
              const isSelected = activeOS === os;
              return (
                <button
                  key={os}
                  onClick={() => setActiveOS(os)}
                  className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isSelected ? "text-white" : "text-muted hover:text-foreground"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="download-pill"
                      className="absolute inset-0 bg-accent rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <OsIcon size={14} className="relative z-10" />
                  <span className="relative z-10">{osData[os].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interface Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Box Left */}
          <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center mb-6">
                <Icon size={22} className="text-accent" />
              </div>
              <h2 className="font-display font-black text-2xl text-foreground mb-1 tracking-tight">
                Prowler Engine {current.label}
              </h2>
              <p className="text-muted text-sm font-medium mb-6">
                {current.version} &middot; Stable Release v1.0.0
              </p>

              {/* Note banner */}
              <div className="flex items-start gap-3 bg-accent/5 border border-accent/20 rounded-xl p-4 mb-8">
                <AlertCircle size={16} className="text-accent shrink-0 mt-0.5" />
                <p className="text-accent text-xs font-bold leading-normal">
                  Installers require verification of system environment bindings. Read setup criteria on the right panel.
                </p>
              </div>
            </div>

            <AnimatedButton
              href={`/api/download/${activeOS}`}
              variant="accent"
              className="w-full justify-center"
            >
              Download for {current.label}
            </AnimatedButton>
          </div>

          {/* Box Right */}
          <div className="lg:col-span-5 bg-white border border-border rounded-2xl p-8 flex flex-col justify-center shadow-sm">
            <h3 className="font-display font-black text-[15px] text-foreground uppercase tracking-widest mb-6">
              Installation steps.
            </h3>
            <ol className="space-y-4">
              {current.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-muted text-xs font-semibold leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* Python notice banner */}
        <div className="border border-border rounded-2xl p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <p className="text-muted text-xs font-bold uppercase tracking-wider text-center sm:text-left">
            Python 3.12 engine setup environment is mandatory on host system path.
          </p>
          <a
            href="https://www.python.org/downloads/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black uppercase text-accent hover:underline tracking-widest flex items-center gap-1 shrink-0"
          >
            Install Python 3.12 &rarr;
          </a>
        </div>

      </div>
    </section>
  );
}