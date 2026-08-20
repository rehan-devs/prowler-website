"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, Apple, Terminal, Download, AlertCircle, CheckCircle } from "lucide-react";

type OS = "windows" | "mac" | "linux";

const osData = {
  windows: {
    icon: Monitor,
    label: "Windows",
    version: "Windows 10 / 11",
    file: "Prowler.io-Setup.exe",
    size: "~85 MB",
    color: "#667eea",
    instructions: [
      "Download the installer below",
      "Install Python 3.12 from python.org if not already installed",
      "Run Prowler.io-Setup.exe",
      "Launch Prowler.io from your desktop",
      "Enter your license key when prompted",
    ],
  },
  mac: {
    icon: Apple,
    label: "macOS",
    version: "macOS 12 Monterey or later",
    file: "Prowler.io.dmg",
    size: "~90 MB",
    color: "#764ba2",
    instructions: [
      "Download the DMG file below",
      "Install Python 3.12 from python.org",
      "Open the DMG and drag Prowler.io to Applications",
      "Right-click → Open (first launch only, to allow unknown developer)",
      "Enter your license key when prompted",
    ],
  },
  linux: {
    icon: Terminal,
    label: "Linux",
    version: "Ubuntu 20.04+ / Debian 11+",
    file: "prowler-io.deb",
    size: "~80 MB",
    color: "#ff6464",
    instructions: [
      "Download the .deb package below",
      "Install Python 3.12: sudo apt install python3.12",
      "Install the package: sudo dpkg -i prowler-io.deb",
      "Run from terminal: prowler-io",
      "Enter your license key when prompted",
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
    <section className="min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-border bg-bg-surface px-4 py-1.5 rounded-full text-xs font-medium text-text-secondary uppercase tracking-widest mb-6">
            Latest Version: 1.0.0
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-text-primary mb-4">
            Download{" "}
            <span className="text-gradient">Prowler.io</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            A desktop app that runs locally on your machine. Your data never
            leaves your computer.
          </p>
        </motion.div>

        {/* OS Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-bg-surface border border-border rounded-xl p-1 gap-1">
            {(Object.keys(osData) as OS[]).map((os) => {
              const OsIcon = osData[os].icon;
              return (
                <button
                  key={os}
                  onClick={() => setActiveOS(os)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeOS === os
                      ? "bg-bg-elevated text-text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <OsIcon size={14} />
                  {osData[os].label}
                  {activeOS === os && os === detectOS() && (
                    <span className="text-xs bg-accent-success/20 text-accent-success px-1.5 py-0.5 rounded-full">
                      Detected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Download card */}
        <motion.div
          key={activeOS}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${current.color}15` }}
            >
              <Icon size={28} style={{ color: current.color }} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display font-bold text-2xl text-text-primary mb-1">
                Prowler.io for {current.label}
              </h2>
              <p className="text-text-muted text-sm mb-2">{current.version}</p>
              <div className="flex items-center gap-4 justify-center md:justify-start text-xs text-text-muted mb-6">
                <span>Version 1.0.0</span>
                <span>·</span>
                <span>{current.size}</span>
                <span>·</span>
                <span>Requires Python 3.12</span>
              </div>

              {/* Notice: installers not yet uploaded */}
              <div className="flex items-start gap-3 bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 mb-6">
                <AlertCircle
                  size={16}
                  className="text-accent-gold flex-shrink-0 mt-0.5"
                />
                <p className="text-accent-gold text-sm">
                  Installers will be available here once uploaded. Purchase a
                  license and you will receive the download link directly in
                  your email.
                </p>
              </div>

              <a
                href={`/api/download/${activeOS}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-accent text-white rounded-xl font-semibold text-sm tracking-wide uppercase hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <Download size={16} />
                Download for {current.label}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Installation instructions */}
        <div className="card-surface p-6 mb-8">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-accent-success" />
            Installation Instructions for {current.label}
          </h3>
          <ol className="space-y-3">
            {current.instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-text-secondary text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Python requirement */}
        <div className="bg-bg-elevated border border-border-glow rounded-xl p-6 text-center">
          <p className="text-text-secondary text-sm mb-3">
            Prowler.io requires Python 3.12 to run the scraping engine.
          </p>
          <a
            href="https://www.python.org/downloads/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent-primary text-sm font-medium hover:underline"
          >
            Download Python 3.12 from python.org
            <Download size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}