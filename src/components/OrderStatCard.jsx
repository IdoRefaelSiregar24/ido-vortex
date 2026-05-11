import React from 'react';
import { MdMoreVert } from 'react-icons/md';

const OrderStatCard = ({ title, value, trendValue, trendDirection, period = "Last 7 days" }) => {
  const isUp = trendDirection === 'up';
  const isDown = trendDirection === 'down';
  const isNeutral = trendDirection === 'none';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 font-sans flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>
        <button className="text-gray-400 hover:text-gray-600 -mr-1 -mt-1 p-1">
          <MdMoreVert size={20} />
        </button>
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <h1 className="text-3xl font-bold text-cyprus">{value}</h1>
        {trendValue && (
          <div className={`flex items-center text-[13px] font-bold ${isDown ? 'text-error' : 'text-success'}`}>
            {isUp && '↑ '}
            {isDown && '↓ '}
            {trendValue}
          </div>
        )}
      </div>
      
      <p className="text-[13px] text-gray-400 font-medium">{period}</p>
    </div>
  );
};

export default OrderStatCard;
