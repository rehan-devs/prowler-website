"use client";

import { motion } from "framer-motion";
import { Users, Mail } from "lucide-react";

interface Customer {
  id: string;
  email: string;
  name: string | null;
  total_spent_cents: number;
  first_purchase_at: string;
  last_purchase_at: string;
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted block mb-3">
          Customer Directory
        </span>
        <h1 className="text-2xl font-display font-black text-foreground tracking-tight flex items-center gap-3">
          <Users size={20} className="text-accent" />
          Customers
        </h1>
        <p className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
          {customers.length} registered customers total
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-16 text-center">
            <Users size={32} className="text-muted mx-auto mb-4" />
            <p className="text-foreground font-black text-lg">No clients indexed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-background">
                  {["Identifier / Name", "Delivery Email", "First Order", "Last Order", "Channel"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left p-5 text-muted text-[10px] font-black uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {customers.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.015 }}
                    className="hover:bg-background/30 transition-colors"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                          <span className="text-accent text-xs font-black uppercase">
                            {(customer.name || customer.email)[0]}
                          </span>
                        </div>
                        <span className="text-foreground font-black tracking-tight text-sm">
                          {customer.name || "System Record"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-muted font-medium text-sm">
                      {customer.email}
                    </td>
                    <td className="p-5 text-muted font-mono text-xs font-bold">
                      {formatDate(customer.first_purchase_at)}
                    </td>
                    <td className="p-5 text-muted font-mono text-xs font-bold">
                      {formatDate(customer.last_purchase_at)}
                    </td>
                    <td className="p-5">
                      <a
                        href={`mailto:${customer.email}`}
                        className="inline-flex items-center gap-1.5 text-accent text-xs font-black uppercase tracking-widest hover:underline"
                      >
                        <Mail size={12} />
                        Contact
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}