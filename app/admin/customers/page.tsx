import { supabaseAdmin } from "@/lib/supabase";
import { CustomersTable } from "@/components/admin/customers-table";

export default async function CustomersPage() {
  const { data: customers } = await supabaseAdmin
    .from("customers")
    .select("*")
    .order("last_purchase_at", { ascending: false })
    .limit(100);

  return <CustomersTable customers={customers || []} />;
}