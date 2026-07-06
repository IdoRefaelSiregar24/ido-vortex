import React, { useState, useRef, useEffect } from 'react';
import { MdAdd, MdMoreVert } from 'react-icons/md';
import OrderStatCard from '../components/OrderStatCard';
import OrderTable, { dummyOrders } from '../components/OrderTable';
import Button from '../components/Button';
import AddOrderModal from '../components/AddOrderModal';

export default function OrderManagement() {
  const [orders, setOrders] = useState(dummyOrders);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  
  const moreActionRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (moreActionRef.current && !moreActionRef.current.contains(event.target)) {
        setIsMoreActionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMoreAction = (action) => {
    alert(`${action} clicked! (Prototype Action)`);
    setIsMoreActionsOpen(false);
  };

  const handleAddOrder = (newOrderData) => {
    // Generate new order details
    const nextNo = orders.length + 1;
    const newOrder = {
      no: nextNo,
      id: `#ORD${String(nextNo).padStart(4, '0')}`,
      name: newOrderData.name,
      image: newOrderData.image || 'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=40&h=40&q=80',
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      price: parseFloat(newOrderData.price).toFixed(2),
      payment: newOrderData.payment,
      status: newOrderData.status
    };

    setOrders([newOrder, ...orders]);
  };

  return (
    <div className="flex flex-col space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
          <h1 className="text-[22px] font-bold text-cyprus">Order List</h1>
          <div className="flex gap-3">
              <Button 
                onClick={() => setIsAddOrderOpen(true)}
                variant="primary" 
                className="!px-4 !py-2 !rounded-lg !text-sm !shadow-sm !gap-1 cursor-pointer"
              >
                  <MdAdd className="text-lg" /> Add Order
              </Button>

              <div className="relative" ref={moreActionRef}>
                <Button 
                  onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
                  variant="accent" 
                  className="!px-4 !py-2 !rounded-lg !text-sm !shadow-sm !border-gray-200 !text-gray-700 hover:!bg-gray-50 !bg-white !gap-1 cursor-pointer"
                >
                    More Action <MdMoreVert className="text-lg text-gray-500" />
                </Button>

                {isMoreActionsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1.5 transition-all text-left">
                    <button 
                      onClick={() => handleMoreAction('Export CSV')} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-aqua-spring hover:text-ocean-green font-semibold transition-colors cursor-pointer"
                    >
                      Export CSV
                    </button>
                    <button 
                      onClick={() => handleMoreAction('Export PDF')} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-aqua-spring hover:text-ocean-green font-semibold transition-colors cursor-pointer"
                    >
                      Export PDF
                    </button>
                    <button 
                      onClick={() => handleMoreAction('Archive Orders')} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-aqua-spring hover:text-ocean-green font-semibold transition-colors cursor-pointer"
                    >
                      Archive Orders
                    </button>
                    <button 
                      onClick={() => handleMoreAction('Bulk Update Status')} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-aqua-spring hover:text-ocean-green font-semibold transition-colors cursor-pointer"
                    >
                      Bulk Update Status
                    </button>
                  </div>
                )}
              </div>
          </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <OrderStatCard title="Total Orders" value={orders.length.toLocaleString()} trendValue="14.4%" trendDirection="up" />
          <OrderStatCard title="New Orders" value={orders.filter(o => o.status === 'Pending').length.toLocaleString()} trendValue="20%" trendDirection="up" />
          <OrderStatCard title="Completed Orders" value={orders.filter(o => o.status === 'Delivered').length.toLocaleString()} trendValue="85%" trendDirection="none" />
          <OrderStatCard title="Canceled Orders" value={orders.filter(o => o.status === 'Cancelled').length.toLocaleString()} trendValue="5%" trendDirection="down" />
      </div>

      {/* Table Section */}
      <div className="mt-4">
          <OrderTable orders={orders} setOrders={setOrders} />
      </div>

      {/* Add Order Modal */}
      <AddOrderModal 
        isOpen={isAddOrderOpen} 
        onClose={() => setIsAddOrderOpen(false)} 
        onAdd={handleAddOrder}
      />

    </div>
  );
}
