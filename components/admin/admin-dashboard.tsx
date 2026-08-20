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
    color: "text-accent-gold",
    bg: "bg-accent-gold/10",
    label: "Pending",
  },
  approved: {
    icon: CheckCircle,
    color: "text-accent-success",
    bg: "bg-accent-success/10",
    label: "Approved",
  },
  rejected: {
    icon: XCircle,
    color: "text-accent-hot",
    bg: "bg-accent-hot/10",
    label: "Rejected",
  },
  refunded: {
    icon: AlertCircle,
    color: "text-text-muted",
    bg: "bg-bg-elevated",
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card-surface p-6 hover:border-border-glow transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex items-center gap-1">
          {trend === "up" && (
            <TrendingUp size={14} className="text-accent-success" />
          )}
          {trend === "down" && (
            <TrendingDown size={14} className="text-accent-hot" />
          )}
          {href && (
            <span className="text-text-muted text-xs group-hover:text-accent-primary transition-colors">
              View →
            </span>
          )}
        </div>
      </div>
      <div className="font-display font-bold text-3xl text-text-primary mb-1">
        {value}
      </div>
      <div className="text-text-secondary text-sm">{title}</div>
      {subtitle && (
        <div className="text-text-muted text-xs mt-1">{subtitle}</div>
      )}
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function RevenueChart({
  data,
}: {
  data: RevenueEntry[];
}) {
  const chartData = useMemo(() => {
    const days: Record<string, number> = {};

    // Initialize all 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split("T")[0];
      days[key] = 0;
    }

    // Fill in actual revenue
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
      transition={{ delay: 0.2 }}
      className="card-surface p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display font-semibold text-text-primary">
            Revenue — Last 30 Days
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Total: ${totalRevenue}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-accent-success/10 border border-accent-success/30 px-3 py-1 rounded-full">
          <TrendingUp size={12} className="text-accent-success" />
          <span className="text-accent-success text-xs font-medium">
            ${totalRevenue}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 flex items-end gap-[3px]">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none w-10">
          <span className="text-text-muted text-xs">${maxAmount}</span>
          <span className="text-text-muted text-xs">
            ${Math.round(maxAmount / 2)}
          </span>
          <span className="text-text-muted text-xs">$0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-0 bottom-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 border-t border-border" />
          <div className="absolute top-1/2 left-0 right-0 border-t border-border opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 border-t border-border" />
        </div>

        {/* Bars */}
        <div className="flex items-end gap-[3px] flex-1 ml-12 h-full">
          {chartData.map((day, i) => {
            const heightPct = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
            const hasRevenue = day.amount > 0;

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 bg-bg-elevated border border-border rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <p className="text-text-primary text-xs font-medium">
                    ${day.amount}
                  </p>
                  <p className="text-text-muted text-xs">{day.label}</p>
                </div>

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPct, 2)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  className={`w-full rounded-t-sm transition-colors duration-200 ${
                    hasRevenue
                      ? "bg-accent-primary group-hover:bg-accent-primary/80"
                      : "bg-border group-hover:bg-border-glow"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex ml-12 mt-2">
        <div className="flex-1 text-left">
          <span className="text-text-muted text-xs">
            {chartData[0]?.label}
          </span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-text-muted text-xs">
            {chartData[14]?.label}
          </span>
        </div>
        <div className="flex-1 text-right">
          <span className="text-text-muted text-xs">
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
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Welcome back. Here is what is happening with Prowler.io.
        </p>
      </div>

      {/* Pending alert */}
      {stats.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-accent-gold/10 border border-accent-gold/30 rounded-xl px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-accent-gold" />
            <p className="text-accent-gold font-medium text-sm">
              {stats.pendingOrders} order
              {stats.pendingOrders > 1 ? "s" : ""} waiting for review
            </p>
          </div>
          <Link
            href="/admin/orders?status=pending"
            className="text-accent-gold text-sm font-semibold hover:underline"
          >
            Review now →
          </Link>
        </motion.div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue Today"
          value={`$${stats.todayRevenue}`}
          icon={DollarSign}
          color="#38ef7d"
          delay={0}
          trend={stats.todayRevenue > 0 ? "up" : null}
        />
        <StatCard
          title="Revenue This Month"
          value={`$${stats.monthRevenue}`}
          icon={DollarSign}
          color="#667eea"
          delay={0.05}
          trend={stats.monthRevenue > 0 ? "up" : null}
        />
        <StatCard
          title="Active Licenses"
          value={stats.activeLicenses}
          subtitle={`${stats.totalLicenses} total`}
          icon={Key}
          color="#764ba2"
          href="/admin/licenses"
          delay={0.1}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle={`${stats.totalApprovedOrders} approved total`}
          icon={ShoppingCart}
          color="#ff6464"
          href="/admin/orders?status=pending"
          delay={0.15}
        />
      </div>

      {/* Revenue chart */}
      <RevenueChart data={revenueData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 card-surface overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-display font-semibold text-text-primary">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-accent-primary text-xs hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                No orders yet
              </div>
            ) : (
              stats.recentOrders.map((order) => {
                const sc =
                  statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = sc.icon;
                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-bg-elevated transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sc.bg}`}
                    >
                      <StatusIcon size={14} className={sc.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm font-medium truncate">
                        {order.customer_name}
                        {order.is_renewal && (
                          <span className="ml-2 text-xs bg-accent-purple/20 text-accent-purple px-1.5 py-0.5 rounded-full">
                            Renewal
                          </span>
                        )}
                      </p>
                      <p className="text-text-muted text-xs truncate">
                        {order.customer_email}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-text-primary text-sm font-semibold">
                        ${order.amount_usd}
                      </p>
                      <p className="text-text-muted text-xs capitalize">
                        {order.plan}{" "}
                        {order.plan_duration === "lifetime" ? "LT" : "/mo"}
                      </p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full font-medium ${sc.bg} ${sc.color}`}
                    >
                      {sc.label}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Plan breakdown */}
        <div className="card-surface p-5">
          <h2 className="font-display font-semibold text-text-primary mb-6">
            License Breakdown
          </h2>
          <div className="space-y-4">
            {(
              [
                { key: "basic", label: "Basic", color: "#667eea" },
                { key: "pro", label: "Pro", color: "#764ba2" },
                { key: "elite", label: "Elite", color: "#ff6464" },
              ] as const
            ).map(({ key, label, color }) => {
              const count = stats.planBreakdown[key];
              const pct = Math.round((count / planTotal) * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-text-secondary">{label}</span>
                    <span className="text-text-primary font-medium">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <p className="text-text-muted text-xs mt-1">{pct}%</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Link
              href="/admin/generate"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-accent text-white rounded-xl text-sm font-semibold hover:shadow-[0_8px_30px_rgba(102,126,234,0.3)] transition-all duration-300"
            >
              <Key size={14} />
              Generate New Key
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}