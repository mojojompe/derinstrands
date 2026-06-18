import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdInventory2, MdBarChart, MdCampaign } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="fixed bottom-6 left-0 right-0 z-40 md:hidden flex justify-center pointer-events-none pb-safe">
      <div className="pointer-events-auto bg-white/80 backdrop-blur-2xl rounded-full px-3 py-2 shadow-[0_20px_40px_rgba(0,0,0,0.25)] border border-gray-100/50 flex items-center gap-2">
        {navLinks.map(link => {
          const isActive = path === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`relative flex items-center justify-center h-12 rounded-full transition-all duration-300 overflow-hidden ${
                isActive ? 'px-5 text-brand-black' : 'w-12 text-gray-400 hover:text-brand-black hover:bg-gray-50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-gray-200 rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2">
                <link.icon className="text-xl shrink-0" />
                <AnimatePresence>
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: 'auto', marginLeft: 4 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
