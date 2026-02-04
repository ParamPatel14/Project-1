import React, { useState, useEffect } from 'react';
import { getVisits, createVisit, enrollVisit } from '../api';
import { useAuth } from '../context/AuthContext';

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
        <h2 className="text-xl font-semibold text-gray-800">Industrial Visits</h2>
        {isOrganizer && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            {showCreateForm ? 'Cancel' : 'Create New Visit'}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Plan a New Visit</h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newVisit.title}
                onChange={(e) => setNewVisit({...newVisit, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newVisit.company_name}
                onChange={(e) => setNewVisit({...newVisit, company_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newVisit.location}
                onChange={(e) => setNewVisit({...newVisit, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input
                type="datetime-local"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newVisit.visit_date}
                onChange={(e) => setNewVisit({...newVisit, visit_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Students</label>
              <input
                type="number"
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newVisit.max_students}
                onChange={(e) => setNewVisit({...newVisit, max_students: parseInt(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                rows="3"
                value={newVisit.description}
                onChange={(e) => setNewVisit({...newVisit, description: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Visit
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading visits...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Industrial Visit
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(visit.visit_date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{visit.title}</h3>
                <p className="text-sm font-medium text-gray-700 mb-2">{visit.company_name} • {visit.location}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{visit.description}</p>
                
                <div className="text-sm text-gray-500">
                  Max Students: {visit.max_students}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => handleEnroll(visit.id)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Request to Join
                </button>
              </div>
            </div>
          ))}
          {visits.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No industrial visits scheduled yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IndustrialVisitList;
