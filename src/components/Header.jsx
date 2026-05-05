import React from 'react';
import InputField from './SearchField';


const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
  </svg>
);

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full px-8 py-5 bg-white border-b border-gray-100">
      <div>
        <h1 className="text-[22px] font-bold text-cyprus tracking-tight">Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Sekarang ini akan berfungsi karena komponen sudah didefinisikan */}
        <InputField 
          variant="minimal" 
          placeholder="Search data, users, or reports"
          className="w-[360px]" 
        />

        <button className="relative text-cyprus hover:text-ocean-green transition-colors cursor-pointer">
          <BellIcon />
          <span className="absolute top-0 right-0.5 w-[8px] h-[8px] bg-error rounded-full border-[1.5px] border-white"></span>
        </button>

        <button className="flex items-center bg-aqua-spring rounded-full p-1 w-14 h-8 cursor-pointer relative shadow-inner">
          <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-sm text-cyprus">
            <SunIcon />
          </div>
        </button>

        <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-ocean-green transition-all cursor-pointer shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="User" 
            className="w-full h-full object-cover" 
          />
        </button>
      </div>
    </header>
  );
}