import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { FiMail, FiMapPin, FiLinkedin, FiGithub, FiGlobe, FiDownload } from 'react-icons/fi';

const StudentProfileModal = ({ 
  isOpen, 
  onClose, 
  student, 
  application = null, 
  onStatusChange = null, 
  statusUpdating = null 
}) => {
  const [activeTab, setActiveTab] = useState('profile');

  if (!isOpen || !student) return null;

  const profile = student.student_profile || {};
  
  const getResumeUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_URL}/${url}`;
  };

  const tabs = ['profile', 'projects', 'experience'];
  if (application?.cover_letter) {
    tabs.push('cover_letter');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-sm w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[var(--color-academia-charcoal)] text-white p-4 md:p-6 flex justify-between items-start shrink-0 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-academia-gold)] rounded-full opacity-10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="flex gap-4 md:gap-6 items-center relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-[var(--color-academia-gold)] flex items-center justify-center text-[var(--color-academia-charcoal)] text-2xl md:text-3xl font-bold font-serif shadow-lg">
                  {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif mb-1">{student.name}</h2>
                  <div className="flex gap-4 text-stone-300 text-sm">
                    <span className="flex items-center gap-1"><FiMail className="text-[var(--color-academia-gold)]" /> {student.email}</span>
                    {profile.city && (
                      <span className="flex items-center gap-1"><FiMapPin className="text-[var(--color-academia-gold)]" /> {profile.city}</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-stone-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-stone-50 border-b border-stone-200 px-4 md:px-6 flex gap-4 md:gap-6 shrink-0 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === tab 
                      ? 'border-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)]' 
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="p-4 md:p-8 overflow-y-auto grow bg-white">
              
              {activeTab === 'profile' && (
                <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                     {application && (
                       <div className="p-4 bg-[var(--color-academia-cream)] border border-[var(--color-academia-gold)] rounded-sm text-center shadow-sm">
                          <div className="text-2xl font-bold text-[var(--color-academia-charcoal)] font-serif">{application.match_score}%</div>
                          <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Match Score</div>
                       </div>
                     )}
                     <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm text-center">
                        <div className="text-lg font-bold text-[var(--color-academia-charcoal)]">
                          {profile.gpa || "N/A"}
                        </div>
                        <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">GPA</div>
                     </div>
                     <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm text-center">
                        <div className="text-lg font-bold text-[var(--color-academia-charcoal)] line-clamp-1">
                          {profile.major || "N/A"}
                        </div>
                        <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Major</div>
                     </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <h3 className="font-serif text-[var(--color-academia-charcoal)] border-b border-[var(--color-academia-gold)] pb-2 mb-4 text-xl font-bold">About</h3>
                    <p className="text-stone-700 leading-relaxed text-lg font-light">
                      {profile.bio || "No bio available."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-serif text-[var(--color-academia-charcoal)] border-b border-stone-200 pb-2 mb-4 font-bold text-lg">Education</h3>
                      {profile.educations?.length > 0 ? (
                         profile.educations.map((edu, i) => (
                           <div key={i} className="mb-4 last:mb-0">
                             <div className="font-bold text-[var(--color-academia-charcoal)] text-lg">{edu.institution}</div>
                             <div className="text-stone-600">{edu.degree}</div>
                             <div className="text-xs text-stone-400 font-mono mt-1">{edu.start_year} - {edu.end_year}</div>
                           </div>
                         ))
                      ) : (
                        <div className="mb-4">
                           <div className="font-bold text-[var(--color-academia-charcoal)]">
                              {profile.university || "University not listed"}
                           </div>
                           <div className="text-stone-600">
                              {profile.degree}
                           </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-serif text-[var(--color-academia-charcoal)] border-b border-stone-200 pb-2 mb-4 font-bold text-lg">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.primary_skills || profile.skills ? (
                          (profile.primary_skills || profile.skills).split(',').map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-white text-[var(--color-academia-charcoal)] text-sm rounded-sm border border-stone-200 shadow-sm font-medium hover:border-[var(--color-academia-gold)] transition-colors">
                              {skill.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-500 italic">No skills listed.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex gap-4 pt-6 border-t border-stone-100">
                      {profile.github_url && (
                          <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 hover:text-[var(--color-academia-charcoal)] transition-colors">
                            <FiGithub /> <span className="text-sm font-medium">GitHub</span>
                          </a>
                      )}
                      {profile.linkedin_url && (
                          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 hover:text-[#0077b5] transition-colors">
                            <FiLinkedin /> <span className="text-sm font-medium">LinkedIn</span>
                          </a>
                      )}
                      {profile.website_url && (
                          <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 hover:text-[var(--color-academia-gold)] transition-colors">
                            <FiGlobe /> <span className="text-sm font-medium">Portfolio</span>
                          </a>
                      )}
                  </div>
                </div>
              )}
              
              {activeTab === 'projects' && (
                <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
                  {profile.projects?.length > 0 ? (
                    profile.projects.map((project, i) => (
                      <div key={i} className="bg-stone-50 border border-stone-200 p-6 rounded-sm hover:border-[var(--color-academia-gold)] transition-colors hover:shadow-md">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold font-serif text-[var(--color-academia-charcoal)]">{project.title}</h4>
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-academia-gold)] hover:underline text-sm flex items-center gap-1 font-medium">
                              View Project <FiGlobe />
                            </a>
                          )}
                        </div>
                        <p className="text-stone-600 mb-4 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack && project.tech_stack.split(',').map((tech, j) => (
                            <span key={j} className="text-xs font-mono bg-white border border-stone-200 px-2 py-1 text-stone-500 rounded-sm">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-stone-400 italic bg-stone-50 rounded-sm border border-stone-100">
                      No projects listed in this profile.
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'experience' && (
                <div className="space-y-8 max-w-3xl mx-auto animate-fade-in pl-4">
                  {profile.work_experiences?.length > 0 ? (
                    profile.work_experiences.map((exp, i) => (
                      <div key={i} className="relative pl-8 border-l-2 border-stone-200 last:border-0 pb-8">
                         <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--color-academia-gold)] border-2 border-white ring-1 ring-stone-100"></div>
                         <h4 className="text-lg font-bold text-[var(--color-academia-charcoal)]">{exp.title}</h4>
                         <div className="text-stone-600 font-medium mb-1">{exp.company}</div>
                         <div className="text-xs text-stone-400 uppercase mb-3 font-mono tracking-wide">{exp.start_date} - {exp.end_date}</div>
                         <p className="text-stone-600 text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                     <div className="text-center py-12 text-stone-400 italic bg-stone-50 rounded-sm border border-stone-100">
                      No work experience listed.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cover_letter' && application?.cover_letter && (
                  <div className="max-w-3xl mx-auto animate-fade-in">
                    <div className="bg-[var(--color-academia-cream)] p-8 rounded-sm border border-[var(--color-academia-gold)] shadow-inner">
                      <h3 className="font-serif text-2xl mb-6 text-[var(--color-academia-charcoal)] font-bold">Statement of Purpose</h3>
                      <div className="prose prose-stone font-serif leading-loose text-stone-800 whitespace-pre-wrap">
                        {application.cover_letter}
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-stone-50 border-t border-stone-200 p-4 md:p-6 shrink-0 flex justify-between items-center">
              {application && onStatusChange ? (
                <>
                  <div className="text-stone-500 text-sm">
                    Status: <span className={`font-bold uppercase ${
                      application.status === 'accepted' ? 'text-green-700' :
                      application.status === 'rejected' ? 'text-red-700' : 'text-stone-700'
                    }`}>{application.status}</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => onStatusChange(application.id, 'rejected')}
                      disabled={statusUpdating === application.id}
                      className="px-6 py-2 border border-red-300 text-red-700 hover:bg-red-50 font-bold rounded-sm transition-colors flex items-center gap-2"
                    >
                      <FaTimes /> Reject
                    </button>
                    <button
                      onClick={() => onStatusChange(application.id, 'accepted')}
                      disabled={statusUpdating === application.id}
                      className="px-8 py-2 bg-[var(--color-academia-charcoal)] text-white hover:bg-stone-800 font-bold rounded-sm transition-colors shadow-lg flex items-center gap-2"
                    >
                      {statusUpdating === application.id ? 'Processing...' : <><FaCheck /> Accept Candidate</>}
                    </button>
                  </div>
                </>
              ) : (
                 <div className="w-full flex justify-end">
                    {profile.resume_url && (
                        <a 
                          href={getResumeUrl(profile.resume_url)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-6 py-3 rounded-sm hover:bg-black transition-all shadow-md font-bold tracking-wide border border-transparent hover:border-[var(--color-academia-gold)]"
                        >
                          <FiDownload className="mr-2 text-[var(--color-academia-gold)]" /> Download Resume
                        </a>
                     )}
                 </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StudentProfileModal;