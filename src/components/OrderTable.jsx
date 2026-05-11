import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdSwapVert, MdMoreHoriz, MdLocalShipping, MdCheckCircleOutline, MdOutlineAccessTime, MdOutlineCancel } from 'react-icons/md';
import Pagination from './Pagination';

const generateDummyData = () => {
  const base = [
    { name: 'Wireless Bluetooth Headphones', payment: 'Paid', status: 'Delivered', price: '49.99' },
    { name: "Men's T-Shirt", payment: 'Unpaid', status: 'Pending', price: '14.99' },
    { name: "Men's Leather Wallet", payment: 'Paid', status: 'Delivered', price: '49.99' },
    { name: 'Memory Foam Pillow', payment: 'Paid', status: 'Shipped', price: '39.99' },
    { name: 'Adjustable Dumbbells', payment: 'Unpaid', status: 'Pending', price: '14.99' },
    { name: 'Coffee Maker', payment: 'Unpaid', status: 'Cancelled', price: '79.99' },
  ];
  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=40&h=40&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=40&h=40&q=80',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=40&h=40&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=40&h=40&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=40&h=40&q=80',
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=40&h=40&q=80',
  ];
  let result = [];
  for (let i = 1; i <= 35; i++) {
    const baseItem = base[i % base.length];
    result.push({
      no: i,
      id: `#ORD${String(i).padStart(4, '0')}`,
      name: baseItem.name,
      image: images[i % images.length],
      date: '01-01-2025',
      price: baseItem.price,
      payment: baseItem.payment,
      status: baseItem.status
    });
  }
  return result;
};

const dummyOrders = generateDummyData();

export default function OrderTable({ orders = dummyOrders }) {
  const [activeTab, setActiveTab] = useState('All order');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    // 1. Tab Filter
    let tabMatch = true;
    if (activeTab === 'Completed') tabMatch = order.status === 'Delivered';
    else if (activeTab === 'Pending') tabMatch = order.status === 'Pending';
    else if (activeTab === 'Canceled') tabMatch = order.status === 'Cancelled';
    
    // 2. Search Filter
    const searchMatch = order.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        order.id.toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && searchMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 on filter/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Dynamic Tabs Data
  const tabs = [
    { name: 'All order', count: orders.length },
    { name: 'Completed', count: orders.filter(o => o.status === 'Delivered').length },
    { name: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { name: 'Canceled', count: orders.filter(o => o.status === 'Cancelled').length },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <MdCheckCircleOutline className="text-success text-lg mr-1.5" />;
      case 'Pending': return <MdOutlineAccessTime className="text-pending text-lg mr-1.5" />;
      case 'Shipped': return <MdLocalShipping className="text-cyprus text-lg mr-1.5" />;
      case 'Cancelled': return <MdOutlineCancel className="text-error text-lg mr-1.5" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'text-success';
      case 'Pending': return 'text-pending';
      case 'Shipped': return 'text-cyprus';
      case 'Cancelled': return 'text-error';
      default: return 'text-gray-500';
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
              placeholder="Search order report" 
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
              <th className="py-3 px-4">Order Id</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4 rounded-r-md">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-ocean-green focus:ring-ocean-green cursor-pointer" />
                  </td>
                  <td className="py-4 px-2 text-[14px] font-medium text-gray-700">{order.no}</td>
                  <td className="py-4 px-4 text-[14px] font-semibold text-cyprus">{order.id}</td>
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md border border-gray-100 overflow-hidden bg-white p-1 flex items-center justify-center">
                      <img src={order.image} alt={order.name} className="w-full h-full object-cover rounded-sm" />
                    </div>
                    <span className="text-[14px] font-medium text-gray-800 leading-tight w-40">{order.name}</span>
                  </td>
                  <td className="py-4 px-4 text-[14px] font-medium text-cyprus">{order.date}</td>
                  <td className="py-4 px-4 text-[14px] font-medium text-cyprus">{order.price}</td>
                  <td className="py-4 px-4 text-[13px] font-medium">
                    <div className="flex items-center gap-2 text-cyprus">
                      <span className={`w-1.5 h-1.5 rounded-full ${order.payment === 'Paid' ? 'bg-success' : 'bg-error'}`}></span>
                      {order.payment}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[13px] font-semibold">
                    <div className={`flex items-center ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500 font-medium">
                  No orders found.
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
