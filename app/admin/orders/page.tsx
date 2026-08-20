import { supabaseAdmin } from "@/lib/supabase";
import { OrdersTable } from "@/components/admin/orders-table";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "all";

  let query = supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: orders } = await query;

  return <OrdersTable orders={orders || []} currentStatus={status} />;
}