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
    color: "text-emerald-600",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  suspended: {
    icon: Ban,
    color: "text-amber-600",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  expired: {
    icon: Clock,
    color: "text-muted",
    bg: "bg-white border-border",
  },
  revoked: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-500/10 border-red-500/20",
  },
};

const bulkActions = [
  { value: "activate", label: "Activate Selected", icon: CheckCircle, color: "emerald" },
  { value: "suspend", label: "Suspend Selected", icon: Ban, color: "amber" },
  { value: "revoke", label: "Revoke Selected", icon: XCircle, color: "red" },
  { value: "reset_hardware", label: "Reset Hardware ID", icon: RefreshCw, color: "accent" },
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
        `${data.updated} license record${data.updated !== 1 ? "s" : ""} modified successfully.`
      );
      setSelectedIds(new Set());
      router.refresh();
    } catch (err: unknown) {
      setBulkError(
        err instanceof Error ? err.message : "Bulk adjustment action failed"
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-3">
            Operational Records
          </span>
          <h1 className="text-2xl font-display font-black text-foreground tracking-tight flex items-center gap-3">
            <Key size={20} className="text-accent" />
            Active Licenses
          </h1>
          <p className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
            {licenses.length} matching license records detected
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exportLoading}
          className="flex items-center justify-center gap-2 px-5 py-3 border border-border hover:border-accent hover:text-accent rounded-full text-xs font-black uppercase tracking-wider bg-white transition-colors"
        >
          {exportLoading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Download size={13} />
          )}
          Export CSV Database
        </button>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client email, notes description..."
              className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-xs font-bold placeholder:text-muted focus:outline-none focus:border-accent transition-colors shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4F52D6] transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "active", "suspended", "expired", "revoked"].map((s) => (
            <button
              key={s}
              onClick={() => handleFilter("status", s)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                currentStatus === s
                  ? "bg-accent border-accent text-white"
                  : "bg-white border-border text-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "basic", "pro", "elite"].map((p) => (
            <button
              key={p}
              onClick={() => handleFilter("plan", p)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                currentPlan === p
                  ? "bg-accent border-accent text-white"
                  : "bg-white border-border text-muted hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions status panel */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap items-center gap-3 bg-white border border-accent rounded-2xl p-5 shadow-sm"
          >
            <span className="text-foreground text-xs font-black uppercase tracking-wider">
              {selectedIds.size} Assets Selected
            </span>
            <div className="w-px h-6 bg-border" />
            <div className="flex flex-wrap gap-2">
              {bulkActions.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() => handleBulkAction(value)}
                  disabled={bulkLoading}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 ${
                    color === "emerald"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/20"
                      : color === "amber"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-700 hover:bg-amber-500/20"
                      : color === "red"
                      ? "bg-red-500/10 border-red-500/30 text-red-700 hover:bg-red-500/20"
                      : "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
                  }`}
                >
                  {bulkLoading ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Icon size={11} strokeWidth={2.5} />
                  )}
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-muted text-xs font-black uppercase tracking-widest hover:text-foreground"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process alerts */}
      <AnimatePresence>
        {bulkSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5"
          >
            <CheckCircle size={14} className="text-emerald-600 shrink-0" />
            <p className="text-emerald-700 text-xs font-bold leading-none">{bulkSuccess}</p>
          </motion.div>
        )}
        {bulkError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5"
          >
            <AlertCircle size={14} className="text-red-600 shrink-0" />
            <p className="text-red-600 text-xs font-bold leading-none">{bulkError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Database Table grid */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {licenses.length === 0 ? (
          <div className="p-16 text-center">
            <Key size={32} className="text-muted mx-auto mb-4" />
            <p className="text-foreground font-black text-lg">No licenses index on current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="p-5 w-12 text-center">
                    <button
                      onClick={toggleAll}
                      className="text-muted hover:text-accent transition-colors inline-block"
                    >
                      {allSelected ? (
                        <CheckSquare size={16} className="text-accent" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  {[
                    "Target Client",
                    "Tier Parameter",
                    "Status",
                    "Cryptographic Signature Key",
                    "Host CPU bound",
                    "Session slots",
                    "Created",
                    "Expiration Bounds",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left p-5 text-muted text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {licenses.map((license, i) => {
                  const sc = statusConfig[license.status as keyof typeof statusConfig] || statusConfig.active;
                  const StatusIcon = sc.icon;
                  const isRevealed = revealedKeys.has(license.id);
                  const isSelected = selectedIds.has(license.id);

                  return (
                    <motion.tr
                      key={license.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.015 }}
                      className={`hover:bg-background/30 transition-colors ${
                        isSelected ? "bg-accent/5" : ""
                      }`}
                    >
                      <td className="p-5 w-12 text-center">
                        <button
                          onClick={() => toggleOne(license.id)}
                          className="text-muted hover:text-accent transition-colors inline-block"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-accent" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="p-5">
                        <p className="text-foreground font-black tracking-tight text-sm">
                          {license.email || "No bound account"}
                        </p>
                        {license.notes && (
                          <p className="text-muted text-[10px] truncate max-w-[140px] font-semibold">
                            {license.notes}
                          </p>
                        )}
                      </td>
                      <td className="p-5">
                        <span className="text-foreground text-xs font-black uppercase tracking-wider">
                          {license.plan}
                        </span>
                        {license.plan_duration && (
                          <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-0.5">
                            {license.plan_duration}
                          </p>
                        )}
                      </td>
                      <td className="p-5">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${sc.bg} ${sc.color}`}
                        >
                          <StatusIcon size={10} strokeWidth={3} />
                          <span>{license.status}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-muted text-xs font-bold">
                            {isRevealed
                              ? license.key_hash
                              : `${license.key_hash.slice(0, 8)}••••••••${license.key_hash.slice(-6)}`}
                          </code>
                          <button
                            onClick={() => toggleReveal(license.id)}
                            className="text-muted hover:text-accent transition-colors"
                          >
                            {isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-muted text-[10px] font-mono font-black uppercase tracking-tight">
                          {license.hardware_id
                            ? `${license.hardware_id.slice(0, 12)}...`
                            : "Unlocked Slots"}
                        </span>
                      </td>
                      <td className="p-5 text-center text-foreground font-black text-xs">
                        {license.activation_count} / {license.max_machines === 999 ? "∞" : license.max_machines}
                      </td>
                      <td className="p-5 text-muted font-mono text-xs font-bold">
                        {formatDate(license.created_at)}
                      </td>
                      <td className="p-5 text-muted font-mono text-xs font-bold">
                        {license.expires_at ? formatDate(license.expires_at) : "Lifetime"}
                      </td>
                      <td className="p-5">
                        <Link
                          href={`/admin/licenses/${license.id}`}
                          className="text-accent text-xs font-black uppercase tracking-widest hover:underline whitespace-nowrap"
                        >
                          Manage &rarr;
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