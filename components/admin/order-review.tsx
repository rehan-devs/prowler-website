"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  plan: string;
  plan_duration: string;
  devices: string;
  amount_usd: number;
  payment_method: string;
  status: string;
  is_renewal: boolean;
  existing_license_key: string | null;
  notes: string | null;
  screenshot_url: string;
  created_at: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-muted hover:text-accent transition-colors shrink-0"
    >
      {copied ? (
        <Check size={12} className="text-emerald-600" strokeWidth={3} />
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
}

export function OrderReview({
  order,
  screenshotUrl,
}: {
  order: Order;
  screenshotUrl: string | null;
}) {
  const router = useRouter();
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || "");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPending = order.status === "pending";

  const handleApprove = async () => {
    setApproving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedKey(data.licenseKey);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
      setShowRejectForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reject");
    } finally {
      setRejecting(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Back button */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-muted hover:text-foreground text-xs font-black uppercase tracking-widest transition-colors mb-4"
        >
          <ArrowLeft size={12} />
          Back to receipts
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-3">
            Proof of payment audit
          </span>
          <h1 className="text-2xl font-display font-black text-foreground tracking-tight leading-none">
            Audit Billing
          </h1>
          <p className="text-muted text-xs font-mono font-bold mt-1.5">
            Order UID: {order.id}
          </p>
        </div>
        <div
          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
            order.status === "pending"
              ? "bg-amber-500/10 border-amber-500/30 text-amber-700"
              : order.status === "approved"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
              : "bg-red-500/10 border-red-500/30 text-red-700"
          }`}
        >
          {order.status}
        </div>
      </div>

      {/* Approve and key delivery confirmation banner */}
      <AnimatePresence>
        {generatedKey && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600 shrink-0" />
              <p className="text-emerald-700 font-bold text-sm tracking-tight leading-none">
                Billing Approved. Core Key Token Successfully Provisioned.
              </p>
            </div>
            <p className="text-muted text-xs font-semibold leading-relaxed">
              Copy this token and transmit to client at: <strong className="text-foreground">{order.customer_email}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-emerald-200 rounded-xl p-4">
              <code className="font-mono text-emerald-700 text-base font-black tracking-widest flex-1 break-all select-all">
                {generatedKey}
              </code>
              <CopyButton value={generatedKey} />
            </div>
            <p className="text-muted text-[10px] font-bold uppercase tracking-wider">
              Token signature state generated once. This reference catalog is unrecoverable.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Errors banner */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-xs font-bold leading-none">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Param metrics card block */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main info card */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="font-display font-black text-lg text-foreground tracking-tight mb-6">
              Receipt Parameters
            </h2>
            <div className="space-y-4">
              {[
                { label: "Target Client Name", value: order.customer_name },
                { label: "Target Account Email", value: order.customer_email, copy: true },
                { label: "Asset signature tier", value: `${order.plan} &middot; ${order.plan_duration} &middot; ${order.devices === "1" ? "1 Device" : "Unlimited Devices"}` },
                { label: "Volume Total", value: `$${order.amount_usd} USD` },
                { label: "Routing pipeline", value: order.payment_method },
                { label: "Operation Type", value: order.is_renewal ? "Renew Existing Key" : "New Contract Purchase" },
                { label: "Submitted date", value: formatDate(order.created_at) },
              ].map(({ label, value, copy }) => (
                <div key={label} className="flex justify-between items-baseline border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-muted text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-xs font-black tracking-tight text-right" dangerouslySetInnerHTML={{ __html: value }} />
                    {copy && <CopyButton value={value} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Renewal target matching details */}
          {order.is_renewal && order.existing_license_key && (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-black text-base text-foreground tracking-tight mb-4 flex items-center gap-2">
                <RefreshCw size={14} className="text-purple-600 shrink-0" />
                Target Key Replacement
              </h2>
              <div className="flex items-center justify-between gap-4 bg-background border border-border rounded-xl p-4">
                <code className="font-mono text-foreground text-xs font-black break-all select-all">
                  {order.existing_license_key}
                </code>
                <CopyButton value={order.existing_license_key} />
              </div>
            </div>
          )}

          {/* Customer notes */}
          {order.notes && (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-black text-base text-foreground tracking-tight mb-2">
                Client Notes
              </h2>
              <p className="text-muted text-xs font-semibold leading-relaxed">
                &ldquo;{order.notes}&rdquo;
              </p>
            </div>
          )}

          {/* Internal admin notes */}
          {isPending && (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-black text-base text-foreground tracking-tight mb-3">
                Internal Operational Notes
              </h2>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Audit notes, manual overrides, reference logs..."
                rows={3}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm font-semibold focus:outline-none focus:border-accent resize-none"
              />
            </div>
          )}

          {/* Audit trace historical stamps */}
          {order.reviewed_at && (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-normal">
                Audited by <strong className="text-foreground font-black">{order.reviewed_by}</strong> on {formatDate(order.reviewed_at)}
              </p>
              {order.admin_notes && (
                <div className="mt-3 bg-background border border-border/60 rounded-xl p-4">
                  <p className="text-foreground text-xs font-semibold leading-relaxed">
                    {order.admin_notes}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Screenshot preview panel */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Payment proof receipt thumbnail upload box */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-black text-base text-foreground tracking-tight mb-4">
              Payment Verification Screenshot
            </h2>
            {screenshotUrl ? (
              <div className="space-y-4">
                <div className="border border-border rounded-xl overflow-hidden bg-background">
                  <img
                    src={screenshotUrl}
                    alt="Proof Receipt Screenshot"
                    className="w-full h-auto object-contain max-h-[420px]"
                  />
                </div>
                <a
                  href={screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 py-3 border border-border hover:border-accent hover:text-accent rounded-full text-xs font-black uppercase tracking-wider transition-colors bg-white w-full"
                >
                  Inspect asset proof fullscreen
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
                </a>
              </div>
            ) : (
              <div className="h-48 bg-background rounded-xl border border-border/80 flex items-center justify-center">
                <p className="text-muted text-xs font-bold uppercase tracking-wider">
                  No payment snapshot asset uploaded.
                </p>
              </div>
            )}
          </div>

          {/* Audit controls button triggers */}
          {isPending && !generatedKey && (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="font-display font-black text-base text-foreground tracking-tight mb-4">
                Verify Operations
              </h2>

              <button
                onClick={handleApprove}
                disabled={approving}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/20 rounded-full text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                {approving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <CheckCircle size={12} strokeWidth={3} />
                )}
                {approving ? "Registering and dispatching..." : "Approve & Dispatch Key Token"}
              </button>

              {!showRejectForm ? (
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 border border-red-500/30 text-red-700 hover:bg-red-500/20 rounded-full text-xs font-black uppercase tracking-widest transition-colors"
                >
                  <XCircle size={12} strokeWidth={3} />
                  Reject receipt proof
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3 pt-2"
                >
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason code (Internal administrative use only)..."
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-xs font-bold focus:outline-none focus:border-red-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 py-3 border border-border rounded-full text-foreground hover:border-accent text-xs font-black uppercase tracking-wider transition-colors bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={rejecting}
                      className="flex-1 py-3 bg-red-500/10 border border-red-500/30 text-red-700 hover:bg-red-500/20 rounded-full text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {rejecting ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        "Confirm Rejection"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}