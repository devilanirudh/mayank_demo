import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, BarChart2, FileText } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#1a0847] p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Proodloop</h1>
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#2a1163] text-white' : 'text-gray-300 hover:bg-[#2a1163] hover:text-white'
            }`
          }
        >
          <Activity size={20} />
          <span>Realtime</span>
        </NavLink>
        <NavLink
          to="/batch"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#2a1163] text-white' : 'text-gray-300 hover:bg-[#2a1163] hover:text-white'
            }`
          }
        >
          <BarChart2 size={20} />
          <span>Batch Analysis</span>
        </NavLink>
        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#2a1163] text-white' : 'text-gray-300 hover:bg-[#2a1163] hover:text-white'
            }`
          }
        >
          <FileText size={20} />
          <span>Summary</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;