import React from 'react';

const ProductImageGallery = ({ product }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-center items-center bg-gray-100 rounded-lg p-8">
        <img src={product?.image} alt={product?.name} className="max-h-96 max-w-96 object-cover rounded-lg" />
      </div>
    </div>
  );
};

export default ProductImageGallery;