import React from 'react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { MdMoreVert } from 'react-icons/md';

const data = [
  { name: 'Sun', value: 20 },
  { name: 'Mon', value: 35 },
  { name: 'Tue', value: 35 },
  { name: 'Wed', value: 25 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 40 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-aqua-spring text-cyprus px-3 py-1.5 rounded-lg shadow-sm text-sm font-medium border border-ocean-green flex flex-col items-center">
        <span>{label === 'Wed' ? 'Wednesday' : label === 'Thu' ? 'Thursday' : label === 'Tue' ? 'Tuesday' : label}</span>
        <span className="font-bold">{payload[0].value.toFixed(1)}k</span>
      </div>
    );
  }
  return null;
};

const CustomerOverviewChart = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-gray-800">Customer Overview</h3>
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 p-1 rounded-lg flex text-[13px] font-medium">
            <button className="px-3 py-1 rounded-md bg-white text-ocean-green shadow-sm">This week</button>
            <button className="px-3 py-1 rounded-md text-gray-500 hover:text-gray-700 transition-colors">Last week</button>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MdMoreVert size={20} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-2">
        <div className="border-b-2 border-ocean-green pb-2">
            <h2 className="text-2xl font-bold text-cyprus">25k</h2>
            <p className="text-[12px] text-gray-400 font-medium mt-1">Active Customers</p>
        </div>
        <div className="border-b-2 border-transparent pb-2">
            <h2 className="text-2xl font-bold text-cyprus">5.6k</h2>
            <p className="text-[12px] text-gray-400 font-medium mt-1">Repeat Customers</p>
        </div>
        <div className="border-b-2 border-transparent pb-2">
            <h2 className="text-2xl font-bold text-cyprus">250k</h2>
            <p className="text-[12px] text-gray-400 font-medium mt-1">Shop Visitor</p>
        </div>
        <div className="border-b-2 border-transparent pb-2">
            <h2 className="text-2xl font-bold text-cyprus">5.5%</h2>
            <p className="text-[12px] text-gray-400 font-medium mt-1">Conversion Rate</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[250px] w-full mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCustomer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4EA674" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#4EA674" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => `${value}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4EA674', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4EA674" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorCustomer)" 
              activeDot={{ r: 6, fill: '#fff', stroke: '#4EA674', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerOverviewChart;
