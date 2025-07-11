import React, { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Settings, Search, HelpCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Applications = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigateHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleNavigateHome}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div onClick={() => navigate('/home')} className="flex items-center space-x-2 text-purple-600 font-medium text-base">
              <button>ApplyFirst</button>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-base" >
              <div className="w-6 h-6 flex items-center justify-center">
              </div>
              <button>Applications</button>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-base" onClick={() => navigate('/support')}>
              <div className="w-6 h-6 flex items-center justify-center">
              </div>
              <button>Support</button>
            </div>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-semibold text-gray-900">Application Tracker</h1>
            
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Application Stages */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Saved Column */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-600 text-xs">📁</span>
              </div>
              <h2 className="text-lg font-medium text-gray-900">Saved</h2>
              <span className="text-gray-500">({0})</span>
            </div>
            
            {/* One Click Apply Button */}
            <button className="w-full mb-6 px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
              <span className="text-yellow-400">⚡</span>
              <span>One Click Apply</span>
            </button>
            
            <div className="text-center text-gray-500 text-sm">
              <p>There are currently no applications in this stage</p>
            </div>
          </div>

          {/* Applied Column */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <h2 className="text-lg font-medium text-gray-900">Applied</h2>
              <span className="text-gray-500">({0})</span>
            </div>
            
            <div className="text-center text-gray-500 text-sm mt-16">
              <p>There are currently no applications in this stage</p>
            </div>
          </div>

          {/* Interviewing Column */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-blue-600 text-xs">👥</span>
              </div>
              <h2 className="text-lg font-medium text-gray-900">Interviewing</h2>
              <span className="text-gray-500">({0})</span>
            </div>
            
            <div className="text-center text-gray-500 text-sm mt-16">
              <p className="mb-2">You can move jobs to this stage once you hear back from employers</p>
            </div>
          </div>

          {/* Offer Column */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-purple-600 text-xs">🎉</span>
              </div>
              <h2 className="text-lg font-medium text-gray-900">Offer</h2>
              <span className="text-gray-500">({0})</span>
            </div>
            
            <div className="text-center text-gray-500 text-sm mt-16">
              <p className="mb-2">You can move jobs to this stage once you hear back from employers</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Applications;
