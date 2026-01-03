// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import creatEvent from "@/services/event/createEvent";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";


// const CreatEventPage = () => {
//   const [isSubmit, setIsSubmit] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const router = useRouter();

 
//  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   setUploading(true);

//   const formData = new FormData();
//   formData.append("image", file);

//   const uploadUrl = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`;

//   try {
//     const res = await fetch(uploadUrl, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();

//     if (!data.success) {
//       toast.error("Image upload failed!");
//       return;
//     }

//     setImageUrl(data.data.url);
//     toast.success("Image uploaded successfully!");
//   } catch (error) {
//     console.error(error);
//     toast.error("Image upload failed");
//   } finally {
//     setUploading(false);
//   }
// };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!imageUrl) {
//       toast.error("Please upload an image first");
//       return;
//     }

//     setIsSubmit(true);
//     const form = new FormData(e.target as HTMLFormElement);

//     const eventData = {
//       name: form.get("name"),
//       description: form.get("description"),
//       eventType: form.get("eventType"),
//       dateTime: form.get("dateTime"),
//       location: form.get("location"),
//       minParticipants: Number(form.get("minParticipants")),
//       maxParticipants: Number(form.get("maxParticipants")),
//       image: imageUrl, // ⬅️ এখানে IMGBB URL দিচ্ছি
//       joiningFee: Number(form.get("joiningFee")),
//       isFeatured: form.get("isFeatured") === "on",
//     };

//     const result = await creatEvent(eventData);

//     if (result.success) {
//       toast.success("Event created successfully!");
//       router.push("/host/dashboard/my-events");
//     } else {
//       toast.error(result.message || "Failed to create event");
//     }

//     setIsSubmit(false);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="flex w-full gap-5">
//           <div className="flex-1">
//             {/* Name */}
//             <div>
//               <label className="text-sm font-medium">Event Name</label>
//               <Input name="name" required />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="text-sm font-medium">Description</label>
//               <Textarea name="description" />
//             </div>

//             {/* Event Type */}
//             <div>
//               <label className="text-sm font-medium">Event Type</label>
//               <select
//                 name="eventType"
//                 required
//                 className="w-full border rounded px-2 py-1"
//                 defaultValue=""
//               >
//                 <option value="" disabled>
//                   Select an event type
//                 </option>
//                 {eventTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type.replaceAll("_", " ")}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Date Time */}
//             <div>
//               <label className="text-sm font-medium">Date & Time</label>
//               <Input type="datetime-local" name="dateTime" required />
//             </div>

//             {/* Location */}
//             <div>
//               <label className="text-sm font-medium">Location</label>
//               <Input name="location" required />
//             </div>
//           </div>

//           <div className="flex-1">
//             {/* Min Participants */}
//             <div>
//               <label className="text-sm font-medium">
//                 Minimum Participants
//               </label>
//               <Input type="number" name="minParticipants" required />
//             </div>

//             {/* Max Participants */}
//             <div>
//               <label className="text-sm font-medium">
//                 Maximum Participants
//               </label>
//               <Input type="number" name="maxParticipants" required />
//             </div>

//             {/* Image Upload (IMGBB) */}
//             <div>
//               <label className="text-sm font-medium">Event Image</label>

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="border rounded px-2 py-2 w-full"
//                 required
//               />

//               {uploading && (
//                 <p className="text-blue-500 text-sm">Uploading...</p>
//               )}
//               {imageUrl && (
//                 <p className="text-green-600 text-sm">Image uploaded</p>
//               )}
//             </div>

//             {/* Joining Fee */}
//             <div>
//               <label className="text-sm font-medium">Joining Fee</label>
//               <Input type="number" name="joiningFee" required />
//             </div>

//             {/* Is Featured */}
//             <div className="flex gap-2 items-center">
//               <input type="checkbox" name="isFeatured" />
//               <label className="text-sm font-medium">Mark as Featured</label>
//             </div>
//           </div>
//         </div>

//         <Button type="submit" className="w-full" disabled={uploading}>
//           {isSubmit ? "Creating..." : "Create Event"}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default CreatEventPage;