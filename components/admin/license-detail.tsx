"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  Activity,
  ShoppingCart,
  Eye,
  EyeOff,
} from "lucide-react";

interface License {
  id: string;
  key_hash: string;
  plan: string;
  status: string;
  email: string | null;
  hardware_id: string | null;
  max_machines: number;
  created_at: string;
  expires_at: string | null;
  last_seen_at: string | null;
  activation_count: number;
  notes: string | null;
  plan_duration: string | null;
}

interface UsageLog {
  id: string;
  action: string;
  hardware_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface Order {
  id: string;
  customer_name: string;
  amount_usd: number;
  plan: string;
  created_at: string;
  status: string;
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
        <Check size={13} className="text-accent-success" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}

const statusActions = {
  active: [
    { label: "Suspend", action: "suspended", color: "accent-gold", icon: Ban },
    {
      label: "Revoke",
      action: "revoked",
      color: "accent-hot",
      icon: XCircle,
    },
  ],
  suspended: [
    {
      label: "Reactivate",
      action: "active",
      color: "accent-success",
      icon: CheckCircle,
    },
    {
      label: "Revoke",
      action: "revoked",
      color: "accent-hot",
      icon: XCircle,
    },
  ],
  revoked: [
    {
      label: "Reactivate",
      action: "active",
      color: "accent-success",
      icon: CheckCircle,
    },
  ],
  expired: [
    {
      label: "Reactivate",
      action: "active",
      color: "accent-success",
      icon: CheckCircle,
    },
  ],
};

export function LicenseDetail({
  license,
  usageLogs,
  order,
}: {
  license: License;
  usageLogs: UsageLog[];
  order: Order | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [notes, setNotes] = useState(license.notes || "");
  const [showHash, setShowHash] = useState(false);
  const [editingExpiry, setEditingExpiry] = useState(false);
  const [newExpiry, setNewExpiry] = useState(
    license.expires_at
      ? new Date(license.expires_at).toISOString().split("T")[0]
      : ""
  );

  const updateLicense = async (
    updates: Record<string, unknown>,
    successMsg: string
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/licenses/${license.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(successMsg);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetHardware = () =>
    updateLicense({ hardware_id: null }, "Hardware binding reset. User can now activate on a new machine.");

  const handleStatusChange = (newStatus: string) =>
    updateLicense({ status: newStatus }, `License ${newStatus} successfully.`);

  const handleSaveNotes = () =>
    updateLicense({ notes }, "Notes saved.");

  const handleSaveExpiry = () => {
    const expiresAt = newExpiry ? new Date(newExpiry).toISOString() : null;
    updateLicense({ expires_at: expiresAt }, "Expiry date updated.");
    setEditingExpiry(false);
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentStatusActions =
    statusActions[license.status as keyof typeof statusActions] || [];

  const statusBadge = {
    active: "bg-accent-success/10 border-accent-success/30 text-accent-success",
    suspended: "bg-accent-gold/10 border-accent-gold/30 text-accent-gold",
    revoked: "bg-accent-hot/10 border-accent-hot/30 text-accent-hot",
    expired: "bg-bg-elevated border-border text-text-muted",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/licenses"
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft size={14} />
          Back to Licenses
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            License Detail
          </h1>
          <p className="text-text-muted text-sm font-mono mt-1">
            {license.id}
          </p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${
            statusBadge[license.status as keyof typeof statusBadge] ||
            statusBadge.expired
          }`}
        >
          {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-accent-success/10 border border-accent-success/30 rounded-xl px-4 py-3"
          >
            <CheckCircle size={14} className="text-accent-success" />
            <p className="text-accent-success text-sm">{success}</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-accent-hot/10 border border-accent-hot/30 rounded-xl px-4 py-3"
          >
            <AlertCircle size={14} className="text-accent-hot" />
            <p className="text-accent-hot text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Core info */}
          <div className="card-surface p-6">
            <h2 className="font-display font-semibold text-text-primary mb-5">
              License Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                {
                  label: "Email",
                  value: license.email || "Not set",
                  copy: !!license.email,
                },
                {
                  label: "Plan",
                  value: `${license.plan.toUpperCase()} — ${
                    license.plan_duration === "lifetime"
                      ? "Lifetime"
                      : "Monthly"
                  }`,
                },
                {
                  label: "Max Devices",
                  value:
                    license.max_machines === 999
                      ? "Unlimited"
                      : license.max_machines.toString(),
                },
                {
                  label: "Activations",
                  value: license.activation_count.toString(),
                },
                {
                  label: "Created",
                  value: formatDate(license.created_at),
                },
                {
                  label: "Last Seen",
                  value: formatDate(license.last_seen_at),
                },
              ].map(({ label, value, copy }) => (
                <div key={label}>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-text-primary text-sm font-medium">
                      {value}
                    </p>
                    {copy && <CopyButton value={value} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key hash */}
          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-text-primary">
                Key Hash (HMAC-SHA256)
              </h2>
              <button
                onClick={() => setShowHash(!showHash)}
                className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors text-xs"
              >
                {showHash ? <EyeOff size={12} /> : <Eye size={12} />}
                {showHash ? "Hide" : "Reveal"}
              </button>
            </div>
            <div className="flex items-center gap-3 bg-bg-elevated border border-border rounded-xl p-4">
              <code className="font-mono text-text-secondary text-xs flex-1 break-all">
                {showHash
                  ? license.key_hash
                  : `${license.key_hash.slice(0, 16)}${"•".repeat(32)}${license.key_hash.slice(-8)}`}
              </code>
              {showHash && <CopyButton value={license.key_hash} />}
            </div>
            <p className="text-text-muted text-xs mt-2">
              The raw license key cannot be recovered. Only the hash is stored.
            </p>
          </div>

          {/* Hardware binding */}
          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-text-primary">
                Hardware Binding
              </h2>
              {license.hardware_id && (
                <button
                  onClick={handleResetHardware}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold rounded-lg text-xs font-medium hover:bg-accent-gold/20 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <RefreshCw size={11} />
                  )}
                  Reset Binding
                </button>
              )}
            </div>
            {license.hardware_id ? (
              <div className="bg-bg-elevated border border-border rounded-xl p-4">
                <p className="text-text-muted text-xs mb-1">Bound to hardware ID</p>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-text-primary text-sm break-all">
                    {license.hardware_id}
                  </code>
                  <CopyButton value={license.hardware_id} />
                </div>
              </div>
            ) : (
              <div className="bg-accent-success/5 border border-accent-success/20 rounded-xl p-4">
                <p className="text-accent-success text-sm flex items-center gap-2">
                  <CheckCircle size={14} />
                  Not bound — user can activate on any machine
                </p>
              </div>
            )}
          </div>

          {/* Expiry management */}
          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-text-primary">
                Expiry Date
              </h2>
              <button
                onClick={() => setEditingExpiry(!editingExpiry)}
                className="text-accent-primary text-xs hover:underline"
              >
                {editingExpiry ? "Cancel" : "Change"}
              </button>
            </div>
            {editingExpiry ? (
              <div className="flex gap-3">
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="flex-1 bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
                />
                <button
                  onClick={() =>
                    updateLicense({ expires_at: null }, "Set to lifetime.")
                  }
                  disabled={loading}
                  className="px-3 py-2.5 border border-border rounded-xl text-text-secondary text-xs hover:border-border-glow transition-all"
                >
                  Lifetime
                </button>
                <button
                  onClick={handleSaveExpiry}
                  disabled={loading}
                  className="px-4 py-2.5 bg-accent-primary/15 border border-accent-primary/30 text-accent-primary rounded-xl text-xs font-medium hover:bg-accent-primary/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            ) : (
              <p className="text-text-primary font-medium">
                {license.expires_at
                  ? formatDate(license.expires_at)
                  : "Lifetime (never expires)"}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="card-surface p-6">
            <h2 className="font-display font-semibold text-text-primary mb-3">
              Internal Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this license..."
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors resize-none mb-3"
            />
            <button
              onClick={handleSaveNotes}
              disabled={loading}
              className="px-4 py-2 bg-accent-primary/15 border border-accent-primary/30 text-accent-primary rounded-xl text-xs font-medium hover:bg-accent-primary/25 transition-all disabled:opacity-50"
            >
              Save Notes
            </button>
          </div>

          {/* Usage logs */}
          <div className="card-surface overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Activity size={14} className="text-accent-primary" />
              <h2 className="font-display font-semibold text-text-primary">
                Usage Logs
              </h2>
              <span className="text-text-muted text-xs ml-1">
                (last 20)
              </span>
            </div>
            {usageLogs.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                No activity recorded yet
              </div>
            ) : (
              <div className="divide-y divide-border">
                {usageLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 px-5 py-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm font-medium capitalize">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-text-muted text-xs font-mono truncate">
                        {log.hardware_id}
                      </p>
                    </div>
                    <p className="text-text-muted text-xs flex-shrink-0">
                      {new Date(log.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — actions */}
        <div className="space-y-5">
          {/* Status actions */}
          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-text-primary mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              {currentStatusActions.map(({ label, action, color, icon: Icon }) => (
                <button
                  key={action}
                  onClick={() => handleStatusChange(action)}
                  disabled={loading}
                  className={`w-full flex items-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 ${
                    color === "accent-success"
                      ? "bg-accent-success/10 border-accent-success/30 text-accent-success hover:bg-accent-success/20"
                      : color === "accent-gold"
                      ? "bg-accent-gold/10 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20"
                      : "bg-accent-hot/10 border-accent-hot/30 text-accent-hot hover:bg-accent-hot/20"
                  }`}
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Icon size={14} />
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Linked order */}
          {order && (
            <div className="card-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={14} className="text-accent-primary" />
                <h2 className="font-display font-semibold text-text-primary">
                  Linked Order
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Customer</span>
                  <span className="text-text-primary text-xs font-medium">
                    {order.customer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Amount</span>
                  <span className="text-text-primary text-xs font-medium">
                    ${order.amount_usd}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Date</span>
                  <span className="text-text-muted text-xs">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Link
                href={`/admin/orders/${order.id}`}
                className="mt-4 block text-center text-accent-primary text-xs hover:underline"
              >
                View order →
              </Link>
            </div>
          )}

          {/* Quick info */}
          <div className="card-surface p-5">
            <h2 className="font-display font-semibold text-text-primary mb-4">
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm">Status</span>
                <span className="text-text-primary text-sm capitalize font-medium">
                  {license.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm">Activations</span>
                <span className="text-text-primary text-sm font-medium">
                  {license.activation_count} /{" "}
                  {license.max_machines === 999 ? "∞" : license.max_machines}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm">Hardware</span>
                <span
                  className={`text-xs font-medium ${
                    license.hardware_id
                      ? "text-accent-gold"
                      : "text-accent-success"
                  }`}
                >
                  {license.hardware_id ? "Bound" : "Free"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-sm">Expiry</span>
                <span className="text-text-primary text-xs font-medium">
                  {license.expires_at ? "Fixed date" : "Lifetime"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}