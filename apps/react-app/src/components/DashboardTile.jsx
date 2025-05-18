import React from 'react';
import { Link } from 'react-router-dom';

const DashboardTile = ({ label, icon, color = 'bg-white', to }) => (
  <Link to={to} aria-label={`Go to ${label}`}>
    <div
      className={`flex flex-col justify-center items-center h-24 rounded shadow-md hover:scale-105 transition-transform ${color} cursor-pointer`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = to;
        }
      }}
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-sm mt-2 font-semibold">{label}</div>
    </div>
  </Link>
);

export default DashboardTile;
