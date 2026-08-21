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
  ShoppingCart,
  X,
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
    color: "text-amber-700",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
  approved: {
    icon: CheckCircle,
    color: "text-emerald-700",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-700",
    bg: "bg-red-500/10 border-red-500/30",
  },
  refunded: {
    icon: AlertCircle,
    color: "text-muted",
    bg: "bg-white border-border",
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
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-3">
          Billing Pipeline Review
        </span>
        <h1 className="text-2xl font-display font-black text-foreground tracking-tight flex items-center gap-3">
          <ShoppingCart size={20} className="text-accent" />
          Orders
        </h1>
        <p className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
          Review payment screenshots, verify proof, and provision license tokens
        </p>
      </div>

      {/* Filter and search row */}
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
              placeholder="Search by customer name, email address..."
              className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-xs font-bold placeholder:text-muted focus:outline-none focus:border-accent transition-colors shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4F52D6] transition-all shrink-0"
          >
            Search
          </button>
          {currentSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="flex items-center gap-1.5 px-4 py-3 border border-border rounded-xl text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground bg-white transition-all shrink-0"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </form>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                currentStatus === tab.value
                  ? "bg-accent border-accent text-white"
                  : "bg-white border-border text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search tag indicator */}
      {currentSearch && (
        <div className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
          <span className="text-accent text-xs font-bold">
            Filtering by search query: <strong className="text-foreground">&ldquo;{currentSearch}&rdquo;</strong>
          </span>
          <button
            onClick={clearSearch}
            className="text-xs font-black uppercase tracking-widest text-accent hover:underline"
          >
            Reset query
          </button>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <Filter size={32} className="text-muted mx-auto mb-4" />
            <p className="text-foreground font-black text-lg">No orders found.</p>
            <p className="text-muted text-xs font-bold uppercase tracking-wider mt-1">
              {currentSearch
                ? `No orders match "${currentSearch}".`
                : currentStatus === "pending"
                ? "No pending receipts awaiting audit."
                : "No orders match this status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-background">
                  {[
                    "Customer Details",
                    "Tier Parameter",
                    "Amount",
                    "Gateway",
                    "Type",
                    "Status",
                    "Submitted",
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
                      transition={{ delay: i * 0.015 }}
                      className="hover:bg-background/30 transition-colors"
                    >
                      {/* Customer */}
                      <td className="p-5">
                        <p className="text-foreground font-black tracking-tight text-sm">
                          {order.customer_name}
                        </p>
                        <p className="text-muted text-xs font-semibold">
                          {order.customer_email}
                        </p>
                      </td>

                      {/* Plan */}
                      <td className="p-5">
                        <span className="text-foreground text-xs font-black uppercase tracking-wider">
                          {order.plan}
                        </span>
                        <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-0.5">
                          {order.plan_duration} &middot;{" "}
                          {order.devices === "1" ? "1 device" : "Unlimited"}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="p-5 text-foreground font-black text-sm">
                        ${order.amount_usd}
                      </td>

                      {/* Payment */}
                      <td className="p-5 text-muted text-xs font-black uppercase tracking-wider">
                        {order.payment_method}
                      </td>

                      {/* Type Badge */}
                      <td className="p-5">
                        {order.is_renewal ? (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                            Renewal
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20">
                            New
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-5">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${sc.bg} ${sc.color}`}
                        >
                          <StatusIcon size={10} strokeWidth={3} />
                          <span>{order.status}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-5 text-muted font-mono text-xs font-bold whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>

                      {/* Action */}
                      <td className="p-5">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-accent text-xs font-black uppercase tracking-widest hover:underline whitespace-nowrap"
                        >
                          <Eye size={12} />
                          Review &rarr;
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