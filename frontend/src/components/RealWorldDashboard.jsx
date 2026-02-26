import React, { useState } from 'react';
import RealWorldInterest from './RealWorldInterest';
import IndustrialVisitList from './IndustrialVisitList';
import BeehiveEventList from './BeehiveEventList';
import { FiTarget, FiGlobe, FiHexagon } from 'react-icons/fi';

const RealWorldDashboard = () => {
  const [activeTab, setActiveTab] = useState('interests');

  const tabs = [
    { id: 'interests', label: 'My Interests', icon: FiTarget },
    { id: 'visits', label: 'Industrial Visits', icon: FiGlobe },
    { id: 'beehive', label: 'Beehive Mentorship', icon: FiHexagon },
  ];

  return (
    <div className="bg-[var(--color-academia-cream)] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-academia-charcoal)]">Real World Projects & Events</h1>
          <p className="mt-2 text-base md:text-lg font-light text-stone-600">
            Connect with industry, join visits, and participate in intensive mentorship weekends.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-200 mb-8 overflow-x-auto scrollbar-hide">
          <nav className="-mb-px flex space-x-4 md:space-x-8 min-w-max px-1" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)]'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-academia-charcoal)] hover:border-stone-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <tab.icon className={`mr-2 ${activeTab === tab.id ? 'text-[var(--color-academia-gold)]' : 'text-stone-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'interests' && <RealWorldInterest />}
          {activeTab === 'visits' && <IndustrialVisitList />}
          {activeTab === 'beehive' && <BeehiveEventList showAdminControls={false} />}
        </div>
      </div>
    </div>
  );
};

export default RealWorldDashboard;
