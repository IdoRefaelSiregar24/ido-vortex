import React from 'react';

const ProductBasicDetails = ({ product }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <p className="text-gray-800 font-semibold text-lg">{product?.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Description
          </label>
          <p className="text-gray-700 leading-relaxed">{product?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicDetails;