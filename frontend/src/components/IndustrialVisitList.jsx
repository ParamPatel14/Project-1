import React, { useState, useEffect } from 'react';
import { getVisits, createVisit, enrollVisit } from '../api';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiMapPin, FiUsers, FiBriefcase, FiPlus, FiGlobe } from 'react-icons/fi';

const IndustrialVisitList = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form State
  const [newVisit, setNewVisit] = useState({
    title: '',
    company_name: '',
    location: '',
    description: '',
    visit_date: '',
    max_students: 20
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const data = await getVisits();
      setVisits(data);
    } catch (err) {
      console.error("Failed to fetch visits", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (visitId) => {
    try {
      await enrollVisit(visitId);
      alert("Enrolled successfully! Status is pending selection.");
      fetchVisits(); // Refresh to update any status if we were to show it
    } catch (err) {
      alert("Failed to enroll: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVisit(newVisit);
      setShowCreateForm(false);
      setNewVisit({
        title: '',
        company_name: '',
        location: '',
        description: '',
        visit_date: '',
        max_students: 20
      });
      fetchVisits();
    } catch (err) {
      alert("Failed to create visit: " + (err.response?.data?.detail || err.message));
    }
  };

  const isOrganizer = user?.role === 'admin' || user?.role === 'mentor';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)]">Industrial Visits</h2>
        {isOrganizer && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] rounded-sm hover:opacity-90 transition-all shadow-md flex items-center gap-2 font-medium"
          >
            <FiPlus /> {showCreateForm ? 'Cancel' : 'Create New Visit'}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-sm shadow-md border-t-4 border-[var(--color-academia-gold)] animate-fade-in">
          <h3 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-4">Plan a New Visit</h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-600">Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newVisit.title}
                onChange={(e) => setNewVisit({...newVisit, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600">Company Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newVisit.company_name}
                onChange={(e) => setNewVisit({...newVisit, company_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600">Location</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newVisit.location}
                onChange={(e) => setNewVisit({...newVisit, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600">Date & Time</label>
              <input
                type="datetime-local"
                required
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newVisit.visit_date}
                onChange={(e) => setNewVisit({...newVisit, visit_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600">Max Students</label>
              <input
                type="number"
                required
                min="1"
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                value={newVisit.max_students}
                onChange={(e) => setNewVisit({...newVisit, max_students: parseInt(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-600">Description</label>
              <textarea
                className="mt-1 block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)] sm:text-sm p-2 border"
                rows="3"
                value={newVisit.description}
                onChange={(e) => setNewVisit({...newVisit, description: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-sm text-[var(--color-academia-cream)] bg-[var(--color-academia-charcoal)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-academia-gold)]"
              >
                Create Visit
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-stone-500 italic font-serif animate-pulse">Loading visits...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200 hover:border-[var(--color-academia-gold)] group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)]">
                    <FiGlobe className="mr-1" /> Visit
                  </span>
                  <span className="text-sm text-stone-500 font-serif italic">
                    {new Date(visit.visit_date).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-2 group-hover:text-[var(--color-academia-gold)] transition-colors">
                  {visit.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-stone-600">
                    <FiBriefcase className="mr-2 text-[var(--color-academia-gold)]" />
                    <span className="font-medium">{visit.company_name}</span>
                  </div>
                  <div className="flex items-center text-sm text-stone-600">
                    <FiMapPin className="mr-2 text-[var(--color-academia-gold)]" />
                    <span>{visit.location}</span>
                  </div>
                </div>

                <p className="text-stone-600 text-sm mb-4 line-clamp-3 font-light leading-relaxed">
                  {visit.description}
                </p>
                
                <div className="flex items-center text-sm text-stone-500 border-t border-stone-100 pt-3">
                  <FiUsers className="mr-2 text-stone-400" />
                  <span>Max Students: {visit.max_students}</span>
                </div>
              </div>
              
              <div className="bg-[var(--color-academia-cream)] px-6 py-4 border-t border-stone-200">
                <button
                  onClick={() => handleEnroll(visit.id)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-[var(--color-academia-charcoal)] text-sm font-medium rounded-sm text-[var(--color-academia-charcoal)] bg-transparent hover:bg-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-cream)] transition-all duration-300"
                >
                  Request to Join
                </button>
              </div>
            </div>
          ))}
          {visits.length === 0 && (
            <div className="col-span-full text-center py-12 text-stone-500 bg-white rounded-sm border border-dashed border-stone-300 font-serif italic">
              No industrial visits scheduled yet. Check back soon.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IndustrialVisitList;