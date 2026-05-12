import React from 'react';

const ProductCategorization = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="product-categories" className="block text-sm font-medium text-gray-700 mb-1">
            Product Categories
          </label>
          <select
            id="product-categories"
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option>Select your product</option>
          </select>
        </div>
        <div>
          <label htmlFor="product-tag" className="block text-sm font-medium text-gray-700 mb-1">
            Product Tag
          </label>
          <select
            id="product-tag"
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option>Select your product</option>
          </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select your color</label>
            <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-200 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-pink-200 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-blue-200 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-200 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-gray-800 cursor-pointer"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategorization;