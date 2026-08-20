"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
          <Zap size={18} className="text-white" />
        </div>
        <span className="font-display font-bold text-text-primary text-xl">
          Prowler<span className="text-accent-primary">.io</span>
        </span>
        <span className="text-text-muted text-sm ml-1">Admin</span>
      </motion.div>

      {/* Brutalist login card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative"
        style={{ perspective: "1000px" }}
      >
        <style jsx>{`
          .login-card {
            position: relative;
            width: 320px;
            height: 80px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: 3px solid #1e1e2e;
            box-shadow: 6px 6px 0 #1e1e2e, 12px 12px 0 rgba(102, 126, 234, 0.2);
            cursor: pointer;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            transform-style: preserve-3d;
            border-radius: 16px;
          }
          .login-card.expanded {
            height: 280px;
            transform: translateZ(10px) rotateX(2deg);
            box-shadow: 8px 8px 0 #1e1e2e, 18px 18px 0 rgba(102, 126, 234, 0.3),
              0 0 60px rgba(102, 126, 234, 0.4);
          }
          .login-title {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s ease;
          }
          .login-title-text {
            color: white;
            font-weight: 800;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 3px;
            transition: all 0.4s ease;
          }
          .login-card.expanded .login-title-text {
            opacity: 0;
            transform: translateY(-30px) scale(0.8);
          }
          .login-form-inner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px;
            box-sizing: border-box;
            opacity: 0;
            transform: translateY(30px) scale(0.8);
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .login-card.expanded .login-form-inner {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          .login-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.15),
              transparent
            );
            transition: left 0.7s ease;
          }
          .login-card.expanded::before {
            left: 100%;
          }
        `}</style>

        <div
          className={`login-card ${isExpanded ? "expanded" : ""}`}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          {/* Collapsed state */}
          <div className="login-title">
            <span className="login-title-text">Enter Admin Zone</span>
          </div>

          {/* Expanded form */}
          <form
            className="login-form-inner"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@prowler.io"
              required
              autoComplete="email"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: "10px",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                color: "white",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: "14px",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                color: "white",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "11px",
                background: "rgba(0,0,0,0.4)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Enter Zone"
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-accent-hot/10 border border-accent-hot/30 rounded-xl px-4 py-3 max-w-xs w-full"
        >
          <AlertCircle size={14} className="text-accent-hot flex-shrink-0" />
          <p className="text-accent-hot text-sm">{error}</p>
        </motion.div>
      )}

      <p className="text-text-muted text-xs">
        Prowler.io Admin Panel — Authorized Access Only
      </p>
    </div>
  );
}