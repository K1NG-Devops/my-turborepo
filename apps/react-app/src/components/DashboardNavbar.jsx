import React from 'react';
import { Link } from 'react-router-dom';

const DashboardNavbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <span className="font-bold text-lg">Dashboard</span>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Home</Link>
        <Link to="/home" className="hover:underline">Go to Site</Link>
        <Link to="/logout" className="hover:underline">Logout</Link>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
