import React, { useState, useEffect } from 'react';
import { getMentorApplications, updateApplicationStatus } from '../api';

const MentorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getMentorApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdating(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      // Update local state
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    } finally {
      setStatusUpdating(null);
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

  const getScoreColor = (score) => {
      if (!score) return 'text-gray-500';
      if (score >= 80) return 'text-green-600 font-bold';
      if (score >= 50) return 'text-yellow-600 font-bold';
      return 'text-red-600';
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Applications</h2>
      
      {applications.length === 0 ? (
        <p className="text-gray-500">No applications received yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Opportunity
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cover Letter
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="font-bold text-gray-700">#{index + 1}</span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={getScoreColor(app.match_score)}>
                        {app.match_score ? `${app.match_score}%` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                           Student ID: {app.student_id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Opp ID: {app.opportunity_id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap truncate max-w-xs" title={app.cover_letter}>
                      {app.cover_letter}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${getStatusColor(app.status)}`}
                    >
                      <span aria-hidden className="absolute inset-0 opacity-50 rounded-full"></span>
                      <span className="relative capitalize">{app.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex flex-col gap-2">
                      {statusUpdating === app.id ? (
                        <span className="text-gray-500">Updating...</span>
                      ) : (
                        <>
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(app.id, 'reviewing')}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                Review
                              </button>
                            </>
                          )}
                          {app.status === 'reviewing' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(app.id, 'accepted')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusChange(app.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MentorApplications;
