import { getDashboardStats } from "@/lib/admin-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  // Get revenue data for last 30 days
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: revenueData } = await supabaseAdmin
    .from("orders")
    .select("amount_usd, created_at")
    .eq("status", "approved")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: true });

  return <AdminDashboard stats={stats} revenueData={revenueData || []} />;
}