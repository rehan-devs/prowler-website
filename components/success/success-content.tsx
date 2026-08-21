"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Download, Clock, Check, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { InlineAnnotation } from "@/components/ui/visual-anchors";

function PaymentCard() {
  return (
    <div className="flex justify-center mb-10">
      <div className="relative w-full max-w-[380px] bg-white border border-border rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:scale-[1.02] transition-transform duration-300">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <ShieldCheck size={22} className="text-accent" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">
            Verification Engine
          </span>
          <span className="font-display font-black text-foreground text-base tracking-tight">
            Order Securely Processed
          </span>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </div>
  );
}

const steps = [
  {
    icon: Check,
    title: "Order Captured",
    description: "Your session and billing reference details were recorded.",
    status: "done",
  },
  {
    icon: Clock,
    title: "License Processing",
    description: "Binding your custom binaries (typically takes 5-10 mins).",
    status: "pending",
  },
  {
    icon: Mail,
    title: "Email Dispatch",
    description: "A private download portal link & hardware key sent.",
    status: "waiting",
  },
];

export function SuccessContent() {
  const params = useSearchParams();
  const email = params.get("email") || "your purchasing email address";
  const orderId = params.get("order");

  return (
    <section className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="max-w-xl w-full relative z-10">
        
        {/* Verification Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-white border-2 border-accent flex items-center justify-center shadow-sm">
            <Check size={32} className="text-accent" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 relative"
        >
          <h1 className="font-display font-black text-4xl md:text-5xl text-foreground mb-4 tracking-tight leading-none">
            Welcome to <span className="accent-block">Prowler.</span>
          </h1>
          <p className="text-muted text-base font-medium leading-relaxed px-2">
            Your credentials have been successfully queued. Your hardware license key will land at{" "}
            <span className="text-foreground font-black">{email}</span> shortly.
          </p>
          {orderId && (
            <p className="text-[11px] font-mono font-bold text-muted mt-3 tracking-widest uppercase">
              Ref: {orderId}
            </p>
          )}

          <span className="hidden md:block absolute -top-12 -right-16 w-0 h-0">
            <InlineAnnotation
              text="secured download"
              delay={0.8}
              path="M 0,0 Q 40,-40 95,-15"
              svgStyles={{ top: "0%", left: "0%" }}
              textStyles={{
                top: "-15px",
                left: "100px",
                transform: "rotate(6deg)",
              }}
            />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PaymentCard />
        </motion.div>

        {/* Step List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-border rounded-2xl p-6 mb-8 shadow-sm"
        >
          <h3 className="font-display font-black text-[15px] text-foreground uppercase tracking-widest mb-6">
            Activation Pipeline
          </h3>
          <div className="space-y-6">
            {steps.map(({ icon: Icon, title, description, status }, i) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                    status === "done"
                      ? "bg-accent border-accent text-white"
                      : status === "pending"
                      ? "bg-accent/15 border-accent text-accent"
                      : "bg-background border-border text-muted"
                  }`}
                >
                  <Icon size={14} strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-black text-[15px] tracking-tight">
                      {title}
                    </p>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                        status === "done"
                          ? "bg-accent/10 text-accent"
                          : status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-background text-muted"
                      }`}
                    >
                      {status === "done" ? "Done" : status === "pending" ? "Active" : "Queued"}
                    </span>
                  </div>
                  <p className="text-muted text-xs font-medium mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <Link
            href="/download"
            className="group flex-1 flex items-center justify-center gap-3 bg-accent text-white py-3.5 rounded-full font-bold text-xs tracking-wider uppercase hover:bg-[#4F52D6] transition-colors"
          >
            Download Center
            <span className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
              <Download size={11} className="text-white" />
            </span>
          </Link>
          <Link
            href="/docs"
            className="flex-1 py-4 border border-border rounded-full text-foreground text-center font-bold text-xs tracking-wider uppercase bg-white hover:border-accent hover:text-accent transition-all"
          >
            Read Desktop Guides
          </Link>
        </motion.div>

        <p className="text-muted text-[10px] font-bold text-center uppercase tracking-widest mt-10">
          Encountered a delay? Email{" "}
          <a href="mailto:support@prowler.io" className="text-accent underline hover:text-[#4F52D6]">
            support@prowler.io
          </a>
        </p>
      </div>
    </section>
  );
}