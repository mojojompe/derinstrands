import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdSearch, MdTune, MdAdd, MdDashboard, MdInventory2, MdBarChart, MdCampaign, MdLogout } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  onAddClick?: () => void;
  activeFilterCount?: number;
  showSearch?: boolean;
  showFilter?: boolean;
}

const navLinks = [
  { to: '/dashboard', label: 'Overview', icon: MdDashboard },
  { to: '/inventory', label: 'Inventory',  icon: MdInventory2 },
  { to: '/reports',   label: 'Analytics',    icon: MdBarChart },
  { to: '/promos',    label: 'Promos',       icon: MdCampaign },
];

const Header: React.FC<HeaderProps> = ({ 
  onSearchClick, onFilterClick, onAddClick, 
  activeFilterCount = 0, showSearch = false, showFilter = false 
}) => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-40 w-full pt-4 px-4 sm:px-6 lg:px-8">
      <header className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-gray-100/50 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          <div className="flex items-center gap-8 lg:gap-12">
            {/* ── Brand ── */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img src="/logo.jpg" alt="DerinStrands Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg sm:text-xl font-black text-brand-black tracking-tighter italic">
                  DERIN<span className="text-brand-pink">STRANDS</span>
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map(link => {
                const isActive = path === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                      isActive 
                        ? 'bg-gray-200 text-brand-black shadow-sm' 
                        : 'text-gray-400 hover:text-brand-black hover:bg-gray-50'
                    }`}
                  >
                    <link.icon className="text-lg" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-1 sm:gap-2">
            {showSearch && (
              <button onClick={onSearchClick} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-gray-500 hover:text-brand-black hover:bg-gray-100 transition-colors">
                <MdSearch className="text-xl sm:text-2xl" />
              </button>
            )}
            
            {showFilter && (
              <button onClick={onFilterClick} className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-gray-500 hover:text-brand-black hover:bg-gray-100 transition-colors">
                <MdTune className="text-xl sm:text-2xl" />
                {activeFilterCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-pink rounded-full border-2 border-white" />
                )}
              </button>
            )}

            {onAddClick && (
              <button onClick={onAddClick} className="hidden sm:flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-pink text-white rounded-xl shadow-md hover:bg-brand-black transition-all ml-2 font-black text-[10px] uppercase tracking-widest">
                <MdAdd className="text-base" />
                <span>Add New</span>
              </button>
            )}

            <button 
              onClick={() => setIsLogoutModalOpen(true)} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-gray-500 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors ml-2"
              title="Logout"
            >
              <MdLogout className="text-xl sm:text-2xl" />
            </button>
          </div>

        </div>
      </header>

      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of the admin portal?"
        confirmText="Logout"
        isLogout={true}
      />
    </div>
  );
};

export default Header;
