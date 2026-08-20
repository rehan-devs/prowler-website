import { NextRequest, NextResponse } from "next/server";
import { deleteAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("prowler_admin_token")?.value;

  if (token) {
    await deleteAdminSession(token);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("prowler_admin_token");
  return response;
}