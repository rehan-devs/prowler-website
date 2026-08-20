"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  Upload,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { PLANS, PRICES, PlanKey, getPrice } from "@/lib/license";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  plan: PlanKey;
  duration: "lifetime" | "subscription";
  devices: "1" | "unlimited";
  onClose: () => void;
}

const PAYMENT_DETAILS = {
  bank: {
    label: "Bank Transfer",
    details: [
      { label: "Account Name", value: "Rehan" },
      { label: "IBAN", value: "PK64UNIL0109000323501718" },
      { label: "Bank", value: "United Bank Limited" },
    ],
  },
  easypaisa: {
    label: "EasyPaisa",
    details: [
      { label: "Account Name", value: "Rehan" },
      { label: "Number", value: "03107322554" },
    ],
  },
  jazzcash: {
    label: "JazzCash",
    details: [
      { label: "Account Name", value: "Rehan" },
      { label: "Number", value: "03071992134" },
    ],
  },
};

type PaymentMethod = keyof typeof PAYMENT_DETAILS;

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-text-muted hover:text-accent-primary transition-colors ml-2 flex-shrink-0"
      title="Copy"
    >
      {copied ? (
        <Check size={12} className="text-accent-success" />
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
}

export function OrderModal({
  plan,
  duration,
  devices,
  onClose,
}: OrderModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");
  const [isRenewal, setIsRenewal] = useState(false);
  const [existingKey, setExistingKey] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const price = getPrice(plan, duration, devices);
  const planData = PLANS[plan];

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setScreenshot(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    setError(null);

    // Validate
    if (!name.trim()) return setError("Please enter your name");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address");
    if (!screenshot) return setError("Please upload your payment screenshot");
    if (isRenewal && !existingKey.trim())
      return setError("Please enter your existing license key for renewal");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("plan", plan);
      formData.append("duration", duration);
      formData.append("devices", devices);
      formData.append("paymentMethod", paymentMethod);
      formData.append("isRenewal", String(isRenewal));
      formData.append("existingKey", existingKey);
      formData.append("notes", notes);
      formData.append("screenshot", screenshot);

      const res = await fetch("/api/orders/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      // Success — redirect to success page
      router.push(`/success?order=${data.orderId}&email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full max-w-lg bg-bg-surface border border-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-text-primary text-xl">
              {step === 1 ? "Complete Payment" : "Your Details"}
            </h2>
            <p className="text-text-muted text-sm mt-0.5">
              {planData.name} ·{" "}
              {duration === "lifetime" ? "Lifetime" : "Monthly"} ·{" "}
              {devices === "1" ? "1 Device" : "Unlimited"} · $
              {price}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex border-b border-border">
          {["Pay", "Submit"].map((label, i) => (
            <div
              key={label}
              className={`flex-1 py-3 text-center text-xs font-medium uppercase tracking-wider transition-colors ${
                step === i + 1
                  ? "text-accent-primary border-b-2 border-accent-primary"
                  : "text-text-muted"
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <div className="p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Step 1: Payment method selection + details */}
              <div>
                <label className="text-text-secondary text-sm font-medium mb-3 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    Object.entries(PAYMENT_DETAILS) as [
                      PaymentMethod,
                      (typeof PAYMENT_DETAILS)[PaymentMethod]
                    ][]
                  ).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setPaymentMethod(key)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        paymentMethod === key
                          ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                          : "border-border text-text-secondary hover:border-border-glow"
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment details */}
              <div className="bg-bg-elevated border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-text-secondary text-sm font-medium">
                    {PAYMENT_DETAILS[paymentMethod].label} Details
                  </span>
                  <span className="text-accent-success font-bold text-lg">
                    ${price} USD
                  </span>
                </div>
                {PAYMENT_DETAILS[paymentMethod].details.map(
                  ({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-text-muted text-xs">{label}</span>
                      <div className="flex items-center">
                        <span className="font-mono text-text-primary text-sm">
                          {value}
                        </span>
                        <CopyButton value={value} />
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Instructions */}
              <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-xl p-4">
                <p className="text-accent-primary text-sm font-medium mb-2">
                  How it works
                </p>
                <ol className="text-text-secondary text-sm space-y-1.5 list-decimal list-inside">
                  <li>Send exactly ${price} USD using the details above</li>
                  <li>Take a clear screenshot of the payment confirmation</li>
                  <li>Click Next and fill in your details</li>
                  <li>Upload the screenshot and submit</li>
                  <li>Your license key arrives within a few hours</li>
                </ol>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-gradient-accent text-white rounded-xl font-semibold text-sm tracking-wide uppercase hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                I've Paid — Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Renewal toggle */}
              <div className="flex items-center gap-3 p-4 bg-bg-elevated border border-border rounded-xl">
                <input
                  type="checkbox"
                  id="renewal"
                  checked={isRenewal}
                  onChange={(e) => setIsRenewal(e.target.checked)}
                  className="w-4 h-4 accent-accent-primary rounded"
                />
                <label
                  htmlFor="renewal"
                  className="text-text-secondary text-sm cursor-pointer"
                >
                  This is a renewal (I already have a license)
                </label>
              </div>

              {/* Existing key (if renewal) */}
              {isRenewal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                >
                  <label className="text-text-secondary text-sm font-medium mb-2 block">
                    Existing License Key
                  </label>
                  <input
                    type="text"
                    value={existingKey}
                    onChange={(e) =>
                      setExistingKey(e.target.value.toUpperCase())
                    }
                    placeholder="PROWL-XXXX-XXXX-XXXX-XXXX"
                    className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm font-mono placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                  />
                </motion.div>
              )}

              {/* Name */}
              <div>
                <label className="text-text-secondary text-sm font-medium mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-text-secondary text-sm font-medium mb-2 block">
                  Email Address
                  <span className="text-text-muted font-normal ml-1">
                    (license will be sent here)
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                />
              </div>

              {/* Screenshot upload */}
              <div>
                <label className="text-text-secondary text-sm font-medium mb-2 block">
                  Payment Screenshot
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    dragOver
                      ? "border-accent-primary bg-accent-primary/10"
                      : screenshotPreview
                      ? "border-accent-success"
                      : "border-border hover:border-border-glow"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {screenshotPreview ? (
                    <div className="relative">
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => {
                          setScreenshot(null);
                          setScreenshotPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-bg-deep/80 border border-border rounded-full p-1 text-text-secondary hover:text-accent-hot transition-colors"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-accent-success/20 border border-accent-success/40 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Check size={10} className="text-accent-success" />
                        <span className="text-accent-success text-xs">
                          Uploaded
                        </span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-8 flex flex-col items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-bg-elevated border border-border flex items-center justify-center">
                        <Upload size={18} className="text-text-muted" />
                      </div>
                      <div className="text-center">
                        <p className="text-text-secondary text-sm font-medium">
                          Drop screenshot here or click to browse
                        </p>
                        <p className="text-text-muted text-xs mt-1">
                          JPG, PNG or WebP · Max 5MB
                        </p>
                      </div>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-text-secondary text-sm font-medium mb-2 block">
                  Notes{" "}
                  <span className="text-text-muted font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isRenewal
                      ? "Renewal for existing license"
                      : "Any additional info..."
                  }
                  rows={2}
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-accent-hot/10 border border-accent-hot/30 rounded-xl p-3"
                >
                  <AlertCircle size={14} className="text-accent-hot" />
                  <p className="text-accent-hot text-sm">{error}</p>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-border rounded-xl text-text-secondary text-sm font-medium hover:border-border-glow hover:text-text-primary transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] py-3 bg-gradient-accent text-white rounded-xl font-semibold text-sm tracking-wide uppercase hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Order"
                  )}
                </button>
              </div>

              <p className="text-text-muted text-xs text-center">
                Your license key will be emailed within a few hours of
                payment verification.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}