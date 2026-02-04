import React, { useState, useEffect } from 'react';
import { getBeehiveEvents, createBeehiveEvent, enrollBeehive } from '../api';
import { useAuth } from '../context/AuthContext';

const BeehiveEventList = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    duration_hours: 4,
    max_seats: 30,
    entry_fee: 1500
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getBeehiveEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch beehive events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    const fee = event ? event.entry_fee : 1500;

    // In a real app, this would redirect to a payment gateway
    if (window.confirm(`This event has an entry fee of ₹${fee}. Confirm enrollment?`)) {
      try {
        await enrollBeehive(eventId);
        alert("Enrolled successfully! Payment status is pending.");
        fetchEvents();
      } catch (err) {
        alert("Failed to enroll: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBeehiveEvent(newEvent);
      setShowCreateForm(false);
      setNewEvent({
        title: '',
        description: '',
        event_date: '',
        duration_hours: 4,
        max_seats: 30,
        entry_fee: 1500
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to create event: " + (err.response?.data?.detail || err.message));
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Beehive Mentorship Events</h2>
          <p className="text-sm text-gray-500">Weekend real-world scenario mentorship sessions</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium"
          >
            {showCreateForm ? 'Cancel' : 'Create Beehive Event'}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-yellow-200">
          <h3 className="text-lg font-medium mb-4">Host a Beehive Event</h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input
                type="datetime-local"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (Hours)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                value={newEvent.duration_hours}
                onChange={(e) => setNewEvent({...newEvent, duration_hours: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Seats</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                value={newEvent.max_seats}
                onChange={(e) => setNewEvent({...newEvent, max_seats: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Entry Fee (INR)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                value={newEvent.entry_fee}
                onChange={(e) => setNewEvent({...newEvent, entry_fee: parseFloat(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
                rows="3"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-yellow-100 flex flex-col relative">
               <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Running
              </div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Beehive Event
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(event.event_date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm font-bold text-indigo-600 mb-2">Entry: ₹{event.entry_fee}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                
                <div className="flex justify-between text-sm text-gray-500 mt-auto">
                   <span>Duration: {event.duration_hours}h</span>
                   <span>Seats: {event.max_seats}</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => handleEnroll(event.id)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Join Beehive (₹{event.entry_fee})
                </button>
              </div>
            </div>
          ))}
           {events.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No active Beehive events at the moment. Check back on weekends!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BeehiveEventList;
