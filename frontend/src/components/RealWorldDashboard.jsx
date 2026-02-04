import React, { useState } from 'react';
import RealWorldInterest from './RealWorldInterest';
import IndustrialVisitList from './IndustrialVisitList';
import BeehiveEventList from './BeehiveEventList';

const RealWorldDashboard = () => {
  const [activeTab, setActiveTab] = useState('interests');

  const tabs = [
    { id: 'interests', label: 'My Interests', icon: '🎯' },
    { id: 'visits', label: 'Industrial Visits', icon: '🏭' },
    { id: 'beehive', label: 'Beehive Mentorship', icon: '🐝' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Real World Projects & Events</h1>
          <p className="mt-2 text-sm text-gray-600">
            Connect with industry, join visits, and participate in intensive mentorship weekends.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'interests' && <RealWorldInterest />}
          {activeTab === 'visits' && <IndustrialVisitList />}
          {activeTab === 'beehive' && <BeehiveEventList />}
        </div>
      </div>
    </div>
  );
};

export default RealWorldDashboard;
