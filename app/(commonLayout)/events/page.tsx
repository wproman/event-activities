

// import TablePagination from "@/components/shared/TablePagination";
// import { TableSkeleton } from "@/components/shared/TableSkeleton";
// import { queryStringFormatter } from "@/lib/formatters";

// // import { getEventCategories } from "@/services/events/categoryService";
// import EventGrid from "@/components/modules/Event/EventGrid";
// import EventSearchFilters from "@/components/modules/Event/EventSearchFilters";
// import { getEvents } from "@/services/event/allEvent";

// import { Suspense } from "react";

// // ISR: Revalidate every 5 minutes for fresh events
// export const revalidate = 300;

// interface EventsPageProps {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// const EventsPage = async ({ searchParams }: EventsPageProps) => {
//   const searchParamsObj = await searchParams;
//   const queryString = queryStringFormatter(searchParamsObj);

//   // Fetch events and categories in parallel
//   const [eventsResponse, categoriesResponse] = await Promise.all([
//     getEvents(queryString),
//     getEventCategories(),
//   ]);

//   const events = eventsResponse?.data?.events || [];
//   const categories = categoriesResponse?.data || [];
//   const meta = eventsResponse?.data?.meta;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
//             Discover Exciting Events
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             Find and join amazing events happening near you
//           </p>
//         </div>

//         {/* Search and Filters */}
//         <EventSearchFilters categories={categories} />

//         {/* Events Grid */}
//         <Suspense fallback={<TableSkeleton columns={3} />}>
//           <EventGrid events={events} />
//         </Suspense>

//         {/* Pagination */}
//         {meta && meta.totalPages > 1 && (
//           <TablePagination
//             currentPage={meta.page || 1}
//             totalPages={meta.totalPages || 1}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventsPage;


const page = () => {
  return (
    <div>comon layout eventpage</div>
  )
}

export default page