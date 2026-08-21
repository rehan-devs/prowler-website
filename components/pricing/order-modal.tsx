"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Upload,
  Copy,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PLANS, PlanKey, getPrice } from "@/lib/license";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatedButton } from "@/components/ui/animated-button";

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
      className="text-muted hover:text-accent transition-colors ml-2 flex-shrink-0"
      title="Copy"
    >
      {copied ? (
        <Check size={12} className="text-accent" />
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
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Prevent background scrolling for both native scroll and smooth-scroll libraries like Lenis
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

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

      router.push(
        `/success?order=${data.orderId}&email=${encodeURIComponent(email)}`
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-border rounded-xl px-4 py-3 text-foreground text-sm font-medium placeholder:text-muted focus:outline-none focus:border-accent transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full max-w-lg bg-background border border-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl"
        data-lenis-prevent /* Stops Lenis scroll hijacking inside the modal box */
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-display font-black text-foreground text-xl tracking-tight">
              {step === 1 ? "Complete Payment" : "Your Details"}
            </h2>
            <p className="text-muted text-sm mt-1 font-medium">
              {planData.name} ·{" "}
              {duration === "lifetime" ? "Lifetime" : "Monthly"} ·{" "}
              {devices === "1" ? "1 Device" : "Unlimited"} · ${price}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex border-b border-border">
          {["Pay", "Submit"].map((label, i) => (
            <div
              key={label}
              className={`flex-1 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                step === i + 1
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted"
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <div className="p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Payment method */}
              <div>
                <label className="text-foreground text-sm font-bold mb-3 block">
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
                      className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                        paymentMethod === key
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-white text-muted hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment details card */}
              <div className="bg-white border border-border rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted text-xs font-bold uppercase tracking-widest">
                    {PAYMENT_DETAILS[paymentMethod].label}
                  </span>
                  <span className="font-display font-black text-foreground text-xl">
                    ${price}
                    <span className="text-muted text-sm font-bold ml-1">USD</span>
                  </span>
                </div>
                {PAYMENT_DETAILS[paymentMethod].details.map(
                  ({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-muted text-xs font-medium">
                        {label}
                      </span>
                      <div className="flex items-center min-w-0">
                        <span className="font-mono text-foreground text-sm font-medium truncate">
                          {value}
                        </span>
                        <CopyButton value={value} />
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* How it works */}
              <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5">
                <p className="text-accent text-sm font-black mb-3 tracking-tight">
                  How it works
                </p>
                <ol className="text-foreground/80 text-sm space-y-2 font-medium">
                  <li className="flex gap-2">
                    <span className="text-accent font-black shrink-0">1.</span>
                    Send exactly ${price} USD using the details above
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-black shrink-0">2.</span>
                    Take a clear screenshot of the payment confirmation
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-black shrink-0">3.</span>
                    Click continue and fill in your details
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-black shrink-0">4.</span>
                    Upload the screenshot and submit
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-black shrink-0">5.</span>
                    Your license key arrives within a few hours
                  </li>
                </ol>
              </div>

              <AnimatedButton
                onClick={() => setStep(2)}
                variant="accent"
                className="w-full justify-center"
              >
                I&apos;ve Paid. Continue
              </AnimatedButton>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Renewal toggle */}
              <label className="flex items-center gap-3 p-4 bg-white border border-border rounded-2xl cursor-pointer hover:border-foreground/20 transition-colors">
                <input
                  type="checkbox"
                  checked={isRenewal}
                  onChange={(e) => setIsRenewal(e.target.checked)}
                  className="w-4 h-4 accent-[#6366F1] rounded"
                />
                <span className="text-foreground text-sm font-medium">
                  This is a renewal (I already have a license)
                </span>
              </label>

              {/* Existing key */}
              {isRenewal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                >
                  <label className="text-foreground text-sm font-bold mb-2 block">
                    Existing License Key
                  </label>
                  <input
                    type="text"
                    value={existingKey}
                    onChange={(e) =>
                      setExistingKey(e.target.value.toUpperCase())
                    }
                    placeholder="PROWL-XXXX-XXXX-XXXX-XXXX"
                    className={`${inputClass} font-mono`}
                  />
                </motion.div>
              )}

              {/* Name */}
              <div>
                <label className="text-foreground text-sm font-bold mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-foreground text-sm font-bold mb-2 block">
                  Email Address{" "}
                  <span className="text-muted font-medium">
                    (license sent here)
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              {/* Screenshot upload */}
              <div>
                <label className="text-foreground text-sm font-bold mb-2 block">
                  Payment Screenshot
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden h-48 ${
                    dragOver
                      ? "border-accent bg-accent/5"
                      : screenshotPreview
                        ? "border-accent"
                        : "border-border hover:border-foreground/30 bg-white"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {screenshotPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => {
                          setScreenshot(null);
                          setScreenshotPreview(null);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-foreground/80 rounded-full flex items-center justify-center text-white hover:bg-foreground transition-colors z-10"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-accent text-white rounded-full px-3 py-1 flex items-center gap-1.5 z-10">
                        <Check size={11} strokeWidth={3} />
                        <span className="text-xs font-bold">Uploaded</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full p-8 flex flex-col items-center justify-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center">
                        <Upload size={18} className="text-muted" />
                      </div>
                      <div className="text-center">
                        <p className="text-foreground text-sm font-bold">
                          Drop screenshot here or click to browse
                        </p>
                        <p className="text-muted text-xs mt-1 font-medium">
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
                <label className="text-foreground text-sm font-bold mb-2 block">
                  Notes{" "}
                  <span className="text-muted font-medium">(optional)</span>
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
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 bg-foreground/5 border border-foreground/15 rounded-xl p-3.5"
                >
                  <AlertCircle size={14} className="text-foreground shrink-0" />
                  <p className="text-foreground text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <AnimatedButton
                  onClick={() => setStep(1)}
                  variant="white"
                  className="flex-1 justify-center py-3.5"
                >
                  Back
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleSubmit}
                  disabled={loading}
                  variant="accent"
                  className="flex-[2] justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Order"
                  )}
                </AnimatedButton>
              </div>

              <p className="text-muted text-xs text-center font-medium">
                Your license key will be emailed within a few hours of payment
                verification.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}