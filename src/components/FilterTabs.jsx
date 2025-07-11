import React from 'react'

export default function FilterTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex space-x-2 overflow-x-auto">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}