import React, { useState, useEffect } from 'react';
import { getBeehiveEvents, createBeehiveEvent, enrollBeehive } from '../api';
import { useAuth } from '../context/AuthContext';
import { FiHexagon, FiClock, FiUsers, FiDollarSign, FiPlus, FiCalendar } from 'react-icons/fi';

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
          <h2 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)]">Beehive Mentorship Events</h2>
          <p className="text-sm text-stone-600 mt-1 font-light">Weekend real-world scenario mentorship sessions</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)] rounded-sm hover:bg-opacity-90 transition-all shadow-md flex items-center gap-2 font-medium"
          >
            <FiPlus /> {showCreateForm ? 'Cancel' : 'Create Beehive Event'}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-sm shadow-md border-t-4 border-[var(--color-academia-charcoal)] animate-fade-in">
          <h3 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-4">Host a Beehive Event</h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-600">Event Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600">Date & Time</label>
              <input
                type="datetime-local"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600">Duration (Hours)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newEvent.duration_hours}
                onChange={(e) => setNewEvent({...newEvent, duration_hours: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600">Max Seats</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newEvent.max_seats}
                onChange={(e) => setNewEvent({...newEvent, max_seats: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600">Entry Fee (INR)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newEvent.entry_fee}
                onChange={(e) => setNewEvent({...newEvent, entry_fee: parseFloat(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-600">Description</label>
              <textarea
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                rows="3"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-sm text-[var(--color-academia-charcoal)] bg-[var(--color-academia-gold)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-academia-gold)]"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="p-8 text-center text-stone-500 italic font-serif animate-pulse">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200 hover:border-[var(--color-academia-gold)] flex flex-col relative group">
               <div className="absolute top-0 right-0 bg-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)] text-xs font-bold px-3 py-1 rounded-bl-sm">
                Running
              </div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)]">
                    <FiHexagon className="mr-1" /> Beehive Event
                  </span>
                </div>
                
                <div className="mb-4">
                     <span className="text-xs text-stone-500 font-serif block mb-1">
                        {new Date(event.event_date).toLocaleDateString()}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] group-hover:text-[var(--color-academia-gold)] transition-colors">{event.title}</h3>
                </div>

                <p className="text-[var(--color-academia-charcoal)] font-bold text-sm mb-3 flex items-center bg-[var(--color-academia-cream)] p-2 rounded-sm inline-block">
                    <FiDollarSign className="text-[var(--color-academia-gold)] mr-1" /> Entry: ₹{event.entry_fee}
                </p>
                
                <p className="text-stone-600 text-sm mb-4 line-clamp-3 font-light leading-relaxed">{event.description}</p>
                
                <div className="flex justify-between text-sm text-stone-500 mt-auto pt-3 border-t border-stone-100">
                   <span className="flex items-center"><FiClock className="mr-1 text-[var(--color-academia-gold)]" /> {event.duration_hours}h</span>
                   <span className="flex items-center"><FiUsers className="mr-1 text-[var(--color-academia-gold)]" /> {event.max_seats} Seats</span>
                </div>
              </div>
              <div className="bg-[var(--color-academia-cream)] px-6 py-4 border-t border-stone-200">
                <button
                  onClick={() => handleEnroll(event.id)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-[var(--color-academia-charcoal)] text-sm font-medium rounded-sm text-[var(--color-academia-charcoal)] bg-transparent hover:bg-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-cream)] transition-all duration-300"
                >
                  Join Beehive (₹{event.entry_fee})
                </button>
              </div>
            </div>
          ))}
           {events.length === 0 && (
            <div className="col-span-full text-center py-10 text-stone-500 bg-white rounded-sm border border-dashed border-stone-300 font-serif italic">
              No active Beehive events at the moment. Check back on weekends!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BeehiveEventList;
