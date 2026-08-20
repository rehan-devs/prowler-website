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
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {generated ? (
          <motion.div
            key="generated"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="card-surface p-6 space-y-5"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-accent-success/20 flex items-center justify-center">
                <Key size={14} className="text-accent-success" />
              </div>
              <p className="text-accent-success font-semibold">
                License Key Generated
              </p>
            </div>

            <div>
              <p className="text-text-muted text-xs mb-2 uppercase tracking-wider">
                License Key (shown once only)
              </p>
              <div className="flex items-center gap-3 bg-bg-deep border border-accent-success/30 rounded-xl p-4">
                <code className="font-mono text-accent-success text-xl flex-1 tracking-widest">
                  {generated.key}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 bg-accent-success/15 border border-accent-success/30 rounded-lg text-accent-success text-xs font-medium hover:bg-accent-success/25 transition-all"
                >
                  {copied ? (
                    <Check size={12} />
                  ) : (
                    <Copy size={12} />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Plan", value: generated.plan.toUpperCase() },
                {
                  label: "Duration",
                  value:
                    generated.duration === "lifetime"
                      ? "Lifetime"
                      : "Monthly",
                },
                {
                  label: "Devices",
                  value:
                    generated.devices === "1" ? "1 Device" : "Unlimited",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-bg-elevated border border-border rounded-xl p-3"
                >
                  <p className="text-text-muted text-xs mb-1">{label}</p>
                  <p className="text-text-primary text-sm font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-3">
              <p className="text-accent-gold text-xs">
                This key will not be shown again. Copy it now and send it
                manually to the customer.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-text-secondary text-sm hover:border-border-glow hover:text-text-primary transition-all"
            >
              <RefreshCw size={14} />
              Generate Another Key
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card-surface p-6 space-y-5"
          >
            {/* Plan */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-3 block">
                Plan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["basic", "pro", "elite"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                      plan === p
                        ? "border-accent-primary bg-accent-primary/15 text-accent-primary"
                        : "border-border text-text-secondary hover:border-border-glow"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-3 block">
                Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "lifetime", label: "Lifetime" },
                  { value: "subscription", label: "Monthly" },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                      duration === d.value
                        ? "border-accent-primary bg-accent-primary/15 text-accent-primary"
                        : "border-border text-text-secondary hover:border-border-glow"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-3 block">
                Devices
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "1", label: "1 Device" },
                  { value: "unlimited", label: "Unlimited" },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDevices(d.value)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                      devices === d.value
                        ? "border-accent-primary bg-accent-primary/15 text-accent-primary"
                        : "border-border text-text-secondary hover:border-border-glow"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-2 block">
                Customer Email{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-text-secondary text-sm font-medium mb-2 block">
                Internal Notes{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Manual issue, giveaway, replacement..."
                rows={2}
                className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-accent-hot/10 border border-accent-hot/30 rounded-xl p-3">
                <AlertCircle size={14} className="text-accent-hot" />
                <p className="text-accent-hot text-sm">{error}</p>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-accent text-white rounded-xl font-semibold text-sm tracking-wide uppercase hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Key size={16} />
              )}
              {loading ? "Generating..." : "Generate License Key"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}