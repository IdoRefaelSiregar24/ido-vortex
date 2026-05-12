import React from 'react';

const ProductPricing = ({ product }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Pricing</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Price
        </label>
        <p className="text-3xl font-bold text-green-600">{product?.price}</p>
      </div>
    </div>
  );
};

export default ProductPricing;