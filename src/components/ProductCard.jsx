import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

export default function ProductCard({
  id,
  index,
  name,
  image,
  createdDate,
  order,
}) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="col-span-1"><input type="checkbox" /></div>
      <div className="col-span-1 text-sm text-gray-600">{index}</div>
      <div className="col-span-4">
        <Link to={`/products/${id}`} className="flex items-center space-x-4 group">
          <img src={image} alt={name} className="w-12 h-12 rounded-lg object-cover" />
          <span className="font-semibold text-gray-800 group-hover:text-green-600">{name}</span>
        </Link>
      </div>
      <div className="col-span-2 text-sm text-gray-600">{createdDate}</div>
      <div className="col-span-2 text-sm text-gray-600">{order}</div>
      <div className="col-span-2">
        <Link to={`/products/${id}`} className="flex items-center text-sm text-gray-500 hover:text-green-600 font-medium">
          <Eye size={16} className="mr-2" />
          Lihat Produk
        </Link>
      </div>
    </div>
  );
}