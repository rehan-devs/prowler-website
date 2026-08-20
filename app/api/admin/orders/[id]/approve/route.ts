import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateAdminSession } from "@/lib/admin-auth";
import { generateLicenseKey, hashLicenseKey } from "@/lib/license";
import { logAdminAction } from "@/lib/admin-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate admin session
  const token = req.cookies.get("prowler_admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = await validateAdminSession(token);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { adminNotes } = await req.json();

    // Fetch the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Order is not pending" },
        { status: 400 }
      );
    }

    let licenseKey: string;
    let licenseId: string;

    if (order.is_renewal && order.existing_license_key) {
      // Handle renewal — extend existing license
      const keyHash = hashLicenseKey(
        order.existing_license_key,
        process.env.MASTER_SECRET!
      );

      const { data: existingLicense } = await supabaseAdmin
        .from("licenses")
        .select("id")
        .eq("key_hash", keyHash)
        .single();

      if (existingLicense) {
        // Update expiry on existing license
        const newExpiry =
          order.plan_duration === "lifetime"
            ? null
            : new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString();

        await supabaseAdmin
          .from("licenses")
          .update({
            status: "active",
            expires_at: newExpiry,
            plan: order.plan,
            notes: `Renewed via order ${order.id}`,
          })
          .eq("id", existingLicense.id);

        licenseKey = order.existing_license_key;
        licenseId = existingLicense.id;
      } else {
        // Key not found — generate new one
        licenseKey = generateLicenseKey();
        const keyHash2 = hashLicenseKey(
          licenseKey,
          process.env.MASTER_SECRET!
        );

        const expiresAt =
          order.plan_duration === "lifetime"
            ? null
            : new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString();

        const { data: newLicense } = await supabaseAdmin
          .from("licenses")
          .insert({
            key_hash: keyHash2,
            plan: order.plan,
            status: "active",
            email: order.customer_email,
            plan_duration: order.plan_duration,
            max_machines: order.devices === "unlimited" ? 999 : 1,
            expires_at: expiresAt,
            notes: `Order: ${order.id} | ${order.customer_email}`,
          })
          .select()
          .single();

        licenseKey = licenseKey;
        licenseId = newLicense!.id;
      }
    } else {
      // New license — generate fresh key
      licenseKey = generateLicenseKey();
      const keyHash = hashLicenseKey(
        licenseKey,
        process.env.MASTER_SECRET!
      );

      const expiresAt =
        order.plan_duration === "lifetime"
          ? null
          : new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString();

      const { data: newLicense, error: licenseError } = await supabaseAdmin
        .from("licenses")
        .insert({
          key_hash: keyHash,
          plan: order.plan,
          status: "active",
          email: order.customer_email,
          plan_duration: order.plan_duration,
          max_machines: order.devices === "unlimited" ? 999 : 1,
          expires_at: expiresAt,
          notes: `Order: ${order.id} | ${order.customer_email}`,
        })
        .select()
        .single();

      if (licenseError || !newLicense) {
        throw new Error("Failed to create license");
      }

      licenseId = newLicense.id;
    }

    // Update order status
    await supabaseAdmin
      .from("orders")
      .update({
        status: "approved",
        license_id: licenseId,
        admin_notes: adminNotes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: admin.email,
      })
      .eq("id", params.id);

    // Upsert customer record
    await supabaseAdmin.from("customers").upsert(
      {
        email: order.customer_email,
        name: order.customer_name,
        last_purchase_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    // Log the action
    await logAdminAction(
      admin.email,
      "approved_order",
      "order",
      params.id,
      { plan: order.plan, amount: order.amount_usd }
    );

    return NextResponse.json({
      success: true,
      licenseKey,
      licenseId,
    });
  } catch (err) {
    console.error("Approve order error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}