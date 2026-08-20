import { supabaseAdmin } from "@/lib/supabase";
import { AuditLogTable } from "@/components/admin/audit-log-table";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: { action?: string; page?: string };
}) {
  const actionFilter = searchParams.action || "all";
  const page = parseInt(searchParams.page || "1");
  const perPage = 50;
  const offset = (page - 1) * perPage;

  let query = supabaseAdmin
    .from("admin_audit_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (actionFilter !== "all") {
    query = query.eq("action", actionFilter);
  }

  const { data: logs, count } = await query;

  // Get distinct actions for filter
  const { data: actionTypes } = await supabaseAdmin
    .from("admin_audit_log")
    .select("action")
    .order("action");

  const uniqueActions = [
    ...new Set((actionTypes || []).map((a) => a.action)),
  ];

  return (
    <AuditLogTable
      logs={logs || []}
      totalCount={count || 0}
      currentPage={page}
      perPage={perPage}
      currentAction={actionFilter}
      availableActions={uniqueActions}
    />
  );
}