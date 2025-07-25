import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              CRO Analysis Tool
            </h1>
          </div>
          <nav className="flex space-x-8">
            <a href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Home
            </a>
            <a href="/admin" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Admin
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 