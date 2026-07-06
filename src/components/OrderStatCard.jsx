import React from 'react';
import { MdMoreVert } from 'react-icons/md';

const OrderStatCard = ({ title, value, trendValue, trendDirection, period = "Last 7 days" }) => {
  const isUp = trendDirection === 'up';
  const isDown = trendDirection === 'down';
  const isNeutral = trendDirection === 'none';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 font-sans flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button className="text-gray-400 hover:text-gray-600 -mr-1 -mt-1 p-1">
          <MdMoreVert size={24} />
        </button>
      </div>
      
      <div className="flex items-baseline gap-2 mb-4">
        <h1 className="text-4xl xl:text-5xl font-bold text-[#082f2d] tracking-tight">{value}</h1>
        {trendValue && (
          <div className={`flex items-center text-[14px] font-bold ${isDown ? 'text-error' : 'text-[#22c55e]'}`}>
            {isUp && '↑ '}
            {isDown && '↓ '}
            {trendValue}
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500 font-medium">{period}</p>
    </div>
  );
};

export default OrderStatCard;
