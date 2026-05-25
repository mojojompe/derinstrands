import React from 'react';
import { MdAdd } from 'react-icons/md';
import { motion } from 'framer-motion';

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, label = 'New Entry' }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-[5.5rem] right-6 md:bottom-8 z-[100] sm:hidden flex items-center gap-1.5 px-4 py-3 
                 bg-brand-pink text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-[0_10px_25px_-5px_rgba(255,20,147,0.5)] 
                 border-2 border-white"
      aria-label={label}
    >
      <MdAdd className="text-base shrink-0" />
      <span>{label}</span>
    </motion.button>
  );
};

export default FloatingActionButton;
