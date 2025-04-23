// DashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome, Agent!</h2>
      <p className="text-center">This is your dashboard.</p>
      <Link to="/login" className="block text-center font-medium text-indigo-600 hover:text-indigo-500">
        Logout
      </Link>
    </div>
  </div>
);

export default DashboardPage;