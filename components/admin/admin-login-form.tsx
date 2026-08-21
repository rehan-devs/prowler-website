"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Zap } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Connection failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 justify-center min-h-[70vh]">
      
      {/* Platform Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <span className="font-display font-black text-foreground text-xl tracking-tight">
            Prowler<span className="text-accent">.io</span>
          </span>
          <span className="text-muted text-[10px] font-black uppercase tracking-widest block">
            Infrastructure Console
          </span>
        </div>
      </motion.div>

      {/* Snappy Spring brutalist Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 150, damping: 15 }}
        className="relative"
      >
        <div
          className={`bg-white border-2 border-foreground rounded-2xl p-8 shadow-[6px_6px_0px_#0A0A0A] transition-all duration-300 w-[340px] ${
            isExpanded ? "h-[320px]" : "h-[160px] flex items-center justify-center cursor-pointer"
          }`}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
                  Access Secure Vault &rarr;
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="expanded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4 w-full"
              >
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-muted mb-1 block">
                    Infrastructure Mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@prowler.io"
                    required
                    autoComplete="email"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-xs font-semibold focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-muted mb-1 block">
                    Validation Secret
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-xs font-semibold focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4F52D6] transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Authorize Session"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 max-w-xs w-full"
          >
            <AlertCircle size={14} className="text-red-600 shrink-0" />
            <p className="text-red-600 text-xs font-bold leading-none">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-muted text-[10px] font-bold uppercase tracking-widest text-center max-w-xs leading-relaxed">
        Access strictly cataloged under dynamic hardware routing profiles.
      </p>
    </div>
  );
}