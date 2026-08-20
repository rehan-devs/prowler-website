"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Key,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  Ban,
  CheckCircle,
  Clock,
  XCircle,
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
    if (key !== "status")
      params.set("status", currentStatus !== "all" ? currentStatus : "");
    if (key !== "plan")
      params.set("plan", currentPlan !== "all" ? currentPlan : "");
    params.set(key, value);
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
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Licenses
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {licenses.length} license{licenses.length !== 1 ? "s" : ""} found
        </p>
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

        {/* Status filter */}
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

        {/* Plan filter */}
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

                  return (
                    <motion.tr
                      key={license.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-bg-elevated/50 transition-colors"
                    >
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