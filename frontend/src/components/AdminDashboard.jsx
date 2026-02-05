import { useState, useEffect } from "react";
import { getPendingMentors, verifyMentor, getAllStudents, getAllMentors, getOpportunities, createAdminOpportunity, getAllApplications } from "../api";
import { FiCheck, FiX, FiShield, FiUsers, FiBriefcase, FiPlus, FiFileText, FiDownload, FiExternalLink, FiCpu, FiBarChart2, FiHexagon } from "react-icons/fi";
import OpportunityForm from "./OpportunityForm";
import AnalyticsDashboard from "./AnalyticsDashboard";
import BeehiveEventList from "./BeehiveEventList";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingMentors, setPendingMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [showOppModal, setShowOppModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const data = await getPendingMentors();
        setPendingMentors(data);
      } else if (activeTab === 'students') {
        const data = await getAllStudents();
        setStudents(data);
      } else if (activeTab === 'mentors') {
        const data = await getAllMentors();
        setMentors(data);
      } else if (activeTab === 'internships') {
        const data = await getOpportunities(); // Reuse public getOpportunities, admin can see all
        setOpportunities(data);
      } else if (activeTab === 'applications') {
        const data = await getAllApplications();
        setApplications(data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${activeTab} data`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await verifyMentor(userId);
      setPendingMentors(pendingMentors.filter(m => m.user_id !== userId));
    } catch (error) {
      console.error("Failed to verify mentor", error);
      alert("Failed to verify mentor");
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const getResumeUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    return `http://localhost:8000/${url}`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiShield },
    { id: 'students', label: 'Students', icon: FiUsers },
    { id: 'mentors', label: 'Mentors', icon: FiBriefcase },
    { id: 'internships', label: 'Internships', icon: FiCpu },
    { id: 'applications', label: 'Applications', icon: FiFileText },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
    { id: 'beehive', label: 'Beehive Events', icon: FiHexagon },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Card */}
      <div className="bg-white p-8 rounded-sm shadow-sm border border-[var(--color-academia-gold)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-academia-cream)] rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold text-[var(--color-academia-charcoal)] flex items-center mb-2">
            <FiShield className="mr-3 text-[var(--color-academia-gold)]" /> Admin Portal
          </h2>
          <p className="text-stone-600 font-light text-lg">Platform Management & Monitoring</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-sm shadow-sm border border-stone-200">
        <div className="border-b border-stone-200 overflow-x-auto">
          <nav className="flex space-x-1 p-2 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group flex items-center px-6 py-3 font-serif font-medium text-sm rounded-sm transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] shadow-md'
                    : 'text-stone-500 hover:bg-[var(--color-academia-cream)] hover:text-[var(--color-academia-charcoal)]'
                  }
                `}
              >
                <tab.icon className={`mr-2 h-4 w-4 ${activeTab === tab.id ? 'text-[var(--color-academia-gold)]' : 'text-stone-400 group-hover:text-[var(--color-academia-charcoal)]'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-academia-gold)]"></div>
            </div>
          ) : (
            <>
              {/* ANALYTICS TAB */}
              {activeTab === 'analytics' && (
                <div className="p-6">
                  <AnalyticsDashboard title="Platform Analytics" />
                </div>
              )}

              {/* BEEHIVE TAB */}
              {activeTab === 'beehive' && (
                <div className="p-6">
                  <BeehiveEventList />
                </div>
              )}

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="p-8">
                   <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-6 flex items-center">
                     <span className="w-2 h-8 bg-[var(--color-academia-gold)] mr-3 rounded-sm"></span>
                     Pending Mentor Verifications
                   </h3>
                   {pendingMentors.length === 0 ? (
                    <div className="bg-[var(--color-academia-cream)] rounded-sm p-8 text-center border border-dashed border-stone-300">
                      <p className="text-stone-500 italic">All caught up! No pending verifications.</p>
                    </div>
                  ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingMentors.map((mentor) => (
                        <li key={mentor.id} className="bg-white border border-stone-200 rounded-sm p-6 hover:border-[var(--color-academia-gold)] transition-all shadow-sm hover:shadow-md group">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-serif font-bold text-lg text-[var(--color-academia-charcoal)]">{mentor.lab_name}</p>
                              <p className="text-sm text-stone-600 mt-1 flex items-center">
                                <span className="font-semibold mr-1">{mentor.university}</span> • <span className="italic ml-1">{mentor.position}</span>
                              </p>
                              <p className="text-xs text-stone-400 mt-2 font-mono">{mentor.email}</p>
                            </div>
                            <button
                              onClick={() => handleVerify(mentor.user_id)}
                              className="flex items-center bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-4 py-2 rounded-sm hover:bg-black transition-colors shadow-sm text-sm font-medium border border-transparent hover:border-[var(--color-academia-gold)]"
                            >
                              <FiCheck className="mr-2 text-[var(--color-academia-gold)]" /> Verify
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* STUDENTS TAB */}
              {activeTab === 'students' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-[var(--color-academia-cream)]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">University</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Major</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Readiness</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-100">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-academia-charcoal)]">{student.name || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{student.student_profile?.university || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{student.student_profile?.major || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                            {student.student_profile?.readiness_score ? (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-sm bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)]">
                                {student.student_profile.readiness_score}%
                              </span>
                            ) : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* MENTORS TAB */}
              {activeTab === 'mentors' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-[var(--color-academia-cream)]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Lab / Institution</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-100">
                      {mentors.map((mentor) => (
                        <tr key={mentor.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-academia-charcoal)]">{mentor.name || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{mentor.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                            {mentor.mentor_profile ? `${mentor.mentor_profile.lab_name || ""} (${mentor.mentor_profile.university || ""})` : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                            {mentor.mentor_profile?.is_verified ? (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-sm bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] flex items-center w-fit gap-1">
                                <FiCheck size={10} /> Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-sm bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)] flex items-center w-fit gap-1">
                                <FiX size={10} /> Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* INTERNSHIPS TAB */}
              {activeTab === 'internships' && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] flex items-center">
                      <span className="w-2 h-8 bg-[var(--color-academia-gold)] mr-3 rounded-sm"></span>
                      All Opportunities
                    </h3>
                    <button 
                      onClick={() => setShowOppModal(true)}
                      className="flex items-center bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-5 py-2.5 rounded-sm hover:bg-black transition-all shadow-md hover:shadow-lg font-medium text-sm border border-transparent hover:border-[var(--color-academia-gold)]"
                    >
                      <FiPlus className="mr-2 text-[var(--color-academia-gold)]" /> Add Internship
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((opp) => (
                      <div key={opp.id} className="bg-white border border-stone-200 rounded-sm p-6 hover:border-[var(--color-academia-gold)] hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                           <span className="inline-block px-2 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)]">
                            {opp.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-stone-400 font-mono">{new Date(opp.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-[var(--color-academia-charcoal)] mb-3 group-hover:text-[var(--color-academia-gold)] transition-colors">{opp.title}</h4>
                        <p className="text-sm text-stone-600 mb-4 line-clamp-3 flex-grow font-light leading-relaxed">{opp.description}</p>
                        <div className="pt-4 border-t border-stone-100 flex justify-end">
                           <span className="text-xs font-bold text-[var(--color-academia-gold)] flex items-center group-hover:underline cursor-pointer">
                             View Details <FiExternalLink className="ml-1" />
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-[var(--color-academia-cream)]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Applicant</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Opportunity</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Match Score</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-serif font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-100">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-bold text-[var(--color-academia-charcoal)]">{app.student?.name || "Unknown Student"}</div>
                                <div className="text-sm text-stone-500">{app.student?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[var(--color-academia-charcoal)]">{app.opportunity?.title || "Unknown Opportunity"}</div>
                            <div className="text-xs text-stone-500 capitalize">{app.opportunity?.type?.replace('_', ' ')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-sm border ${
                              app.match_score >= 80 ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] border-[var(--color-academia-charcoal)]' :
                              app.match_score >= 50 ? 'bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border-[var(--color-academia-gold)]' :
                              'bg-stone-100 text-stone-500 border-stone-300'
                            }`}>
                              {app.match_score}% Match
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-sm ${
                              app.status === 'accepted' ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)]' :
                              app.status === 'rejected' ? 'bg-red-50 text-red-800 border border-red-200' :
                              'bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)]'
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                            <div className="flex space-x-4">
                               {app.student?.student_profile?.resume_url && (
                                  <a 
                                    href={getResumeUrl(app.student.student_profile.resume_url)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] flex items-center transition-colors font-medium"
                                    title="View Resume"
                                  >
                                    <FiDownload className="mr-1" /> Resume
                                  </a>
                               )}
                               <button 
                                 onClick={() => handleViewProfile(app.student)}
                                 className="text-stone-600 hover:text-[var(--color-academia-charcoal)] flex items-center transition-colors font-medium" 
                                 title="View Full Profile"
                               >
                                 <FiExternalLink className="mr-1" /> Profile
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {applications.length === 0 && (
                          <tr>
                              <td colSpan="5" className="px-6 py-12 text-center text-stone-500 font-light italic">
                                  No applications found.
                              </td>
                          </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Internship Modal */}
      {showOppModal && (
        <div className="fixed inset-0 bg-[var(--color-academia-charcoal)]/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4 border border-[var(--color-academia-gold)]">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-[var(--color-academia-cream)]">
              <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] flex items-center gap-2">
                <FiBriefcase className="text-[var(--color-academia-gold)]"/> 
                Add New Internship
              </h3>
              <button onClick={() => setShowOppModal(false)} className="text-stone-400 hover:text-[var(--color-academia-charcoal)] transition-colors p-1 hover:bg-stone-200 rounded-full">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-0">
              <OpportunityForm 
                onSuccess={() => {
                  setShowOppModal(false);
                  fetchData(); // Refresh list
                }} 
                customSubmitFunction={createAdminOpportunity}
              />
            </div>
          </div>
        </div>
      )}
      {/* Profile Modal */}
      {showProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-[var(--color-academia-charcoal)]/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-sm max-w-2xl w-full mx-4 shadow-2xl overflow-hidden border border-[var(--color-academia-gold)] max-h-[90vh] overflow-y-auto">
            <div className="bg-[var(--color-academia-charcoal)] p-8 text-[var(--color-academia-cream)] flex justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-academia-gold)] rounded-bl-full opacity-20"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-serif font-bold">{selectedStudent.name}</h3>
                <p className="text-[var(--color-academia-gold)] opacity-90 mt-1">{selectedStudent.email}</p>
                <div className="mt-4 flex gap-2">
                    {selectedStudent.student_profile?.university && <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-sm text-xs font-medium tracking-wide">{selectedStudent.student_profile.university}</span>}
                    {selectedStudent.student_profile?.major && <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-sm text-xs font-medium tracking-wide">{selectedStudent.student_profile.major}</span>}
                </div>
              </div>
               <button onClick={() => setShowProfileModal(false)} className="text-white/70 hover:text-white transition-colors relative z-10">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
                <div>
                    <h4 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-2 flex items-center">
                        <span className="w-1.5 h-1.5 bg-[var(--color-academia-gold)] rounded-full mr-2"></span>
                        About
                    </h4>
                    <p className="text-stone-600 leading-relaxed font-light">{selectedStudent.student_profile?.bio || "No bio available."}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider mb-2">GPA</h4>
                        <p className="text-2xl font-serif text-[var(--color-academia-gold)]">{selectedStudent.student_profile?.gpa || "N/A"}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[var(--color-academia-charcoal)] uppercase tracking-wider mb-2">Year</h4>
                        <p className="text-2xl font-serif text-[var(--color-academia-charcoal)]">{selectedStudent.student_profile?.graduation_year || "N/A"}</p>
                    </div>
                </div>

                {selectedStudent.student_profile?.skills && (
                    <div>
                         <h4 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-3 flex items-center">
                            <span className="w-1.5 h-1.5 bg-[var(--color-academia-gold)] rounded-full mr-2"></span>
                            Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedStudent.student_profile.skills.split(',').map((skill, i) => (
                                <span key={i} className="bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)] px-3 py-1 rounded-sm text-sm font-medium shadow-sm">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="pt-6 border-t border-stone-200 flex justify-end">
                     {selectedStudent.student_profile?.resume_url && (
                        <a 
                          href={getResumeUrl(selectedStudent.student_profile.resume_url)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-5 py-2.5 rounded-sm hover:bg-black transition-all shadow-md font-medium"
                        >
                          <FiDownload className="mr-2 text-[var(--color-academia-gold)]" /> Download Resume
                        </a>
                     )}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
