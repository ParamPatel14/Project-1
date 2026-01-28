import React, { useState, useEffect } from 'react';
import { getMyImprovementPlans, updatePlanItem } from '../api';

const ImprovementPlanBoard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlanId, setActivePlanId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getMyImprovementPlans();
      setPlans(data);
      if (data.length > 0 && !activePlanId) {
        setActivePlanId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch plans", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      await updatePlanItem(itemId, { status: newStatus });
      fetchPlans(); // Refresh to update UI
    } catch (err) {
      console.error("Failed to update item", err);
    }
  };

  const handleEvidenceSubmit = async (itemId, link) => {
    try {
        await updatePlanItem(itemId, { evidence_link: link });
        fetchPlans();
    } catch (err) {
        console.error("Failed to submit evidence", err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading plans...</div>;

  if (plans.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Improvement Plans</h2>
        <p className="text-gray-600">You haven't started any improvement plans yet.</p>
        <p className="text-gray-600">Go to Opportunities and click "Improve My Chances" to get started.</p>
      </div>
    );
  }

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 flex gap-6">
      {/* Sidebar: List of Plans */}
      <div className="w-1/4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Plans</h2>
        {plans.map(plan => (
          <div 
            key={plan.id}
            onClick={() => setActivePlanId(plan.id)}
            className={`p-4 rounded-lg cursor-pointer transition border ${
              activePlanId === plan.id 
                ? 'bg-blue-50 border-blue-500 shadow-sm' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <h3 className="font-semibold text-gray-800 truncate">{plan.opportunity_title}</h3>
            <div className="flex justify-between items-center mt-2 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                    plan.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {plan.status.replace('_', ' ')}
                </span>
                <span className="text-gray-500 text-xs">
                    {plan.items.filter(i => i.status === 'completed').length} / {plan.items.length} Done
                </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Kanban Board for Active Plan */}
      <div className="w-3/4">
        {activePlan && (
          <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{activePlan.opportunity_title} - Roadmap</h2>
                <div className="text-sm text-gray-500">Started: {new Date(activePlan.created_at).toLocaleDateString()}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {['pending', 'in_progress', 'completed'].map(status => (
                    <div key={status} className="bg-gray-100 p-4 rounded-lg min-h-[500px]">
                        <h3 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wide">
                            {status.replace('_', ' ')} 
                            <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded-full text-xs">
                                {activePlan.items.filter(i => i.status === status).length}
                            </span>
                        </h3>
                        
                        <div className="space-y-3">
                            {activePlan.items.filter(i => i.status === status).map(item => (
                                <PlanItemCard 
                                    key={item.id} 
                                    item={item} 
                                    onStatusChange={handleStatusUpdate}
                                    onEvidenceSubmit={handleEvidenceSubmit}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PlanItemCard = ({ item, onStatusChange, onEvidenceSubmit }) => {
    const [evidence, setEvidence] = useState(item.evidence_link || '');
    const [isEditingEvidence, setIsEditingEvidence] = useState(false);

    const handleSubmitEvidence = () => {
        onEvidenceSubmit(item.id, evidence);
        setIsEditingEvidence(false);
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'skill_gap': return 'bg-red-100 text-red-800';
            case 'mini_project': return 'bg-purple-100 text-purple-800';
            case 'reading_list': return 'bg-blue-100 text-blue-800';
            case 'sop': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${getTypeColor(item.type)}`}>
                    {item.type.replace('_', ' ')}
                </span>
            </div>
            <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            
            {/* Evidence Link */}
            <div className="mb-3">
                {item.evidence_link && !isEditingEvidence ? (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                        <a href={item.evidence_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate max-w-[150px]">
                            View Evidence
                        </a>
                        <button onClick={() => setIsEditingEvidence(true)} className="text-gray-400 hover:text-gray-600">✎</button>
                    </div>
                ) : (
                    <div className="flex gap-1">
                        <input 
                            type="text" 
                            value={evidence}
                            onChange={(e) => setEvidence(e.target.value)}
                            placeholder="Add proof link (GitHub/Doc)..."
                            className="text-xs border rounded px-2 py-1 w-full"
                        />
                        <button 
                            onClick={handleSubmitEvidence}
                            className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                        >
                            ✓
                        </button>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                {item.status !== 'pending' && (
                    <button 
                        onClick={() => onStatusChange(item.id, 'pending')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                    >
                        ← Pending
                    </button>
                )}
                {item.status === 'pending' && (
                    <button 
                        onClick={() => onStatusChange(item.id, 'in_progress')}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-auto"
                    >
                        Start →
                    </button>
                )}
                {item.status === 'in_progress' && (
                    <button 
                        onClick={() => onStatusChange(item.id, 'completed')}
                        className="text-xs text-green-600 hover:text-green-800 font-medium"
                    >
                        Complete →
                    </button>
                )}
                {item.status === 'completed' && (
                    <button 
                        onClick={() => onStatusChange(item.id, 'in_progress')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                    >
                        ← Reopen
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImprovementPlanBoard;
