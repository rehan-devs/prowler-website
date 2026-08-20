"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Download, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

// The payment card animation converted to React
function PaymentCard() {
  return (
    <div className="flex justify-center mb-10">
      <style jsx>{`
        .payment-container {
          background-color: #14141f;
          display: flex;
          width: 380px;
          height: 100px;
          position: relative;
          border-radius: 12px;
          border: 1px solid #1e1e2e;
          transition: 0.3s ease-in-out;
          overflow: hidden;
        }
        .payment-container:hover {
          transform: scale(1.03);
          width: 200px;
        }
        .payment-container:hover .left-panel {
          width: 100%;
        }
        .left-panel {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 110px;
          height: 100px;
          border-radius: 10px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: 0.3s;
          flex-shrink: 0;
          overflow: hidden;
        }
        .right-panel {
          width: calc(100% - 110px);
          display: flex;
          align-items: center;
          overflow: hidden;
          cursor: pointer;
          justify-content: space-between;
          white-space: nowrap;
          transition: 0.3s;
          padding: 0 16px;
        }
        .right-panel:hover {
          background-color: #1a1a2e;
        }
        .panel-label {
          font-size: 16px;
          font-family: sans-serif;
          font-weight: 600;
          color: #f0f0f0;
        }
        .card-inner {
          width: 60px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 6px;
          position: absolute;
          display: flex;
          z-index: 10;
          flex-direction: column;
          align-items: center;
          box-shadow: 6px 6px 8px rgba(0,0,0,0.3);
        }
        .card-line {
          width: 54px;
          height: 11px;
          background: rgba(255,255,255,0.35);
          border-radius: 2px;
          margin-top: 6px;
        }
        .card-dots {
          width: 7px;
          height: 7px;
          background: rgba(255,255,255,0.5);
          box-shadow: 0 -9px 0 0 rgba(255,255,255,0.5), 0 9px 0 0 rgba(255,255,255,0.5);
          border-radius: 50%;
          margin: 5px 0 0 -25px;
          transform: rotate(90deg);
        }
        .payment-container:hover .card-inner {
          animation: slide-card 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) both;
        }
        .post-terminal {
          width: 54px;
          height: 65px;
          background: rgba(255,255,255,0.15);
          position: absolute;
          z-index: 11;
          bottom: 8px;
          top: 100px;
          border-radius: 6px;
          overflow: hidden;
        }
        .payment-container:hover .post-terminal {
          animation: slide-post 1s cubic-bezier(0.165, 0.84, 0.44, 1) both;
        }
        .terminal-screen {
          width: 40px;
          height: 20px;
          background: rgba(255,255,255,0.9);
          position: absolute;
          top: 18px;
          right: 7px;
          border-radius: 3px;
        }
        .dollar-sign {
          position: absolute;
          font-size: 14px;
          font-weight: bold;
          width: 100%;
          left: 0;
          top: 0;
          color: #667eea;
          text-align: center;
        }
        .payment-container:hover .dollar-sign {
          animation: fade-in-dollar 0.3s 1s backwards;
        }
        @keyframes slide-card {
          0% { transform: translateY(0); }
          50% { transform: translateY(-60px) rotate(90deg); }
          60% { transform: translateY(-60px) rotate(90deg); }
          100% { transform: translateY(-6px) rotate(90deg); }
        }
        @keyframes slide-post {
          50% { transform: translateY(0); }
          100% { transform: translateY(-60px); }
        }
        @keyframes fade-in-dollar {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .arrow-icon {
          width: 16px;
          height: 16px;
          color: #555566;
        }
      `}</style>

      <div className="payment-container" title="Hover to see payment animation">
        <div className="left-panel">
          <div className="card-inner">
            <div className="card-line" />
            <div className="card-dots" />
          </div>
          <div className="post-terminal">
            <div className="terminal-screen">
              <div className="dollar-sign">$</div>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <span className="panel-label">Payment Received</span>
          <ArrowRight size={16} className="text-text-muted" />
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    icon: CheckCircle,
    title: "Order Received",
    description: "Your order has been submitted successfully",
    status: "done",
    color: "#38ef7d",
  },
  {
    icon: Clock,
    title: "Payment Verification",
    description: "We verify your payment screenshot (usually within hours)",
    status: "pending",
    color: "#f7e479",
  },
  {
    icon: Mail,
    title: "License Delivered",
    description: "Your license key is emailed to you",
    status: "waiting",
    color: "#667eea",
  },
];

export function SuccessContent() {
  const params = useSearchParams();
  const email = params.get("email") || "your email";
  const orderId = params.get("order");

  return (
    <section className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-accent-success/10 border border-accent-success/30 flex items-center justify-center">
            <CheckCircle size={36} className="text-accent-success" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
            Order Submitted!
          </h1>
          <p className="text-text-secondary text-lg">
            Your payment screenshot is under review. Your license key will be
            emailed to{" "}
            <span className="text-accent-primary font-medium">{email}</span>{" "}
            within a few hours.
          </p>
          {orderId && (
            <p className="text-text-muted text-sm mt-2">
              Order ID:{" "}
              <span className="font-mono text-text-secondary">{orderId}</span>
            </p>
          )}
        </motion.div>

        {/* Payment animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <PaymentCard />
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-surface p-6 mb-8"
        >
          <h3 className="font-display font-semibold text-text-primary mb-6">
            What happens next
          </h3>
          <div className="space-y-4">
            {steps.map(({ icon: Icon, title, description, status, color }, i) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-text-primary font-medium text-sm">
                      {title}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        status === "done"
                          ? "bg-accent-success/10 text-accent-success"
                          : status === "pending"
                          ? "bg-accent-gold/10 text-accent-gold"
                          : "bg-border text-text-muted"
                      }`}
                    >
                      {status === "done"
                        ? "Done"
                        : status === "pending"
                        ? "In Progress"
                        : "Waiting"}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/download"
            className="flex-1 py-4 bg-gradient-accent text-white rounded-xl font-semibold text-sm tracking-wide uppercase text-center hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] transition-all duration-300"
          >
            <Download size={14} className="inline mr-2" />
            Download Now
          </Link>
          <Link
            href="/docs"
            className="flex-1 py-4 border border-border rounded-xl text-text-secondary text-sm font-medium text-center hover:border-border-glow hover:text-text-primary transition-all"
          >
            Read the Docs
          </Link>
        </motion.div>

        <p className="text-text-muted text-xs text-center mt-6">
          Questions? Email{" "}
          <a
            href="mailto:support@prowler.io"
            className="text-accent-primary hover:underline"
          >
            support@prowler.io
          </a>
        </p>
      </div>
    </section>
  );
}