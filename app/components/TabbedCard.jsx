import React, { useState } from 'react';

const TabbedCard = ({ title, tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mx-auto border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex space-x-2 mt-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`py-2 px-4 rounded-lg text-gray-700 font-semibold transition duration-200 focus:outline-none ${index === activeTab ? 'bg-gray-300 text-gray-800 shadow' : 'bg-transparent hover:bg-gray-200'}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default TabbedCard;
