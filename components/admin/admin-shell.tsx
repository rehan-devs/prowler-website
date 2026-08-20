"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Key,
  ShoppingCart,
  Users,
  PlusSquare,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
  Shield,
} from "lucide-react";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
    badge: "pending",
  },
  {
    href: "/admin/licenses",
    label: "Licenses",
    icon: Key,
  },
  {
    href: "/admin/generate",
    label: "Generate Key",
    icon: PlusSquare,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/audit",
    label: "Audit Log",
    icon: Shield,
  },
];

function NavItem({
  item,
  pendingCount,
}: {
  item: (typeof navItems)[0];
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
        isActive
          ? "bg-accent-primary/15 text-accent-primary"
          : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
      }`}
    >
      <Icon size={16} />
      <span>{item.label}</span>
      {item.badge === "pending" && pendingCount && pendingCount > 0 ? (
        <span className="ml-auto bg-accent-hot text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {pendingCount}
        </span>
      ) : (
        isActive && (
          <ChevronRight size={12} className="ml-auto text-accent-primary" />
        )
      )}
    </Link>
  );
}

export function AdminShell({
  children,
  adminEmail,
}: {
  children: React.ReactNode;
  adminEmail: string;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount] = useState(0); // Will be updated by dashboard

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <div>
          <span className="font-display font-bold text-text-primary text-sm">
            Prowler<span className="text-accent-primary">.io</span>
          </span>
          <p className="text-text-muted text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} pendingCount={pendingCount} />
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <span className="text-accent-primary text-xs font-bold uppercase">
              {adminEmail[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-xs font-medium truncate">
              {adminEmail}
            </p>
            <p className="text-text-muted text-xs">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-hot hover:bg-accent-hot/10 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-deep flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-bg-surface border-r border-border fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 left-0 w-60 bg-bg-surface border-r border-border z-50 lg:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-bg-surface border-b border-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-text-secondary hover:text-text-primary"
          >
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-text-primary text-sm">
            Admin
          </span>
          <div className="w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}