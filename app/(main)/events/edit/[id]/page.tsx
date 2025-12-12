// app/(main)/events/edit/[id]/page.tsx
// import EventForm from "@/components/EventForm"
import { notFound } from "next/navigation"

// In real app: fetch event by id from your backend
async function getEvent(id: string) {
  // Replace with real API call
  const dummyEvent = {
    id,
    title: "Sample Hiking Trip",
    description: "A fun hike in the mountains",
    date: "2025-12-20",
    location: "Mountain Park",
    category: "Outdoor",
    maxParticipants: 10,
    price: 15,
  }
  return dummyEvent || null
}

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground mt-2">Update your event details</p>
      </div>

      {/* <EventForm mode="edit" initialData={event} /> */}
    </div>
  )
}