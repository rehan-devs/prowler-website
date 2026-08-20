import { supabaseAdmin } from "./supabase";
import { validateAdminSession } from "./admin-auth";
import { cookies } from "next/headers";

/**
 * Get current admin from cookie — use in server components
 */
export async function getAdminFromCookie(): Promise<{
  id: string;
  email: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("prowler_admin_token")?.value;
  if (!token) return null;
  return validateAdminSession(token);
}

/**
 * Fetch dashboard stats
 */
export async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  const [
    { count: totalLicenses },
    { count: activeLicenses },
    { count: pendingOrders },
    { count: totalOrders },
    { data: recentOrders },
    { data: planBreakdown },
    { data: todayOrders },
    { data: monthOrders },
  ] = await Promise.all([
    supabaseAdmin
      .from("licenses")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("licenses")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
    supabaseAdmin
      .from("licenses")
      .select("plan, status"),
    supabaseAdmin
      .from("orders")
      .select("amount_usd")
      .eq("status", "approved")
      .gte("created_at", todayStart),
    supabaseAdmin
      .from("orders")
      .select("amount_usd")
      .eq("status", "approved")
      .gte("created_at", monthStart),
  ]);

  const todayRevenue = (todayOrders || []).reduce(
    (sum, o) => sum + (o.amount_usd || 0),
    0
  );
  const monthRevenue = (monthOrders || []).reduce(
    (sum, o) => sum + (o.amount_usd || 0),
    0
  );

  const breakdown = { basic: 0, pro: 0, elite: 0 };
  (planBreakdown || []).forEach((l) => {
    if (l.plan in breakdown) breakdown[l.plan as keyof typeof breakdown]++;
  });

  return {
    totalLicenses: totalLicenses || 0,
    activeLicenses: activeLicenses || 0,
    pendingOrders: pendingOrders || 0,
    totalApprovedOrders: totalOrders || 0,
    recentOrders: recentOrders || [],
    planBreakdown: breakdown,
    todayRevenue,
    monthRevenue,
  };
}

/**
 * Fetch all orders with filters
 */
export async function getOrders(
  status?: string,
  limit = 50,
  offset = 0
) {
  let query = supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;
  return { orders: data || [], error, count };
}

/**
 * Fetch all licenses with filters
 */
export async function getLicenses(
  status?: string,
  plan?: string,
  search?: string,
  limit = 50,
  offset = 0
) {
  let query = supabaseAdmin
    .from("licenses")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") query = query.eq("status", status);
  if (plan && plan !== "all") query = query.eq("plan", plan);
  if (search) {
    query = query.or(
      `email.ilike.%${search}%,notes.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  return { licenses: data || [], error };
}