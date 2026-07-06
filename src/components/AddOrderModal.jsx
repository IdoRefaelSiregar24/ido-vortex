import React, { useState, useEffect, useRef } from 'react';

const MEDICINE_SUGGESTIONS = [
  { name: 'Paracetamol 500mg', price: '5.99', image: 'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=40&h=40&q=80' },
  { name: 'Ibuprofen 400mg', price: '6.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=40&h=40&q=80' },
  { name: 'Amoxicillin 250mg', price: '8.99', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=40&h=40&q=80' },
  { name: 'Vitamin C 1000mg', price: '4.99', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=40&h=40&q=80' },
  { name: 'Omeprazole 20mg', price: '7.99', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=40&h=40&q=80' },
  { name: 'Cetirizine 10mg', price: '5.99', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=40&h=40&q=80' },
];

export default function AddOrderModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    payment: 'Paid',
    status: 'Pending',
    image: ''
  });
  
  const [isRendered, setIsRendered] = useState(false);
  const [animate, setAnimate] = useState(false);
  const modalContentRef = useRef(null);

  // Manage animation timing on open/close
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setIsRendered(false), 200); // Wait for transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle outside click to close modal
  const handleBackdropClick = (e) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSelectMedicine = (e) => {
    const selectedMed = MEDICINE_SUGGESTIONS.find(m => m.name === e.target.value);
    if (selectedMed) {
      setFormData(prev => ({
        ...prev,
        name: selectedMed.name,
        price: selectedMed.price,
        image: selectedMed.image
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        name: e.target.value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill out all fields!');
      return;
    }
    onAdd(formData);
    // Reset Form
    setFormData({
      name: '',
      price: '',
      payment: 'Paid',
      status: 'Pending',
      image: ''
    });
    onClose();
  };

  if (!isRendered) return null;

  return (
    <div 
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-cyprus/40 backdrop-blur-sm p-4 text-left transition-opacity duration-200 ${animate ? 'opacity-100' : 'opacity-0'}`}
    >
      <div 
        ref={modalContentRef}
        className={`bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transition-all duration-300 transform ${animate ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-aqua-spring/50">
          <h2 className="text-lg font-bold text-cyprus">Add New Order</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-cyprus hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Medicine Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Medicine / Product</label>
            <select 
              value={formData.name} 
              onChange={handleSelectMedicine}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-semibold outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green cursor-pointer"
              required
            >
              <option value="">Select a medicine...</option>
              {MEDICINE_SUGGESTIONS.map(m => (
                <option key={m.name} value={m.name}>{m.name} - ${m.price}</option>
              ))}
            </select>
          </div>

          {/* Custom Name (Fallback Option) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Or Type Custom Product Name</label>
            <input 
              type="text" 
              placeholder="e.g., Vitamin D3 5000IU"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-medium outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              min="0.01"
              placeholder="e.g., 9.99"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-medium outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green"
              required
            />
          </div>

          {/* Grid for Payment and Status */}
          <div className="grid grid-cols-2 gap-4">
            {/* Payment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Payment</label>
              <select 
                value={formData.payment} 
                onChange={(e) => setFormData(prev => ({ ...prev, payment: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-semibold outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green cursor-pointer"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-semibold outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2.5 bg-ocean-green text-white font-semibold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Add Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
