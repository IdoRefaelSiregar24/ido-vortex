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
      case 'In Stock': return 'text-emerald-700 bg-emerald-500/10';
      case 'Low Stock': return 'text-amber-700 bg-amber-500/10';
      case 'Out of Stock': return 'text-red-700 bg-red-500/10';
      case 'Non-aktif': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusDotColor = (status) => {
    switch(status) {
      case 'In Stock': return 'bg-emerald-500';
      case 'Low Stock': return 'bg-amber-500';
      case 'Out of Stock': return 'bg-red-500';
      case 'Non-aktif': return 'bg-gray-400';
      default: return 'bg-gray-400';
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full text-left font-sans">
      
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex bg-aqua-spring p-1 rounded-lg overflow-x-auto w-full lg:w-max gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`whitespace-nowrap px-4 py-2 text-[13px] font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === tab.name 
                  ? 'bg-white shadow-sm text-cyprus' 
                  : 'text-gray-500 hover:text-cyprus'
              }`}
            >
              {tab.name} {tab.count !== undefined && <span className={activeTab === tab.name ? 'text-ocean-green' : 'text-gray-400'}>({tab.count})</span>}
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
              className="w-full pl-4 pr-10 py-2 bg-[#f8fafc] border-none rounded-lg text-[13px] font-medium text-gray-700 outline-none focus:ring-1 focus:ring-ocean-green" 
            />
            <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center" title="Filter list">
            <MdFilterList size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-aqua-spring text-cyprus text-[13px] font-semibold">
              <th className="py-3 px-4 rounded-l-md w-10">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-ocean-green focus:ring-ocean-green cursor-pointer" />
              </th>
              <th className="py-3 px-2 w-12">No.</th>
              <th className="py-3 px-4 w-28">SKU</th>
              <th className="py-3 px-4">Nama Obat</th>
              <th className="py-3 px-4">Golongan</th>
              <th className="py-3 px-4 text-right">Harga Satuan</th>
              <th className="py-3 px-4 text-center">Stok</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-r-md text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => {
                const status = getStatus(product);
                const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-4">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-ocean-green focus:ring-ocean-green cursor-pointer" />
                    </td>
                    <td className="py-4 px-2 text-[14px] font-medium text-gray-700">{displayIndex}</td>
                    <td className="py-4 px-4 text-[14px] font-mono font-bold text-gray-600">{product.sku}</td>
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md border border-gray-100 overflow-hidden bg-white p-1 flex items-center justify-center flex-shrink-0">
                        <img src={product.image_url || 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=40&h=40&q=80'} alt={product.name} className="w-full h-full object-cover rounded-sm" />
                      </div>
                      <div className="flex flex-col text-left leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-medium text-gray-800 leading-tight">{product.name}</span>
                          {product.requires_prescription && (
                            <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[8px] font-black text-white leading-none" title="Obat Keras">
                              K
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <span className="text-[10px] text-gray-400 mt-1 line-clamp-1 max-w-xs font-medium">{product.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[14px] font-medium text-cyprus">{product.category}</td>
                    <td className="py-4 px-4 text-[14px] font-medium text-cyprus text-right">{formatRupiah(product.price)}</td>
                    <td className="py-4 px-4 text-[14px] font-medium text-cyprus text-center">
                      {product.stock} <span className="text-[10px] text-gray-400 font-normal">{product.unit || 'tablet'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(status)}`} />
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
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-450 hover:text-red-650 transition-all cursor-pointer"
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
                <td colSpan="9" className="py-12 text-center text-gray-450 font-bold text-xs uppercase tracking-widest">
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
