import React, { useState, useEffect } from 'react';
import { createInterest, getInterests } from '../api';

const RealWorldInterest = () => {
  const [interestArea, setInterestArea] = useState('');
  const [preferredIndustry, setPreferredIndustry] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [submittedInterests, setSubmittedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const data = await getInterests();
      setSubmittedInterests(data);
    } catch (err) {
      console.error("Failed to fetch interests", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createInterest({
        interest_area: interestArea,
        preferred_industry: preferredIndustry,
        current_skills: currentSkills
      });
      setInterestArea('');
      setPreferredIndustry('');
      setCurrentSkills('');
      fetchInterests(); // Refresh list
    } catch (err) {
      setError("Failed to submit interest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Real World Project Interest</h2>
      <p className="text-gray-600 mb-6">
        Express your interest in working on real-world projects. We will connect you with industry partners based on your skills and preferences.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Area of Interest</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g. AI, Web Development, IoT"
            value={interestArea}
            onChange={(e) => setInterestArea(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Industry</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g. Fintech, Healthcare, Automotive"
            value={preferredIndustry}
            onChange={(e) => setPreferredIndustry(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Skills</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            rows="3"
            placeholder="List your relevant skills..."
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Submitting...' : 'Submit Interest'}
        </button>
      </form>

      {submittedInterests.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Submitted Interests</h3>
          <div className="space-y-4">
            {submittedInterests.map((interest) => (
              <div key={interest.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{interest.interest_area}</h4>
                    <p className="text-sm text-gray-600">Industry: {interest.preferred_industry || 'Any'}</p>
                    <p className="text-sm text-gray-600 mt-1">Skills: {interest.current_skills}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    interest.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {interest.status.charAt(0).toUpperCase() + interest.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealWorldInterest;
