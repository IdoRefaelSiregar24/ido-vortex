import React from 'react';
import { MdSearch } from 'react-icons/md';

const topProducts = [
  { name: 'Apple iPhone 13', item: '#FXZ-4567', price: '$999.00', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=48&h=48&q=80' },
  { name: 'Nike Air Jordan', item: '#FXZ-4567', price: '$72.40', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=48&h=48&q=80' },
  { name: 'T-shirt', item: '#FXZ-4567', price: '$35.40', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=48&h=48&q=80' },
  { name: 'Assorted Cross Bag', item: '#FXZ-4567', price: '$80.00', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=48&h=48&q=80' },
];

const TopProducts = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Top Products</h3>
        <a href="#" className="text-[13px] text-primary-cta font-medium hover:underline">All product</a>
      </div>

      <div className="relative mb-6">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full bg-[#f8fafc] text-sm border-none rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-1 focus:ring-gray-200"
        />
      </div>

      <div className="space-y-1">
        {topProducts.map((prod, idx) => (
          <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
            <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-md object-cover" />
            <div className="flex-1">
              <h4 className="text-[14px] font-semibold text-cyprus leading-tight">{prod.name}</h4>
              <p className="text-[12px] text-gray-400 mt-0.5">Item: {prod.item}</p>
            </div>
            <div className="font-bold text-cyprus text-[14px]">{prod.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
