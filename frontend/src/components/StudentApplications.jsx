import React, { useState, useEffect } from 'react';
import { getMyApplications } from '../api';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'reviewing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <div>Loading your applications...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Applications</h2>
      
      {applications.length === 0 ? (
        <p className="text-gray-500">You haven't submitted any applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-150">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">
                  Applied on {new Date(app.created_at).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                  {app.status.toUpperCase()}
                </span>
              </div>
              <div className="mb-2">
                <p className="text-gray-900 font-medium">Opportunity ID: {app.opportunity_id}</p>
                {/* Ideally we'd show the opportunity title here, but we need to fetch it or include it in the response */}
              </div>
              <div>
                 <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Cover Letter</h4>
                 <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">{app.cover_letter}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
