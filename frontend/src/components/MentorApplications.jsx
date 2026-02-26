import React, { useState, useEffect } from 'react';
import { getMentorApplications, updateApplicationStatus } from '../api';
import { FaTimes, FaCheck, FaBan, FaSearch, FaFilter } from 'react-icons/fa';
import { FiUser, FiMail, FiMapPin, FiLinkedin, FiGithub, FiGlobe, FiFileText, FiBriefcase, FiBookOpen, FiAward, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import StudentProfileModal from "./StudentProfileModal";
import CubeLoader from "./ui/CubeLoader";

const MentorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('applications'); // 'applications' or 'plans'
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const appsData = await getMentorApplications();
      setApplications(appsData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setShowDetailsModal(true);
    setActiveTab('profile');
  };

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdating(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
      if (selectedApplication && selectedApplication.id === appId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-800 bg-green-100 border-green-300';
      case 'rejected': return 'text-red-800 bg-red-100 border-red-300';
      case 'reviewing': return 'text-amber-800 bg-amber-100 border-amber-300';
      default: return 'text-stone-600 bg-stone-100 border-stone-300';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-academia-cream)]">
      <CubeLoader />
    </div>
  );

  return (
    <div className="bg-stone-50 min-h-screen p-8 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 border-b border-[var(--color-academia-gold)] pb-6">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-[var(--color-academia-charcoal)] mb-2">Talent Identification</h1>
          <p className="text-stone-600 max-w-2xl text-lg">Review and align with high-potential candidates for your research opportunities.</p>
        </header>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-all capitalize ${
                  filterStatus === status 
                    ? 'bg-[var(--color-academia-charcoal)] text-white shadow-md' 
                    : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="text-stone-500 font-serif italic">
            Showing {filteredApplications.length} candidates
          </div>
        </div>

        {/* Grid Layout */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm shadow-sm border border-stone-200">
            <p className="text-stone-400 text-xl font-serif">No candidates found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredApplications.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-sm border-t-4 border-[var(--color-academia-gold)] shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-academia-cream)] border border-[var(--color-academia-gold)] flex items-center justify-center text-[var(--color-academia-charcoal)] font-bold font-serif text-lg">
                        {app.student?.name ? app.student.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-academia-charcoal)] font-serif text-lg leading-tight">
                          {app.student?.name || "Unknown Candidate"}
                        </h3>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">
                          {app.student?.student_profile?.university || "University N/A"}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-sm text-xs font-bold border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </div>
                  </div>

                  <div className="mb-4 bg-stone-50 p-3 rounded-sm border border-stone-100">
                    <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Applying For</p>
                    <p className="text-sm font-semibold text-[var(--color-academia-charcoal)] line-clamp-1">
                      {app.opportunity?.title || "Unknown Opportunity"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                     <div className="text-center">
                        <span className="block text-2xl font-bold text-[var(--color-academia-gold)] font-serif">
                          {app.match_score}%
                        </span>
                        <span className="text-xs text-stone-400 uppercase">Match</span>
                     </div>
                     <div className="text-right">
                        <span className="block text-sm font-semibold text-stone-600">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-stone-400 uppercase">Date</span>
                     </div>
                  </div>

                  <button
                    onClick={() => handleViewApplication(app)}
                    className="mt-auto w-full py-3 bg-[var(--color-academia-charcoal)] text-white text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors rounded-sm flex items-center justify-center gap-2"
                  >
                    <FiSearch /> Review Profile
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      <StudentProfileModal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        student={selectedApplication?.student} 
        application={selectedApplication}
        onStatusChange={handleStatusChange}
        statusUpdating={statusUpdating}
      />
    </div>
  );
};

export default MentorApplications;
