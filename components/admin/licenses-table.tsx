"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Key,
  Search,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  Download,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

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

const statusConfig = {
  active: {
    icon: CheckCircle,
    color: "text-accent-success",
    bg: "bg-accent-success/10 border-accent-success/20",
  },
  suspended: {
    icon: Ban,
    color: "text-accent-gold",
    bg: "bg-accent-gold/10 border-accent-gold/20",
  },
  expired: {
    icon: Clock,
    color: "text-text-muted",
    bg: "bg-bg-elevated border-border",
  },
  revoked: {
    icon: XCircle,
    color: "text-accent-hot",
    bg: "bg-accent-hot/10 border-accent-hot/20",
  },
};

const bulkActions = [
  { value: "activate", label: "Activate Selected", icon: CheckCircle, color: "accent-success" },
  { value: "suspend", label: "Suspend Selected", icon: Ban, color: "accent-gold" },
  { value: "revoke", label: "Revoke Selected", icon: XCircle, color: "accent-hot" },
  { value: "reset_hardware", label: "Reset Hardware", icon: RefreshCw, color: "accent-primary" },
];

export function LicensesTable({
  licenses,
  currentStatus,
  currentPlan,
  currentSearch,
}: {
  licenses: License[];
  currentStatus: string;
  currentPlan: string;
  currentSearch: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const allSelected =
    licenses.length > 0 && selectedIds.size === licenses.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(licenses.map((l) => l.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    setBulkError(null);
    setBulkSuccess(null);

    try {
      const res = await fetch("/api/admin/licenses/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          licenseIds: Array.from(selectedIds),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBulkSuccess(
        `${data.updated} license${data.updated !== 1 ? "s" : ""} updated successfully`
      );
      setSelectedIds(new Set());
      router.refresh();
    } catch (err: unknown) {
      setBulkError(
        err instanceof Error ? err.message : "Bulk action failed"
      );
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentStatus !== "all") params.set("status", currentStatus);
      if (currentPlan !== "all") params.set("plan", currentPlan);

      const res = await fetch(`/api/admin/licenses/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prowler-licenses-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (currentStatus !== "all") params.set("status", currentStatus);
    if (currentPlan !== "all") params.set("plan", currentPlan);
    router.push(`/admin/licenses?${params.toString()}`);
  };

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (key !== "status" && currentStatus !== "all")
      params.set("status", currentStatus);
    if (key !== "plan" && currentPlan !== "all")
      params.set("plan", currentPlan);
    if (value !== "all") params.set(key, value);
    router.push(`/admin/licenses?${params.toString()}`);
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const maskedHash = (hash: string) =>
    `${hash.slice(0, 8)}...${hash.slice(-6)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Licenses
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {licenses.length} license{licenses.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exportLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border rounded-xl text-text-secondary text-sm font-medium hover:border-border-glow hover:text-text-primary transition-all disabled:opacity-50"
        >
          {exportLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or notes..."
              className="w-full bg-bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-accent-primary/15 border border-accent-primary/30 text-accent-primary rounded-xl text-sm font-medium hover:bg-accent-primary/25 transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto">
          {["all", "active", "suspended", "expired", "revoked"].map((s) => (
            <button
              key={s}
              onClick={() => handleFilter("status", s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                currentStatus === s
                  ? "bg-accent-primary/15 text-accent-primary border-accent-primary/30"
                  : "bg-bg-surface border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {["all", "basic", "pro", "elite"].map((p) => (
            <button
              key={p}
              onClick={() => handleFilter("plan", p)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                currentPlan === p
                  ? "bg-accent-primary/15 text-accent-primary border-accent-primary/30"
                  : "bg-bg-surface border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap items-center gap-3 bg-bg-surface border border-border-glow rounded-xl p-4"
          >
            <span className="text-text-primary text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <div className="w-px h-6 bg-border" />
            {bulkActions.map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => handleBulkAction(value)}
                disabled={bulkLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all disabled:opacity-50 ${
                  color === "accent-success"
                    ? "bg-accent-success/10 border-accent-success/30 text-accent-success hover:bg-accent-success/20"
                    : color === "accent-gold"
                    ? "bg-accent-gold/10 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20"
                    : color === "accent-hot"
                    ? "bg-accent-hot/10 border-accent-hot/30 text-accent-hot hover:bg-accent-hot/20"
                    : "bg-accent-primary/10 border-accent-primary/30 text-accent-primary hover:bg-accent-primary/20"
                }`}
              >
                {bulkLoading ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Icon size={11} />
                )}
                {label}
              </button>
            ))}
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-text-muted text-xs hover:text-text-primary transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts */}
      <AnimatePresence>
        {bulkSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-accent-success/10 border border-accent-success/30 rounded-xl px-4 py-3"
          >
            <CheckCircle size={14} className="text-accent-success" />
            <p className="text-accent-success text-sm">{bulkSuccess}</p>
          </motion.div>
        )}
        {bulkError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-accent-hot/10 border border-accent-hot/30 rounded-xl px-4 py-3"
          >
            <AlertCircle size={14} className="text-accent-hot" />
            <p className="text-accent-hot text-sm">{bulkError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="card-surface overflow-hidden">
        {licenses.length === 0 ? (
          <div className="p-16 text-center">
            <Key size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">
              No licenses found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="p-4 w-10">
                    <button
                      onClick={toggleAll}
                      className="text-text-muted hover:text-accent-primary transition-colors"
                    >
                      {allSelected ? (
                        <CheckSquare size={16} className="text-accent-primary" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  {[
                    "Email",
                    "Plan",
                    "Status",
                    "Key Hash",
                    "Hardware",
                    "Activations",
                    "Created",
                    "Expires",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left p-4 text-text-muted font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {licenses.map((license, i) => {
                  const sc =
                    statusConfig[
                      license.status as keyof typeof statusConfig
                    ] || statusConfig.active;
                  const StatusIcon = sc.icon;
                  const isRevealed = revealedKeys.has(license.id);
                  const isSelected = selectedIds.has(license.id);

                  return (
                    <motion.tr
                      key={license.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`hover:bg-bg-elevated/50 transition-colors ${
                        isSelected ? "bg-accent-primary/5" : ""
                      }`}
                    >
                      <td className="p-4 w-10">
                        <button
                          onClick={() => toggleOne(license.id)}
                          className="text-text-muted hover:text-accent-primary transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare
                              size={16}
                              className="text-accent-primary"
                            />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <p className="text-text-primary font-medium text-sm">
                          {license.email || "No email"}
                        </p>
                        {license.notes && (
                          <p className="text-text-muted text-xs truncate max-w-32">
                            {license.notes}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="capitalize text-text-primary font-medium">
                          {license.plan}
                        </span>
                        {license.plan_duration && (
                          <p className="text-text-muted text-xs capitalize">
                            {license.plan_duration}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium ${sc.bg} ${sc.color}`}
                        >
                          <StatusIcon size={10} />
                          <span className="capitalize">{license.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-text-muted text-xs">
                            {isRevealed
                              ? license.key_hash
                              : maskedHash(license.key_hash)}
                          </code>
                          <button
                            onClick={() => toggleReveal(license.id)}
                            className="text-text-muted hover:text-accent-primary transition-colors"
                          >
                            {isRevealed ? (
                              <EyeOff size={12} />
                            ) : (
                              <Eye size={12} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-text-muted text-xs font-mono">
                          {license.hardware_id
                            ? `${license.hardware_id.slice(0, 12)}...`
                            : "Not activated"}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary text-center">
                        {license.activation_count}
                        {" / "}
                        {license.max_machines === 999
                          ? "∞"
                          : license.max_machines}
                      </td>
                      <td className="p-4 text-text-muted text-xs">
                        {formatDate(license.created_at)}
                      </td>
                      <td className="p-4 text-text-muted text-xs">
                        {license.expires_at
                          ? formatDate(license.expires_at)
                          : "Lifetime"}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/licenses/${license.id}`}
                          className="text-accent-primary hover:underline text-xs font-medium"
                        >
                          Manage
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}