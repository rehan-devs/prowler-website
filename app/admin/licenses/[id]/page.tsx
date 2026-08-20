import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { LicenseDetail } from "@/components/admin/license-detail";

export default async function LicenseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!license) notFound();

  // Get usage logs for this license
  const { data: usageLogs } = await supabaseAdmin
    .from("usage_logs")
    .select("*")
    .eq("license_id", params.id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Get order linked to this license
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("license_id", params.id)
    .single();

  return (
    <LicenseDetail
      license={license}
      usageLogs={usageLogs || []}
      order={order || null}
    />
  );
}