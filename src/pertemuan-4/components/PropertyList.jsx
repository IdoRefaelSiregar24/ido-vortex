import React, { useState } from 'react';
import propertiesData from '../HomeSales.json';
import PropertyCard from './PropertyCard';
import { formatRupiah } from './currency';

const FILTER_TAGS = ['Semua', 'Minimalis', 'Mewah', 'Modern', 'Investasi', 'Subsidi'];
const UNIQUE_LOCATIONS = ['Semua', ...new Set(propertiesData.map(p => p.details.location.split(', ')[0]))];

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            Ido<span className="text-orange-500">Vortex</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Beranda', 'Properti', 'Tentang', 'Kontak'].map((item) => (
            <a key={item} href="#" className={`text-sm font-semibold transition-colors hover:text-orange-500 ${item === 'Properti' ? 'text-orange-500' : 'text-gray-500'}`}>
              {item}
            </a>
          ))}
        </div>
        <button className="text-sm font-bold text-white px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-all shadow-md">
          Pasang Iklan
        </button>
      </div>
    </nav>
  );
}

// ── PropertyList (Main Component) ──────────────────────────────────────────
export default function PropertyList() {

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [locationFilter, setLocationFilter] = useState('Semua'); 
  const [viewMode, setViewMode] = useState('guest'); 


  const filteredProperties = propertiesData.filter((property) => {
    const matchSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.details.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTag =
      activeFilter === 'Semua' ||
      property.tags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase()));

    const matchLocation = 
      locationFilter === 'Semua' || 
      property.details.location.includes(locationFilter);

    return matchSearch &&  matchTag && matchLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header Section & Toggle View */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Direktori Properti</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola dan temukan hunian impian dengan mudah.</p>
          </div>
          
          {/* Tombol Toggle Admin vs Guest */}
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('guest')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'guest' ? 'bg-white shadow text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Mode Guest (Card)
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'admin' ? 'bg-white shadow text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Mode Admin (Tabel)
            </button>
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Cari Properti</label>
            <input
              type="text"
              placeholder="Ketik nama atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-4 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Filter 1: Kategori Tipe</label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full py-2.5 px-4 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            >
              {FILTER_TAGS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Filter 2: Lokasi Kota</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full py-2.5 px-4 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            >
              {UNIQUE_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>

        {/* Area Hasil */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 font-medium">
            Menampilkan <span className="font-bold text-orange-500">{filteredProperties.length}</span> properti ditemukan
          </p>
        </div>

        {/* Conditional Rendering: Guest (Card Grid) vs Admin (Table) */}
        {filteredProperties.length > 0 ? (
          viewMode === 'guest' ? (
            /* TAMPILAN GUEST (GRID CARD) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))} 
            </div>
          ) : (
            /* TAMPILAN ADMIN (TABEL) */
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Nama Properti</th>
                    <th className="px-6 py-4">Lokasi</th>
                    <th className="px-6 py-4">Kategori (Tag)</th>
                    <th className="px-6 py-4">Luas (T/B)</th>
                    <th className="px-6 py-4">Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProperties.map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-gray-500">{item.details.location}</td>
                      <td className="px-6 py-4">
                        <span className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-md text-xs font-bold">
                          {item.tags[0]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {item.details.specs.landArea} / {item.details.specs.buildingArea}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-gray-900">
                        {formatRupiah(item.details.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-4xl mb-3">🏡</p>
            <p className="text-sm text-gray-500 font-medium">Data properti tidak ditemukan.</p>
          </div>
        )}
      </main>
    </div>
  );
}