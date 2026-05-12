import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const images = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&h=500&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&h=500&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&h=500&q=80',
  'https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=500&h=500&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=500&h=500&q=80',
  'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=500&h=500&q=80',
];

const products = [
  { id: 1, name: 'Paracetamol 500mg', description: 'Obat pereda demam dan nyeri, efektif untuk mengurangi rasa sakit dan demam dalam waktu singkat.', image: images[0], price: '$5.99', stock: 45, category: 'Analgesik', rating: 4.5, reviews: 128, discountedPrice: '$4.99', color: 'white' },
  { id: 2, name: 'Ibuprofen 400mg', description: 'Obat anti-inflamasi non-steroid (NSAID) untuk mengatasi nyeri, demam, dan peradangan.', image: images[1], price: '$6.99', stock: 120, category: 'Anti-Inflamasi', rating: 4.2, reviews: 95, discountedPrice: null, color: 'blue' },
  { id: 3, name: 'Amoxicillin 250mg', description: 'Antibiotik beta-lactam yang digunakan untuk mengobati berbagai infeksi bakteri.', image: images[2], price: '$8.99', stock: 30, category: 'Antibiotik', rating: 4.7, reviews: 156, discountedPrice: '$7.99', color: 'red' },
  { id: 4, name: 'Vitamin C 1000mg', description: 'Suplemen vitamin C untuk meningkatkan imunitas tubuh dan kesehatan secara umum.', image: images[3], price: '$4.99', stock: 80, category: 'Suplemen', rating: 4.6, reviews: 203, discountedPrice: null, color: 'orange' },
  { id: 5, name: 'Omeprazole 20mg', description: 'Obat untuk mengurangi asam lambung dan mengobati penyakit refluks asam lambung (GERD).', image: images[4], price: '$7.99', stock: 25, category: 'Gastrointestinal', rating: 4.4, reviews: 87, discountedPrice: '$6.99', color: 'green' },
  { id: 6, name: 'Cetirizine 10mg', description: 'Obat antihistamin untuk mengatasi alergi, gatal-gatal, dan reaksi alergi lainnya.', image: images[5], price: '$5.99', stock: 150, category: 'Antihistamin', rating: 4.3, reviews: 62, discountedPrice: null, color: 'purple' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="bg-gray-50 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Obat tidak ditemukan</h1>
        </div>
      </div>
    );
  }

  const colors = ['#E8F5E9', '#FCE4EC', '#F3E5F5', '#FFF9C4', '#2D2D2D'];
  const colorNames = ['Hijau', 'Pink', 'Ungu', 'Kuning', 'Hitam'];

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Detail Obat</h1>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-white"
        >
          <ArrowLeft size={20} className="mr-2" />
          Kembali
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Obat</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Obat
                </label>
                <p className="text-gray-800 font-medium text-base">{product.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Obat
                </label>
                <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Harga</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Obat
                </label>
                  <p className="text-gray-800 font-semibold text-lg">{product.price}</p>
                </div>
                {product.discountedPrice && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Diskon
                    </label>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 font-semibold text-lg">{product.discountedPrice}</p>
                      <span className="text-xs text-green-600 font-medium">Sale</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  ✓ Yes
                </span>
                <span className="ml-2 text-sm text-gray-600">PPN Termasuk</span>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stok</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Stok
                  </label>
                  <p className="text-gray-800 font-medium text-base">{product.stock}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Stok
                  </label>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Product Image */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Gambar Obat</h2>
            <div className="border-2 border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <img src={product.image} alt={product.name} className="h-56 w-56 mx-auto object-cover rounded-lg" />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Kategori</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Obat
                </label>
                <p className="text-gray-800 text-base font-medium">{product.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Obat
                </label>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">Popular</span>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">Best Seller</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilihan Warna
                </label>
                <div className="flex gap-2">
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                      title={colorNames[idx]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;