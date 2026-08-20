import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateAdminSession, logAdminAction } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("prowler_admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = await validateAdminSession(token);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const plan = searchParams.get("plan");

    let query = supabaseAdmin
      .from("licenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") query = query.eq("status", status);
    if (plan && plan !== "all") query = query.eq("plan", plan);

    const { data: licenses, error } = await query;

    if (error) throw error;

    // Build CSV
    const headers = [
      "ID",
      "Email",
      "Plan",
      "Plan Duration",
      "Status",
      "Max Machines",
      "Activation Count",
      "Hardware ID",
      "Created At",
      "Expires At",
      "Last Seen At",
      "Notes",
    ];

    const escapeCSV = (val: string | null | undefined): string => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = (licenses || []).map((l) =>
      [
        l.id,
        l.email,
        l.plan,
        l.plan_duration,
        l.status,
        l.max_machines === 999 ? "unlimited" : l.max_machines,
        l.activation_count,
        l.hardware_id,
        l.created_at,
        l.expires_at,
        l.last_seen_at,
        l.notes,
      ]
        .map(escapeCSV)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    // Log the export action
    await logAdminAction(admin.email, "exported_licenses", "license", null, {
      count: licenses?.length || 0,
      filters: { status, plan },
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="prowler-licenses-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: "Failed to export" },
      { status: 500 }
    );
  }
}