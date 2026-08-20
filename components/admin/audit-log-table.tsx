"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield,
  ChevronLeft,
  ChevronRight,
  Key,
  ShoppingCart,
  Download,
  RefreshCw,
  Ban,
  CheckCircle,
  Eye,
  Trash2,
  FileText,
} from "lucide-react";

interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

const actionIcons: Record<string, React.ElementType> = {
  approved_order: CheckCircle,
  rejected_order: Ban,
  generated_license: Key,
  updated_license: RefreshCw,
  exported_licenses: Download,
  bulk_suspended: Ban,
  bulk_revoked: Trash2,
  bulk_activated: CheckCircle,
  bulk_reset_hardware: RefreshCw,
  viewed_screenshot: Eye,
};

const actionColors: Record<string, string> = {
  approved_order: "#38ef7d",
  rejected_order: "#ff6464",
  generated_license: "#667eea",
  updated_license: "#764ba2",
  exported_licenses: "#47C9FF",
  bulk_suspended: "#f7e479",
  bulk_revoked: "#ff6464",
  bulk_activated: "#38ef7d",
  bulk_reset_hardware: "#764ba2",
  viewed_screenshot: "#888899",
};

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AuditLogTable({
  logs,
  totalCount,
  currentPage,
  perPage,
  currentAction,
  availableActions,
}: {
  logs: AuditLog[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  currentAction: string;
  availableActions: string[];
}) {
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / perPage);

  const handleActionFilter = (action: string) => {
    const params = new URLSearchParams();
    if (action !== "all") params.set("action", action);
    router.push(`/admin/audit?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentAction !== "all") params.set("action", currentAction);
    params.set("page", page.toString());
    router.push(`/admin/audit?${params.toString()}`);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDetails = (details: Record<string, unknown> | null): string => {
    if (!details) return "";
    const entries = Object.entries(details);
    if (entries.length === 0) return "";
    return entries
      .map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
      .join(" · ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary flex items-center gap-2">
          <Shield size={20} className="text-accent-primary" />
          Audit Log
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {totalCount} total event{totalCount !== 1 ? "s" : ""} recorded
        </p>
      </div>

      {/* Action filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleActionFilter("all")}
          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
            currentAction === "all"
              ? "bg-accent-primary/15 text-accent-primary border-accent-primary/30"
              : "bg-bg-surface border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          All Actions
        </button>
        {availableActions.map((action) => (
          <button
            key={action}
            onClick={() => handleActionFilter(action)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
              currentAction === action
                ? "bg-accent-primary/15 text-accent-primary border-accent-primary/30"
                : "bg-bg-surface border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {formatAction(action)}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="card-surface overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-16 text-center">
            <Shield size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">
              No audit events found
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log, i) => {
              const Icon =
                actionIcons[log.action] || FileText;
              const color = actionColors[log.action] || "#888899";

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-4 p-4 hover:bg-bg-elevated/50 transition-colors"
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-text-primary text-sm font-medium">
                          {formatAction(log.action)}
                        </p>
                        <p className="text-text-muted text-xs mt-0.5">
                          by{" "}
                          <span className="text-text-secondary">
                            {log.admin_email}
                          </span>
                        </p>
                      </div>
                      <p className="text-text-muted text-xs flex-shrink-0 text-right">
                        {formatDate(log.created_at)}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {log.target_type && (
                        <span className="bg-bg-elevated border border-border rounded-md px-2 py-0.5 text-xs text-text-muted">
                          {log.target_type}
                        </span>
                      )}
                      {log.target_id && (
                        <span className="bg-bg-elevated border border-border rounded-md px-2 py-0.5 text-xs text-text-muted font-mono truncate max-w-48">
                          {log.target_id.length > 36
                            ? `${log.target_id.slice(0, 36)}...`
                            : log.target_id}
                        </span>
                      )}
                    </div>

                    {/* Expanded details */}
                    {log.details &&
                      Object.keys(log.details).length > 0 && (
                        <div className="mt-2 bg-bg-elevated border border-border rounded-lg p-3">
                          <pre className="text-text-muted text-xs font-mono whitespace-pre-wrap break-all">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-text-muted text-xs">
              Page {currentPage} of {totalPages} · {totalCount} total events
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-text-secondary text-xs hover:border-border-glow hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={12} />
                Prev
              </button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-accent-primary text-white"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-text-secondary text-xs hover:border-border-glow hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}