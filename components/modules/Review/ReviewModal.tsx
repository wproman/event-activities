// "use client";

// import { useState } from 'react';
// import { toast } from 'sonner';

// import { revalidatePathFunction } from '@/services/event/eventDetails';

// // Make sure this import exists

// import { zodResolver } from '@hookform/resolvers/zod';
// import { Calendar, CheckCircle, Star, User as UserIcon } from 'lucide-react';
// // React Hook Form (Optional but recommended)
// import { Review, User } from '@/app/types';
// import { Badge } from '@/components/ui/badge';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// // Shadcn/ui Components
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from '@/components/ui/dialog';
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from '@/components/ui/form';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { Textarea } from '@/components/ui/textarea';
// import creatReview from '@/services/review/createReview';

// // Define validation schema
// const reviewSchema = z.object({
//   rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
//   comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment cannot exceed 500 characters"),
// });

// type ReviewFormData = z.infer<typeof reviewSchema>;

// interface ReviewModalProps {
//   event: Event;
//   reviews: Review[];
//   user: User;
// }

// const ReviewModal = ({ event, reviews, user }: ReviewModalProps) => {
//   const [open, setOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [userRating, setUserRating] = useState(0);

//   // Initialize React Hook Form
//   const form = useForm<ReviewFormData>({
//     resolver: zodResolver(reviewSchema),
//     defaultValues: {
//       rating: 0,
//       comment: '',
//     },
//   });

//   // Check if user already reviewed this event
//   const alreadyReviewed = reviews?.some(
//     (review) => review.eventId === event.id && review.reviewerId === user?.id
//   );

//   const userReview = reviews?.find(
//     (review) => review.eventId === event.id && review.reviewerId === user?.id
//   );

//   // Calculate average rating
//   const averageRating = reviews?.length > 0 
//     ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
//     : 0;

//   // Handle form submission
//   const onSubmit = async (data: ReviewFormData) => {
//     setIsSubmitting(true);
    
//     try {
//       const result = await creatReview({
//         eventId: event.id,
//         reviewData: data
//       });

//       if (result.success) {
//         await revalidatePathFunction(`/dashboard/my-events`);
//         toast.success("Review submitted successfully!");
//         setOpen(false);
//         form.reset();
//       } else {
//         toast.error(result.message || "Failed to submit review");
//       }
//     } catch (error: any) {
//       console.error("Review submission error:", error);
//       toast.error(error.message || "An error occurred");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Render rating stars
//   const renderStars = (rating: number, interactive = false) => {
//     return (
//       <div className="flex items-center gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => interactive && form.setValue("rating", star)}
//             className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
//             disabled={!interactive || isSubmitting}
//           >
//             <Star
//               className={`h-5 w-5 ${
//                 star <= rating
//                   ? 'text-yellow-400 fill-yellow-400'
//                   : 'text-gray-300'
//               }`}
//             />
//           </button>
//         ))}
//         <span className="ml-2 text-sm text-muted-foreground">
//           {rating.toFixed(1)}
//         </span>
//       </div>
//     );
//   };

//   if (event.status !== "COMPLETED") {
//     return (
//       <Card className="border-border">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Calendar className="h-5 w-5" />
//             Event Status
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center gap-2">
//             <Badge variant="outline">{event.status}</Badge>
//             <p className="text-sm text-muted-foreground">
//               Reviews can only be submitted for completed events.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Reviews Summary */}
//       <Card className="border-border">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg">Event Reviews</CardTitle>
//             <Badge variant="outline">
//               {reviews?.length || 0} review{reviews?.length !== 1 ? 's' : ''}
//             </Badge>
//           </div>
//           <CardDescription>
//             Share your experience with this event
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {/* Average Rating */}
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
//               <div className="mt-1">{renderStars(averageRating)}</div>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Based on {reviews?.length || 0} reviews
//               </p>
//             </div>
            
//             {/* Rating Distribution */}
//             <div className="space-y-1">
//               {[5, 4, 3, 2, 1].map((rating) => {
//                 const count = reviews?.filter(r => r.rating === rating).length || 0;
//                 const percentage = reviews?.length ? (count / reviews.length) * 100 : 0;
                
//                 return (
//                   <div key={rating} className="flex items-center gap-2 text-sm">
//                     <span className="w-8">{rating} ★</span>
//                     <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div 
//                         className="h-full bg-yellow-400" 
//                         style={{ width: `${percentage}%` }}
//                       />
//                     </div>
//                     <span className="w-8 text-right">{count}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <Separator />

