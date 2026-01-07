// import { Category, CategoryResponse } from "@/app/types/event.category";


// const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// // Fetch all event categories
// export const getEventCategories = async (): Promise<CategoryResponse | null> => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/events/categories`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // Cache for 1 hour since categories don't change often
//         next: { revalidate: 3600 }
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch categories: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching event categories:", error);
//     return null;
//   }
// };

// // Fetch single category by ID
// export const getCategoryById = async (id: string): Promise<Category | null> => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/events/categories/${id}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         next: { revalidate: 3600 }
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch category: ${response.statusText}`);
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error("Error fetching category:", error);
//     return null;
//   }
// };