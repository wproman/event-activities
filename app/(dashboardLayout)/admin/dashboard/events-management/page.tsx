// app/(dashboardLayout)/admin/dashboard/events-management/page.tsx

import EventsTable from "@/components/modules/Admin/EventManagement/EventsTable";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import allEvents from "@/services/event/allEvent";
import { Suspense } from "react";

// Header Component
const EventsManagementHeader = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
    <p className="text-gray-600 mt-1">Manage and approve events</p>
  </div>
);

const AdminEventsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  // Fetch events data
  const eventsData = await allEvents();

  // Convert to expected structure
  const eventsList = Array.isArray(eventsData) ? eventsData : [];

  // Calculate pagination (adjust based on your API)
  const totalPages = Math.ceil(eventsList.length / 10);

  return (
    <div className="space-y-6">
      <EventsManagementHeader />

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {eventsList.length > 0
            ? `Showing ${eventsList.length} events`
            : "No events found"}
        </div>
        <div className="flex space-x-2">
          <SearchFilter paramName="searchTerm" placeholder="Search events..." />
          <RefreshButton />
        </div>
      </div>

      {/* Pass events data to client component */}
      <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
        <EventsTable events={eventsList} />
      </Suspense>

      {/* Add pagination if needed */}
      {totalPages > 1 && (
        <TablePagination currentPage={1} totalPages={totalPages} />
      )}
    </div>
  );
};

export default AdminEventsManagementPage;

export const dynamic = "force-dynamic";
export const revalidate = 0;