//           {/* User Review Status */}
//           <div>
//             {alreadyReviewed ? (
//               <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
//                 <div className="flex items-start gap-3">
//                   <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
//                   <div>
//                     <h4 className="font-medium text-green-800">Review Submitted</h4>
//                     <div className="mt-2">
//                       <div className="flex items-center gap-2">
//                         {renderStars(userReview?.rating || 0)}
//                         <span className="text-sm text-muted-foreground">
//                           {new Date(userReview?.createdAt || '').toLocaleDateString()}
//                         </span>
//                       </div>
//                       <p className="mt-2 text-sm text-green-700">
//                         {userReview?.comment}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogTrigger asChild>
//                   <Button className="w-full">
//                     <Star className="h-4 w-4 mr-2" />
//                     Write a Review
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[500px]">
//                   <DialogHeader>
//                     <DialogTitle className="flex items-center gap-2">
//                       <Star className="h-5 w-5" />
//                       Review {event.title}
//                     </DialogTitle>
//                     <DialogDescription>
//                       Share your honest feedback about this event
//                     </DialogDescription>
//                   </DialogHeader>

//                   <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                       {/* Event Info */}
//                       <Card className="border-border">
//                         <CardContent className="pt-6">
//                           <div className="space-y-2">
//                             <h4 className="font-medium">{event.title}</h4>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                               <span className="flex items-center gap-1">
//                                 <Calendar className="h-4 w-4" />
//                                 {new Date(event.date).toLocaleDateString()}
//                               </span>
//                               <span className="flex items-center gap-1">
//                                 <UserIcon className="h-4 w-4" />
//                                 {event.host?.name || 'Host'}
//                               </span>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Rating Field */}
//                       <FormField
//                         control={form.control}
//                         name="rating"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Rating</FormLabel>
//                             <FormControl>
//                               <div className="flex items-center gap-4">
//                                 {renderStars(field.value, true)}
//                                 <div className="flex-1">
//                                   <Select
//                                     value={field.value.toString()}
//                                     onValueChange={(value) => field.onChange(parseInt(value))}
//                                     disabled={isSubmitting}
//                                   >
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select rating" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       {[1, 2, 3, 4, 5].map((rating) => (
//                                         <SelectItem key={rating} value={rating.toString()}>
//                                           {rating} Star{rating !== 1 ? 's' : ''}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                               </div>
//                             </FormControl>
//                             <FormDescription>
//                               Rate your experience from 1 (poor) to 5 (excellent)
//                             </FormDescription>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       {/* Comment Field */}
//                       <FormField
//                         control={form.control}
//                         name="comment"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Your Review</FormLabel>
//                             <FormControl>
//                               <Textarea
//                                 placeholder="What did you like or dislike about this event? What could be improved?"
//                                 className="min-h-[120px]"
//                                 disabled={isSubmitting}
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormDescription>
//                               Minimum 10 characters, maximum 500 characters
//                             </FormDescription>
//                             <div className="text-right text-xs text-muted-foreground">
//                               {field.value.length}/500
//                             </div>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <div className="flex gap-3">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           className="flex-1"
//                           onClick={() => setOpen(false)}
//                           disabled={isSubmitting}
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           type="submit"
//                           className="flex-1"
//                           disabled={isSubmitting}
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <span className="animate-spin mr-2">⟳</span>
//                               Submitting...
//                             </>
//                           ) : (
//                             <>
//                               <CheckCircle className="h-4 w-4 mr-2" />
//                               Submit Review
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </form>
//                   </Form>
//                 </DialogContent>
//               </Dialog>
//             )}
//           </div>

//           {/* Existing Reviews */}
//           {reviews?.length > 0 && (
//             <>
//               <Separator />
//               <div className="space-y-4">
//                 <h4 className="font-medium">Recent Reviews</h4>
//                 {reviews.slice(0, 3).map((review) => (
//                   <Card key={review.id} className="border-border">
//                     <CardContent className="pt-6">
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                               <UserIcon className="h-4 w-4 text-primary" />
//                             </div>
//                             <div>
//                               <p className="font-medium text-sm">
//                                 {review.reviewer?.name || 'Anonymous'}
//                               </p>
//                               <p className="text-xs text-muted-foreground">
//                                 {new Date(review.createdAt).toLocaleDateString()}
//                               </p>
//                             </div>
//                           </div>
//                           {renderStars(review.rating)}
//                         </div>
//                         <p className="text-sm">{review.comment}</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ReviewModal;