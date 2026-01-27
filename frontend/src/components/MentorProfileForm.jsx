import { useState, useEffect } from "react";
import { updateMentorProfile } from "../api";
import { FiUser, FiGlobe } from "react-icons/fi";

const MentorProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    lab_name: "",
    university: "",
    position: "",
    research_areas: "",
    bio: "",
    website_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user?.mentor_profile) {
      setFormData({
        lab_name: user.mentor_profile.lab_name || "",
        university: user.mentor_profile.university || "",
        position: user.mentor_profile.position || "",
        research_areas: user.mentor_profile.research_areas || "",
        bio: user.mentor_profile.bio || "",
        website_url: user.mentor_profile.website_url || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await updateMentorProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      if (onUpdate) onUpdate();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-indigo-600 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <FiUser className="mr-2" /> Mentor Profile
          </h2>
          {user?.mentor_profile?.is_verified ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Verified
            </span>
          ) : (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Pending Verification
            </span>
          )}
        </div>
        <p className="opacity-80 mt-1">Provide details about your research lab and mentorship opportunities</p>
      </div>
      
      <div className="p-6">
        {message.text && (
          <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
              <input
                type="text"
                name="lab_name"
                value={formData.lab_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="AI Research Lab"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University / Institution</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="MIT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Associate Professor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://lab.example.edu"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Research Areas (comma separated)</label>
            <textarea
              name="research_areas"
              value={formData.research_areas}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Computer Vision, NLP, Robotics"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your mentorship style and what you're looking for in students..."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorProfileForm;
