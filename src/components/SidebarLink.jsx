// src/components/SidebarLink.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SidebarLink = ({ to, icon: Icon, label, tooltip }) => {
  return (
    <div className="relative group w-full">
      {to ? (
        <Link
          to={to}
          className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors duration-300 w-full text-gray-300"
        >
          <Icon className="mr-3" size={18} />
          <span className={`whitespace-nowrap ${!label && 'hidden'} md:inline`}>{label}</span>
        </Link>
      ) : (
        <button
          onClick={() => {}}
          className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors duration-300 w-full text-left text-gray-300"
        >
          <Icon className="mr-3" size={18} />
          <span className={`whitespace-nowrap ${!label && 'hidden'} md:inline`}>{label}</span>
        </button>
      )}

      {/* Tooltip */}
      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-800 text-gray-200 text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {tooltip}
      </div>
    </div>
  );
};

export default SidebarLink;