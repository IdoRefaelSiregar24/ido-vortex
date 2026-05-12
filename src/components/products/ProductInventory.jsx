import React from 'react';

const ProductInventory = ({ product }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Inventory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity
          </label>
          <p className="text-lg font-semibold text-gray-800">{product?.stock} units</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
            {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInventory;