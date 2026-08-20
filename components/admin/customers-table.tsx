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
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Customers
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="card-surface overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-16 text-center">
            <Users size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  {["Name", "Email", "First Purchase", "Last Purchase", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left p-4 text-text-muted font-medium"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-bg-elevated/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent-primary text-xs font-bold uppercase">
                            {(customer.name || customer.email)[0]}
                          </span>
                        </div>
                        <span className="text-text-primary font-medium">
                          {customer.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {customer.email}
                    </td>
                    <td className="p-4 text-text-muted text-xs">
                      {formatDate(customer.first_purchase_at)}
                    </td>
                    <td className="p-4 text-text-muted text-xs">
                      {formatDate(customer.last_purchase_at)}
                    </td>
                    <td className="p-4">
                      <a
                        href={`mailto:${customer.email}`}
                        className="flex items-center gap-1 text-accent-primary hover:underline text-xs"
                      >
                        <Mail size={11} />
                        Email
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