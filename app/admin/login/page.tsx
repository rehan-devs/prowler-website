import { AdminLoginForm } from "@/components/admin/admin-login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — Prowler.io",
  robots: "noindex, nofollow",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center p-4">
      <AdminLoginForm />
    </div>
  );
}