import { useState, useEffect } from "react";
import { getPendingMentors, verifyMentor, getAllStudents, getAllMentors, getOpportunities, createAdminOpportunity, getAllApplications, getProjectInterests } from "../api";
import { FiCheck, FiX, FiShield, FiUsers, FiBriefcase, FiPlus, FiFileText, FiDownload, FiExternalLink, FiCpu, FiBarChart2, FiLogOut } from "react-icons/fi";
import OpportunityForm from "./OpportunityForm";
import BeehiveEventList from "./BeehiveEventList";
import IndustrialVisitList from "./IndustrialVisitList";
import ProjectInterestForm from "./ProjectInterestForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingMentors, setPendingMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [projectInterests, setProjectInterests] = useState([]);
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
      } else if (activeTab === 'real-world') {
        const data = await getProjectInterests();
        setProjectInterests(data);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">Admin Portal</h1>
            <span className="ml-3 px-2 py-1 bg-[var(--color-academia-gold)] text-white text-xs rounded-full uppercase tracking-wider font-bold">
              Administrator
            </span>
          </div>
          <button
            onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }}
            className="flex items-center text-stone-500 hover:text-[var(--color-academia-charcoal)] transition-colors"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-stone-200 pb-2 overflow-x-auto">
        {['overview', 'students', 'mentors', 'internships', 'applications', 'real-world', 'analytics'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors capitalize ${activeTab === tab ? 'bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border-b-2 border-[var(--color-academia-gold)]' : 'text-stone-500 hover:text-[var(--color-academia-charcoal)] hover:bg-stone-50'}`}
            >
              {tab.replace('-', ' ')} {tab === 'overview' && '(Pending)'}
            </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden min-h-[400px] border border-stone-200">
        {loading ? (
           <div className="p-8 text-center text-stone-500 flex flex-col items-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-academia-gold)] mb-4"></div>
               Loading data...
           </div>
        ) : (
          <>
            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="p-6">
                <AnalyticsDashboard title="Platform Analytics" />
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="p-6">
                 <h3 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-4">Pending Mentor Verifications</h3>
                 {pendingMentors.length === 0 ? (
                  <p className="text-stone-500 italic">No pending verifications.</p>
                ) : (
                  <ul className="divide-y divide-stone-200">
                    {pendingMentors.map((mentor) => (
                      <li key={mentor.id} className="py-4 hover:bg-[var(--color-academia-cream)]/30 transition-colors rounded-lg px-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-[var(--color-academia-charcoal)]">{mentor.lab_name}</p>
                            <p className="text-sm text-stone-600">{mentor.university} - {mentor.position}</p>
                          </div>
                          <button
                            onClick={() => handleVerify(mentor.user_id)}
                            className="flex items-center bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded hover:bg-emerald-100 transition-colors"
                          >
                            <FiCheck className="mr-1" /> Verify
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
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">University</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Major</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Readiness</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-academia-charcoal)]">{student.name || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{student.student_profile?.university || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{student.student_profile?.major || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                          {student.student_profile?.readiness_score ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)]">
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
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Lab / Institution</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-200">
                    {mentors.map((mentor) => (
                      <tr key={mentor.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-academia-charcoal)]">{mentor.name || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{mentor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                          {mentor.mentor_profile ? `${mentor.mentor_profile.lab_name || ""} (${mentor.mentor_profile.university || ""})` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                          {mentor.mentor_profile?.is_verified ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Verified</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
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
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)]">All Opportunities</h3>
                  <button 
                    onClick={() => setShowOppModal(true)}
                    className="flex items-center bg-[var(--color-academia-charcoal)] text-white px-4 py-2 rounded-md hover:bg-stone-800 transition shadow-sm"
                  >
                    <FiPlus className="mr-2" /> Add Internship
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition bg-white group">
                      <h4 className="font-serif font-bold text-[var(--color-academia-charcoal)] group-hover:text-[var(--color-academia-gold)] transition-colors">{opp.title}</h4>
                      <p className="text-sm text-stone-600 mt-1 line-clamp-2 font-sans">{opp.description}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-3">
                        <span className="bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-stone-200 px-2 py-1 rounded capitalize">{opp.type.replace('_', ' ')}</span>
                        <span>{new Date(opp.created_at).toLocaleDateString()}</span>
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
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Opportunity</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Match Score</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-200">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-[var(--color-academia-charcoal)]">{app.student?.name || "Unknown Student"}</div>
                              <div className="text-sm text-stone-500">{app.student?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[var(--color-academia-charcoal)]">{app.opportunity?.title || "Unknown Opportunity"}</div>
                          <div className="text-xs text-stone-500 capitalize">{app.opportunity?.type?.replace('_', ' ')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                            app.match_score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            app.match_score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {app.match_score}% Match
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                            app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-sky-50 text-sky-700 border-sky-200'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                          <div className="flex space-x-3">
                             {app.student?.student_profile?.resume_url && (
                                <a 
                                  href={getResumeUrl(app.student.student_profile.resume_url)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] flex items-center transition-colors"
                                  title="View Resume"
                                >
                                  <FiDownload className="mr-1" /> Resume
                                </a>
                             )}
                             <button 
                               onClick={() => handleViewProfile(app.student)}
                               className="text-stone-600 hover:text-[var(--color-academia-charcoal)] flex items-center transition-colors" 
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
                            <td colSpan="5" className="px-6 py-12 text-center text-stone-500">
                                No applications found.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* REAL WORLD TAB */}
            {activeTab === 'real-world' && (
              <div className="p-6 space-y-8">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <BeehiveEventList />
                    </div>
                    <div>
                        <IndustrialVisitList />
                    </div>
                 </div>

                 <div className="border-t border-stone-200 pt-6">
                    <h3 className="text-xl font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center">
                        <FiCpu className="mr-2 text-[var(--color-academia-gold)]" /> Student Project Interests
                    </h3>
                    <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                        {projectInterests.length === 0 ? (
                            <p className="text-stone-500 text-center">No student interests submitted yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {projectInterests.map((interest) => (
                                    <div key={interest.id} className="bg-white p-4 rounded shadow-sm border border-stone-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-[var(--color-academia-charcoal)]">{interest.student?.name || "Unknown Student"}</h4>
                                                <p className="text-sm text-stone-500">{interest.student?.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(interest.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm">{interest.interest_area}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Internship Modal */}
      {showOppModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4 border border-stone-100">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-[var(--color-academia-cream)]">
              <h3 className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] flex items-center gap-2">
                <FiBriefcase className="text-[var(--color-academia-gold)]"/> 
                Add New Internship
              </h3>
              <button onClick={() => setShowOppModal(false)} className="text-stone-400 hover:text-rose-500 transition-colors p-1 hover:bg-rose-50 rounded-full">
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
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 shadow-2xl overflow-hidden border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-[var(--color-academia-charcoal)] p-6 text-white flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-gold)]">{selectedStudent.name}</h3>
                <p className="text-stone-300">{selectedStudent.email}</p>
                <div className="mt-2 flex gap-2">
                    {selectedStudent.student_profile?.university && <span className="bg-white/10 px-2 py-1 rounded text-xs text-stone-200 border border-white/20">{selectedStudent.student_profile.university}</span>}
                    {selectedStudent.student_profile?.major && <span className="bg-white/10 px-2 py-1 rounded text-xs text-stone-200 border border-white/20">{selectedStudent.student_profile.major}</span>}
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="text-stone-400 hover:text-white text-2xl transition-colors">&times;</button>
            </div>
            
            <div className="p-6 space-y-6">
                {/* About */}
                {selectedStudent.student_profile?.bio && (
                    <section>
                        <h4 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-2 flex items-center"><FiUsers className="mr-2 text-[var(--color-academia-gold)]"/> About</h4>
                        <p className="text-stone-600 leading-relaxed">{selectedStudent.student_profile.bio}</p>
                    </section>
                )}

                {/* Skills */}
                {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                    <section>
                        <h4 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-2 flex items-center"><FiCheck className="mr-2 text-emerald-600"/> Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedStudent.skills.map(skill => (
                                <span key={skill.id} className="bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] px-3 py-1 rounded-full text-sm font-medium border border-stone-200">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {selectedStudent.student_profile?.work_experiences?.length > 0 && (
                    <section>
                        <h4 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-3 flex items-center"><FiBriefcase className="mr-2 text-sky-600"/> Experience</h4>
                        <div className="space-y-4">
                            {selectedStudent.student_profile.work_experiences.map((exp, i) => (
                                <div key={i} className="border-l-2 border-stone-200 pl-4 pb-2">
                                    <h5 className="font-bold text-[var(--color-academia-charcoal)]">{exp.title}</h5>
                                    <p className="text-[var(--color-academia-gold)] text-sm font-medium">{exp.company}</p>
                                    <p className="text-stone-500 text-xs mb-1">{exp.start_date} - {exp.end_date || 'Present'}</p>
                                    {exp.description && <p className="text-stone-600 text-sm mt-1">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {selectedStudent.student_profile?.projects?.length > 0 && (
                    <section>
                        <h4 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-3 flex items-center"><FiCpu className="mr-2 text-indigo-500"/> Projects</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {selectedStudent.student_profile.projects.map((proj, i) => (
                                <div key={i} className="bg-stone-50 p-3 rounded-lg border border-stone-200 hover:border-[var(--color-academia-gold)] transition-colors">
                                    <div className="flex justify-between items-start">
                                        <h5 className="font-bold text-[var(--color-academia-charcoal)]">{proj.title}</h5>
                                        {proj.url && (
                                            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 text-sm flex items-center">
                                                <FiExternalLink className="mr-1"/> Link
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-stone-600 text-sm mt-1">{proj.description}</p>
                                    {proj.tech_stack && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {proj.tech_stack.split(',').map((tech, j) => (
                                                <span key={j} className="text-xs bg-white border border-stone-300 px-1.5 py-0.5 rounded text-stone-600">{tech.trim()}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {selectedStudent.student_profile?.educations?.length > 0 && (
                    <section>
                        <h4 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-3 flex items-center"><FiFileText className="mr-2 text-amber-600"/> Education</h4>
                        <div className="space-y-3">
                            {selectedStudent.student_profile.educations.map((edu, i) => (
                                <div key={i} className="flex justify-between items-start border-b border-stone-100 pb-2 last:border-0">
                                    <div>
                                        <h5 className="font-bold text-[var(--color-academia-charcoal)]">{edu.institution}</h5>
                                        <p className="text-stone-600 text-sm">{edu.degree}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-xs">{edu.start_year} - {edu.end_year}</p>
                                        {edu.grade && <p className="text-indigo-600 text-xs font-semibold">Grade: {edu.grade}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Readiness */}
                <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-800">Readiness Score</h4>
                        <span className="text-2xl font-bold text-indigo-600">{selectedStudent.student_profile?.readiness_score || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${selectedStudent.student_profile?.readiness_score || 0}%` }}
                        ></div>
                    </div>
                </section>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    {selectedStudent.student_profile?.resume_url && (
                        <a 
                            href={getResumeUrl(selectedStudent.student_profile.resume_url)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
                        >
                            <FiDownload className="mr-2" /> Download Resume
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
