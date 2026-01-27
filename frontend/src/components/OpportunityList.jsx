import React, { useState, useEffect } from 'react';
import { getOpportunities, applyForOpportunity } from '../api';

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOpportunities();
  }, [filterType]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const filters = filterType ? { type: filterType } : {};
      const data = await getOpportunities(filters);
      setOpportunities(data);
    } catch (err) {
      console.error("Failed to fetch opportunities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (id) => {
    setApplyingId(id);
    setCoverLetter('');
    setMessage({ type: '', text: '' });
  };

  const handleCancelApply = () => {
    setApplyingId(null);
    setCoverLetter('');
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      await applyForOpportunity({
        opportunity_id: applyingId,
        cover_letter: coverLetter
      });
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setTimeout(() => {
        setApplyingId(null);
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to submit application.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse Opportunities</h2>

      {/* Filter */}
      <div className="mb-6">
        <label className="mr-2 font-medium text-gray-700">Filter by Type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="internship">Internship</option>
          <option value="research_assistant">Research Assistant</option>
          <option value="phd_guidance">PhD Guidance</option>
          <option value="collaboration">Grant Collaboration</option>
        </select>
      </div>

      {loading ? (
        <p>Loading opportunities...</p>
      ) : (
        <div className="space-y-6">
          {opportunities.length === 0 ? (
            <p className="text-gray-500">No opportunities found.</p>
          ) : (
            opportunities.map((opp) => (
              <div key={opp.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">{opp.title}</h3>
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 mt-2">
                      {opp.type.replace('_', ' ')}
                    </span>
                    <p className="text-gray-600 mt-2">{opp.description}</p>
                    {opp.requirements && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700">Requirements:</h4>
                        <p className="text-gray-600 text-sm">{opp.requirements}</p>
                      </div>
                    )}
                  </div>
                  {opp.is_open ? (
                    <button
                      onClick={() => handleApplyClick(opp.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Apply
                    </button>
                  ) : (
                    <span className="bg-red-100 text-red-600 py-1 px-3 rounded text-sm font-bold">Closed</span>
                  )}
                </div>

                {/* Application Form (Inline) */}
                {applyingId === opp.id && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="font-bold text-lg mb-2">Apply for {opp.title}</h4>
                    {message.text && (
                      <div className={`px-4 py-2 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                      </div>
                    )}
                    <form onSubmit={handleSubmitApplication}>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Cover Letter</label>
                        <textarea
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          rows="4"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Introduce yourself and explain why you're a good fit..."
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelApply}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Submit Application
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OpportunityList;
