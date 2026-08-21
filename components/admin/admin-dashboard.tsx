"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Key,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { InlineAnnotation } from "@/components/ui/visual-anchors";

interface DashboardStats {
  totalLicenses: number;
  activeLicenses: number;
  pendingOrders: number;
  totalApprovedOrders: number;
  recentOrders: Array<{
    id: string;
    customer_name: string;
    customer_email: string;
    plan: string;
    plan_duration: string;
    devices: string;
    amount_usd: number;
    status: string;
    created_at: string;
    is_renewal: boolean;
  }>;
  planBreakdown: { basic: number; pro: number; elite: number };
  todayRevenue: number;
  monthRevenue: number;
}

interface RevenueEntry {
  amount_usd: number;
  created_at: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-500/10 border-amber-500/20",
    label: "Pending",
  },
  approved: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    label: "Approved",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-500/10 border-red-500/20",
    label: "Rejected",
  },
  refunded: {
    icon: AlertCircle,
    color: "text-muted",
    bg: "bg-white border-border",
    label: "Refunded",
  },
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  href,
  delay,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  href?: string;
  delay: number;
  trend?: "up" | "down" | null;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-border rounded-2xl p-6 hover:border-accent hover:shadow-sm transition-all duration-300 group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex items-center gap-1.5">
          {trend === "up" && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 uppercase tracking-wider">
              <TrendingUp size={10} /> Up
            </span>
          )}
          {trend === "down" && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-700 uppercase tracking-wider">
              <TrendingDown size={10} /> Down
            </span>
          )}
          {href && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-accent transition-colors">
              Manage &rarr;
            </span>
          )}
        </div>
      </div>
      <div className="font-display font-black text-3xl text-foreground tracking-tight mb-1">
        {value}
      </div>
      <div className="text-muted text-xs font-bold uppercase tracking-wider">{title}</div>
      {subtitle && (
        <div className="text-muted/65 text-[11px] font-semibold mt-1">{subtitle}</div>
      )}
    </motion.div>
  );

  return href ? <Link href={href} className="block">{content}</Link> : content;
}

