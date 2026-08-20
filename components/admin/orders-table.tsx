"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
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
  created_at: string;
  notes: string | null;
}

const statusTabs = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-accent-gold",
    bg: "bg-accent-gold/10 border-accent-gold/30",
  },
  approved: {
    icon: CheckCircle,
    color: "text-accent-success",
    bg: "bg-accent-success/10 border-accent-success/30",
  },
  rejected: {
    icon: XCircle,
    color: "text-accent-hot",
    bg: "bg-accent-hot/10 border-accent-hot/30",
  },
  refunded: {
    icon: AlertCircle,
    color: "text-text-muted",
    bg: "bg-bg-elevated border-border",
  },
};

export function OrdersTable({
  orders,
  currentStatus,
  currentSearch,
}: {
  orders: Order[];
  currentStatus: string;
  currentSearch: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (currentStatus !== "all") params.set("status", currentStatus);
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status !== "all") params.set("status", status);
    router.push(`/admin/orders?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");
    const params = new URLSearchParams();
    if (currentStatus !== "all") params.set("status", currentStatus);
    router.push(`/admin/orders?${params.toString()}`);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Orders
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Review payment screenshots and approve licenses
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-accent-primary/15 border border-accent-primary/30 text-accent-primary rounded-xl text-sm font-medium hover:bg-accent-primary/25 transition-all"
        >
          Search
        </button>
        {currentSearch && (
          <button
            type="button"
            onClick={clearSearch}
            className="px-3 py-2.5 border border-border rounded-xl text-text-muted text-sm hover:text-text-primary hover:border-border-glow transition-all"
          >
            Clear
          </button>
        )}
      </form>

      {/* Current search indicator */}
      {currentSearch && (
        <div className="flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/30 rounded-xl px-4 py-2">
          <Search size={12} className="text-accent-primary" />
          <span className="text-accent-primary text-sm">
            Showing results for &ldquo;{currentSearch}&rdquo;
          </span>
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              currentStatus === tab.value
                ? "bg-accent-primary/15 text-accent-primary border border-accent-primary/30"
                : "bg-bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-surface overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <Filter size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No orders found</p>
            <p className="text-text-muted text-sm mt-1">
              {currentSearch
                ? `No orders match "${currentSearch}".`
                : currentStatus === "pending"
                ? "No pending orders right now."
                : "No orders match this filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  {[
                    "Customer",
                    "Plan",
                    "Amount",
                    "Payment",
                    "Type",
                    "Status",
                    "Date",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left p-4 text-text-muted font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order, i) => {
                  const sc =
                    statusConfig[order.status as keyof typeof statusConfig] ||
                    statusConfig.pending;
                  const StatusIcon = sc.icon;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-bg-elevated/50 transition-colors"
                    >
                      <td className="p-4">
                        <p className="text-text-primary font-medium">
                          {order.customer_name}
                        </p>
                        <p className="text-text-muted text-xs">
                          {order.customer_email}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="capitalize text-text-primary font-medium">
                          {order.plan}
                        </span>
                        <p className="text-text-muted text-xs capitalize">
                          {order.plan_duration} ·{" "}
                          {order.devices === "1"
                            ? "1 device"
                            : "Unlimited"}
                        </p>
                      </td>
                      <td className="p-4 text-text-primary font-semibold">
                        ${order.amount_usd}
                      </td>
                      <td className="p-4 text-text-secondary capitalize">
                        {order.payment_method}
                      </td>
                      <td className="p-4">
                        {order.is_renewal ? (
                          <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full font-medium">
                            Renewal
                          </span>
                        ) : (
                          <span className="text-xs bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-full font-medium">
                            New
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${sc.bg} ${sc.color}`}
                        >
                          <StatusIcon size={10} />
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-muted text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="flex items-center gap-1 text-accent-primary hover:underline text-xs font-medium"
                        >
                          <Eye size={12} />
                          Review
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