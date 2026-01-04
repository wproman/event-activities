// // export default MyEventPage
// // export const dynamic = 'force-dynamic'

// import getAllEventAndParticipents from "@/services/eventParticipents.ts/getAllEventParticipents";
// import getAllReview from "@/services/review/getAllReview";
// import userInfo from "@/services/user/userInfo";

// export const dynamic = 'force-dynamic'
// const MyEventPage = async () => {
//   const eventAndParticipents = await getAllEventAndParticipents() 
//   console.log("eventAndParticipents",eventAndParticipents)
  
//   const reviews = await getAllReview() 
//   const user = await userInfo() 

//   if (eventAndParticipents.length === 0) {
//     return (
//       <div className="flex justify-center mt-16">
//         <div className="bg-gray-800 text-gray-200 border border-gray-700 p-8 rounded-xl shadow-lg max-w-md text-center">
//           <h2 className="text-xl font-semibold">You have not joined any event</h2>
//           <p className="text-gray-400 mt-2">
//             Join an event to see it listed here.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <EventFilters
//       eventAndParticipents={eventAndParticipents}
//       reviews={reviews}
//       user={user}
//     />
//   );
// };

// export default MyEventPage;