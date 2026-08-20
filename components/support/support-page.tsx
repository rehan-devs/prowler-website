"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  BookOpen,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const commonIssues = [
  {
    q: "My license key is not working",
    a: "Make sure you are entering the full key including the PROWL- prefix. If the error says already bound, contact us to reset the hardware binding.",
  },
  {
    q: "I changed computers and cannot activate",
    a: "Email us with your license key and we will reset the hardware binding within 24 hours. Unlimited device plan holders can activate immediately.",
  },
  {
    q: "I lost my license key email",
    a: "Email support@prowler.io from the email you used to purchase. We will resend your key after verifying your identity.",
  },
  {
    q: "The scraper is finding 0 results",
    a: "Check your internet connection and make sure you are not using a VPN. Try a different search query or source. Contact us if the issue persists.",
  },
  {
    q: "I want a refund",
    a: "We offer a 7-day refund if Prowler does not work on your system and our support team cannot resolve the issue. Email us with your order details.",
  },
];

export function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Failed to send message. Please email us directly at support@prowler.io");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-border bg-bg-surface px-4 py-1.5 rounded-full text-xs font-medium text-text-secondary uppercase tracking-widest mb-6">
            Support
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-text-primary mb-4">
            How can we help?
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            We respond to all messages within 24 hours.
          </p>
        </motion.div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            {
              icon: BookOpen,
              title: "Documentation",
              desc: "Full installation and usage guides",
              href: "/docs",
              color: "#667eea",
            },
            {
              icon: Mail,
              title: "Email Support",
              desc: "support@prowler.io",
              href: "mailto:support@prowler.io",
              color: "#764ba2",
            },
            {
              icon: Clock,
              title: "Response Time",
              desc: "Usually within a few hours",
              href: "#contact",
              color: "#38ef7d",
            },
          ].map(({ icon: Icon, title, desc, href, color }) => (
            <Link
              key={title}
              href={href}
              className="card-surface p-6 hover:border-border-glow transition-all duration-300 group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-1">
                {title}
              </h3>
              <p className="text-text-muted text-sm">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Common issues */}
          <div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
              Common Issues
            </h2>
            <div className="space-y-3">
              {commonIssues.map(({ q, a }) => (
                <div key={q} className="card-surface p-5">
                  <p className="text-text-primary font-semibold text-sm mb-2">
                    {q}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div id="contact">
            <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
              Contact Us
            </h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-surface p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent-success/10 border border-accent-success/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-accent-success" />
                </div>
                <h3 className="font-display font-bold text-xl text-text-primary mb-2">
                  Message Sent
                </h3>
                <p className="text-text-secondary">
                  We will get back to you at{" "}
                  <span className="text-accent-primary">{email}</span> within 24
                  hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="card-surface p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-text-secondary text-xs font-medium mb-2 block uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Smith"
                      className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary text-xs font-medium mb-2 block uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-text-secondary text-xs font-medium mb-2 block uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="License activation issue"
                    className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="text-text-secondary text-xs font-medium mb-2 block uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Describe your issue in detail..."
                    className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-accent-hot/10 border border-accent-hot/30 rounded-xl p-3">
                    <AlertCircle size={13} className="text-accent-hot" />
                    <p className="text-accent-hot text-xs">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-accent text-white rounded-xl font-semibold text-sm tracking-wide uppercase hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <MessageSquare size={14} />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}