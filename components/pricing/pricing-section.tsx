"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { PLANS, PRICES, PlanKey } from "@/lib/license";
import { OrderModal } from "./order-modal";

type Duration = "lifetime" | "subscription";
type Devices = "1" | "unlimited";

const planOrder: PlanKey[] = ["basic", "pro", "elite"];

function PlanToggle({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
        {label}
      </span>
      <div className="relative flex bg-white border border-border rounded-full p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative z-10 px-5 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
              value === opt.value
                ? "text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {value === opt.value && (
              <motion.span
                layoutId={`toggle-${label}`}
                className="absolute inset-0 bg-accent rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  duration,
  devices,
  onSelect,
  index,
}: {
  plan: PlanKey;
  duration: Duration;
  devices: Devices;
  onSelect: (plan: PlanKey) => void;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const planData = PLANS[plan];
  const price = PRICES[plan][duration][devices];

  const isPro = plan === "pro";
  const isElite = plan === "elite";

  // Card surface styles
  const cardClass = isPro
    ? "bg-accent border-accent text-white"
    : isElite
      ? "bg-inverted border-inverted text-inverted-foreground"
      : "bg-white border-border text-foreground";

  const mutedClass = isPro
    ? "text-white/70"
    : isElite
      ? "text-inverted-muted"
      : "text-muted";

  const checkBg = isPro
    ? "bg-white/20"
    : isElite
      ? "bg-white/10"
      : "bg-foreground/5";

  const checkColor = isPro
    ? "text-white"
    : isElite
      ? "text-white"
      : "text-foreground";

  const devicePill = isPro
    ? "bg-white/10 border-white/15"
    : isElite
      ? "bg-white/5 border-white/10"
      : "bg-background border-border";

  const ctaClass = isPro
    ? "bg-white text-foreground hover:bg-white/90"
    : isElite
      ? "bg-accent text-white hover:bg-[#4F52D6]"
      : "bg-foreground text-white hover:bg-foreground/90";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col p-8 md:p-10 rounded-2xl border ${cardClass}`}
    >
      {/* Badge */}
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-foreground text-white">
            Most Popular
          </span>
        </div>
      )}
      {isElite && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-accent text-white">
            Best Value
          </span>
        </div>
      )}

      {/* Name + tagline */}
      <div className="mb-6">
        <h3 className="font-display font-black text-2xl tracking-tight">
          {planData.name}
        </h3>
        <p className={`text-sm font-medium mt-1 ${mutedClass}`}>
          {plan === "basic" && "Get started fast"}
          {plan === "pro" && "For serious prospectors"}
          {plan === "elite" && "Unlimited everything"}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-6">
        <span className={`text-lg font-bold ${mutedClass}`}>$</span>
        <motion.span
          key={price}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-5xl md:text-6xl tracking-tight"
        >
          {price}
        </motion.span>
        <span className={`text-sm font-bold ${mutedClass}`}>
          {duration === "subscription" ? "/mo" : " one-time"}
        </span>
      </div>

      {/* Device / billing pill */}
      <div
        className={`flex items-center gap-2 mb-8 py-2.5 px-3.5 rounded-xl border text-xs font-bold uppercase tracking-wide ${devicePill} ${mutedClass}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPro || isElite ? "bg-white" : "bg-accent"
          }`}
        />
        {devices === "1" ? "1 device" : "Unlimited devices"}
        {" · "}
        {duration === "lifetime" ? "Lifetime access" : "Monthly billing"}
      </div>

      {/* Features */}
      <ul className="space-y-3.5 flex-1 mb-10">
        {planData.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${checkBg}`}
            >
              <Check size={11} strokeWidth={3} className={checkColor} />
            </div>
            <span className={`text-[15px] font-medium leading-snug ${isPro || isElite ? "text-white/90" : "text-foreground/80"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan)}
        className={`w-full py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] ${ctaClass}`}
      >
        Get {planData.name}
      </button>
    </motion.div>
  );
}

export function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [duration, setDuration] = useState<Duration>("lifetime");
  const [devices, setDevices] = useState<Devices>("1");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);

  return (
    <section className="min-h-screen pt-28 pb-32 bg-background relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-display font-black text-display-sm md:text-display-md text-foreground mb-5 tracking-tight"
          >
            One tool.{" "}
            <span className="accent-block">Real leads.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="text-muted text-lg max-w-xl mx-auto font-medium"
          >
            No hidden fees. No seat limits. Pay once, own it forever.
            Or go monthly and cancel anytime.
          </motion.p>
        </div>

        {/* Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6"
        >
          <PlanToggle
            label="Billing"
            value={duration}
            options={[
              { value: "lifetime", label: "Lifetime" },
              { value: "subscription", label: "Monthly" },
            ]}
            onChange={(v) => setDuration(v as Duration)}
          />

          <div className="hidden sm:block w-px h-10 bg-border" />

          <PlanToggle
            label="Devices"
            value={devices}
            options={[
              { value: "1", label: "1 Device" },
              { value: "unlimited", label: "Unlimited" },
            ]}
            onChange={(v) => setDevices(v as Devices)}
          />
        </motion.div>

        {/* Config summary */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`${duration}-${devices}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-muted font-medium mb-12"
          >
            Showing{" "}
            <span className="text-foreground font-bold">
              {duration === "lifetime" ? "lifetime" : "monthly"}
            </span>{" "}
            prices for{" "}
            <span className="text-foreground font-bold">
              {devices === "1" ? "1 device" : "unlimited devices"}
            </span>
          </motion.p>
        </AnimatePresence>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16">
          {planOrder.map((plan, index) => (
            <PlanCard
              key={plan}
              plan={plan}
              duration={duration}
              devices={devices}
              onSelect={setSelectedPlan}
              index={index}
            />
          ))}
        </div>

        {/* Trust row — matches landing CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[10px] md:text-[11px] font-bold text-muted uppercase tracking-[0.2em]"
        >
          <span>Pay once, own forever</span>
          <span className="w-1 h-1 bg-muted/50 rounded-full" />
          <span>License delivered in hours</span>
          <span className="w-1 h-1 bg-muted/50 rounded-full" />
          <span>Runs 100% offline</span>
        </motion.div>
      </div>

      {/* Order modal */}
      <AnimatePresence>
        {selectedPlan && (
          <OrderModal
            plan={selectedPlan}
            duration={duration}
            devices={devices}
            onClose={() => setSelectedPlan(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}