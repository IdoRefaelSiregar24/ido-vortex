import React, { useState, useRef, useEffect } from 'react';
import { MdSearch, MdFilterList, MdSwapVert, MdMoreHoriz, MdLocalShipping, MdCheckCircleOutline, MdOutlineAccessTime, MdOutlineCancel } from 'react-icons/md';
import Pagination from './Pagination';

export const generateDummyData = () => {
  const base = [
    { name: 'Paracetamol 500mg', payment: 'Paid', status: 'Delivered', price: '5.99' },
    { name: 'Ibuprofen 400mg', payment: 'Unpaid', status: 'Pending', price: '6.99' },
    { name: 'Amoxicillin 250mg', payment: 'Paid', status: 'Delivered', price: '8.99' },
    { name: 'Vitamin C 1000mg', payment: 'Paid', status: 'Shipped', price: '4.99' },
    { name: 'Omeprazole 20mg', payment: 'Unpaid', status: 'Pending', price: '7.99' },
    { name: 'Cetirizine 10mg', payment: 'Unpaid', status: 'Cancelled', price: '5.99' },
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

export const dummyOrders = generateDummyData();

export default function OrderTable({ orders: propOrders, setOrders }) {
  const [localOrders, setLocalOrders] = useState(dummyOrders);
  const activeOrders = propOrders || localOrders;
  const activeSetOrders = setOrders || setLocalOrders;

  const [activeTab, setActiveTab] = useState('All order');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Refs for click outside handling
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const tableActionsRef = useRef(null);

  // Popover Open States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTableActionsOpen, setIsTableActionsOpen] = useState(false);

  // Sorting & Filtering Options
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, price-asc, price-desc, name-asc, name-desc
  const [filterPayment, setFilterPayment] = useState('All'); // All, Paid, Unpaid
  const [filterStatus, setFilterStatus] = useState('All'); // All, Delivered, Shipped, Pending, Cancelled

  // Click Outside Event Handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
      if (tableActionsRef.current && !tableActionsRef.current.contains(event.target)) {
        setIsTableActionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync tab status filter with popover status filter
  useEffect(() => {
    if (activeTab === 'All order') setFilterStatus('All');
    else if (activeTab === 'Completed') setFilterStatus('Delivered');
    else if (activeTab === 'Pending') setFilterStatus('Pending');
    else if (activeTab === 'Canceled') setFilterStatus('Cancelled');
  }, [activeTab]);

  // Filter Logic
  const filteredOrders = activeOrders.filter((order) => {
    // 1. Tab & Popover Shipping Status Filter (they work together)
    let statusMatch = true;
    if (filterStatus !== 'All') {
      statusMatch = order.status === filterStatus;
    } else {
      if (activeTab === 'Completed') statusMatch = order.status === 'Delivered';
      else if (activeTab === 'Pending') statusMatch = order.status === 'Pending';
      else if (activeTab === 'Canceled') statusMatch = order.status === 'Cancelled';
    }
    
    // 2. Search Filter
    const searchMatch = order.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        order.id.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Payment Filter
    const paymentMatch = filterPayment === 'All' || order.payment === filterPayment;

    return statusMatch && searchMatch && paymentMatch;
  });

  // Sort Logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date-desc') {
      const [d1, m1, y1] = a.date.split('-');
      const [d2, m2, y2] = b.date.split('-');
      return new Date(y2, m2-1, d2) - new Date(y1, m1-1, d1) || b.no - a.no;
    }
    if (sortBy === 'date-asc') {
      const [d1, m1, y1] = a.date.split('-');
      const [d2, m2, y2] = b.date.split('-');
      return new Date(y1, m1-1, d1) - new Date(y2, m2-1, d2) || a.no - b.no;
    }
    if (sortBy === 'price-desc') {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    if (sortBy === 'price-asc') {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage) || 1;
  const currentOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortBy, filterPayment, filterStatus]);

  // Dynamic Tabs Data (Uses activeOrders directly)
  const tabs = [
    { name: 'All order', count: activeOrders.length },
    { name: 'Completed', count: activeOrders.filter(o => o.status === 'Delivered').length },
    { name: 'Pending', count: activeOrders.filter(o => o.status === 'Pending').length },
    { name: 'Canceled', count: activeOrders.filter(o => o.status === 'Cancelled').length },
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
              onClick={() => {
                setActiveTab(tab.name);
                // Also reset explicit status filter if switching tabs
                setFilterStatus('All');
              }}
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
              placeholder="Search order report" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-[#f8fafc] border-none rounded-lg text-[13px] font-medium text-gray-700 outline-none focus:ring-1 focus:ring-ocean-green" 
            />
            <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          {/* Filter Popover */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className={`p-2 border rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer ${isFilterOpen ? 'bg-aqua-spring text-ocean-green border-ocean-green/30' : 'border-gray-200'}`}
            >
              <MdFilterList size={18} />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50 p-4 text-left">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filters</h4>
                
                {/* Payment Status */}
                <div className="space-y-1.5 mb-4">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Payment Status</label>
                  <select 
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-cyprus outline-none focus:ring-1 focus:ring-ocean-green cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                {/* Shipping Status */}
                <div className="space-y-1.5 mb-4">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Shipping Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      // Sync back to tabs if selecting specific status
                      if (e.target.value === 'All') setActiveTab('All order');
                      else if (e.target.value === 'Delivered') setActiveTab('Completed');
                      else if (e.target.value === 'Pending') setActiveTab('Pending');
                      else if (e.target.value === 'Cancelled') setActiveTab('Canceled');
                    }}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-cyprus outline-none focus:ring-1 focus:ring-ocean-green cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button 
                  onClick={() => { setFilterPayment('All'); setFilterStatus('All'); setActiveTab('All order'); setIsFilterOpen(false); }}
                  className="w-full py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-error text-center text-xs font-semibold text-gray-600 rounded-lg transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Sort Popover */}
          <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)} 
              className={`p-2 border rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer ${isSortOpen ? 'bg-aqua-spring text-ocean-green border-ocean-green/30' : 'border-gray-200'}`}
            >
              <MdSwapVert size={18} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1.5 text-left">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2 border-b border-gray-50">Sort By</h4>
                
                {[
                  { id: 'date-desc', label: 'Newest First' },
                  { id: 'date-asc', label: 'Oldest First' },
                  { id: 'price-desc', label: 'Highest Price' },
                  { id: 'price-asc', label: 'Lowest Price' },
                  { id: 'name-asc', label: 'Product Name (A-Z)' },
                  { id: 'name-desc', label: 'Product Name (Z-A)' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors cursor-pointer hover:bg-aqua-spring hover:text-ocean-green ${sortBy === option.id ? 'text-ocean-green bg-aqua-spring/30' : 'text-gray-700'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Table Actions Popover */}
          <div className="relative" ref={tableActionsRef}>
            <button 
              onClick={() => setIsTableActionsOpen(!isTableActionsOpen)} 
              className={`p-2 border rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer ${isTableActionsOpen ? 'bg-aqua-spring text-ocean-green border-ocean-green/30' : 'border-gray-200'}`}
            >
              <MdMoreHoriz size={18} />
            </button>
            {isTableActionsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1.5 text-left">
                <button 
                  onClick={() => { alert('Select All checked (Prototype Action)'); setIsTableActionsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-aqua-spring hover:text-ocean-green transition-colors cursor-pointer"
                >
                  Select All Items
                </button>
                <button 
                  onClick={() => { alert('Delete selected clicked (Prototype Action)'); setIsTableActionsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-error hover:bg-error/5 transition-colors cursor-pointer"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
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
