import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-xl">🕉️</span>
              <h1 className="text-lg font-bold text-gray-800">SANATANA-DHARM</h1>
            </div>
            
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm border-b border-gray-200">
          <div className="px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🕉️</span>
                <h1 className="text-xl font-bold text-gray-800">SANATANA-DHARM</h1>
                <span className="text-sm text-gray-500">- Eternal Dharma Community</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-600">
                    {user?.username}
                  </span>
                  {user?.role === 'ADMIN' && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;