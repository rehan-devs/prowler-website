import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateAdminSession, logAdminAction } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("prowler_admin_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = await validateAdminSession(token);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Await the asynchronous route params
  const { id } = await params;

  try {
    const body = await req.json();
    const allowedFields = [
      "status",
      "plan",
      "expires_at",
      "max_machines",
      "notes",
      "hardware_id",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("licenses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await logAdminAction(
      admin.email,
      "updated_license",
      "license",
      id,
      { updates }
    );

    return NextResponse.json({ success: true, license: data });
  } catch (err) {
    console.error("License update error:", err);
    return NextResponse.json(
      { error: "Failed to update license" },
      { status: 500 }
    );
  }
}