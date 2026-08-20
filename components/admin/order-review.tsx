"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

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
      className="text-text-muted hover:text-accent-primary transition-colors"
    >
      {copied ? (
        <Check size={14} className="text-accent-success" />
      ) : (
        <Copy size={14} />
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
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft size={14} />
          Back to Orders
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Order Review
          </h1>
          <p className="text-text-muted text-sm font-mono mt-1">{order.id}</p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${
            order.status === "pending"
              ? "bg-accent-gold/10 border-accent-gold/30 text-accent-gold"
              : order.status === "approved"
              ? "bg-accent-success/10 border-accent-success/30 text-accent-success"
              : "bg-accent-hot/10 border-accent-hot/30 text-accent-hot"
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>

      {/* Generated key success */}
      {generatedKey && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-success/10 border border-accent-success/30 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-accent-success" />
            <p className="text-accent-success font-semibold">
              Order Approved — License Generated
            </p>
          </div>
          <p className="text-text-secondary text-sm mb-3">
            Copy this key and send it to{" "}
            <strong>{order.customer_email}</strong>
          </p>
          <div className="flex items-center gap-3 bg-bg-deep border border-accent-success/30 rounded-xl p-4">
            <code className="font-mono text-accent-success text-lg flex-1">
              {generatedKey}
            </code>
            <CopyButton value={generatedKey} />
          </div>
          <p className="text-text-muted text-xs mt-3">
            This key is only shown once. Copy it now.
          </p>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-accent-hot/10 border border-accent-hot/30 rounded-xl p-4 text-accent-hot text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order details */}
        <div className="space-y-4">
          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-text-primary mb-4">
              Order Details
            </h2>
            <div className="space-y-3">
              {[
                { label: "Customer", value: order.customer_name },
                {
                  label: "Email",
                  value: order.customer_email,
                  copy: true,
                },
                {
                  label: "Plan",
                  value: `${order.plan.toUpperCase()} — ${
                    order.plan_duration === "lifetime"
                      ? "Lifetime"
                      : "Monthly"
                  } — ${
                    order.devices === "1" ? "1 Device" : "Unlimited"
                  }`,
                },
                { label: "Amount", value: `$${order.amount_usd} USD` },
                {
                  label: "Payment",
                  value: order.payment_method,
                },
                {
                  label: "Type",
                  value: order.is_renewal ? "Renewal" : "New Purchase",
                },
                {
                  label: "Submitted",
                  value: formatDate(order.created_at),
                },
              ].map(({ label, value, copy }) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="text-text-muted text-sm flex-shrink-0">
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary text-sm text-right">
                      {value}
                    </span>
                    {copy && <CopyButton value={value} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Renewal info */}
          {order.is_renewal && order.existing_license_key && (
            <div className="card-surface p-5">
              <h2 className="font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
                <RefreshCw size={14} className="text-accent-purple" />
                Renewal Info
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-sm">Existing Key</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-text-primary text-xs">
                    {order.existing_license_key}
                  </code>
                  <CopyButton value={order.existing_license_key} />
                </div>
              </div>
            </div>
          )}

          {/* Customer notes */}
          {order.notes && (
            <div className="card-surface p-5">
              <h2 className="font-display font-semibold text-text-primary mb-2">
                Customer Notes
              </h2>
              <p className="text-text-secondary text-sm">{order.notes}</p>
            </div>
          )}

          {/* Admin notes */}
          {isPending && (
            <div className="card-surface p-5">
              <h2 className="font-display font-semibold text-text-primary mb-3">
                Admin Notes (optional)
              </h2>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this order..."
                rows={3}
                className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors resize-none"
              />
            </div>
          )}

          {/* Reviewed info */}
          {order.reviewed_at && (
            <div className="card-surface p-5">
              <p className="text-text-muted text-xs">
                Reviewed by{" "}
                <span className="text-text-secondary">
                  {order.reviewed_by}
                </span>{" "}
                on {formatDate(order.reviewed_at)}
              </p>
              {order.admin_notes && (
                <p className="text-text-secondary text-sm mt-2">
                  {order.admin_notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Screenshot + actions */}
        <div className="space-y-4">
          {/* Payment screenshot */}
          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-text-primary mb-4">
              Payment Screenshot
            </h2>
            {screenshotUrl ? (
              <div>
                <img
                  src={screenshotUrl}
                  alt="Payment proof"
                  className="w-full rounded-xl border border-border"
                />
                <a
                  href={screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent-primary text-xs mt-3 hover:underline"
                >
                  <ExternalLink size={10} />
                  Open full size
                </a>
              </div>
            ) : (
              <div className="h-32 bg-bg-elevated rounded-xl border border-border flex items-center justify-center">
                <p className="text-text-muted text-sm">
                  Screenshot not available
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          {isPending && !generatedKey && (
            <div className="card-surface p-5 space-y-3">
              <h2 className="font-display font-semibold text-text-primary mb-4">
                Actions
              </h2>

              <button
                onClick={handleApprove}
                disabled={approving}
                className="w-full flex items-center justify-center gap-2 py-4 bg-accent-success/15 border border-accent-success/40 text-accent-success rounded-xl font-semibold text-sm hover:bg-accent-success/25 transition-all disabled:opacity-50"
              >
                {approving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                {approving ? "Approving..." : "Approve & Generate License"}
              </button>

              {!showRejectForm ? (
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-accent-hot/10 border border-accent-hot/30 text-accent-hot rounded-xl font-semibold text-sm hover:bg-accent-hot/20 transition-all"
                >
                  <XCircle size={16} />
                  Reject Order
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection (customer will not see this)..."
                    rows={2}
                    className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-hot transition-colors resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 py-3 border border-border rounded-xl text-text-secondary text-sm hover:border-border-glow transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={rejecting}
                      className="flex-1 py-3 bg-accent-hot/15 border border-accent-hot/40 text-accent-hot rounded-xl text-sm font-semibold hover:bg-accent-hot/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {rejecting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Confirm Reject"
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