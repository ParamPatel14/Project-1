import { useState, useEffect } from "react";
import { getSmartMatches, getProfile, getOpportunities, applyForOpportunity } from "../api";
import ResearchGapList from "./ResearchGapList";
import SavedResearchGapList from "./SavedResearchGapList";
import { FaLightbulb, FaTimes } from "react-icons/fa";
import { FiCpu, FiUser, FiBriefcase, FiAward, FiCheckCircle, FiBook, FiArrowRight, FiActivity, FiTrendingUp, FiMinus, FiBookmark, FiSend } from "react-icons/fi";
import CubeLoader from "./ui/CubeLoader";

const SmartMatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [expandedMentorId, setExpandedMentorId] = useState(null);
  const [activeTab, setActiveTab] = useState("matches"); // "matches" or "saved"
  
  // Apply Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorOpportunities, setMentorOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const [matchesData, profileData] = await Promise.all([
          getSmartMatches(),
          getProfile()
        ]);
        setMatches(matchesData);
        if (profileData.student_profile) {
          setStudentId(profileData.student_profile.id);
        }
      } catch {
        setError("Failed to load smart matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const toggleGaps = (mentorId) => {
    if (expandedMentorId === mentorId) {
      setExpandedMentorId(null);
    } else {
      setExpandedMentorId(mentorId);
    }
  };

  const handleApplyClick = async (mentor) => {
    setSelectedMentor(mentor);
    setShowApplyModal(true);
    setLoadingOpportunities(true);
    setMentorOpportunities([]);
    setSelectedOpportunityId(null);
    setCoverLetter("");
    setApplySuccess(false);
    
    try {
      console.log("Fetching opportunities for mentor:", mentor.mentor_id); // Debug log
      const opportunities = await getOpportunities({ mentor_id: mentor.mentor_id });
      console.log("Fetched opportunities:", opportunities); // Debug log
      
      // Filter only open opportunities
      const openOpportunities = opportunities.filter(op => op.is_open);
      setMentorOpportunities(openOpportunities);
      if (openOpportunities.length > 0) {
        setSelectedOpportunityId(openOpportunities[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch opportunities", err);
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedOpportunityId) return;
    
    setApplying(true);
    try {
      await applyForOpportunity(selectedOpportunityId, coverLetter, selectedMentor.match_score);
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(false);
      }, 2000);
    } catch (err) {
      // Check if error message indicates duplicate application
      if (err.response && err.response.status === 400 && err.response.data.detail === "You have already applied to this opportunity") {
          alert("You have already applied to this opportunity.");
      } else {
          alert("Failed to submit application. Please try again.");
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CubeLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 rounded-sm border border-red-100">
        <FiActivity className="mx-auto text-4xl mb-4" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold font-serif text-[var(--color-academia-charcoal)] flex items-center gap-2">
                <FiCpu className="text-[var(--color-academia-gold)]" /> Research Intelligence
            </h2>
            <p className="text-stone-500 mt-1">AI-powered matching and research gap discovery.</p>
        </div>
        
        <div className="flex bg-stone-100 p-1 rounded-sm">
          <button
            onClick={() => setActiveTab("matches")}
            className={`px-4 py-2 rounded-sm text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "matches" 
                ? "bg-white text-[var(--color-academia-charcoal)] shadow-sm border border-stone-200" 
                : "text-stone-500 hover:text-[var(--color-academia-charcoal)]"
            }`}
          >
            <FiUser /> Smart Matches
            {matches.length > 0 && (
              <span className="bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] px-1.5 py-0.5 rounded-full text-[10px] border border-[var(--color-academia-gold)]">
                {matches.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 rounded-sm text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "saved" 
                ? "bg-white text-[var(--color-academia-charcoal)] shadow-sm border border-stone-200" 
                : "text-stone-500 hover:text-[var(--color-academia-charcoal)]"
            }`}
          >
            <FiBookmark /> Saved Gaps
          </button>
        </div>
      </div>

      {activeTab === "saved" ? (
        <SavedResearchGapList />
      ) : (
        <>
          {matches.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-sm shadow-sm border border-stone-100">
              <div className="bg-[var(--color-academia-cream)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-academia-gold)]">
                <FiUser className="text-[var(--color-academia-charcoal)] text-2xl" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[var(--color-academia-charcoal)]">No Perfect Matches Found Yet</h3>
              <p className="text-stone-500 max-w-md mx-auto mt-2">
                Try updating your profile with more detailed research interests and skills to help our AI find better connections.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {matches.map((match, index) => (
                <div 
                  key={match.mentor_id} 
                  className="bg-white rounded-sm shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left: Score Panel */}
                    <div className="bg-gradient-to-b from-[var(--color-academia-charcoal)] to-[#2c3e50] p-6 flex flex-col items-center justify-center text-white min-w-[140px] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-academia-gold)] opacity-10 mix-blend-overlay"></div>
                      <div className="relative z-10 text-center">
                          <span className="text-xs uppercase tracking-wider font-serif font-semibold opacity-90 text-[var(--color-academia-gold)]">Match Score</span>
                          <div className="text-5xl font-bold font-serif my-2 text-white">{match.match_score}%</div>
                          
                          <div className="mt-4 space-y-2 w-full">
                              <div className="flex justify-between text-xs opacity-90">
                                  <span>Semantic</span>
                                  <span>{match.semantic_score}%</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-1">
                                  <div className="bg-[var(--color-academia-gold)] h-1 rounded-full" style={{ width: `${match.semantic_score}%` }}></div>
                              </div>
                              
                              <div className="flex justify-between text-xs opacity-90 mt-2">
                                  <span>Profile</span>
                                  <span>{match.alignment_score}%</span>
                              </div>
                               <div className="w-full bg-white/10 rounded-full h-1">
                                  <div className="bg-stone-300 h-1 rounded-full" style={{ width: `${match.alignment_score}%` }}></div>
                              </div>
                          </div>
                      </div>
                    </div>

                    {/* Right: Content Panel */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                          <div className="flex items-start justify-between mb-2">
                              <div>
                                  <h3 className="text-xl font-bold font-serif text-[var(--color-academia-charcoal)]">{match.mentor_name}</h3>
                                  <div className="text-stone-500 font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                                      <FiBriefcase className="text-sm" />
                                      {match.position} at {match.institution}
                                  </div>
                              </div>
                              {match.accepting_students === 'Yes' && (
                                  <span className="bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border border-[var(--color-academia-gold)] px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-1">
                                      <FiCheckCircle className="text-[var(--color-academia-gold)]" /> Hiring
                                  </span>
                              )}
                          </div>

                          {/* Research Areas Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                              {match.research_areas && match.research_areas.split(',').slice(0, 3).map((area, i) => (
                                  <span key={i} className="bg-stone-50 text-stone-600 px-2 py-1 rounded-sm text-xs font-medium border border-stone-200">
                                      {area.trim()}
                                  </span>
                              ))}
                              {match.research_areas && match.research_areas.split(',').length > 3 && (
                                  <span className="text-xs text-stone-400 flex items-center">+{match.research_areas.split(',').length - 3} more</span>
                              )}
                          </div>

                          {/* Research Trends (Phase 3) */}
                          {match.trends && match.trends.length > 0 && (
                              <div className="mb-4">
                                  <h4 className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-2 flex items-center gap-1">
                                      <FiActivity className="text-[var(--color-academia-gold)]" /> Recent Research Focus
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                      {match.trends.map((trend, idx) => (
                                          <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium border ${
                                              trend.status === 'Rising' 
                                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                                  : 'bg-stone-50 text-stone-700 border-stone-200'
                                          }`}>
                                              {trend.status === 'Rising' ? <FiTrendingUp /> : <FiMinus className="rotate-90" />}
                                              <span>{trend.topic}</span>
                                              {trend.status === 'Rising' && <span className="ml-1 text-[10px] bg-green-200 px-1 rounded-full">Rising</span>}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {/* AI Explanation Box */}
                          <div className="bg-[var(--color-academia-cream)] rounded-sm p-4 border border-[var(--color-academia-gold)]/30 mb-4 relative">
                              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-academia-gold)]"></div>
                              <div className="flex gap-3 pl-2">
                                  <div className="mt-1">
                                      <FiCpu className="text-[var(--color-academia-charcoal)]" />
                                  </div>
                                  <div>
                                      <h4 className="text-sm font-bold font-serif text-[var(--color-academia-charcoal)] mb-1">Why this match?</h4>
                                      <p className="text-sm text-stone-700 leading-relaxed italic">
                                          "{match.explanation}"
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-stone-100">
                          <button 
                              onClick={() => toggleGaps(match.mentor_id)}
                              className={`text-sm font-medium px-4 py-2 rounded-sm flex items-center gap-2 transition-all border ${
                                  expandedMentorId === match.mentor_id 
                                      ? "bg-[var(--color-academia-charcoal)] text-white border-[var(--color-academia-charcoal)]" 
                                      : "bg-white border-stone-300 text-stone-600 hover:text-[var(--color-academia-charcoal)] hover:bg-[var(--color-academia-cream)]"
                              }`}
                          >
                              <FaLightbulb className={expandedMentorId === match.mentor_id ? "text-[var(--color-academia-gold)]" : ""} />
                              {expandedMentorId === match.mentor_id ? "Hide Gaps" : "Discover Gaps"}
                          </button>
                          <button className="text-stone-500 hover:text-[var(--color-academia-charcoal)] text-sm font-medium px-4 py-2">
                              View Profile
                          </button>
                          <button 
                            onClick={() => handleApplyClick(match)}
                            className="bg-[var(--color-academia-charcoal)] hover:bg-[#2c3e50] text-white px-5 py-2 rounded-sm text-sm font-bold flex items-center gap-2 transition-colors shadow-sm hover:shadow hover:-translate-y-0.5"
                          >
                              Connect <FiArrowRight />
                          </button>
                      </div>
                    </div>
                  </div>
                  
                  {expandedMentorId === match.mentor_id && studentId && (
                      <div className="border-t border-stone-200 p-6 bg-stone-50">
                          <ResearchGapList mentorId={match.mentor_id} studentId={studentId} mentorName={match.mentor_name} />
                      </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedMentor && (
        <div className="fixed inset-0 bg-[var(--color-academia-charcoal)]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="p-0">
              <div className="bg-[var(--color-academia-charcoal)] px-8 py-6 flex justify-between items-center border-b-4 border-[var(--color-academia-gold)]">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-white">Apply to Lab</h3>
                  <p className="text-[var(--color-academia-gold)] font-medium text-sm mt-1">{selectedMentor.mentor_name}</p>
                </div>
                <button 
                  onClick={() => setShowApplyModal(false)} 
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="p-8">
                {loadingOpportunities ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-[var(--color-academia-charcoal)] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : mentorOpportunities.length === 0 ? (
                   <div className="text-center py-8">
                      <p className="text-stone-500 mb-4">This mentor has no open opportunities at the moment.</p>
                      <button onClick={() => setShowApplyModal(false)} className="text-[var(--color-academia-charcoal)] font-bold hover:underline">
                        Close
                      </button>
                   </div>
                ) : applySuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                      <FiCheckCircle className="text-3xl" />
                    </div>
                    <h4 className="text-xl font-bold font-serif text-[var(--color-academia-charcoal)] mb-2">Application Sent!</h4>
                    <p className="text-stone-500">Your application has been successfully submitted.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[var(--color-academia-charcoal)] mb-2 uppercase tracking-wide">Select Opportunity</label>
                      <div className="space-y-3">
                        {mentorOpportunities.map((op) => (
                          <div 
                            key={op.id}
                            className={`border rounded-sm p-4 cursor-pointer transition-all ${
                              selectedOpportunityId === op.id 
                                ? "border-[var(--color-academia-gold)] bg-[var(--color-academia-cream)]" 
                                : "border-stone-200 hover:border-[var(--color-academia-charcoal)]"
                            }`}
                            onClick={() => setSelectedOpportunityId(op.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                selectedOpportunityId === op.id ? "border-[var(--color-academia-charcoal)]" : "border-stone-400"
                              }`}>
                                {selectedOpportunityId === op.id && <div className="w-2 h-2 bg-[var(--color-academia-charcoal)] rounded-full"></div>}
                              </div>
                              <div>
                                <p className="font-bold text-[var(--color-academia-charcoal)] font-serif">{op.title}</p>
                                <p className="text-xs text-stone-500 uppercase tracking-wide mt-1">{op.type.replace('_', ' ')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--color-academia-charcoal)] mb-2 uppercase tracking-wide">Cover Letter</label>
                      <textarea
                        required
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Introduce yourself and explain why you're a good fit..."
                        className="w-full border border-stone-300 rounded-sm p-3 h-32 focus:ring-1 focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setShowApplyModal(false)}
                        className="px-4 py-2 text-stone-600 font-medium hover:bg-stone-100 rounded-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={applying || !selectedOpportunityId}
                        className={`px-6 py-2 bg-[var(--color-academia-charcoal)] text-white font-bold rounded-sm flex items-center gap-2 ${
                          (applying || !selectedOpportunityId) ? "opacity-70 cursor-not-allowed" : "hover:bg-[#2c3e50] shadow-md hover:shadow-lg"
                        }`}
                      >
                        {applying ? "Sending..." : "Submit Application"}
                        {!applying && <FiSend />}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartMatchList;
