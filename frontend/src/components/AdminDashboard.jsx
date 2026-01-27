import { useState, useEffect } from "react";
import { getPendingMentors, verifyMentor } from "../api";
import { FiCheck, FiX, FiShield } from "react-icons/fi";

const AdminDashboard = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = async () => {
    try {
      const data = await getPendingMentors();
      setMentors(data);
    } catch (error) {
      console.error("Failed to fetch pending mentors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleVerify = async (userId) => {
    try {
      await verifyMentor(userId);
      setMentors(mentors.filter(m => m.user_id !== userId));
    } catch (error) {
      console.error("Failed to verify mentor", error);
      alert("Failed to verify mentor");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-600">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiShield className="mr-2" /> Admin Dashboard
        </h2>
        <p className="text-gray-600 mt-2">Manage user verifications and platform settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Pending Mentor Verifications</h3>
        </div>
        
        {mentors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending verifications.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {mentors.map((mentor) => (
              <li key={mentor.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{mentor.lab_name}</h4>
                    <p className="text-gray-600">{mentor.university} - {mentor.position}</p>
                    <p className="text-sm text-gray-500 mt-1">User ID: {mentor.user_id}</p>
                    {mentor.website_url && (
                      <a href={mentor.website_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-sm mt-1 block">
                        {mentor.website_url}
                      </a>
                    )}
                    <p className="mt-2 text-gray-700 bg-gray-100 p-2 rounded text-sm">
                      {mentor.bio || "No bio provided."}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVerify(mentor.user_id)}
                      className="flex items-center bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <FiCheck className="mr-1" /> Verify
                    </button>
                    {/* Add Reject functionality later if needed */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
