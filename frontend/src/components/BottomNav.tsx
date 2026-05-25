import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdInventory2, MdBarChart, MdCampaign } from 'react-icons/md';
import { motion } from 'framer-motion';

const navLinks = [
  { to: '/dashboard', label: 'Overview', icon: MdDashboard },
  { to: '/inventory', label: 'Inventory',  icon: MdInventory2 },
  { to: '/reports',   label: 'Analytics',    icon: MdBarChart },
  { to: '/promos',    label: 'Promos',       icon: MdCampaign },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden pb-safe">
      <div className="glass-panel !border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-xl rounded-[2rem] px-2">
        <div className="flex items-center justify-around h-16 px-2">
        {navLinks.map(link => {
          const isActive = path === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-black'
              }`}
            >
              <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'w-11 h-11 -translate-y-1.5' : 'w-8 h-8'}`}>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-pink-100 border-2 border-brand-pink rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <link.icon className={`relative z-10 transition-all duration-300 ${isActive ? 'text-2xl text-brand-pink' : 'text-xl'}`} />
              </div>
              <span className={`text-[9px] font-black tracking-widest uppercase ${isActive ? 'text-brand-black -translate-y-2' : ''}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default BottomNav;
