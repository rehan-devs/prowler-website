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
  approved_order: "#10B981",
  rejected_order: "#EF4444",
  generated_license: "#6366F1",
  updated_license: "#8B5CF6",
  exported_licenses: "#0EA5E9",
  bulk_suspended: "#F59E0B",
  bulk_revoked: "#EF4444",
  bulk_activated: "#10B981",
  bulk_reset_hardware: "#6366F1",
  viewed_screenshot: "#6B6B6B",
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
    });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-3">
          Security Audits
        </span>
        <h1 className="text-2xl font-display font-black text-foreground tracking-tight flex items-center gap-3">
          <Shield size={20} className="text-accent" />
          Audit Log
        </h1>
        <p className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
          {totalCount} events indexed overall
        </p>
      </div>

      {/* Action filters */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => handleActionFilter("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
            currentAction === "all"
              ? "bg-accent border-accent text-white"
              : "bg-white border-border text-muted hover:text-foreground"
          }`}
        >
          All Events
        </button>
        {availableActions.map((action) => (
          <button
            key={action}
            onClick={() => handleActionFilter(action)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              currentAction === action
                ? "bg-accent border-accent text-white"
                : "bg-white border-border text-muted hover:text-foreground"
            }`}
          >
            {formatAction(action)}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-16 text-center">
            <Shield size={32} className="text-muted mx-auto mb-4" />
            <p className="text-foreground font-black text-lg">No security events match criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {logs.map((log, i) => {
              const Icon = actionIcons[log.action] || FileText;
              const color = actionColors[log.action] || "#6B6B6B";

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.015 }}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-6 hover:bg-background/30 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={16} style={{ color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-foreground text-sm font-black tracking-tight">
                          {formatAction(log.action)}
                        </p>
                        <p className="text-muted text-[10px] font-bold uppercase tracking-widest">
                          by {log.admin_email}
                        </p>
                      </div>

                      {/* Details row metadata */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {log.target_type && (
                          <span className="bg-background border border-border rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-muted">
                            {log.target_type}
                          </span>
                        )}
                        {log.target_id && (
                          <span className="bg-background border border-border rounded-lg px-2.5 py-0.5 text-[10px] font-mono text-foreground tracking-tight truncate max-w-xs">
                            {log.target_id}
                          </span>
                        )}
                        {log.ip_address && (
                          <span className="bg-background border border-border rounded-lg px-2.5 py-0.5 text-[10px] font-mono text-muted tracking-tight">
                            IP: {log.ip_address}
                          </span>
                        )}
                      </div>

                      {/* Preformatted details metadata */}
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-3 bg-background border border-border/80 rounded-xl p-4 overflow-x-auto">
                          <pre className="text-foreground text-[11px] font-mono whitespace-pre-wrap break-all">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-muted text-xs font-bold uppercase tracking-widest shrink-0 md:text-right">
                    {formatDate(log.created_at)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border/60 bg-white">
            <p className="text-muted text-xs font-bold uppercase tracking-widest">
              Page {currentPage} of {totalPages} &middot; {totalCount} total entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 px-4 py-2 border border-border rounded-full text-foreground hover:border-accent text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border"
              >
                <ChevronLeft size={12} />
                Prev
              </button>

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
                      className={`w-8 h-8 rounded-full text-xs font-black transition-all ${
                        currentPage === pageNum
                          ? "bg-accent text-white"
                          : "text-muted hover:text-foreground hover:bg-background"
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
                className="flex items-center gap-1 px-4 py-2 border border-border rounded-full text-foreground hover:border-accent text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border"
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