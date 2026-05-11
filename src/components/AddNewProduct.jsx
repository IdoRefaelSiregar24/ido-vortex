import React from 'react';
import { MdAddCircleOutline, MdChevronRight, MdDevices, MdCheckroom, MdChair } from 'react-icons/md';
import Button from './Button';

const categories = [
  { name: 'Electronic', icon: <MdDevices size={20} className="text-gray-500" /> },
  { name: 'Fashion', icon: <MdCheckroom size={20} className="text-gray-500" /> },
  { name: 'Home', icon: <MdChair size={20} className="text-gray-500" /> },
];

const productList = [
  { name: 'Smart Fitness Tracker', price: '$39.99', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?auto=format&fit=crop&w=48&h=48&q=80' },
  { name: 'Leather Wallet', price: '$19.99', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=48&h=48&q=80' },
  { name: 'Electric Hair Trimmer', price: '$34.99', image: 'https://images.unsplash.com/photo-1593998066526-65fcab3021a2?auto=format&fit=crop&w=48&h=48&q=80' },
];

const AddNewProduct = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Add New Product</h3>
        <button className="flex items-center gap-1 text-[13px] text-primary-cta font-medium hover:underline">
          <MdAddCircleOutline size={16} /> Add New
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-[13px] text-gray-500 mb-3">Categories</h4>
        <div className="space-y-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-50 rounded-md">
                  {cat.icon}
                </div>
                <span className="text-[14px] font-medium text-gray-800">{cat.name}</span>
              </div>
              <MdChevronRight className="text-gray-400" size={20} />
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <a href="#" className="text-[13px] text-primary-cta font-medium hover:underline">See more</a>
        </div>
      </div>

      {/* Product List */}
      <div>
        <h4 className="text-[13px] text-gray-500 mb-3">Product</h4>
        <div className="space-y-3">
          {productList.map((prod, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg shadow-sm">
              <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-md object-cover" />
              <div className="flex-1">
                <h5 className="text-[13px] font-medium text-gray-800 leading-tight">{prod.name}</h5>
                <p className="text-[12px] text-success font-medium mt-0.5">{prod.price}</p>
              </div>
              <Button variant="primary" className="!px-3 !py-1.5 !text-[12px] !gap-1">
                <MdAddCircleOutline size={14} /> Add
              </Button>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <a href="#" className="text-[13px] text-primary-cta font-medium hover:underline">See more</a>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
