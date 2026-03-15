import React from 'react';
import { MdSearch, MdFilterList } from 'react-icons/md';

interface FilterSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  searchQuery, setSearchQuery, 
  statusFilter, setStatusFilter, 
  dateFilter, setDateFilter 
}) => {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="relative flex-1">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input 
          type="text" 
          placeholder="Search by buyer name or hair type..."
          className="modern-input pl-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex space-x-4">
        <div className="relative">
          <MdFilterList className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <select 
            className="modern-input pl-11 pr-8 appearance-none min-w-[140px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        
        <input 
          type="date" 
          className="modern-input max-w-[160px]"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterSection;
