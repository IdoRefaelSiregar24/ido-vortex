import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { MdMoreVert } from 'react-icons/md';
import Button from './Button';

const barData = Array.from({ length: 30 }, (_, i) => ({
  value: Math.floor(Math.random() * 30) + 10
}));

const countries = [
  { name: 'US', flag: '🇺🇸', value: '30k', percent: '25.8%', isUp: true, progress: 60 },
  { name: 'Brazil', flag: '🇧🇷', value: '30k', percent: '15.8%', isUp: false, progress: 40 },
  { name: 'Australia', flag: '🇦🇺', value: '25k', percent: '35.8%', isUp: true, progress: 50 },
];

const UsersActiveCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[15px] font-medium text-primary-cta">Users in last 30 minutes</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MdMoreVert size={24} />
        </button>
      </div>
      
      {/* Big Value */}
      <h1 className="text-4xl font-bold text-cyprus mb-6 tracking-tight">21.5K</h1>
      
      {/* Subtitle & Bar Chart */}
      <p className="text-[13px] text-gray-500 mb-2">Users per minute</p>
      <div className="h-16 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#4EA674" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="w-full h-px bg-gray-100 mb-6"></div>
      
      {/* Sales by Country Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-semibold text-gray-800">Sales by Country</h3>
        <span className="text-[14px] font-medium text-gray-800">Sales</span>
      </div>
      
      {/* Country List */}
      <div className="space-y-5 mb-8">
        {countries.map((country, idx) => (
          <div key={idx} className="flex items-center">
            <div className="text-3xl mr-4 leading-none">{country.flag}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-800 text-[15px]">{country.value}</span>
                  <span className="text-[13px] text-gray-400 font-medium">{country.name}</span>
                </div>
                <div className={`flex items-center text-[12px] font-bold ${country.isUp ? 'text-success' : 'text-red-500'}`}>
                  {country.isUp ? '↑' : '↓'} {country.percent}
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 flex items-center">
                <div className="bg-primary-cta h-1.5 rounded-full" style={{ width: `${country.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Button */}
      <div className="mt-auto">
        <Button variant="accent" className="w-full !border-primary-cta !text-primary-cta hover:!bg-indigo-50 !py-2.5 !text-[15px]">
          View Insight
        </Button>
      </div>
    </div>
  );
};

export default UsersActiveCard;
