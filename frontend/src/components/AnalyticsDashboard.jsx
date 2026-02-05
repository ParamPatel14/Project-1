import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../api';
import { FiUsers, FiActivity, FiBook, FiDollarSign, FiAward } from 'react-icons/fi';

const AnalyticsDashboard = ({ title = "Platform Analytics" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-48">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-academia-gold)]"></div>
    </div>
  );
  
  if (!data) return <div className="text-stone-500 italic p-4">No analytics data available</div>;

  const StatCard = ({ icon: Icon, title, mainValue, subLabel, secondaryValue, secondaryLabel }) => (
    <div className="bg-[var(--color-academia-cream)] p-6 rounded-sm border border-[var(--color-academia-gold)] relative overflow-hidden group hover:shadow-md transition-all duration-300 h-full">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
            <Icon size={80} className="text-[var(--color-academia-charcoal)]" />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Icon className="text-[var(--color-academia-gold)]" size={20} />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-academia-charcoal)]">{title}</h3>
                </div>
                <div>
                    <p className="text-4xl font-serif font-bold text-[var(--color-academia-charcoal)]">{mainValue}</p>
                    <p className="text-xs font-medium text-stone-500 mt-1 uppercase tracking-wide">{subLabel}</p>
                </div>
            </div>
            {(secondaryValue !== undefined) && (
                 <div className="mt-4 pt-4 border-t border-[var(--color-academia-gold)]/20">
                    <p className="text-xl font-serif font-bold text-[var(--color-academia-charcoal)] opacity-80">{secondaryValue}</p>
                    <p className="text-xs font-medium text-stone-500 mt-1 uppercase tracking-wide">{secondaryLabel}</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="mt-2">
      <h2 className="text-2xl font-serif font-bold mb-8 text-[var(--color-academia-charcoal)] flex items-center">
        <span className="w-2 h-8 bg-[var(--color-academia-gold)] mr-3 rounded-sm"></span>
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Stats */}
        <StatCard 
            icon={FiUsers}
            title="Community"
            mainValue={data.users.students}
            subLabel="Students"
            secondaryValue={data.users.mentors}
            secondaryLabel="Mentors"
        />

        {/* Engagement Stats */}
        <div className="bg-white p-6 rounded-sm border border-stone-200 hover:border-[var(--color-academia-gold)] transition-all duration-300 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-4">
                <FiActivity className="text-[var(--color-academia-gold)]" size={20} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-academia-charcoal)]">Engagement</h3>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-stone-100 pb-2">
                    <span className="text-stone-600 text-sm">Opportunities</span>
                    <span className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">{data.engagement.opportunities}</span>
                </div>
                <div className="flex justify-between items-end border-b border-stone-100 pb-2">
                    <span className="text-stone-600 text-sm">Applications</span>
                    <span className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">{data.engagement.applications}</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-stone-600 text-sm flex items-center gap-1"><FiAward className="text-[var(--color-academia-gold)]" /> Certificates</span>
                    <span className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">{data.engagement.certificates}</span>
                </div>
            </div>
        </div>

        {/* Research Stats */}
        <StatCard 
            icon={FiBook}
            title="Research Output"
            mainValue={data.research.published}
            subLabel="Published Projects"
            secondaryValue={data.research.active}
            secondaryLabel="Active Projects"
        />

        {/* Funding Stats */}
        <StatCard 
            icon={FiDollarSign}
            title="Total Funding"
            mainValue={`$${data.funding.total_committed.toLocaleString()}`}
            subLabel="Committed Grants"
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
