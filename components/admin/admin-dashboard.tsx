"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Key,
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  href?: string;
  delay: number;
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
        {href && (
          <span className="text-text-muted text-xs group-hover:text-accent-primary transition-colors">
            View all →
          </span>
        )}
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

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export function AdminDashboard({ stats }: { stats: DashboardStats }) {
  const planTotal =
    stats.planBreakdown.basic +
    stats.planBreakdown.pro +
    stats.planBreakdown.elite || 1;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Welcome back. Here is what is happening with Prowler.io.
        </p>
      </div>

      {/* Pending orders alert */}
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
        />
        <StatCard
          title="Revenue This Month"
          value={`$${stats.monthRevenue}`}
          icon={DollarSign}
          color="#667eea"
          delay={0.05}
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