"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Copy, Check, Loader2, RefreshCw, AlertCircle } from "lucide-react";

interface GeneratedKey {
  key: string;
  plan: string;
  duration: string;
  devices: string;
}

export function GenerateKeyForm() {
  const [plan, setPlan] = useState("pro");
  const [duration, setDuration] = useState("lifetime");
  const [devices, setDevices] = useState("1");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedKey | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGenerated(null);

    try {
      const res = await fetch("/api/admin/licenses/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, duration, devices, email, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGenerated({
        key: data.key,
        plan,
        duration,
        devices,
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to generate key"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGenerated(null);
    setEmail("");
    setNotes("");
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-3">
          Instant Key Provisions
        </span>
        <h1 className="text-2xl font-display font-black text-foreground tracking-tight flex items-center gap-3">
          <Key size={20} className="text-accent" />
          Generate Keys
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {generated ? (
          <motion.div
            key="generated"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Check size={14} className="text-emerald-600" strokeWidth={3} />
              </div>
              <p className="text-emerald-700 font-bold text-sm tracking-tight">
                New Cryptographic Key Generated Successfully
              </p>
            </div>

            <div>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-2">
                License Key Token (Shown Once)
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-background border border-border rounded-xl p-4">
                <code className="font-mono text-foreground text-base font-black tracking-widest flex-1 break-all">
                  {generated.key}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#4F52D6] transition-colors shrink-0"
                >
                  {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy Key"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Target Plan", value: generated.plan },
                { label: "Duration Type", value: generated.duration },
                { label: "Hardware Slots", value: generated.devices === "1" ? "1 Device" : "Unlimited" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-background border border-border rounded-xl p-4"
                >
                  <p className="text-muted text-[9px] font-black uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-foreground text-xs font-black uppercase tracking-wide">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-amber-800 text-xs font-bold leading-normal">
                Important: Prowler records matching cryptographic state hashes only. Copy the raw string now as it cannot be reproduced later.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-4 border border-border hover:border-accent hover:text-accent rounded-full text-xs font-black uppercase tracking-widest bg-white transition-colors"
            >
              <RefreshCw size={13} />
              Provision Another Key
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
          >
            {/* Plan */}
            <div>
              <label className="text-muted text-[10px] font-black uppercase tracking-wider mb-2.5 block">
                Plan Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["basic", "pro", "elite"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={`py-3.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                      plan === p
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border text-muted hover:border-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-muted text-[10px] font-black uppercase tracking-wider mb-2.5 block">
                Billing Cycle Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "lifetime", label: "Lifetime Asset" },
                  { value: "subscription", label: "Monthly subscription" },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`py-3.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                      duration === d.value
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border text-muted hover:border-foreground"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div>
              <label className="text-muted text-[10px] font-black uppercase tracking-wider mb-2.5 block">
                Bound Machine Allocations
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "1", label: "Single Device" },
                  { value: "unlimited", label: "Unlimited Devices" },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDevices(d.value)}
                    className={`py-3.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                      devices === d.value
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border text-muted hover:border-foreground"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-muted text-[10px] font-black uppercase tracking-wider mb-2 block">
                Customer Email <span className="font-medium lowercase text-muted/60">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-foreground text-sm font-semibold focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-muted text-[10px] font-black uppercase tracking-wider mb-2 block">
                Internal Tracking Notes <span className="font-medium lowercase text-muted/60">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Replacement license, custom promotional tier, offline distribution..."
                rows={3}
                className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-foreground text-sm font-semibold focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle size={14} className="text-red-600 shrink-0" />
                <p className="text-red-600 text-xs font-bold leading-none">{error}</p>
              </div>
            )}

            {/* Generate Trigger */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#4F52D6] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Key size={13} />
              )}
              {loading ? "Generating Core Signatures..." : "Generate License Token"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}