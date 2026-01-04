// app/(dashboardLayout)/admin/dashboard/hosts-management/page.tsx

import HostsManagementHeader from "@/components/modules/Admin/HostsManagement/HostsManagementHeader";
import HostsTable from "@/components/modules/Admin/HostsManagement/HostsTable";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getHosts } from "@/services/admin/hostManagement";
import { Suspense } from "react";

const AdminHostsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  // Fetch data on the server
  const hostsResult = await getHosts(queryString);

  // Calculate pagination safely
  const totalPages = Math.ceil(
    (hostsResult?.meta?.total || 0) / (hostsResult?.meta?.limit || 10),
  );

  return (
    <div className="space-y-6">
      <HostsManagementHeader />

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {hostsResult?.meta?.total
            ? `Showing ${hostsResult.meta.total} hosts`
            : "No hosts found"}
        </div>
        <div className="flex space-x-2">
          <SearchFilter paramName="searchTerm" placeholder="Search hosts..." />
          <RefreshButton />
        </div>
      </div>

      {/* Pass the fetched hosts data to the client component */}
      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <HostsTable hosts={hostsResult?.data || []} />
      </Suspense>

      {/* Add pagination if needed */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={hostsResult?.meta?.page || 1}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default AdminHostsManagementPage;

// Optional: Add these to prevent caching if needed
export const dynamic = "force-dynamic";
export const revalidate = 0;
