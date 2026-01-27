import { useState, useEffect } from "react";
import { updateStudentProfile, addSkills } from "../api";
import { FiBook, FiGithub, FiGlobe, FiVideo } from "react-icons/fi";

const StudentProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    university: "",
    degree: "",
    major: "",
    graduation_year: "",
    bio: "",
    github_url: "",
    scholar_url: "",
    website_url: "",
    intro_video_url: "",
  });
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user?.student_profile) {
      setFormData({
        university: user.student_profile.university || "",
        degree: user.student_profile.degree || "",
        major: user.student_profile.major || "",
        graduation_year: user.student_profile.graduation_year || "",
        bio: user.student_profile.bio || "",
        github_url: user.student_profile.github_url || "",
        scholar_url: user.student_profile.scholar_url || "",
        website_url: user.student_profile.website_url || "",
        intro_video_url: user.student_profile.intro_video_url || "",
      });
    }
    if (user?.skills) {
      setSkills(user.skills.map(s => s.name).join(", "));
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
      // Update profile
      await updateStudentProfile({
        ...formData,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null
      });

      // Update skills
      if (skills.trim()) {
        const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);
        await addSkills(skillList);
      }

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
        <h2 className="text-2xl font-bold flex items-center">
          <FiBook className="mr-2" /> Student Profile
        </h2>
        <p className="opacity-80">Complete your profile to get matched with mentors</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Stanford University"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="B.S. Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tell us about your research interests and background..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Python, Machine Learning, React, Data Analysis"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Links & Portfolio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGithub className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="GitHub Profile URL"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBook className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="scholar_url"
                  value={formData.scholar_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Google Scholar URL"
                />
              </div>

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
                  placeholder="Personal Website URL"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiVideo className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="intro_video_url"
                  value={formData.intro_video_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Intro Video URL"
                />
              </div>
            </div>
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

export default StudentProfileForm;
