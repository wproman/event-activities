// // services/admin/eventManagement.ts
// import { Event } from "@/app/types";

// interface EventsResponse {
//   data: Event[];
//   meta?: {
//     total: number;
//     limit: number;
//     page: number;
//     totalPages: number;
//   };
// }

// export const getEvents = async (queryString: string = ''): Promise<EventsResponse> => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API_URL}/events}`,
//       {
//         credentials: "include",
//         cache: 'no-store'
//       }
//     );

//     if (!res.ok) {
//       // Silent fail - return empty structure
//       return {
//         data: [],
//         meta: {
//           total: 0,
//           limit: 10,
//           page: 1,
//           totalPages: 1
//         }
//       };
//     }

//     const data = await res.json();

//     // Ensure consistent response structure
//     return {
//       data: Array.isArray(data.data) ? data.data : [],
//       meta: data.meta || {
//         total: data.data?.length || 0,
//         limit: 10,
//         page: 1,
//         totalPages: Math.ceil((data.data?.length || 0) / 10)
//       }
//     };

//   } catch {
//     // Return empty structure on any error
//     return {
//       data: [],
//       meta: {
//         total: 0,
//         limit: 10,
//         page: 1,
//         totalPages: 1
//       }
//     };
//   }
// };

// // Optional: Keep your original allEvents if needed elsewhere
// export { default as allEvents } from "../event/allEvent";

