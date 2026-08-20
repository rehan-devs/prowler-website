import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Store in support_tickets table if it exists
    // Otherwise just log it
    try {
      await supabaseAdmin.from("support_tickets").insert({
        customer_email: email,
        subject: `[${name}] ${subject}`,
        message,
        status: "open",
      });
    } catch {
      // Table may not exist yet — that is okay
      console.log("Support ticket stored to logs only:", { name, email, subject });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}