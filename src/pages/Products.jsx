import React from 'react';
import { Plus, MoreHorizontal, ChevronRight } from 'lucide-react';
import CategoryCard from '../components/products/CategoryCard';
import ProductTable from '../components/products/ProductTable';

const images = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=100&h=100&q=80',
  'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=100&h=100&q=80',
];

const categories = [
  { name: 'Analgesik', image: images[0] },
  { name: 'Antibiotik', image: images[1] },
  { name: 'Antihistamin', image: images[2] },
  { name: 'Anti-Inflamasi', image: images[3] },
  { name: 'Suplemen', image: images[4] },
  { name: 'Gastrointestinal', image: images[5] },
  { name: 'Cardiovascular', image: images[0] },
  { name: 'Vitamin & Mineral', image: images[1] },
];

const Products = () => {
  return (
    <div className="flex flex-col space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Obat</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus size={20} className="mr-2" />
            Tambah Obat
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center">
            Aksi Lainnya
            <MoreHorizontal size={20} className="ml-2" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} name={category.name} image={category.image} />
          ))}
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
            <ChevronRight size={24} />
        </button>
      </div>

      <ProductTable />
    </div>
  );
};

export default Products;