import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdSwapVert, MdMoreHoriz, MdEdit, MdDeleteOutline } from 'react-icons/md';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';

export default function ProductTable({ items = [], onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('Semua Obat');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter Logic
  const getStatus = (product) => {
    if (product.is_active === false) return 'Non-aktif';
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock > 0 && product.stock <= 25) return 'Low Stock';
    return 'In Stock';
  };

  const filteredProducts = items.filter((product) => {
    const status = getStatus(product);

    // 1. Tab Filter
    let tabMatch = true;
    if (activeTab === 'Obat Keras') tabMatch = product.requires_prescription === true;
    else if (activeTab === 'Stok Rendah') tabMatch = product.stock > 0 && product.stock <= 25 && product.is_active !== false;
    else if (activeTab === 'Habis') tabMatch = product.stock === 0 && product.is_active !== false;
    else if (activeTab === 'Non-aktif') tabMatch = product.is_active === false;
    
    // 2. Search Filter
    const searchMatch = 
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && searchMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 on filter/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Dynamic Tabs Data
  const tabs = [
    { name: 'Semua Obat', count: items.length },
    { name: 'Obat Keras', count: items.filter(p => p.requires_prescription === true).length },
    { name: 'Stok Rendah', count: items.filter(p => p.stock > 0 && p.stock <= 25 && p.is_active !== false).length },
    { name: 'Habis', count: items.filter(p => p.stock === 0 && p.is_active !== false).length },
    { name: 'Non-aktif', count: items.filter(p => p.is_active === false).length },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Low Stock': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Out of Stock': return 'text-red-700 bg-red-50 border-red-200';
      case 'Non-aktif': return 'text-gray-500 bg-gray-50 border-gray-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans text-left">
      
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-lg overflow-x-auto w-full lg:w-max gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`whitespace-nowrap px-4 py-2 text-[12px] font-bold rounded-md transition-all cursor-pointer ${
                activeTab === tab.name 
                  ? 'bg-white shadow-xs text-cyprus' 
                  : 'text-gray-500 hover:text-cyprus'
              }`}
            >
              {tab.name} {tab.count !== undefined && <span className={activeTab === tab.name ? 'text-green-600' : 'text-gray-400'}>({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <input 
              type="text" 
              placeholder="Cari SKU atau nama obat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-250/70 rounded-lg text-[12px] font-medium text-gray-700 outline-none focus:ring-1 focus:ring-green-650" 
            />
            <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer" title="Filter list">
            <MdFilterList size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-aqua-spring text-cyprus text-[13px] font-bold border-b border-gray-150">
              <th className="py-3.5 px-4 w-28">SKU</th>
              <th className="py-3.5 px-4">Nama Obat</th>
              <th className="py-3.5 px-4">Golongan</th>
              <th className="py-3.5 px-4 text-right">Harga Satuan</th>
              <th className="py-3.5 px-4 text-center">Stok</th>
              <th className="py-3.5 px-4 text-center">Resep (K)</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const status = getStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-4 text-[13px] font-mono font-bold text-gray-600">{product.sku}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-extrabold text-cyprus leading-none">{product.name}</span>
                          {product.requires_prescription && (
                            <span className="w-4 h-4 rounded-full bg-red-600 border border-black flex items-center justify-center text-[8px] font-black text-black leading-none" title="Obat Keras">
                              K
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <span className="text-[10px] text-gray-400 mt-1 line-clamp-1 max-w-xs font-medium">{product.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[12px] font-bold text-gray-600">{product.category}</td>
                    <td className="py-4 px-4 text-[13px] font-black text-cyprus text-right">{formatRupiah(product.price)}</td>
                    <td className="py-4 px-4 text-[13px] font-bold text-cyprus text-center">
                      {product.stock} <span className="text-[10px] text-gray-400 font-normal">{product.unit || 'tablet'}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        product.requires_prescription 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                      }`}>
                        {product.requires_prescription ? 'Resep' : 'Bebas'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[12px] font-bold">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onEdit(product)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-cyprus hover:text-green-650 transition-all cursor-pointer"
                          title="Ubah info obat"
                        >
                          <MdEdit size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(product.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-650 transition-all cursor-pointer"
                          title="Nonaktifkan obat (Soft Delete)"
                        >
                          <MdDeleteOutline size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                  Tidak ada obat ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-4 border-t border-gray-100">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </div>
      )}

    </div>
  );
}
