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
  Zap,
  ChevronRight,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: "pending" },
  { href: "/admin/licenses", label: "Licenses", icon: Key },
  { href: "/admin/generate", label: "Generate Key", icon: PlusSquare },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/audit", label: "Audit Log", icon: Shield },
];

function NavItem({
  item,
  pendingCount,
  onNavigate,
}: {
  item: (typeof navItems)[0];
  pendingCount?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 group ${
        isActive
          ? "bg-accent text-white"
          : "text-muted hover:text-foreground hover:bg-white border border-transparent hover:border-border"
      }`}
    >
      <Icon size={14} />
      <span>{item.label}</span>
      {item.badge === "pending" && pendingCount && pendingCount > 0 ? (
        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {pendingCount}
        </span>
      ) : (
        isActive && (
          <ChevronRight size={12} className="ml-auto text-white/70" />
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
  const [pendingCount] = useState(0);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full bg-white border-r border-border">
      {/* Branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/60">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        <div>
          <span className="font-display font-black text-foreground text-sm tracking-tight block">
            Prowler<span className="text-accent">.io</span>
          </span>
          <p className="text-muted text-[9px] font-black uppercase tracking-widest">Admin Control</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            pendingCount={pendingCount}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Footer Meta */}
      <div className="p-4 border-t border-border/60">
        <div className="flex items-center gap-3 px-3 py-2 mb-3 bg-background border border-border rounded-xl">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <span className="text-accent text-xs font-black uppercase">
              {adminEmail?.[0] || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-[11px] font-black truncate leading-tight">
              {adminEmail || "Administrator"}
            </p>
            <p className="text-muted text-[8px] font-bold uppercase tracking-widest mt-0.5">Admin Operator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100/60 border border-red-200/50 text-red-700 rounded-full text-xs font-black uppercase tracking-widest transition-colors"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/45 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden"
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content Space */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Navbar */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-foreground hover:text-accent transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-display font-black text-foreground text-sm uppercase tracking-wider">
            Admin Console
          </span>
          <div className="w-8" />
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}