function RevenueChart({ data }: { data: RevenueEntry[] }) {
  const chartData = useMemo(() => {
    const days: Record<string, number> = {};

    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split("T")[0];
      days[key] = 0;
    }

    data.forEach((entry) => {
      const key = new Date(entry.created_at).toISOString().split("T")[0];
      if (key in days) {
        days[key] += entry.amount_usd;
      }
    });

    return Object.entries(days).map(([date, amount]) => ({
      date,
      amount,
      label: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);
  const totalRevenue = chartData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-black text-xl text-foreground tracking-tight">
            Revenue Over Time
          </h2>
          <p className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
            Running 30 Day Total Balance
          </p>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-full">
          <TrendingUp size={13} className="text-accent" />
          <span className="text-accent text-xs font-black tracking-widest uppercase">
            ${totalRevenue.toLocaleString()} Total
          </span>
        </div>
      </div>

      <div className="relative h-48 flex items-end gap-1">
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none w-12 border-r border-border/40 pr-2">
          <span className="text-muted text-[10px] font-black font-mono">${maxAmount}</span>
          <span className="text-muted text-[10px] font-black font-mono">${Math.round(maxAmount / 2)}</span>
          <span className="text-muted text-[10px] font-black font-mono">$0</span>
        </div>

        {/* Bars Container */}
        <div className="flex items-end gap-[4px] flex-1 ml-14 h-full relative">
          {chartData.map((day, i) => {
            const heightPct = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
            const hasRevenue = day.amount > 0;

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 bg-foreground text-background text-[10px] font-black uppercase tracking-wider rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-15 whitespace-nowrap shadow-sm">
                  <p className="font-mono">${day.amount}</p>
                  <p className="opacity-70 text-[8px]">{day.label}</p>
                </div>

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPct, 3)}%` }}
                  transition={{ duration: 0.6, delay: i * 0.015, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full rounded-t-md transition-colors duration-200 ${
                    hasRevenue
                      ? "bg-accent group-hover:bg-[#4F52D6]"
                      : "bg-border/45 group-hover:bg-border/80"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis */}
      <div className="flex ml-14 mt-4 pt-3 border-t border-border/45">
        <div className="flex-1 text-left">
          <span className="text-muted text-[10px] font-black uppercase tracking-widest">
            {chartData[0]?.label}
          </span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-muted text-[10px] font-black uppercase tracking-widest">
            {chartData[14]?.label}
          </span>
        </div>
        <div className="flex-1 text-right">
          <span className="text-muted text-[10px] font-black uppercase tracking-widest">
            {chartData[chartData.length - 1]?.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function AdminDashboard({
  stats,
  revenueData,
}: {
  stats: DashboardStats;
  revenueData: RevenueEntry[];
}) {
  const planTotal =
    stats.planBreakdown.basic +
    stats.planBreakdown.pro +
    stats.planBreakdown.elite || 1;

  return (
    <div className="space-y-8">
      
      {/* Hero Banner Title */}
      <div className="relative pb-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-3">
          Overview Control Matrix
        </span>
        <h1 className="text-display-sm font-display font-black text-foreground tracking-tight leading-none">
          Welcome back,{" "}
          <span className="relative inline-block">
            admin
            <span className="hidden md:block absolute top-0 right-0 w-0 h-0">
              <InlineAnnotation
                text="system fully active"
                delay={0.4}
                path="M 0,0 Q 45,-40 105,-18"
                svgStyles={{ top: "5%", left: "80%" }}
                textStyles={{
                  top: "-12px",
                  left: "115px",
                  transform: "rotate(5deg)",
                }}
              />
            </span>
          </span>
          .
        </h1>
      </div>

      {/* Review Banner Alert */}
      {stats.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-2xl px-6 py-4 gap-4"
        >
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-amber-600" />
            <p className="text-amber-900 font-bold text-sm tracking-tight">
              Action Required: {stats.pendingOrders} order{stats.pendingOrders > 1 ? "s" : ""} awaiting billing proof audit
            </p>
          </div>
          <Link
            href="/admin/orders?status=pending"
            className="text-amber-800 text-xs font-black uppercase tracking-widest hover:underline whitespace-nowrap"
          >
            Review receipts &rarr;
          </Link>
        </motion.div>
      )}

      {/* Grid Status Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue Today"
          value={`$${stats.todayRevenue}`}
          icon={DollarSign}
          color="#10B981"
          delay={0}
          trend={stats.todayRevenue > 0 ? "up" : null}
        />
        <StatCard
          title="Monthly Volume"
          value={`$${stats.monthRevenue}`}
          icon={DollarSign}
          color="#6366F1"
          delay={0.05}
          trend={stats.monthRevenue > 0 ? "up" : null}
        />
        <StatCard
          title="Active Licenses"
          value={stats.activeLicenses}
          subtitle={`${stats.totalLicenses} registered total`}
          icon={Key}
          color="#8B5CF6"
          href="/admin/licenses"
          delay={0.1}
        />
        <StatCard
          title="Audit Backlog"
          value={stats.pendingOrders}
          subtitle={`${stats.totalApprovedOrders} processed orders`}
          icon={ShoppingCart}
          color="#EF4444"
          href="/admin/orders?status=pending"
          delay={0.15}
        />
      </div>

      {/* Visualization Chart */}
      <RevenueChart data={revenueData} />

      {/* Multi-column Grid Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Card */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-border/60">
            <div>
              <h2 className="font-display font-black text-lg text-foreground tracking-tight">
                Billing Receipts Queue
              </h2>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-0.5">
                Latest transactions
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-accent text-xs font-black uppercase tracking-widest hover:underline"
            >
              See catalog &rarr;
            </Link>
          </div>
          <div className="divide-y divide-border/60 flex-1">
            {stats.recentOrders.length === 0 ? (
              <div className="p-12 text-center text-muted text-sm font-semibold">
                No purchases found in queue.
              </div>
            ) : (
              stats.recentOrders.map((order) => {
                const sc = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = sc.icon;
                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-background/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${sc.bg}`}>
                        <StatusIcon size={14} className={sc.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground text-sm font-black tracking-tight truncate flex items-center gap-2">
                          {order.customer_name}
                          {order.is_renewal && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                              Renewal
                            </span>
                          )}
                        </p>
                        <p className="text-muted text-xs font-semibold truncate">
                          {order.customer_email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-0 pt-3 sm:pt-0 border-border/40">
                      <div className="sm:text-right">
                        <p className="text-foreground text-sm font-black tracking-tight">
                          ${order.amount_usd}
                        </p>
                        <p className="text-muted text-[10px] font-bold uppercase tracking-wider">
                          {order.plan} &middot; {order.plan_duration === "lifetime" ? "LT" : "MO"}
                        </p>
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* License Breakdown Card */}
        <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-display font-black text-lg text-foreground tracking-tight mb-2">
              License Breakdown
            </h2>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-8">
              Distribution of configurations
            </p>
            <div className="space-y-6">
              {(
                [
                  { key: "basic", label: "Basic Tier", color: "#6366F1" },
                  { key: "pro", label: "Professional", color: "#8B5CF6" },
                  { key: "elite", label: "Elite Access", color: "#EF4444" },
                ] as const
              ).map(({ key, label, color }) => {
                const count = stats.planBreakdown[key];
                const pct = Math.round((count / planTotal) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-foreground text-sm font-black tracking-tight">{label}</span>
                      <span className="text-muted text-xs font-mono font-bold">
                        {count} keys ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 bg-background border border-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Link
              href="/admin/generate"
              className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#4F52D6] transition-colors"
            >
              <Key size={13} />
              Generate License
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}