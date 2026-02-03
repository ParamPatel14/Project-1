import React, { useState, useEffect } from 'react';
import { getOpportunities } from '../api';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiBriefcase, FiArrowRight } from 'react-icons/fi';

const OpportunityList = ({ initialFilters = {} }) => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  // Use JSON.stringify to ensure deep comparison of initialFilters object
  // preventing infinite loops when a new object reference is passed or generated
  useEffect(() => {
    fetchOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, JSON.stringify(initialFilters)]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const filters = { ...initialFilters, ...(filterType ? { type: filterType } : {}) };
      const data = await getOpportunities(filters);
      setOpportunities(data);
    } catch (err) {
      console.error("Failed to fetch opportunities", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold font-serif text-[var(--color-academia-charcoal)]">Explore Opportunities</h2>
        
        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-academia-gold)] bg-white shadow-sm font-serif text-[var(--color-academia-charcoal)]"
        >
          <option value="">All Types</option>
          <option value="internship">Internship</option>
          <option value="research_assistant">Research Assistant</option>
          <option value="phd_guidance">PhD Guidance</option>
          <option value="grant">Grant / Collaboration</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-academia-gold)]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.length === 0 ? (
            <p className="text-stone-500 col-span-full text-center py-10 font-serif">No opportunities found.</p>
          ) : (
            opportunities.map((opp) => (
              <div 
                key={opp.id} 
                onClick={() => navigate(`/opportunities/${opp.id}`)}
                className="bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 cursor-pointer group transform hover:-translate-y-1 overflow-hidden flex flex-col h-full hover:border-[var(--color-academia-gold)]"
              >
                <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wide border ${
                            opp.type === 'internship' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            opp.type === 'grant' ? 'bg-green-50 text-green-800 border-green-200' :
                            'bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] border-[var(--color-academia-gold)]'
                        }`}>
                            {opp.type.replace('_', ' ')}
                        </span>
                        {opp.is_open ? (
                            <span className="flex items-center text-green-700 text-xs font-semibold">
                                <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></span> Open
                            </span>
                        ) : (
                            <span className="text-red-600 text-xs font-semibold">Closed</span>
                        )}
                    </div>
                    
                    <h3 className="text-xl font-bold font-serif text-[var(--color-academia-charcoal)] mb-2 group-hover:text-[var(--color-academia-gold)] transition-colors line-clamp-2">{opp.title}</h3>
                    
                    {opp.mentor && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-stone-600">
                         <div className="w-6 h-6 rounded-full bg-[var(--color-academia-cream)] border border-[var(--color-academia-gold)] flex items-center justify-center text-[var(--color-academia-charcoal)] font-bold text-xs font-serif">
                            {opp.mentor.name ? opp.mentor.name.charAt(0).toUpperCase() : 'M'}
                         </div>
                         <span className="font-serif">{opp.mentor.name || 'Unknown Mentor'}</span>
                      </div>
                    )}

                    <p className="text-stone-600 text-sm mb-4 line-clamp-3 leading-relaxed">{opp.description}</p>
                    
                    {opp.deadline && (
                        <div className="flex items-center text-stone-500 text-xs mt-auto">
                            <FiClock className="mr-1 text-[var(--color-academia-gold)]" />
                            Open till: {new Date(opp.deadline).toLocaleDateString()}
                        </div>
                    )}
                </div>
                
                <div className="bg-[var(--color-academia-cream)] px-6 py-4 border-t border-stone-200 flex justify-between items-center group-hover:bg-[var(--color-academia-gold)]/10 transition-colors">
                    <span className="text-sm text-[var(--color-academia-charcoal)] font-medium font-serif">View Details</span>
                    <FiArrowRight className="text-[var(--color-academia-gold)] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OpportunityList;
