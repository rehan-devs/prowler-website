import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPrice, PlanKey } from "@/lib/license";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const plan = formData.get("plan") as PlanKey;
    const duration = formData.get("duration") as "lifetime" | "subscription";
    const devices = formData.get("devices") as "1" | "unlimited";
    const paymentMethod = formData.get("paymentMethod") as string;
    const isRenewal = formData.get("isRenewal") === "true";
    const existingKey = formData.get("existingKey") as string | null;
    const notes = formData.get("notes") as string | null;
    const screenshot = formData.get("screenshot") as File | null;

    // Validate required fields
    if (!name || !email || !plan || !duration || !devices || !paymentMethod || !screenshot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate plan
    if (!["basic", "pro", "elite"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(screenshot.type)) {
      return NextResponse.json(
        { error: "Screenshot must be JPG, PNG or WebP" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (screenshot.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Screenshot must be under 5MB" },
        { status: 400 }
      );
    }

    // Get price
    const amount = getPrice(plan, duration, devices);

    // Upload screenshot to Supabase Storage
    const fileExt = screenshot.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const fileBuffer = await screenshot.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("payment-screenshots")
      .upload(fileName, fileBuffer, {
        contentType: screenshot.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload screenshot" },
        { status: 500 }
      );
    }

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: name.trim(),
        customer_email: email.toLowerCase().trim(),
        plan,
        plan_duration: duration,
        devices,
        amount_usd: amount,
        payment_method: paymentMethod,
        screenshot_url: uploadData.path,
        is_renewal: isRenewal,
        existing_license_key: existingKey || null,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Upsert customer record
    await supabaseAdmin.from("customers").upsert(
      {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        last_purchase_at: new Date().toISOString(),
      },
      { onConflict: "email", ignoreDuplicates: false }
    );

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order submitted successfully",
    });
  } catch (err) {
    console.error("Submit order error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}