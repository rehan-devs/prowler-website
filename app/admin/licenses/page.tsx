import { getLicenses } from "@/lib/admin-helpers";
import { LicensesTable } from "@/components/admin/licenses-table";

export default async function LicensesPage({
  searchParams,
}: {
  searchParams: { status?: string; plan?: string; search?: string };
}) {
  const { licenses } = await getLicenses(
    searchParams.status,
    searchParams.plan,
    searchParams.search
  );

  return (
    <LicensesTable
      licenses={licenses}
      currentStatus={searchParams.status || "all"}
      currentPlan={searchParams.plan || "all"}
      currentSearch={searchParams.search || ""}
    />
  );
}