// components/modules/Admin/EventManagement/EventsTable.tsx
"use client";

import { Event } from "@/app/types";
import EventApproval from "@/components/modules/Admin/EventManagement/EventApprove";

interface EventsTableProps {
  events: Event[];
}

const EventsTable = ({ events }: EventsTableProps) => {
  // Type fix: index should be number, not string
  const eventsList = Array.isArray(events) ? events : [];

  if (eventsList.length === 0) {
    return (
      <div className="overflow-x-auto mt-8">
        <div className="text-center text-gray-500 py-8">
          No events found.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-8">
      <table className="table w-full border">
        <thead className="bg-gray-200 font-semibold">
          <tr>
            <th>#</th>
            <th>Event Title</th>
            <th>Location</th>
            <th>Date</th>
            <th>Host</th>
            <th>Approved?</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {eventsList.map((event: Event, index: number) => (
            <tr key={event.id} className="border-b text-center hover:bg-gray-50">
              <td className="py-3">{index + 1}</td>
              <td className="py-3 font-medium">{event.name}</td>
              <td className="py-3">{event.location}</td>
              <td className="py-3">
                {event?.dateTime ? new Date(event.dateTime).toLocaleDateString() : 'N/A'}
              </td>
              <td className="py-3">{event.host?.name || "N/A"}</td>

              <td className="py-3">
                {event.isApproved ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    Approved
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    Pending
                  </span>
                )}
              </td>

              <td className="py-3">
                <EventApproval event={event} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;