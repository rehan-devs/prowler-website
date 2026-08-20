import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateAdminSession, logAdminAction } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("prowler_admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = await validateAdminSession(token);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, licenseIds } = await req.json();

    if (!action || !Array.isArray(licenseIds) || licenseIds.length === 0) {
      return NextResponse.json(
        { error: "Action and license IDs required" },
        { status: 400 }
      );
    }

    const allowedActions = [
      "suspend",
      "revoke",
      "activate",
      "reset_hardware",
    ];

    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    let updates: Record<string, unknown> = {};
    let logAction = "";

    switch (action) {
      case "suspend":
        updates = { status: "suspended" };
        logAction = "bulk_suspended";
        break;
      case "revoke":
        updates = { status: "revoked" };
        logAction = "bulk_revoked";
        break;
      case "activate":
        updates = { status: "active" };
        logAction = "bulk_activated";
        break;
      case "reset_hardware":
        updates = { hardware_id: null };
        logAction = "bulk_reset_hardware";
        break;
    }

    const { data, error } = await supabaseAdmin
      .from("licenses")
      .update(updates)
      .in("id", licenseIds)
      .select();

    if (error) throw error;

    await logAdminAction(
      admin.email,
      logAction,
      "license",
      licenseIds.join(","),
      { count: licenseIds.length, action }
    );

    return NextResponse.json({
      success: true,
      updated: data?.length || 0,
    });
  } catch (err) {
    console.error("Bulk action error:", err);
    return NextResponse.json(
      { error: "Bulk action failed" },
      { status: 500 }
    );
  }
}