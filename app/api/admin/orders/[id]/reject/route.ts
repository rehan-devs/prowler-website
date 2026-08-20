import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateAdminSession, logAdminAction } from "@/lib/admin-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("prowler_admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = await validateAdminSession(token);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { reason } = await req.json();

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "pending") {
      return NextResponse.json({ error: "Order is not pending" }, { status: 400 });
    }

    await supabaseAdmin
      .from("orders")
      .update({
        status: "rejected",
        admin_notes: reason || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: admin.email,
      })
      .eq("id", params.id);

    await logAdminAction(
      admin.email,
      "rejected_order",
      "order",
      params.id,
      { reason }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}