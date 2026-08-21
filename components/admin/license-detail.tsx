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

const statusActions = {
  active: [
    { label: "Suspend Key", action: "suspended", color: "amber", icon: Ban },
    { label: "Revoke Permanently", action: "revoked", color: "red", icon: XCircle },
  ],
  suspended: [
    { label: "Activate Session", action: "active", color: "emerald", icon: CheckCircle },
    { label: "Revoke Permanently", action: "revoked", color: "red", icon: XCircle },
  ],
  revoked: [
    { label: "Reinstate Active Status", action: "active", color: "emerald", icon: CheckCircle },
  ],
  expired: [
    { label: "Extend & Activate", action: "active", color: "emerald", icon: CheckCircle },
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
    updateLicense({ hardware_id: null }, "Hardware token reset successfully. System unlocked for activation.");

  const handleStatusChange = (newStatus: string) =>
    updateLicense({ status: newStatus }, `License record updated to: ${newStatus}`);

  const handleSaveNotes = () =>
    updateLicense({ notes }, "Internal administrative notes saved.");

  const handleSaveExpiry = () => {
    const expiresAt = newExpiry ? new Date(newExpiry).toISOString() : null;
    updateLicense({ expires_at: expiresAt }, "Operational expiration bounds updated.");
    setEditingExpiry(false);
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Never Expiring";
    return new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentStatusActions =
    statusActions[license.status as keyof typeof statusActions] || [];

  const statusBadge = {
    active: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700",
    suspended: "bg-amber-500/10 border-amber-500/30 text-amber-700",
    revoked: "bg-red-500/10 border-red-500/30 text-red-700",
    expired: "bg-white border-border text-muted",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Breadcrumb back */}
      <div>
        <Link
          href="/admin/licenses"
          className="inline-flex items-center gap-1.5 text-muted hover:text-foreground text-xs font-black uppercase tracking-widest transition-colors mb-4"
        >
          <ArrowLeft size={12} />
          Back to licenses
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-3">
            Detailed Core State
          </span>
          <h1 className="text-2xl font-display font-black text-foreground tracking-tight leading-none">
            License Records
          </h1>
          <p className="text-muted text-xs font-mono font-bold mt-1.5">
            UID: {license.id}
          </p>
        </div>
        <div
          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
            statusBadge[license.status as keyof typeof statusBadge] || statusBadge.expired
          }`}
        >
          {license.status}
        </div>
      </div>

      {/* Dynamic alerts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5"
          >
            <CheckCircle size={14} className="text-emerald-600 shrink-0" />
            <p className="text-emerald-700 text-xs font-bold leading-none">{success}</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5"
          >
            <AlertCircle size={14} className="text-red-600 shrink-0" />
            <p className="text-red-600 text-xs font-bold leading-none">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Core parameters column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* parameters Grid Box */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="font-display font-black text-lg text-foreground tracking-tight mb-6">
              Parameter Index
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Target Client", value: license.email || "No email bound", copy: !!license.email },
                { label: "Signature Tier", value: `${license.plan} &middot; ${license.plan_duration}` },
                { label: "Machine Slots", value: license.max_machines === 999 ? "Unlimited" : `${license.max_machines} Device(s)` },
                { label: "Activations Count", value: `${license.activation_count} sessions` },
                { label: "Created Timestamp", value: formatDate(license.created_at) },
                { label: "Telemetry Heartbeat", value: formatDate(license.last_seen_at) },
              ].map(({ label, value, copy }) => (
                <div key={label} className="border-b border-border/40 pb-4 last:border-0 last:pb-0">
                  <p className="text-muted text-[9px] font-black uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground text-sm font-black tracking-tight" dangerouslySetInnerHTML={{ __html: value }} />
                    {copy && <CopyButton value={value} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic block hash */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-display font-black text-lg text-foreground tracking-tight">
                Cryptographic Signature State
              </h2>
              <button
                onClick={() => setShowHash(!showHash)}
                className="flex items-center gap-1 text-muted hover:text-foreground text-xs font-black uppercase tracking-widest transition-colors"
              >
                {showHash ? <EyeOff size={12} /> : <Eye size={12} />}
                {showHash ? "Hide" : "Reveal Hash"}
              </button>
            </div>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-4">
              <code className="font-mono text-foreground text-xs font-semibold flex-1 break-all select-all">
                {showHash
                  ? license.key_hash
                  : `${license.key_hash.slice(0, 16)}••••••••••••••••••••••••${license.key_hash.slice(-8)}`}
              </code>
              {showHash && <CopyButton value={license.key_hash} />}
            </div>
            <p className="text-muted text-[10px] font-bold uppercase tracking-wider mt-3 leading-normal">
              Internal HMAC state cannot be reversed to restore original plain text license strings.
            </p>
          </div>

          {/* Host CPU binding */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="font-display font-black text-lg text-foreground tracking-tight">
                Hardware Binding State
              </h2>
              {license.hardware_id && (
                <button
                  onClick={handleResetHardware}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all"
                >
                  {loading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <RefreshCw size={12} />
                  )}
                  Reset Binding
                </button>
              )}
            </div>
            {license.hardware_id ? (
              <div className="bg-background border border-border rounded-xl p-4">
                <p className="text-muted text-[9px] font-black uppercase tracking-wider mb-1">BOUND LOCAL HOST ID</p>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-foreground text-xs font-black break-all select-all">
                    {license.hardware_id}
                  </code>
                  <CopyButton value={license.hardware_id} />
                </div>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={14} />
                  Available: Lock is clear for next device initialization setup.
                </p>
              </div>
            )}
          </div>

          {/* Expiration date bounds */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-display font-black text-lg text-foreground tracking-tight">
                Expiration Bounds
              </h2>
              <button
                onClick={() => setEditingExpiry(!editingExpiry)}
                className="text-accent hover:text-[#4F52D6] text-xs font-black uppercase tracking-widest hover:underline"
              >
                {editingExpiry ? "Cancel" : "Modify limits"}
              </button>
            </div>
            {editingExpiry ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-foreground text-xs font-bold focus:outline-none focus:border-accent"
                />
                <button
                  onClick={() => updateLicense({ expires_at: null }, "License reset to permanent lifetime bounds.")}
                  disabled={loading}
                  className="px-5 py-3 border border-border rounded-full text-foreground hover:border-accent text-xs font-black uppercase tracking-widest transition-colors bg-white"
                >
                  Convert to lifetime
                </button>
                <button
                  onClick={handleSaveExpiry}
                  disabled={loading}
                  className="px-6 py-3 bg-accent text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#4F52D6] transition-colors"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : "Apply Bounds"}
                </button>
              </div>
            ) : (
              <p className="text-foreground text-sm font-black tracking-tight">
                {license.expires_at ? formatDate(license.expires_at) : "Lifetime (Permanent entitlement tier)"}
              </p>
            )}
          </div>

          {/* Core admin notes */}
          <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="font-display font-black text-lg text-foreground tracking-tight mb-4">
              Administrative Record Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Track manual changes or verification IDs..."
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm font-semibold focus:outline-none focus:border-accent resize-none mb-4"
            />
            <button
              onClick={handleSaveNotes}
              disabled={loading}
              className="px-5 py-3 bg-accent text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#4F52D6] transition-colors"
            >
              Save notes
            </button>
          </div>

          {/* Activity Logs */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 p-6 border-b border-border/60">
              <Activity size={14} className="text-accent shrink-0" />
              <h2 className="font-display font-black text-lg text-foreground tracking-tight">
                Activity Logs
              </h2>
              <span className="text-muted text-[10px] font-bold uppercase tracking-widest ml-1">
                Last 20 operations
              </span>
            </div>
            {usageLogs.length === 0 ? (
              <div className="p-8 text-center text-muted text-xs font-bold uppercase tracking-wider">
                No tracking data retrieved.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {usageLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between gap-4 p-5 hover:bg-background/20">
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-xs font-black uppercase tracking-wider truncate">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-muted text-[10px] font-mono truncate mt-0.5">
                        HWID: {log.hardware_id}
                      </p>
                    </div>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-wider shrink-0">
                      {new Date(log.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Status Actions Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Actions card */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-black text-base text-foreground tracking-tight mb-4">
              State Operations
            </h2>
            <div className="space-y-2">
              {currentStatusActions.map(({ label, action, color, icon: Icon }) => (
                <button
                  key={action}
                  onClick={() => handleStatusChange(action)}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    color === "emerald"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/20"
                      : color === "amber"
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-700 hover:bg-amber-500/20"
                      : "bg-red-500/10 border border-red-500/30 text-red-700 hover:bg-red-500/20"
                  }`}
                >
                  {loading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Icon size={12} strokeWidth={3} />
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Linked order details */}
          {order && (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={14} className="text-accent shrink-0" />
                <h2 className="font-display font-black text-base text-foreground tracking-tight">
                  Linked Order Proof
                </h2>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-baseline border-b border-border/40 pb-2">
                  <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Client</span>
                  <span className="text-foreground text-xs font-black tracking-tight">{order.customer_name}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/40 pb-2">
                  <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Sum</span>
                  <span className="text-foreground text-xs font-black tracking-tight">${order.amount_usd}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Captured</span>
                  <span className="text-muted text-[10px] font-mono font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Link
                href={`/admin/orders/${order.id}`}
                className="w-full block py-3 text-center border border-border hover:border-accent hover:text-accent rounded-full text-xs font-black uppercase tracking-wider transition-colors bg-white"
              >
                Review transaction &rarr;
              </Link>
            </div>
          )}

          {/* Quick Stats sidebar block */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-black text-base text-foreground tracking-tight mb-4">
              Quick Telemetry
            </h2>
            <div className="space-y-3">
              {[
                { label: "Operation state", value: license.status, style: "text-foreground font-black capitalize" },
                { label: "Hardware bound", value: license.hardware_id ? "Bound (Locked)" : "Free (Unlocked)", style: license.hardware_id ? "text-amber-700 font-bold" : "text-emerald-700 font-bold" },
                { label: "Limit Bounds", value: license.expires_at ? "Fixed Expiry" : "Permanent Lifetime", style: "text-foreground font-black" },
              ].map(({ label, value, style }) => (
                <div key={label} className="flex justify-between items-baseline border-b border-border/45 pb-2 last:border-0 last:pb-0">
                  <span className="text-muted text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  <span className={`text-xs ${style}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}