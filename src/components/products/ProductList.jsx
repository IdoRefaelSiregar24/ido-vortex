import React from 'react';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
import ProductCard from '../ProductCard'; // Menggunakan ProductCard yang sudah ada

const images = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=40&h=40&q=80',
];

const products = [
    { id: 1, name: 'Wireless Bluetooth Headphones', image: images[0], createdDate: '01-01-2025', order: 25 },
    { id: 2, name: 'Men\'s T-Shirt', image: images[1], createdDate: '01-01-2025', order: 20 },
    { id: 3, name: 'Men\'s Leather Wallet', image: images[2], createdDate: '01-01-2025', order: 35 },
    { id: 4, name: 'Memory Foam Pillow', image: images[3], createdDate: '01-01-2025', order: 40 },
    { id: 5, name: 'Coffee Maker', image: images[4], createdDate: '01-01-2025', order: 45 },
    { id: 6, name: 'Casual Baseball Cap', image: images[5], createdDate: '01-01-2025', order: 55 },
    { id: 7, name: 'Full HD Webcam', image: images[0], createdDate: '01-01-2025', order: 20 },
    { id: 8, name: 'Smart LED Color Bulb', image: images[1], createdDate: '01-01-2025', order: 16 },
];

const ProductList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-1">
          <button className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">All Product (145)</button>
          <button className="px-4 py-2 rounded-lg text-gray-500">Featured Products</button>
          <button className="px-4 py-2 rounded-lg text-gray-500">On Sale</button>
          <button className="px-4 py-2 rounded-lg text-gray-500">Out of Stock</button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input type="text" placeholder="Search your product" className="bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button className="p-2 bg-gray-100 rounded-lg"><Filter size={20} /></button>
          <button className="p-2 bg-gray-100 rounded-lg"><Plus size={20} /></button>
          <button className="p-2 bg-gray-100 rounded-lg"><MoreHorizontal size={20} /></button>
        </div>
      </div>
      
      {/* Header Tabel */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-green-50 rounded-t-lg">
        <div className="col-span-1"><input type="checkbox" /></div>
        <div className="col-span-1 text-sm font-semibold text-gray-600">No.</div>
        <div className="col-span-4 text-sm font-semibold text-gray-600">Product</div>
        <div className="col-span-2 text-sm font-semibold text-gray-600">Created Date</div>
        <div className="col-span-2 text-sm font-semibold text-gray-600">Order</div>
        <div className="col-span-2 text-sm font-semibold text-gray-600">Action</div>
      </div>

      {/* Daftar Produk */}
      <div>
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            index={index + 1} 
            {...product} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;