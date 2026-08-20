import { supabaseAdmin } from "@/lib/supabase";
import { OrdersTable } from "@/components/admin/orders-table";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const status = searchParams.status || "all";
  const search = searchParams.search || "";

  let query = supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`
    );
  }

  const { data: orders } = await query;

  return (
    <OrdersTable
      orders={orders || []}
      currentStatus={status}
      currentSearch={search}
    />
  );
}