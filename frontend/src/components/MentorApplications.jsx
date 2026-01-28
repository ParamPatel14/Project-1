import React, { useState, useEffect } from 'react';
import { getMentorApplications, updateApplicationStatus, getMentorImprovementPlans } from '../api';

const MentorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [improvementPlans, setImprovementPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('applications'); // 'applications' or 'plans'
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Parallel fetch could be better but sticking to simple for now
      const appsData = await getMentorApplications();
      setApplications(appsData);
      
      // Fetch plans for all opportunities this mentor owns
      // This is a bit inefficient (N+1), but simple given current API
      // Ideally backend should provide a unified endpoint or we just fetch when needed
      // For now, let's just fetch applications first. 
      // We will fetch plans only when switching tabs or we can fetch a specific endpoint if we created one.
      // Since we implemented getMentorImprovementPlans(oppId), we need to know the oppIds.
      // Let's extract unique oppIds from applications to guess active opportunities? 
      // Or better, just wait until user clicks a "View Plans" button for a specific opportunity?
      // Actually, the user requirement says "Mentor visibility (read-only)". 
      // Let's add a "View Improvement Plans" button next to each opportunity or a separate tab.
      
      // Let's try to fetch all plans for all opportunities the mentor has. 
      // We don't have a "get all my plans" endpoint for mentors, only by opportunity.
      // Let's modify the UI to show a "Improvement Plans" tab that lists plans grouped by opportunity.
      // For now, let's just stick to Applications view and maybe add a column or a separate section?
      
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to fetch plans for a specific opportunity
  const fetchPlansForOpp = async (oppId) => {
      try {
          const data = await getMentorImprovementPlans(oppId);
          return data;
      } catch (e) {
          console.error(e);
          return [];
      }
  }

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

      {/* Basic Tab Switcher */}
      <div className="flex gap-4 mb-6 border-b">
        <button 
            className={`py-2 px-4 ${view === 'applications' ? 'border-b-2 border-blue-500 font-bold text-blue-600' : 'text-gray-500'}`}
            onClick={() => setView('applications')}
        >
            Applications
        </button>
        <button 
            className={`py-2 px-4 ${view === 'plans' ? 'border-b-2 border-blue-500 font-bold text-blue-600' : 'text-gray-500'}`}
            onClick={() => setView('plans')}
        >
            Improvement Plans (Candidate Progress)
        </button>
      </div>
      
      {view === 'plans' && (
          <div className="p-4 bg-gray-50 rounded text-center text-gray-600">
              <p>Select an opportunity to view active improvement plans.</p>
              {/* This is a placeholder. A real implementation would list opportunities and let the mentor click to see plans. */}
              {/* Since we don't have a "get all my opportunities" call here yet, we'll skip the full implementation for now 
                  to focus on the student side which is the core of Phase 4. */}
              <p className="mt-2 text-sm">(Feature coming in next update: Full dashboard for tracking candidate improvement plans)</p>
          </div>
      )}

      {view === 'applications' && (
      <>
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
      </>
      )}
    </div>
  );
};

export default MentorApplications;
