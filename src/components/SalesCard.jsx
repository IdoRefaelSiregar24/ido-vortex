import React from 'react';
import { MdMoreVert } from 'react-icons/md';

const SalesCard = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm w-full max-w-[360px] font-sans">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">Total Sales</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MdMoreVert size={24} />
        </button>
      </div>
      
      {/* Subtitle */}
      <p className="text-sm text-gray-500 mt-1 mb-6">Last 7 days</p>
      
      {/* Main Content */}
      <div className="flex items-baseline mb-6 gap-3">
        <h1 className="text-5xl font-bold text-[#082f2d] tracking-tight">$350K</h1>
        <div className="flex items-center gap-1.5">
          <span className="text-[15px] font-medium text-gray-800">Sales</span>
          <span className="text-[14px] font-medium text-[#22c55e]">
            ↑ 10.4%
          </span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-end mt-2">
        <p className="text-[14px] text-gray-500 pb-1">
          Previous 7days <span className="text-[#605dec] font-medium">($235)</span>
        </p>
        <button className="px-6 py-1.5 border border-[#605dec] text-[#605dec] text-[15px] font-medium rounded-full hover:bg-indigo-50 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
};

export default SalesCard;
