import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Ikon Logo Utama
const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#4EA674"/>
    <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Icons = {
  Dashboard: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Order: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Customer: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Coupon: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M9 12h.01"/><path d="M15 12h.01"/></svg>,
  Category: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.82l8.49-8.48"/></svg>,
  Transaction: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
  Brand: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Add: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>,
  Media: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  List: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>,
  Review: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>,
  Admin: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Medical: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2v6"/><path d="M15 2v6"/><path d="M12 17v-5"/><path d="M9.5 14.5h5"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M4 13h16"/></svg>,
};

import { supabase } from '../lib/supabase';

export default function Sidebar({ user, isOpen, setIsOpen }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert("Gagal keluar: " + error.message);
      }
    }
  };

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  const navigation = [
    {
      title: 'Main menu',
      items: [
        { name: 'Dashboard', icon: Icons.Dashboard, path: '/dashboard' },
        { name: 'Order Management', icon: Icons.Order, path: '/order-management' },
        { name: 'Customers', icon: Icons.Customer, path: '/pelanggan' },
        { name: 'Obat', icon: Icons.Category, path: '/products' },
        { name: 'Components', icon: Icons.List, path: '/components' },
        { name: 'Coupon Code', icon: Icons.Coupon, path: '/coupon' },
        { name: 'Transaction', icon: Icons.Transaction, path: '/transaksi' },
        { name: 'Brand', icon: Icons.Brand, path: '/brand' },
      ]
    },
    {
      title: 'Product',
      items: [
        { name: 'Add Products', icon: Icons.Add, path: '/add-product' },
        { name: 'Product Media', icon: Icons.Media, path: '/product-media' },
        { name: 'Product List', icon: Icons.List, path: '/obat' },
        { name: 'Product Reviews', icon: Icons.Review, path: '/reviews' },
      ]
    },
    {
      title: 'Admin',
      items: [
        { name: 'Medical Records',   icon: Icons.Medical, path: '/medical-records' },
        { name: 'User Management',   icon: Icons.Customer, path: '/user-management' },
        { name: 'Control Authority', icon: Icons.Admin, path: '/authority' },
      ]
    }
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 h-screen bg-white border-r border-gray-100 flex flex-col py-6 overflow-y-auto
      transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-0
      ${isCollapsed ? 'lg:w-[88px] w-[280px]' : 'w-[280px]'}
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      
      {/* 1. Header & Logo */}
      <div className={`flex items-center mb-8 relative transition-all duration-300 ${isCollapsed ? 'justify-center gap-1 px-3' : 'justify-between px-6'}`}>
        <div className="flex items-center gap-3 cursor-pointer overflow-hidden flex-shrink-0">
          <LogoIcon />
          <span className={`text-title-large font-bold text-cyprus tracking-wide transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[250px]'}`}>
            Apotek Sehat Pekanbaru
          </span>
        </div>
        {/* Close Button on Mobile */}
        <button onClick={() => setIsOpen && setIsOpen(false)} className="text-gray-400 lg:hidden hover:text-cyprus cursor-pointer p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {/* Tombol Collapse (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className={`text-gray-400 hidden lg:flex items-center justify-center hover:text-ocean-green active:scale-95 transition-all cursor-pointer flex-shrink-0 ${isCollapsed ? 'p-1 hover:bg-aqua-spring/50 rounded-lg' : 'p-1.5 hover:bg-aqua-spring/50 rounded-lg'}`}
        >
          {isCollapsed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
          )}
        </button>
      </div>

      {/* 2. Daftar Menu Navigasi Berdasarkan Seksion */}
      <div className={`flex-1 space-y-8 transition-all duration-300 ${isCollapsed ? 'lg:px-2 lg:space-y-6' : 'px-4'}`}>
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className={`px-4 mb-3 text-[12px] font-bold text-gray-400 uppercase tracking-widest transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:max-h-0 lg:mb-0 lg:max-w-0' : 'opacity-100 max-h-[20px] max-w-[200px] block'}`}>
              {section.title}
            </h3>
            {isCollapsed && (
              <div className="hidden lg:block border-t border-gray-100 my-4 mx-2" />
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen && setIsOpen(false)}
                    className={`
                      flex items-center rounded-xl w-full text-left transition-all duration-200 overflow-hidden
                      ${isCollapsed ? 'lg:justify-center lg:px-0 lg:py-3 lg:gap-0' : 'px-4 py-3 gap-4'}
                      ${isActive 
                        ? 'bg-ocean-green text-white font-bold' 
                        : 'bg-transparent text-grey font-medium hover:bg-aqua-spring/50 hover:text-cyprus'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-grey'} transition-transform duration-200`} />
                    <span className={`text-body transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* 3. User Profile & "Your Shop" */}
      <div className={`mt-8 pt-6 border-t border-gray-50 space-y-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {/* Profil */}
        <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'lg:flex-col lg:justify-center lg:gap-3 px-0' : 'justify-between px-2'}`}>
          <div className={`flex items-center transition-all duration-300 overflow-hidden ${isCollapsed ? 'lg:flex-col lg:text-center lg:gap-2' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-aqua-spring border border-ocean-green/20 flex items-center justify-center text-ocean-green font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className={`flex flex-col transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:max-w-0 lg:max-h-0' : 'opacity-100 max-w-[200px] max-h-[50px]'}`}>
              <span className="text-sm font-bold text-cyprus leading-none truncate w-32">{user?.full_name || "Apoteker"}</span>
              <span className="text-[11px] text-gray-400 truncate w-32">{user?.email || "staff@apotek.com"}</span>
            </div>
          </div>
          <button onClick={handleLogout} className={`text-gray-400 hover:text-error cursor-pointer transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'lg:mt-1 p-1.5 hover:bg-error/10 hover:text-error rounded-lg' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </div>

        {/* Tombol Your Shop */}
        <button className={`flex items-center transition-all duration-300 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer overflow-hidden ${isCollapsed ? 'lg:justify-center lg:p-3 w-full' : 'justify-between p-4 w-full'}`}>
          <div className="flex items-center gap-3">
            <svg className="text-cyprus flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="22" width="6" height="0"/></svg>
            <span className={`text-sm font-bold text-cyprus transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[150px]'}`}>Your Shop</span>
          </div>
          <svg className={`text-gray-300 group-hover:text-ocean-green transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'lg:opacity-0 lg:max-w-0' : 'opacity-100 max-w-[20px]'}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
        </button>
      </div>

    </aside>
  );
}