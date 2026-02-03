import { useState, useEffect } from "react";
import { getBeehiveEvents, createBeehiveEvent, enrollBeehiveEvent } from "../api";
import { useAuth } from "../context/AuthContext";
import { FiHexagon, FiCalendar, FiUser, FiDollarSign, FiPlus, FiCheck } from "react-icons/fi";

const BeehiveEventList = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    event_date: "",
    description: "",
    total_seats: 30,
    entry_fee: 1500
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getBeehiveEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch beehive events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createBeehiveEvent(formData);
      setShowCreateModal(false);
      fetchEvents();
      setFormData({
        title: "",
        topic: "",
        event_date: "",
        description: "",
        total_seats: 30,
        entry_fee: 1500
      });
    } catch (error) {
      console.error("Failed to create event", error);
      alert("Failed to create event");
    }
  };

  const handleEnroll = async (eventId) => {
    if (!window.confirm("Confirm enrollment? Fee of 1500 will be required.")) return;
    try {
      await enrollBeehiveEvent(eventId, { payment_status: "pending" });
      alert("Enrolled successfully! Please complete payment.");
      fetchEvents();
    } catch (error) {
      console.error("Failed to enroll", error);
      alert(error.response?.data?.detail || "Failed to enroll");
    }
  };

  const isAdmin = user?.role === "admin";

  if (loading) return <div className="p-8 text-center text-stone-500">Loading beehive events...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] flex items-center gap-2">
            <FiHexagon className="text-[var(--color-academia-gold)]" /> Beehive Mentorship
          </h2>
          <p className="text-stone-600">Exclusive weekend mentorship sessions on real-world scenarios.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[var(--color-academia-charcoal)] text-white px-4 py-2 rounded-sm hover:bg-stone-800 transition-colors shadow-sm"
          >
            <FiPlus /> Create Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
           // Calculate seats left if we had enrollment count in API response.
           // Assuming event object might eventually have enrollments count or we fetch it.
           // For now, display total seats.
           return (
            <div key={event.id} className="bg-white p-6 rounded-sm shadow-md border-l-4 border-[var(--color-academia-charcoal)] hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-[var(--color-academia-charcoal)]">{event.title}</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {event.topic}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-stone-600 mb-4 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-[var(--color-academia-gold)]" />
                  <span>{new Date(event.event_date).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUser className="text-[var(--color-academia-gold)]" />
                  <span>Seats: {event.total_seats}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-[var(--color-academia-gold)]" />
                  <span>Entry: ₹{event.entry_fee}</span>
                </div>
              </div>

              <p className="text-stone-700 text-sm mb-6 min-h-[3rem]">{event.description}</p>

              {user?.role === "student" && (
                <button 
                  onClick={() => handleEnroll(event.id)}
                  className="w-full bg-[var(--color-academia-gold)] text-white py-2 rounded-sm hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  Enroll Now
                </button>
              )}
            </div>
          );
        })}
        {events.length === 0 && (
            <div className="col-span-full text-center py-12 bg-stone-50 rounded-lg border border-dashed border-stone-300">
                <p className="text-stone-500">No upcoming beehive events.</p>
            </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4">
            <h3 className="text-xl font-bold text-[var(--color-academia-charcoal)] mb-4">Create Beehive Event</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Topic (Scenario)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Real World Scenario A"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date & Time</label>
                <input 
                  type="datetime-local" 
                  required
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Total Seats</label>
                    <input 
                      type="number" 
                      required
                      value={formData.total_seats}
                      onChange={(e) => setFormData({...formData, total_seats: parseInt(e.target.value)})}
                      className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Entry Fee (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.entry_fee}
                      onChange={(e) => setFormData({...formData, entry_fee: parseFloat(e.target.value)})}
                      className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                    />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[var(--color-academia-charcoal)] text-white px-4 py-2 rounded-sm hover:bg-stone-800"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeehiveEventList;
