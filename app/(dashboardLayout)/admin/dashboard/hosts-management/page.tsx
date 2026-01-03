import HostsManagementHeader from "@/components/modules/Admin/HostsManagement/HostsManagementHeader";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

import { queryStringFormatter } from "@/lib/formatters";
import { Suspense } from "react";

const AdminHostsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
//   const hostsResult = await getHosts(queryString);
  
//   const totalPages = Math.ceil(
//     hostsResult.meta.total / hostsResult.meta.limit
//   );
  
  return (
    <div className="space-y-6">
      <HostsManagementHeader />
      <div className="flex space-x-2">
        <SearchFilter paramName="searchTerm" placeholder="Search hosts..." />
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        {/* <HostsTable
          hosts={hostsResult.data}
        /> */}
        {/* <TablePagination
          currentPage={hostsResult.meta.page}
          totalPages={totalPages}
        /> */}
      </Suspense>
    </div>
  );
};

export default AdminHostsManagementPage;