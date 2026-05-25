import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-gray-500 hover:bg-gray-50 hover:text-brand-black disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-200 shadow-sm"
      >
        <MdChevronLeft className="text-xl" />
      </button>

      <div className="bg-white px-4 py-2.5 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Page <span className="text-brand-black text-sm">{currentPage}</span> of {totalPages}
        </span>
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-gray-500 hover:bg-gray-50 hover:text-brand-black disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-200 shadow-sm"
      >
        <MdChevronRight className="text-xl" />
      </button>
    </div>
  );
};

export default Pagination;
