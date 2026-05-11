import React from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

export default function Pagination({ currentPage = 1, totalPages = 24, onPageChange }) {
  const renderPageNumbers = () => {
    const pages = [];
    
    // Pagination logic for ellipsis
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '....', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '....', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '....', currentPage - 1, currentPage, currentPage + 1, '....', totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === '....') {
        return (
          <div 
            key={`ellipsis-${index}`} 
            className="flex items-center justify-center min-w-[32px] h-[32px] px-1 bg-white border border-gray-200 rounded-md text-[13px] font-bold text-cyprus"
          >
            ....
          </div>
        );
      }
      
      const isActive = currentPage === page;
      
      return (
        <button
          key={page}
          onClick={() => onPageChange && onPageChange(page)}
          className={`flex items-center justify-center min-w-[32px] h-[32px] px-2 rounded-md text-[13px] font-bold transition-colors border
            ${isActive 
              ? 'bg-surf-crest text-cyprus border-surf-crest' 
              : 'bg-white text-cyprus border-gray-200 hover:bg-gray-50'
            }
          `}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center justify-between w-full pt-6">
      {/* Previous Button */}
      <button 
        onClick={() => onPageChange && currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-[13px] font-bold text-cyprus hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <MdArrowBack size={16} />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      {/* Next Button */}
      <button 
        onClick={() => onPageChange && currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-[13px] font-bold text-cyprus hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <MdArrowForward size={16} />
      </button>
    </div>
  );
}
