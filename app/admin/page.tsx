import { getDashboardStats } from "@/lib/admin-helpers";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  return <AdminDashboard stats={stats} />;
}