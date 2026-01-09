// // components/modules/Event/LeaveEventButton.tsx
// "use client";

// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import leaveEvent from "@/services/event/leaveEvent";
// import { Loader2, LogOut } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";

// interface LeaveEventButtonProps {
//   eventId: string;
//   eventTitle: string;
//   onSuccess?: () => void;
// }

// const LeaveEventButton = ({ eventId, eventTitle, onSuccess }: LeaveEventButtonProps) => {
//   const [isLoading, setIsLoading] = useState(false);

//  const handleLeaveEvent = async () => {
//   setIsLoading(true);
//   try {
//     console.log("=== LEAVE BUTTON DEBUG ===");
//     console.log("1. Button clicked for event:", eventTitle, "ID:", eventId);
//     console.log("2. leaveEvent function exists:", typeof leaveEvent);
//     console.log("3. Calling leaveEvent service...");
    
//     const result = await leaveEvent(eventId);
    
//     console.log("4. Service returned:", result);
    
//     if (result.success) {
//       toast.success(result.message || "Successfully left the event");
      
//       // If there's refund info, show additional message
//       if (result.data?.requiresRefund) {
//         toast.info("Please contact the host for refund processing", {
//           duration: 8000,
//         });
//       }
      
//       // Call the callback to refresh data
//       if (onSuccess) {
//         onSuccess();
//       }
//     }
//   } catch (error: any) {
//     console.error("5. Leave event error:", error);
//     toast.error(error.message || "Failed to leave event");
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button
//           variant="destructive"
//           size="sm"
//           className="gap-2"
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <LogOut className="h-4 w-4" />
//           )}
//           Leave
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Leave Event</AlertDialogTitle>
//           <AlertDialogDescription>
//             Are you sure you want to leave &quot;{eventTitle}&quot;?
//             <br />
//             <span className="text-amber-600 font-medium mt-2 block">
//               Note: If you paid for this event, you may need to request a refund separately.
//             </span>
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={handleLeaveEvent}
//             disabled={isLoading}
//             className="bg-red-600 hover:bg-red-700"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Leaving...
//               </>
//             ) : (
//               "Yes, Leave Event"
//             )}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default LeaveEventButton;