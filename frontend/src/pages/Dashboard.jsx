import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCompleteness, getMe } from "../api";
import StudentProfileForm from "../components/StudentProfileForm";
import MentorProfileForm from "../components/MentorProfileForm";
import AdminDashboard from "../components/AdminDashboard";
import OpportunityForm from "../components/OpportunityForm";
import OpportunityList from "../components/OpportunityList";
import MentorApplications from "../components/MentorApplications";
import StudentApplications from "../components/StudentApplications";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import SmartMatchList from "../components/SmartMatchList";
import RealWorldDashboard from "../components/RealWorldDashboard";
import ErrorBoundary from "../components/ErrorBoundary";
import CubeLoader from "../components/ui/CubeLoader";
import { FiLogOut, FiActivity, FiBook, FiUser, FiPlusCircle, FiList, FiBriefcase, FiCpu, FiGlobe, FiMenu, FiX } from "react-icons/fi";

const Dashboard = () => {
  const { user, logout, loading: authLoading, refreshUser } = useAuth();
  const location = useLocation();
  const [completeness, setCompleteness] = useState({ score: 0, role: "" });
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mentor Tabs: 'profile', 'post-opp', 'applications'
  // Student Tabs: 'profile', 'browse', 'applications'
  const searchParams = new URLSearchParams(location.search);
  const initialTabFromQuery = searchParams.get("tab");
  const beehiveDeepLink = searchParams.get("beehive");
  const [activeTab, setActiveTab] = useState(
    initialTabFromQuery || (beehiveDeepLink ? "real-world" : "profile")
  );
  
  // We need a local user state that can be updated when profile changes
  // without waiting for the global AuthContext to refresh (though we should trigger that too)
  const [currentUser, setCurrentUser] = useState(user);

  const fetchData = async () => {
    try {
      const [completenessData, userData] = await Promise.all([
        getCompleteness(),
        getMe()
      ]);
      setCompleteness(completenessData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    await Promise.all([fetchData(), refreshUser()]);
    setSelectedRole(null); // Clear selection as role should be updated in backend now
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-academia-cream)]">
        <CubeLoader />
      </div>
    );
  }

  // Determine which role view to show
  // If user has explicit role, use it. If "user" (OAuth default), check if they selected one locally.
  const displayRole = (currentUser?.role === "user" && selectedRole) ? selectedRole : currentUser?.role;

  return (
    <div className="min-h-screen bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)]">
      {/* Navbar */}
      <nav className="bg-[var(--color-academia-cream)]/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-stone-200">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl leading-tight font-serif font-bold text-[var(--color-academia-charcoal)] truncate max-w-[200px] md:max-w-none">
              Shaun Spherix
            </h1>
            {/* Role Badge */}
            {displayRole && displayRole !== 'user' && (
              <span className="hidden md:inline-block ml-3 px-2 py-1 rounded-sm text-xs font-semibold bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] capitalize tracking-wide">
                {displayRole} Portal
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Tabs Navigation */}
              {displayRole === "student" && (
                <div className="hidden lg:flex space-x-1 mr-2 overflow-x-auto">
                  {[
                    { id: 'profile', label: 'Profile', icon: FiUser },
                    { id: 'smart-match', label: 'Smart Match', icon: FiCpu },
                    { id: 'browse', label: 'Browse Opportunities', icon: FiList },
                    { id: 'applications', label: 'My Applications', icon: FiBriefcase },
                    { id: 'real-world', label: 'Real World Opportunities', icon: FiGlobe }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap px-3 py-2 rounded-sm text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
                        activeTab === tab.id 
                          ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] shadow-md' 
                          : 'text-stone-600 hover:text-[var(--color-academia-charcoal)] hover:bg-stone-100'
                      }`}
                    >
                      {tab.icon && <tab.icon className={activeTab === tab.id ? 'text-[var(--color-academia-gold)]' : 'text-stone-400'} />}
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              {displayRole === "mentor" && (
                <div className="hidden lg:flex space-x-1 mr-2 overflow-x-auto">
                  {[
                    { id: 'profile', label: 'Profile' },
                    { id: 'post-opp', label: 'Post Opportunity' },
                    { id: 'my-opportunities', label: 'My Opportunities' },
                    { id: 'applications', label: 'Manage Applications' },
                    { id: 'analytics', label: 'Analytics' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap px-3 py-2 rounded-sm text-xs md:text-sm font-medium transition-all ${
                        activeTab === tab.id 
                          ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] shadow-md' 
                          : 'text-stone-600 hover:text-[var(--color-academia-charcoal)] hover:bg-stone-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-[var(--color-academia-charcoal)]">{currentUser?.name}</p>
              </div>
              
              <button
                onClick={logout}
                className="p-2 rounded-full text-stone-400 hover:text-[var(--color-academia-gold)] hover:bg-stone-100 transition-colors hidden sm:block"
                title="Logout"
              >
                <FiLogOut className="h-6 w-6" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-[var(--color-academia-charcoal)] focus:outline-none"
              >
                {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-16 left-0 w-full bg-[var(--color-academia-cream)] border-b border-stone-200 shadow-lg z-40 p-4 flex flex-col gap-4 animate-fade-in">
               <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-2">
                  <span className="font-serif font-bold text-[var(--color-academia-charcoal)]">Menu</span>
                  <span className="text-xs text-stone-500">{currentUser?.name}</span>
               </div>
               
               {displayRole === "student" && (
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'profile', label: 'Profile', icon: FiUser },
                      { id: 'smart-match', label: 'Smart Match', icon: FiCpu },
                      { id: 'browse', label: 'Browse Opportunities', icon: FiList },
                      { id: 'applications', label: 'My Applications', icon: FiBriefcase },
                      { id: 'real-world', label: 'Real World Opportunities', icon: FiGlobe }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all flex items-center gap-3 ${
                          activeTab === tab.id 
                            ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)]' 
                            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-100'
                        }`}
                      >
                        {tab.icon && <tab.icon className={activeTab === tab.id ? 'text-[var(--color-academia-gold)]' : 'text-stone-400'} />}
                        {tab.label}
                      </button>
                    ))}
                  </div>
               )}

               {displayRole === "mentor" && (
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'profile', label: 'Profile', icon: FiUser },
                      { id: 'post-opp', label: 'Post Opportunity', icon: FiPlusCircle },
                      { id: 'my-opportunities', label: 'My Opportunities', icon: FiList },
                      { id: 'applications', label: 'Manage Applications', icon: FiBriefcase },
                      { id: 'analytics', label: 'Analytics', icon: FiActivity }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all flex items-center gap-3 ${
                          activeTab === tab.id 
                            ? 'bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)]' 
                            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-100'
                        }`}
                      >
                        {tab.icon && <tab.icon className={activeTab === tab.id ? 'text-[var(--color-academia-gold)]' : 'text-stone-400'} />}
                        {tab.label}
                      </button>
                    ))}
                  </div>
               )}

               <div className="pt-2 border-t border-stone-200">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-all flex items-center gap-3"
                  >
                    <FiLogOut /> Logout
                  </button>
               </div>
            </div>
          )}
      </nav>

      {/* Main Content */}
      <main className="w-full px-4 md:px-10 lg:px-20 py-8">
        
        {/* Role Selection for New Users (OAuth) */}
        {currentUser?.role === "user" && !selectedRole && (
          <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-4">Welcome to Shaun Spherix Solutions LLP!</h2>
            <p className="text-lg md:text-xl text-stone-600 mb-8 md:mb-12">To get started, please tell us how you plan to use the platform.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div 
                className="bg-white p-6 md:p-8 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer border border-stone-200 hover:border-[var(--color-academia-gold)] group" 
                onClick={() => setSelectedRole("student")}
              >
                <div className="bg-[var(--color-academia-cream)] border border-[var(--color-academia-gold)] p-4 md:p-6 rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-[var(--color-academia-gold)] transition-colors">
                  <FiBook className="text-[var(--color-academia-charcoal)] text-2xl md:text-4xl group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-2 md:mb-3">I am a Student</h3>
                <p className="text-sm md:text-base text-stone-500 font-light">I'm looking for research opportunities, mentors, and lab positions to advance my academic career.</p>
              </div>

              <div 
                className="bg-white p-6 md:p-8 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer border border-stone-200 hover:border-[var(--color-academia-gold)] group" 
                onClick={() => setSelectedRole("mentor")}
              >
                <div className="bg-[var(--color-academia-cream)] border border-[var(--color-academia-gold)] p-4 md:p-6 rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-[var(--color-academia-gold)] transition-colors">
                  <FiUser className="text-[var(--color-academia-charcoal)] text-2xl md:text-4xl group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-2 md:mb-3">I am a Mentor</h3>
                <p className="text-sm md:text-base text-stone-500 font-light">I'm a professor or researcher looking for talented students to join my lab and research projects.</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin View */}
        {displayRole === "admin" && <AdminDashboard />}

        {/* Student View */}
        {displayRole === "student" && (
          <>
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column: Profile */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  {/* Completeness Hero Section */}
                  <div className="bg-white p-4 rounded-sm border border-[var(--color-academia-gold)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <FiActivity className="text-4xl md:text-6xl text-[var(--color-academia-charcoal)]" />
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-5 relative z-10">
                      {/* Circular Chart */}
                      <div className="relative flex-shrink-0">
                         <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                              <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-stone-100" />
                              <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                strokeDasharray={263.89} 
                                strokeDashoffset={263.89 - (completeness.score / 100) * 263.89} 
                                strokeLinecap="round" 
                                className={`${completeness.score >= 80 ? 'text-green-600' : completeness.score >= 50 ? 'text-yellow-600' : 'text-red-600'} transition-all duration-1000 ease-out`} 
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="text-lg md:text-xl font-serif font-bold text-[var(--color-academia-charcoal)]">
                                  {completeness.score}%
                               </span>
                            </div>
                         </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-1">
                          {displayRole === 'student' ? 'Readiness Score' : 'Profile Completeness'}
                        </h3>
                        <p className="text-stone-600 text-xs leading-relaxed font-light">
                          {completeness.score < 80 
                            ? "Complete your details to increase your chances of matching." 
                            : "Excellent! Your profile is robust and ready for premium opportunities."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <StudentProfileForm user={currentUser} onUpdate={handleProfileUpdate} />
                </div>

                {/* Right Column: Status/Matches (Placeholder) */}
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-200 border-t-4 border-t-[var(--color-academia-charcoal)]">
                    <h3 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center">
                      <FiActivity className="mr-2" /> Quick Stats
                    </h3>
                    <div className="text-center py-4 text-stone-500 font-light">
                      <p>Complete your profile to unlock more stats.</p>
                    </div>
                  </div>

                  {/* PhD Matcher CTA */}
                  {!currentUser?.student_profile?.is_phd_seeker && (
                    <div 
                      onClick={() => window.dispatchEvent(new Event('open-profile-edit'))}
                      className="bg-white p-6 rounded-sm shadow-sm cursor-pointer border border-stone-200 hover:border-[var(--color-academia-gold)] transition group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[var(--color-academia-cream)] p-2 rounded-sm border border-[var(--color-academia-gold)] group-hover:bg-[var(--color-academia-gold)] transition-colors">
                          <FiBook className="text-[var(--color-academia-charcoal)] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-serif font-bold text-[var(--color-academia-charcoal)]">PhD Matcher</h3>
                      </div>
                      <div className="flex items-start gap-3 mt-4">
                        <input 
                          type="checkbox" 
                          checked={false} 
                          readOnly 
                          className="mt-1 w-4 h-4 text-[var(--color-academia-charcoal)] rounded border-stone-300 cursor-pointer pointer-events-none focus:ring-[var(--color-academia-gold)]" 
                        />
                        <p className="text-sm text-stone-600 font-light leading-relaxed">
                          I am looking for a PhD Supervisor. <span className="text-[var(--color-academia-gold)] font-medium border-b border-[var(--color-academia-gold)] pb-0.5">Complete Profile</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'smart-match' && <SmartMatchList />}

            {activeTab === 'browse' && <OpportunityList />}
            
            {activeTab === 'applications' && <StudentApplications />}
            
            {activeTab === 'real-world' && <RealWorldDashboard />}



          </>
        )}

        {/* Mentor View */}
        {displayRole === "mentor" && (
          <>
             {/* Mobile Tab Selector */}
            <div className="md:hidden mb-6">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full rounded-sm border-stone-300 shadow-sm focus:border-[var(--color-academia-gold)] focus:ring-[var(--color-academia-gold)]"
              >
                <option value="profile">My Profile</option>
                <option value="post-opp">Post Opportunity</option>
                <option value="my-opportunities">My Opportunities</option>
                <option value="applications">Manage Applications</option>
              </select>
            </div>

            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Verification Status Card */}
                  <div className={`p-6 rounded-sm shadow-md border-l-4 ${currentUser.mentor_profile?.is_verified ? 'bg-green-50 border-green-500' : 'bg-[var(--color-academia-cream)] border-[var(--color-academia-gold)]'}`}>
                    <h3 className={`text-lg font-serif font-bold ${currentUser.mentor_profile?.is_verified ? 'text-green-800' : 'text-[var(--color-academia-charcoal)]'}`}>
                      {currentUser.mentor_profile?.is_verified ? 'Verified Account' : 'Verification Pending'}
                    </h3>
                    <p className={`text-sm mt-1 ${currentUser.mentor_profile?.is_verified ? 'text-green-700' : 'text-stone-600'}`}>
                      {currentUser.mentor_profile?.is_verified 
                        ? "Your account is verified. Students can now apply to your lab." 
                        : "Your profile is under review by the administrators. You can update your details in the meantime."}
                    </p>
                  </div>

                  <MentorProfileForm user={currentUser} onUpdate={handleProfileUpdate} />
                </div>

                {/* Right Column: Quick Actions */}
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-sm shadow-md border-t-4 border-[var(--color-academia-charcoal)]">
                    <h3 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-4">Quick Actions</h3>
                    <button 
                      onClick={() => setActiveTab('post-opp')}
                      className="w-full bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-4 py-2 rounded-sm hover:opacity-90 transition flex items-center justify-center shadow-sm"
                    >
                      <FiPlusCircle className="mr-2" /> Post New Opportunity
                    </button>
                    <button 
                      onClick={() => setActiveTab('applications')}
                      className="w-full mt-3 bg-white text-[var(--color-academia-charcoal)] border border-[var(--color-academia-charcoal)] px-4 py-2 rounded-sm hover:bg-stone-50 transition flex items-center justify-center shadow-sm"
                    >
                      <FiList className="mr-2" /> View Applications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'post-opp' && (
              <OpportunityForm onSuccess={() => setActiveTab('applications')} />
            )}

            {activeTab === 'my-opportunities' && currentUser && (
              <OpportunityList initialFilters={{ mentor_id: currentUser.id }} />
            )}

            {activeTab === 'applications' && (
              <ErrorBoundary>
                <MentorApplications />
              </ErrorBoundary>
            )}

            {activeTab === 'analytics' && <AnalyticsDashboard title="My Engagement Analytics" />}
          </>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
