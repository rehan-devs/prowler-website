"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 gap-6">
      <style jsx>{`
        .login-container {
          position: relative;
          perspective: 1000px;
          width: 350px; /* Slightly wider to prevent any form squishing */
        }

        .login-card {
          position: relative;
          width: 100%;
          height: 80px;
          background: linear-gradient(135deg, #6366F1, #4F52D6);
          border: 4px solid #0A0A0A;
          border-radius: 18px;
          box-shadow:
            8px 8px 0 #0A0A0A,
            16px 16px 0 rgba(99, 102, 241, 0.3);
          cursor: pointer;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-style: preserve-3d;
        }

        /* Hover expansion & 3D tilt */
        .login-card:hover,
        .login-card:focus-within {
          height: 340px; /* Generous height to make sure all elements fit perfectly */
          transform: translateZ(20px) rotateX(4deg) rotateY(-4deg);
          box-shadow:
            12px 12px 0 #0A0A0A,
            24px 24px 0 rgba(99, 102, 241, 0.45),
            0 0 50px rgba(99, 102, 241, 0.5);
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
          background: inherit;
          transition: all 0.4s ease;
          z-index: 10;
        }

        .login-text {
          color: #FFFFFF;
          font-weight: 900;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 3px;
          text-shadow: 2px 2px 0 #0A0A0A;
          transition: all 0.4s ease;
        }

        .login-card:hover .login-text,
        .login-card:focus-within .login-text {
          opacity: 0;
          transform: translateY(-30px) scale(0.8);
        }

        .login-form {
          position: absolute;
          top: 80px; /* Anchored exactly below the default header space to prevent overlapping */
          left: 0;
          width: 100%;
          height: calc(100% - 80px); /* Clean calculation to utilize the full height dynamic region */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 24px 24px 24px;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(15px) scale(0.95);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 5;
        }

        .login-card:hover .login-form,
        .login-card:focus-within .login-form {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .input-group {
          position: relative;
          width: 100%;
          margin-bottom: 12px;
        }

        .login-input {
          width: 100%;
          padding: 13px 16px;
          background: #F4F4EF;
          border: 3px solid #0A0A0A;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          color: #0A0A0A;
          box-shadow: 4px 4px 0 #0A0A0A;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-sizing: border-box;
        }

        .login-input:focus {
          outline: none;
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #0A0A0A;
          border-color: #6366F1;
        }

        .login-input::placeholder {
          color: #6B6B6B;
          opacity: 0.8;
        }

        .login-btn {
          width: 100%;
          padding: 13px;
          background: #0A0A0A;
          color: #FFFFFF;
          border: 3px solid #0A0A0A;
          border-radius: 12px;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          box-shadow: 4px 4px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 6px;
        }

        .login-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(255, 255, 255, 0.2);
          background: #262626;
        }

        /* Glitch sweep overlay */
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
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 12;
        }

        .login-card:hover::before,
        .login-card:focus-within::before {
          left: 100%;
        }

        /* Corner fold */
        .login-card::after {
          content: "";
          position: absolute;
          top: -4px;
          right: -4px;
          width: 24px;
          height: 24px;
          background: #0A0A0A;
          clip-path: polygon(0 0, 100% 0, 100% 100%);
          transition: all 0.6s ease;
          z-index: 15;
        }

        .login-card:hover::after,
        .login-card:focus-within::after {
          transform: scale(1) rotate(0deg);
          background: #A5B4FC;
        }

        /* Pulse shadow aura */
        .login-container::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(99, 102, 241, 0.08);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.6s ease;
          z-index: -1;
        }

        .login-container:hover::before,
        .login-container:focus-within::before {
          width: 460px;
          height: 460px;
        }
      `}</style>

      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <span className="font-display font-black text-foreground text-2xl tracking-tight block">
          Prowler<span className="text-accent">.io</span>
        </span>
        <span className="text-muted text-[10px] font-black uppercase tracking-widest block mt-1.5">
          System Infrastructure
        </span>
      </motion.div>

      {/* 3D Expanding Login Card */}
      <div className="login-container">
        <div className="login-card">
          {/* Cover View */}
          <div className="login-title">
            <span className="login-text">Enter Admin Zone &rarr;</span>
          </div>

          {/* Form View */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@prowler.io"
                required
                autoComplete="email"
                className="login-input"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
                className="login-input"
              />
            </div>
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Authorize"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Error Message Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 mt-2 max-w-xs w-full"
          >
            <AlertCircle size={14} className="text-red-600 shrink-0" />
            <p className="text-red-600 text-xs font-bold leading-none">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-muted text-[10px] font-bold uppercase tracking-widest text-center mt-2">
        Prowler admin panel &middot; authorized access only
      </p>
    </div>
  );
}