import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdSwapVert, MdMoreHoriz } from 'react-icons/md';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';

const images = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=40&h=40&q=80',
];

const products = [
  { id: 1, name: 'Paracetamol 500mg', image: images[0], createdDate: '01-01-2025', order: 25, stock: 45, status: 'In Stock' },
  { id: 2, name: 'Ibuprofen 400mg', image: images[1], createdDate: '01-01-2025', order: 20, stock: 120, status: 'In Stock' },
  { id: 3, name: 'Amoxicillin 250mg', image: images[2], createdDate: '01-01-2025', order: 35, stock: 30, status: 'In Stock' },
  { id: 4, name: 'Vitamin C 1000mg', image: images[3], createdDate: '01-01-2025', order: 40, stock: 80, status: 'In Stock' },
  { id: 5, name: 'Omeprazole 20mg', image: images[4], createdDate: '01-01-2025', order: 45, stock: 25, status: 'In Stock' },
  { id: 6, name: 'Cetirizine 10mg', image: images[5], createdDate: '01-01-2025', order: 55, stock: 150, status: 'In Stock' },
  { id: 7, name: 'Metformin 500mg', image: images[0], createdDate: '01-01-2025', order: 20, stock: 10, status: 'Low Stock' },
  { id: 8, name: 'Atorvastatin 10mg', image: images[1], createdDate: '01-01-2025', order: 16, stock: 0, status: 'Out of Stock' },
];

export default function ProductTable({ items = products }) {
  const [activeTab, setActiveTab] = useState('Semua Obat');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Logic
  const filteredProducts = items.filter((product) => {
    // 1. Tab Filter
    let tabMatch = true;
    if (activeTab === 'Obat Unggulan') tabMatch = product.order > 30;
    else if (activeTab === 'Stok Rendah') tabMatch = product.stock > 0 && product.stock <= 25;
    else if (activeTab === 'Habis') tabMatch = product.stock === 0;
    
    // 2. Search Filter
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        product.id.toString().includes(searchQuery);

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
    { name: 'Obat Unggulan', count: items.filter(p => p.order > 30).length },
    { name: 'Stok Rendah', count: items.filter(p => p.stock > 0 && p.stock <= 25).length },
    { name: 'Habis', count: items.filter(p => p.stock === 0).length },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'text-green-600';
      case 'Low Stock': return 'text-orange-600';
      case 'Out of Stock': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case 'In Stock': return 'bg-green-50';
      case 'Low Stock': return 'bg-orange-50';
      case 'Out of Stock': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans">
      
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex bg-aqua-spring p-1 rounded-lg overflow-x-auto w-full lg:w-max">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`whitespace-nowrap px-4 py-2 text-[13px] font-semibold rounded-md transition-all ${
                activeTab === tab.name 
                  ? 'bg-white shadow-sm text-cyprus' 
                  : 'text-gray-500 hover:text-cyprus'
              }`}
            >
              {tab.name} {tab.count && <span className={activeTab === tab.name ? 'text-ocean-green' : 'text-gray-400'}>({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <input 
              type="text" 
              placeholder="Cari obat" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-[#f8fafc] border-none rounded-lg text-[13px] font-medium text-gray-700 outline-none focus:ring-1 focus:ring-ocean-green" 
            />
            <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <MdFilterList size={18} />
          </button>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <MdSwapVert size={18} />
          </button>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <MdMoreHoriz size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-aqua-spring text-cyprus text-[13px] font-semibold">
              <th className="py-3 px-4 rounded-l-md w-10"></th>
              <th className="py-3 px-2 w-12">No.</th>
              <th className="py-3 px-4">Obat</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-r-md">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, idx) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-ocean-green focus:ring-ocean-green cursor-pointer" />
                  </td>
                  <td className="py-4 px-4 text-[14px] font-medium text-gray-700">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="py-4 px-4">
                    <Link 
                      to={`/products/${product.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-md border border-gray-100 overflow-hidden bg-white p-1 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-sm" />
                      </div>
                      <span className="text-[14px] font-medium text-cyprus hover:underline leading-tight w-40">{product.name}</span>
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-[14px] font-medium text-cyprus">{product.createdDate}</td>
                  <td className="py-4 px-4 text-[14px] font-medium text-cyprus">{product.order}</td>
                  <td className="py-4 px-4 text-[14px] font-medium text-cyprus">{product.stock}</td>
                  <td className="py-4 px-4 text-[13px] font-semibold">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${getStatusBgColor(product.status)} ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Link 
                      to={`/products/${product.id}`}
                      className="flex items-center gap-1 text-cyprus hover:text-ocean-green font-semibold text-[13px] transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500 font-medium">
                  Tidak ada obat ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page) => setCurrentPage(page)} 
        />
      )}

    </div>
  );
}
