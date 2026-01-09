import EventFilters from "@/components/modules/Event/EventFilter";
import getAllEventAndParticipents from "@/services/eventParticipents/getAllEventParticipents";
import getAllReview from "@/services/review/getAllReview";
import userInfo from "@/services/user/userInfo";

export const dynamic = 'force-dynamic'

const MyEventPage = async () => {
  const eventAndParticipents = await getAllEventAndParticipents();
  console.log("eventAndParticipents", eventAndParticipents);

  const reviews = await getAllReview();
  
  // FIX: Extract user data from response
  const userResponse = await userInfo();
  const user = userResponse.success ? userResponse.data : null;
  
  // Check if user data exists
  if (!user) {
    return (
      <div className="flex justify-center mt-16">
        <div className="bg-gray-800 text-gray-200 border border-gray-700 p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-xl font-semibold">Please login to view your events</h2>
          <p className="text-gray-400 mt-2">
            You need to be logged in to see your joined events.
          </p>
        </div>
      </div>
    );
  }

  if (!eventAndParticipents || 
      (Array.isArray(eventAndParticipents) && eventAndParticipents.length === 0) ||
      (typeof eventAndParticipents === 'object' && 
       (!eventAndParticipents.hostedEvents || eventAndParticipents.hostedEvents.length === 0) &&
       (!eventAndParticipents.joinedEvents || eventAndParticipents.joinedEvents.length === 0))) {
    return (
      <div className="flex justify-center mt-16">
        <div className="bg-gray-800 text-gray-200 border border-gray-700 p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-xl font-semibold">You have not joined any event</h2>
          <p className="text-gray-400 mt-2">
            Join an event to see it listed here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <EventFilters
      mode="USER_EVENTS"
      eventAndParticipants={eventAndParticipents}  
      reviews={reviews}
      user={user}  
    />
  );
};

export default MyEventPage;