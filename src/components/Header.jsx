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

export default function Header({ user, title = "Dashboard", onToggleSidebar }) {
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="flex items-center justify-between w-full px-4 md:px-8 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button */}
        <button 
          onClick={onToggleSidebar} 
          className="p-1.5 text-gray-500 hover:text-cyprus lg:hidden focus:outline-none cursor-pointer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <h1 className="text-lg md:text-[22px] font-bold text-cyprus tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <InputField 
          variant="minimal" 
          placeholder="Search..."
          className="hidden sm:inline-flex w-[180px] md:w-[360px]" 
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

        <div className="flex items-center gap-2 md:gap-3">
          {user && (
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-cyprus">{user.full_name}</span>
              <span className="text-[11px] text-gray-400 capitalize">{user.role}</span>
            </div>
          )}
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-ocean-green/20 bg-aqua-spring hover:border-ocean-green transition-all cursor-pointer shadow-sm flex items-center justify-center text-ocean-green font-bold text-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}