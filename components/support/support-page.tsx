"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, BookOpen, Clock, Check, Loader2, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { InlineAnnotation } from "@/components/ui/visual-anchors";

const commonIssues = [
  {
    q: "My license key is not working",
    a: "Make sure you copy the entire key including the PROWL- prefix exactly. If you see a hardware binding error, drop us a line below and we will reset your key instantly.",
  },
  {
    q: "I changed computers and cannot activate",
    a: "No worries! Shoot us your key and we will reset the hardware locks within 24 hours. If you are on the Unlimited Devices plan, you can activate immediately on any machine.",
  },
  {
    q: "I lost my license key email",
    a: "Please submit your purchase email address via the support form below or email support@prowler.io directly. We will recover and send your keys within the hour.",
  },
  {
    q: "The scraper is finding 0 results",
    a: "Most common reason is dynamic changes in targeted directories or a lack of dependencies. Ensure Python 3.12 is completely installed, and run with your VPN turned off.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <section className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="text-center mb-20 relative"
>
  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-4">
    Direct Support Line
  </span>
  <h1 className="text-display-sm md:text-display-md text-foreground max-w-3xl mx-auto leading-none tracking-tight">
    How can{" "}
    <span className="relative inline-block">
      we
      <span className="hidden md:block absolute top-0 right-0 w-0 h-0">
        <InlineAnnotation
          text="real humans here"
          delay={0.6}
          path="M 0,0 Q 45,-40 105,-18"
          svgStyles={{ top: "5%", left: "80%" }}
          textStyles={{
            top: "-12px",
            left: "115px",
            transform: "rotate(5deg)",
          }}
        />
      </span>
    </span>{" "}
    <span className="accent-block">help?</span>
  </h1>
</motion.div>

        {/* Grid Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: BookOpen,
              title: "Product Docs",
              desc: "Step-by-step guides for custom setups",
              href: "/docs",
              badge: "Read wiki",
            },
            {
              icon: Mail,
              title: "Raw Email",
              desc: "support@prowler.io",
              href: "mailto:support@prowler.io",
              badge: "Mail directly",
            },
            {
              icon: Clock,
              title: "Response Time",
              desc: "We verify requests within 24 hours",
              href: "#contact",
              badge: "Fast support",
            },
          ].map(({ icon: Icon, title, desc, href, badge }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col p-8 rounded-2xl border border-border bg-white text-foreground hover:border-accent transition-colors duration-300"
            >
              <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Icon size={18} className="text-accent" />
              </div>
              <h3 className="font-display font-black text-xl mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-muted text-sm font-medium leading-relaxed mb-6 flex-1">
                {desc}
              </p>
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                {badge} <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Content split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQ Column */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-display font-black text-foreground mb-8 tracking-tight">
              Common issues.
            </h2>
            <div className="space-y-4">
              {commonIssues.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.q} className="border border-border rounded-2xl bg-white overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-6 text-left gap-4"
                    >
                      <span className="font-display font-black text-[15px] text-foreground tracking-tight leading-tight">
                        {faq.q}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? "border-accent text-accent rotate-45" : "border-border text-muted"
                        }`}
                      >
                        <Plus size={12} strokeWidth={3} />
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="px-6 pb-6 text-sm text-muted font-medium leading-relaxed border-t border-border/40 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7" id="contact">
            <div className="bg-white border border-border rounded-2xl p-8 md:p-10 shadow-sm relative">
              <h2 className="text-3xl font-display font-black text-foreground mb-2 tracking-tight">
                Send a ticket.
              </h2>
              <p className="text-muted text-sm font-medium mb-8">
                Include as much detail as possible. Our technical team is on standby.
              </p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Check size={20} className="text-accent" strokeWidth={3} />
                  </div>
                  <h3 className="font-display font-black text-xl text-foreground mb-2 tracking-tight">
                    Ticket Sent!
                  </h3>
                  <p className="text-muted text-sm font-medium max-w-sm mx-auto leading-relaxed">
                    We will get back to you at <span className="text-foreground font-black">{email}</span> within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-2 block">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-foreground text-sm font-medium focus:outline-none focus:border-accent focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-2 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@company.com"
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-foreground text-sm font-medium focus:outline-none focus:border-accent focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-2 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="e.g. License reset verification required"
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-foreground text-sm font-medium focus:outline-none focus:border-accent focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-2 block">
                      Detailed Issue Description
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="Please include your OS and License Key if applicable..."
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-foreground text-sm font-medium focus:outline-none focus:border-accent focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                      <p className="text-red-600 text-xs font-bold">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-accent text-white font-bold text-sm tracking-wider uppercase hover:bg-[#4F52D6] transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Submit Support Ticket"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}