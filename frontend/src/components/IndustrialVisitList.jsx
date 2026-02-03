import { useState, useEffect } from "react";
import { 
  getIndustrialVisits, 
  createIndustrialVisit, 
  applyForVisit, 
  getVisitApplications, 
  updateVisitApplicationStatus 
} from "../api";
import { useAuth } from "../context/AuthContext";
import { FiBriefcase, FiCalendar, FiMapPin, FiUsers, FiPlus, FiCheckCircle, FiXCircle, FiSettings } from "react-icons/fi";

const IndustrialVisitList = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Management State
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [visitApplications, setVisitApplications] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    company_name: "",
    location: "",
    visit_date: "",
    description: "",
    max_students: 20,
    requirements: ""
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const data = await getIndustrialVisits();
      setVisits(data);
    } catch (error) {
      console.error("Failed to fetch visits", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createIndustrialVisit(formData);
      setShowCreateModal(false);
      fetchVisits();
      setFormData({
        company_name: "",
        location: "",
        visit_date: "",
        description: "",
        max_students: 20,
        requirements: ""
      });
    } catch (error) {
      console.error("Failed to create visit", error);
      alert("Failed to create visit");
    }
  };

  const handleManage = async (visit) => {
    setSelectedVisit(visit);
    setIsLoadingApps(true);
    try {
      const apps = await getVisitApplications(visit.id);
      setVisitApplications(apps);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      alert("Failed to fetch applications. You might not be the organizer.");
    } finally {
      setIsLoadingApps(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateVisitApplicationStatus(appId, newStatus);
      setVisitApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleApply = async (visitId) => {
    if (!window.confirm("Are you sure you want to apply for this industrial visit?")) return;
    try {
      await applyForVisit(visitId, { statement_of_purpose: "Interested in this visit." }); // Simple default SOP for now
      alert("Application submitted successfully!");
      fetchVisits(); // Refresh to potentially show 'Applied' status if we tracked it
    } catch (error) {
      console.error("Failed to apply", error);
      alert("Failed to apply. You might have already applied.");
    }
  };

  const isOrganizer = user?.role === "admin" || user?.role === "mentor";

  if (loading) return <div className="p-8 text-center text-stone-500">Loading industrial visits...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">Industrial Visits</h2>
          <p className="text-stone-600">Collaborate and learn from real-world industry leaders.</p>
        </div>
        {isOrganizer && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[var(--color-academia-gold)] text-white px-4 py-2 rounded-sm hover:bg-yellow-600 transition-colors shadow-sm"
          >
            <FiPlus /> Create Visit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visits.map((visit) => (
          <div key={visit.id} className="bg-white p-6 rounded-sm shadow-md border-t-4 border-[var(--color-academia-gold)] hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-[var(--color-academia-charcoal)] mb-2">{visit.company_name}</h3>
            
            <div className="space-y-2 text-sm text-stone-600 mb-4">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-[var(--color-academia-gold)]" />
                <span>{visit.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[var(--color-academia-gold)]" />
                <span>{new Date(visit.visit_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-[var(--color-academia-gold)]" />
                <span>Max: {visit.max_students} Students</span>
              </div>
            </div>

            <p className="text-stone-700 text-sm mb-4 line-clamp-3">{visit.description}</p>

            {user?.role === "student" && (
              <button 
                onClick={() => handleApply(visit.id)}
                className="w-full mt-2 border border-[var(--color-academia-charcoal)] text-[var(--color-academia-charcoal)] py-2 rounded-sm hover:bg-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-cream)] transition-colors font-medium"
              >
                Apply for Visit
              </button>
            )}
             {isOrganizer && (
                <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
                    <span className="text-xs text-stone-400">Organizer View</span>
                    <button 
                      onClick={() => handleManage(visit)}
                      className="text-sm flex items-center gap-1 text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] transition-colors font-medium"
                    >
                      <FiSettings /> Manage Applications
                    </button>
                </div>
            )}
          </div>
        ))}
        {visits.length === 0 && (
            <div className="col-span-full text-center py-12 bg-stone-50 rounded-lg border border-dashed border-stone-300">
                <p className="text-stone-500">No upcoming industrial visits scheduled.</p>
            </div>
        )}
      </div>

      {/* Management Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-[var(--color-academia-charcoal)]">Manage Applications</h3>
                    <p className="text-stone-600 text-sm">{selectedVisit.company_name} - {new Date(selectedVisit.visit_date).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setSelectedVisit(null)} className="text-stone-400 hover:text-stone-600">
                    <FiXCircle size={24} />
                </button>
             </div>
             
             {isLoadingApps ? (
                 <div className="text-center py-8">Loading applications...</div>
             ) : visitApplications.length === 0 ? (
                 <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-300">
                     No applications received yet.
                 </div>
             ) : (
                 <div className="space-y-4">
                     {visitApplications.map(app => (
                         <div key={app.id} className="p-4 border border-stone-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-stone-50 transition-colors">
                             <div>
                                 <div className="font-bold text-[var(--color-academia-charcoal)]">
                                     {app.student?.name || "Unknown Student"}
                                 </div>
                                 <div className="text-sm text-stone-500">{app.student?.email}</div>
                                 <div className="text-xs text-stone-400 mt-1">Applied: {new Date(app.created_at).toLocaleDateString()}</div>
                                 {app.statement_of_purpose && (
                                     <div className="mt-2 text-sm text-stone-600 italic">"{app.statement_of_purpose}"</div>
                                 )}
                             </div>
                             
                             <div className="flex items-center gap-2">
                                 {app.status === 'pending' ? (
                                     <>
                                         <button 
                                             onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                             className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors text-sm font-medium"
                                         >
                                             <FiCheckCircle /> Accept
                                         </button>
                                         <button 
                                             onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                             className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                                         >
                                             <FiXCircle /> Reject
                                         </button>
                                     </>
                                 ) : (
                                     <span className={`px-3 py-1 rounded text-sm font-medium capitalize flex items-center gap-1
                                         ${app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                     `}>
                                         {app.status === 'accepted' ? <FiCheckCircle /> : <FiXCircle />}
                                         {app.status}
                                     </span>
                                 )}
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4">
            <h3 className="text-xl font-bold text-[var(--color-academia-charcoal)] mb-4">Schedule Industrial Visit</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
                <input 
                  type="datetime-local" 
                  required
                  value={formData.visit_date}
                  onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Max Students</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={formData.max_students}
                  onChange={(e) => setFormData({...formData, max_students: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)]"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[var(--color-academia-charcoal)] text-white px-4 py-2 rounded-sm hover:bg-stone-800"
                >
                  Create Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustrialVisitList;
