import React from 'react';
import { MdSearch, MdClose, MdCalendarToday } from 'react-icons/md';

interface FilterSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
}

const statusOptions = ['All', 'Paid', 'Pending'];

const FilterSection: React.FC<FilterSectionProps> = ({
  searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  dateFilter, setDateFilter,
}) => {
  const hasActiveFilters = searchQuery || statusFilter !== 'All' || dateFilter;

  const clearAll = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateFilter('');
  };

  return (
    <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center mb-6">
      
      {/* Search */}
      <div className="relative flex-1 w-full">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
        <input
          type="text"
          placeholder="Search buyer name or hair type..."
          className="modern-input !py-2.5 pl-12 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-black transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
        <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100 shrink-0">
          {statusOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                statusFilter === opt 
                  ? 'bg-white text-brand-black shadow-sm' 
                  : 'text-gray-400 hover:text-brand-black'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <input
            type="date"
            className="modern-input !py-2.5 pl-9 pr-3 text-sm min-w-[140px]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="shrink-0 text-xs font-black text-brand-pink hover:text-brand-black transition-colors flex items-center gap-1 bg-pink-50 px-3 py-2.5 rounded-xl border border-pink-100"
          >
            <MdClose size={16} /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
