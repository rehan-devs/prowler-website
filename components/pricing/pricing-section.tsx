"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { Check, Zap, Shield, Star } from "lucide-react";
import { PLANS, PRICES, PlanKey } from "@/lib/license";
import { OrderModal } from "./order-modal";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

type Duration = "lifetime" | "subscription";
type Devices = "1" | "unlimited";

const planOrder: PlanKey[] = ["basic", "pro", "elite"];

const planMeta = {
  basic: {
    icon: Zap,
    badge: null,
    borderColor: "border-border",
    accentColor: "#667eea",
    tagline: "Get started fast",
  },
  pro: {
    icon: Star,
    badge: "Most Popular",
    borderColor: "border-accent-primary",
    accentColor: "#764ba2",
    tagline: "For serious prospectors",
  },
  elite: {
    icon: Shield,
    badge: "Best Value",
    borderColor: "border-border",
    accentColor: "#ff6464",
    tagline: "Unlimited everything",
  },
};

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
      <span className="text-text-muted text-xs uppercase tracking-widest">
        {label}
      </span>
      <div className="relative flex bg-bg-surface border border-border rounded-xl p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative z-10 px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              value === opt.value
                ? "text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {value === opt.value && (
              <motion.span
                layoutId={`toggle-${label}`}
                className="absolute inset-0 bg-accent-primary rounded-lg"
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

function PriceDisplay({
  price,
  duration,
}: {
  price: number;
  duration: Duration;
}) {
  return (
    <div className="flex items-baseline gap-1 my-4">
      <span className="text-text-secondary text-lg">$</span>
      <motion.span
        key={price}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-bold text-5xl text-text-primary"
      >
        {price}
      </motion.span>
      <span className="text-text-muted text-sm">
        {duration === "subscription" ? "/mo" : " one-time"}
      </span>
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
  const meta = planMeta[plan];
  const planData = PLANS[plan];
  const price = PRICES[plan][duration][devices];
  const Icon = meta.icon;
  const isPopular = plan === "pro";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative card-surface p-8 flex flex-col ${
        isPopular
          ? "border-accent-primary shadow-[0_0_40px_rgba(102,126,234,0.15)]"
          : "border-border"
      } hover:border-border-glow transition-all duration-300`}
    >
      {/* Popular badge */}
      {meta.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="px-4 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: meta.accentColor }}
          >
            {meta.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${meta.accentColor}20` }}
          >
            <Icon size={18} style={{ color: meta.accentColor }} />
          </div>
          <h3 className="font-display font-bold text-2xl text-text-primary">
            {planData.name}
          </h3>
          <p className="text-text-muted text-sm mt-0.5">{meta.tagline}</p>
        </div>
      </div>

      {/* Price */}
      <PriceDisplay price={price} duration={duration} />

      {/* Device info */}
      <div className="flex items-center gap-2 mb-6 py-2 px-3 bg-bg-elevated rounded-lg border border-border">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: meta.accentColor }}
        />
        <span className="text-text-secondary text-xs">
          {devices === "1" ? "1 device" : "Unlimited devices"}
          {" · "}
          {duration === "lifetime" ? "Lifetime access" : "Monthly billing"}
        </span>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {planData.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${meta.accentColor}20` }}
            >
              <Check size={10} style={{ color: meta.accentColor }} />
            </div>
            <span className="text-text-secondary text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan)}
        className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wide uppercase transition-all duration-300 ${
          isPopular
            ? "bg-gradient-accent text-white hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] hover:-translate-y-0.5"
            : "bg-bg-elevated border border-border text-text-primary hover:border-border-active hover:text-accent-primary"
        }`}
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
    <section className="min-h-screen pt-28 pb-24 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-2 border border-border bg-bg-surface px-4 py-1.5 rounded-full text-xs font-medium text-text-secondary uppercase tracking-widest mb-6"
          >
            Simple Pricing
          </motion.div>

          <h1 className="font-display font-bold text-5xl md:text-7xl text-text-primary mb-4">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.12}
              containerClassName="justify-center"
            >
              One tool. Real leads.
            </VerticalCutReveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-text-secondary text-lg max-w-xl mx-auto"
          >
            No hidden fees. No seat limits on team plans. Pay once, own it
            forever — or go monthly and cancel anytime.
          </motion.p>
        </div>

        {/* Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
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

        {/* Selected config summary */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${duration}-${devices}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-10"
          >
            <span className="text-text-muted text-sm">
              Showing{" "}
              <span className="text-accent-primary font-medium">
                {duration === "lifetime" ? "lifetime" : "monthly"}{" "}
              </span>
              prices for{" "}
              <span className="text-accent-primary font-medium">
                {devices === "1" ? "1 device" : "unlimited devices"}
              </span>
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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

        {/* Price breakdown table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="card-surface overflow-hidden mb-16"
        >
          <div className="p-6 border-b border-border">
            <h3 className="font-display font-semibold text-text-primary">
              Full Pricing Breakdown
            </h3>
            <p className="text-text-muted text-sm mt-1">
              All prices in USD
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="text-left p-4 text-text-muted font-medium">
                    Plan
                  </th>
                  <th className="p-4 text-center text-text-muted font-medium">
                    Lifetime · 1 Device
                  </th>
                  <th className="p-4 text-center text-text-muted font-medium">
                    Lifetime · Unlimited
                  </th>
                  <th className="p-4 text-center text-text-muted font-medium">
                    Monthly · 1 Device
                  </th>
                  <th className="p-4 text-center text-text-muted font-medium">
                    Monthly · Unlimited
                  </th>
                </tr>
              </thead>
              <tbody>
                {planOrder.map((plan, i) => (
                  <tr
                    key={plan}
                    className={`border-b border-border last:border-0 ${
                      i % 2 === 0 ? "bg-bg-elevated/30" : ""
                    }`}
                  >
                    <td className="p-4 font-semibold text-text-primary">
                      {PLANS[plan].name}
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      ${PRICES[plan].lifetime["1"]}
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      ${PRICES[plan].lifetime.unlimited}
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      ${PRICES[plan].subscription["1"]}/mo
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      ${PRICES[plan].subscription.unlimited}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: Shield, text: "7-day refund guarantee" },
            { icon: Zap, text: "License delivered within hours" },
            { icon: Check, text: "No subscription required" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-text-muted text-sm"
            >
              <Icon size={14} className="text-accent-primary" />
              {text}
            </div>
          ))}
        </div>
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