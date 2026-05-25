import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdClose, MdTune, MdCalendarToday } from 'react-icons/md';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  placeholder?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, searchQuery, setSearchQuery, placeholder = "Search..." }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start sm:items-center justify-center p-4 pt-24 sm:pt-4">
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }} 
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-white/70"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl"
          >
            <div className="flex items-center border-b-2 border-brand-black pb-4 sm:pb-6 relative">
              <MdSearch className="text-3xl sm:text-5xl text-brand-black mr-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                className="w-full bg-transparent text-2xl sm:text-5xl font-black text-brand-black placeholder-gray-300 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-black p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shrink-0">
                  <MdClose className="text-xl sm:text-3xl" />
                </button>
              )}
            </div>

            <div className="mt-8">
              <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Suggested Searches</p>
              <div className="flex flex-wrap gap-3">
                {['Frontal', 'Closure', 'Bone Straight', 'Braid', 'Wig'].map(term => (
                  <button
                    key={term} onClick={() => setSearchQuery(term)}
                    className="px-5 py-3 bg-white rounded-2xl text-[10px] sm:text-xs font-black text-gray-500 hover:bg-brand-black hover:text-white transition-all border border-gray-200 shadow-sm uppercase tracking-widest"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={onClose} className="mt-12 text-[10px] sm:text-xs font-black text-gray-400 hover:text-brand-black uppercase tracking-widest underline underline-offset-4">
              Close Search
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  statusOptions: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, onClose, statusFilter, setStatusFilter, dateFilter, setDateFilter, statusOptions 
}) => {
  const hasActiveFilters = statusFilter !== 'All' || dateFilter;

  const clearAll = () => {
    setStatusFilter('All');
    setDateFilter('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-8"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <MdTune className="text-2xl text-brand-black" />
                <h2 className="text-xl font-black text-brand-black uppercase tracking-tighter italic">Filters</h2>
              </div>
              {hasActiveFilters && (
                <button onClick={clearAll} className="text-[10px] font-black text-brand-pink uppercase tracking-widest hover:text-brand-black transition-colors bg-pink-50 px-3 py-1.5 rounded-xl">
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Status</p>
                <div className="flex flex-wrap gap-3">
                  {statusOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setStatusFilter(opt)}
                      className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        statusFilter === opt 
                          ? 'bg-brand-black text-white shadow-md scale-[1.02]' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-brand-black border border-gray-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Date</p>
                <div className="relative">
                  <MdCalendarToday className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                  <input
                    type="date"
                    className="modern-input !py-4 pl-12 pr-4 text-sm font-bold border border-gray-100"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button onClick={onClose} className="mt-10 w-full modern-button-primary !bg-brand-pink hover:!bg-brand-black py-4">
              Apply Filters
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
