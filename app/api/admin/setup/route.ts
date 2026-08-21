import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

// Helper to hash password using SHA-256 with salt (or your admin-auth scheme)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { setupSecret, email, password } = await req.json();

    const expectedSecret =
      process.env.ADMIN_SETUP_SECRET || process.env.MASTER_SECRET;

    if (!setupSecret || setupSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid setup secret" },
        { status: 403 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    // Insert or update admin in the database
    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .upsert(
        {
          email: email.toLowerCase().trim(),
          password_hash: passwordHash,
          created_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) {
      // If table name is "admins" instead of "admin_users", try fallback
      const { data: fallbackData, error: fallbackError } = await supabaseAdmin
        .from("admins")
        .upsert(
          {
            email: email.toLowerCase().trim(),
            password_hash: passwordHash,
            created_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        )
        .select()
        .single();

      if (fallbackError) {
        throw new Error(error.message || fallbackError.message);
      }

      return NextResponse.json({
        success: true,
        message: "Admin account created successfully!",
        admin: fallbackData,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully!",
      admin: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal setup error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}