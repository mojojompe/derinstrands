import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdBarChart, MdAdd } from 'react-icons/md';

interface HeaderProps {
  onNewEntry?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewEntry }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex-shrink-0 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center bg-white">
              <img src="/logo.jpg" alt="DerinStrands Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-black text-brand-black tracking-tighter hidden sm:block">
              DERIN<span className="text-brand-pink"> STRANDS</span>
            </span>
          </div>
          
          <nav className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-300 ${
                isDashboard 
                ? 'bg-white shadow-sm text-brand-black font-bold' 
                : 'text-gray-500 hover:text-brand-black'
              }`}
            >
              <MdDashboard className={`text-xl ${isDashboard ? 'text-brand-pink' : ''}`} />
              <span className="text-sm hidden sm:block">Dashboard</span>
            </Link>
            <Link 
              to="/reports" 
              className={`flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-300 ${
                !isDashboard 
                ? 'bg-white shadow-sm text-brand-black font-bold' 
                : 'text-gray-500 hover:text-brand-black'
              }`}
            >
              <MdBarChart className={`text-xl ${!isDashboard ? 'text-brand-pink' : ''}`} />
              <span className="text-sm hidden sm:block">Reports</span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNewEntry}
              className="modern-button-primary flex items-center space-x-2"
            >
              <MdAdd className="text-xl" />
              <span className="hidden sm:inline">New Entry</span>
              <span className="sm:hidden"></span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
