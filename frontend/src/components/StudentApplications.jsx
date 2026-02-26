import React, { useState, useEffect } from 'react';
import { getMyApplications } from '../api';
import { 
  FiFileText, FiCalendar, FiClock, FiCheckCircle, FiXCircle, 
  FiAlertCircle, FiChevronRight, FiBriefcase, FiHash, FiTarget 
} from 'react-icons/fi';
import CubeLoader from './ui/CubeLoader';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'accepted': 
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: <FiCheckCircle /> };
      case 'rejected': 
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: <FiXCircle /> };
      case 'reviewing': 
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <FiClock /> };
      default: 
        return { color: 'bg-blue-50 text-blue-800 border-blue-200', icon: <FiAlertCircle /> };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[var(--color-academia-cream)]">
        <CubeLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-[var(--color-academia-cream)] min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4 md:gap-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">My Applications</h2>
          <p className="text-stone-500 font-serif text-base md:text-lg">Track the status of your research proposals and internships</p>
        </div>
        <div className="w-full md:w-auto bg-white px-6 py-3 rounded-sm shadow-sm border border-[var(--color-academia-gold)] text-sm font-bold text-[var(--color-academia-charcoal)] text-center md:text-left">
          Total Applications: <span className="text-[var(--color-academia-gold)] text-lg ml-2">{applications.length}</span>
        </div>
      </div>
      
      {applications.length === 0 ? (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-sm shadow-md border-t-4 border-[var(--color-academia-charcoal)] p-16 text-center"
        >
          <div className="w-24 h-24 bg-[var(--color-academia-cream)] rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--color-academia-gold)]">
            <FiFileText size={40} className="text-[var(--color-academia-charcoal)]" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-4">No Applications Yet</h3>
          <p className="text-stone-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            You haven't submitted any research proposals yet. Identify gaps in current research and apply to align with a mentor.
          </p>
          <a href="/opportunities" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-sm text-[var(--color-academia-cream)] bg-[var(--color-academia-charcoal)] hover:bg-stone-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Browse Research Opportunities
          </a>
        </motion.div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, index) => {
            const statusConfig = getStatusConfig(app.status);
            const opportunity = app.opportunity || {};
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className="bg-white rounded-sm shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full hover:border-[var(--color-academia-gold)]"
              >
                {/* Card Header */}
                <div className="p-8 pb-6 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {app.status}
                    </span>
                    <span className="text-stone-400 text-xs flex items-center gap-1 font-mono">
                      <FiCalendar size={12} />
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-3 line-clamp-2 group-hover:text-[var(--color-academia-gold)] transition-colors leading-snug">
                    {opportunity.title || `Opportunity #${app.opportunity_id}`}
                  </h3>
                  
                  {opportunity.mentor && (
                    <div className="flex items-center gap-3 mb-4 text-sm text-stone-600">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-academia-cream)] flex items-center justify-center text-[var(--color-academia-charcoal)] font-bold text-xs border border-[var(--color-academia-gold)]">
                        {opportunity.mentor.name ? opportunity.mentor.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <span className="truncate font-medium">{opportunity.mentor.name || 'Unknown Mentor'}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-stone-500 mb-4 font-medium">
                    <FiBriefcase className="flex-shrink-0 text-[var(--color-academia-gold)]" />
                    <span className="truncate uppercase tracking-wide text-xs">{opportunity.type ? opportunity.type.replace('_', ' ') : 'Internship'}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-8 py-5 bg-[var(--color-academia-cream)] border-t border-stone-100 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[var(--color-academia-charcoal)]">
                        <FiTarget className="text-[var(--color-academia-gold)]" />
                        <span className="font-bold">Match: {Math.round(app.match_score)}%</span>
                    </div>
                    <span className="text-[var(--color-academia-charcoal)] font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        Details <FiChevronRight />
                    </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-[var(--color-academia-charcoal)]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-t-4 border-[var(--color-academia-gold)] mx-4 md:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 md:p-8 border-b border-stone-100 flex justify-between items-start bg-[var(--color-academia-cream)]">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-2">
                  {selectedApp.opportunity?.title || 'Application Details'}
                </h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-stone-500 font-mono">
                    <span className="flex items-center gap-1">
                        <FiHash /> ID: {selectedApp.id}
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span>Applied: {new Date(selectedApp.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-2 text-stone-400 hover:text-[var(--color-academia-charcoal)] hover:bg-stone-100 rounded-full transition"
              >
                <FiXCircle size={28} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-8 space-y-6 md:space-y-10">
              {/* Status Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 bg-white border border-stone-200 p-4 md:p-6 rounded-sm shadow-sm">
                <div>
                    <p className="text-xs uppercase font-bold text-stone-500 mb-2 tracking-wider">Current Status</p>
                    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-sm text-base font-bold capitalize ${getStatusConfig(selectedApp.status).color}`}>
                        {getStatusConfig(selectedApp.status).icon}
                        {selectedApp.status}
                    </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                    <p className="text-xs uppercase font-bold text-stone-500 mb-2 tracking-wider">Alignment Score</p>
                    <div className="text-4xl font-serif font-bold text-[var(--color-academia-charcoal)]">{Math.round(selectedApp.match_score)}%</div>
                </div>
              </div>

              {/* Cover Letter Section */}
              <div>
                <h4 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center gap-3 border-b border-[var(--color-academia-gold)] pb-2">
                    <FiFileText className="text-[var(--color-academia-gold)]" />
                    Cover Letter
                </h4>
                <div className="bg-stone-50 p-4 md:p-8 rounded-sm border-l-4 border-[var(--color-academia-charcoal)] text-stone-700 leading-relaxed whitespace-pre-wrap font-serif text-base md:text-lg">
                  {selectedApp.cover_letter}
                </div>
              </div>

              {/* Additional Details */}
              {selectedApp.opportunity && (
                 <div>
                    <h4 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center gap-3 border-b border-[var(--color-academia-gold)] pb-2">
                        <FiTarget className="text-[var(--color-academia-gold)]" />
                        Opportunity Summary
                    </h4>
                    <div className="bg-[var(--color-academia-cream)] p-4 md:p-6 rounded-sm border border-[var(--color-academia-gold)]/30">
                        {selectedApp.opportunity.mentor && (
                            <p className="text-stone-700 mb-3 flex flex-wrap items-center gap-2 text-base md:text-lg">
                                <span className="font-bold text-[var(--color-academia-charcoal)]">Mentor:</span> 
                                <span className="bg-white px-3 py-1 rounded-sm text-sm border border-stone-200 font-serif">{selectedApp.opportunity.mentor.name}</span>
                            </p>
                        )}
                        <p className="text-stone-700 mb-3 text-base md:text-lg">
                            <span className="font-bold text-[var(--color-academia-charcoal)]">Type:</span> {selectedApp.opportunity.type}
                        </p>
                         <p className="text-stone-700 leading-relaxed text-base md:text-lg">
                            <span className="font-bold text-[var(--color-academia-charcoal)] block mb-1">Description:</span> {selectedApp.opportunity.description}
                        </p>
                    </div>
                 </div>
              )}

              {/* Curriculum Section (Only if Accepted) */}
              {selectedApp.status === 'accepted' && selectedApp.opportunity && selectedApp.opportunity.curriculum && (
                 <div>
                    <h4 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center gap-3 border-b border-[var(--color-academia-gold)] pb-2">
                        <FiBriefcase className="text-[var(--color-academia-gold)]" />
                        Research Curriculum
                    </h4>
                    <div className="bg-green-50 p-4 md:p-8 rounded-sm border border-green-200 text-stone-800 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                        {selectedApp.opportunity.curriculum}
                    </div>
                 </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 md:p-8 border-t border-stone-100 bg-stone-50 flex justify-end">
                <button 
                    onClick={() => setSelectedApp(null)}
                    className="px-8 py-3 bg-white border border-stone-300 text-[var(--color-academia-charcoal)] font-bold rounded-sm hover:bg-stone-50 transition shadow-sm uppercase tracking-wide text-sm"
                >
                    Close
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
