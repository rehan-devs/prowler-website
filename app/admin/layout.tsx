import { redirect } from "next/navigation";
import { getAdminFromCookie } from "@/lib/admin-helpers";
import { AdminShell } from "@/components/admin/admin-shell";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Bypass layout auth check for the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const admin = await getAdminFromCookie();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminShell adminEmail={admin.email}>{children}</AdminShell>;
}