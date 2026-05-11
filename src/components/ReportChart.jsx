import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { MdMoreVert } from 'react-icons/md';

const data = [
  { name: 'Sun', value: 15 },
  { name: 'Mon', value: 27 },
  { name: 'Tue', value: 18 },
  { name: 'Wed', value: 36 },
  { name: 'Thu', value: 22 },
  { name: 'Fri', value: 22 },
  { name: 'Sat', value: 31 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-aqua-spring text-cyprus px-3 py-1.5 rounded-lg shadow-sm text-sm font-medium border border-ocean-green flex flex-col items-center">
        <span>{label === 'Wed' ? 'Wednesday' : label === 'Thu' ? 'Thursday' : label === 'Tue' ? 'Tuesday' : label}</span>
        <span>{payload[0].value}k</span>
      </div>
    );
  }
  return null;
};

const ReportChart = () => {
  const [activeTab, setActiveTab] = useState('Customers');

  const tabs = [
    { label: 'Customers', value: '52k' },
    { label: 'Total Products', value: '3.5k' },
    { label: 'Stock Products', value: '2.5k' },
    { label: 'Out of Stock', value: '0.5k' },
    { label: 'Revenue', value: '250k' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Report for this week</h3>
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 p-1 rounded-lg flex text-[13px] font-medium">
            <button className="px-3 py-1 rounded-md bg-aqua-spring text-ocean-green shadow-sm">This week</button>
            <button className="px-3 py-1 rounded-md text-gray-500 hover:text-gray-700 transition-colors">Last week</button>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MdMoreVert size={24} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-100 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`pb-4 px-2 text-left flex-1 border-b-2 transition-colors ${
              activeTab === tab.label 
                ? 'border-ocean-green' 
                : 'border-transparent hover:border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900">{tab.value}</h2>
            <p className="text-[13px] text-gray-500 mt-1">{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4EA674" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#4EA674" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={({x, y, payload}) => {
                const isWed = payload.value === 'Wed';
                return (
                  <text x={x} y={y+15} textAnchor="middle" fill={isWed ? '#082f2d' : '#9ca3af'} fontSize={12} fontWeight={isWed ? 'bold' : 'normal'}>
                    {payload.value}
                  </text>
                );
              }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              tickFormatter={(val) => `${val}k`}
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#a7f3d0', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4EA674" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorReport)" 
              activeDot={{ r: 5, fill: '#fff', stroke: '#22c55e', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportChart;
