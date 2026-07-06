import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, ChevronRight, AlertCircle, Edit, Trash2, Check, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CategoryCard from '../components/products/CategoryCard';
import ProductTable from '../components/products/ProductTable';
import Modal from '../components/Modal';

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

const initialForm = {
  sku: '',
  name: '',
  category: 'Obat Bebas',
  description: '',
  price: 0,
  stock: 0,
  unit: 'tablet',
  requires_prescription: false,
  daily_dosage: 1.0,
  expiry_date: '',
  image_url: '',
  is_active: true
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err.message);
      setErrorMessage('Gagal memuat katalog obat: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setForm({
      ...initialForm,
      sku: 'OBT-' + Math.floor(1000 + Math.random() * 9000),
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // default 1 year expiry
    });
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      sku: product.sku || '',
      name: product.name || '',
      category: product.category || 'Obat Bebas',
      description: product.description || '',
      price: product.price || 0,
      stock: product.stock || 0,
      unit: product.unit || 'tablet',
      requires_prescription: product.requires_prescription || false,
      daily_dosage: product.daily_dosage || 1.0,
      expiry_date: product.expiry_date || '',
      image_url: product.image_url || '',
      is_active: product.is_active !== false
    });
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.sku || !form.name || form.price < 0 || form.stock < 0) {
      setErrorMessage('Harap isi semua field wajib dengan benar.');
      return;
    }

    try {
      if (editingProduct) {
        // Update
        const { error } = await supabase
          .from('products')
          .update({
            sku: form.sku,
            name: form.name,
            category: form.category,
            description: form.description,
            price: form.price,
            stock: form.stock,
            unit: form.unit,
            requires_prescription: form.requires_prescription,
            daily_dosage: form.daily_dosage || null,
            expiry_date: form.expiry_date || null,
            image_url: form.image_url || null,
            is_active: form.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        setSuccessMessage('Obat berhasil diperbarui!');
      } else {
        // Create
        const { error } = await supabase
          .from('products')
          .insert([{
            sku: form.sku,
            name: form.name,
            category: form.category,
            description: form.description,
            price: form.price,
            stock: form.stock,
            unit: form.unit,
            requires_prescription: form.requires_prescription,
            daily_dosage: form.daily_dosage || null,
            expiry_date: form.expiry_date || null,
            image_url: form.image_url || null,
            is_active: form.is_active
          }]);

        if (error) throw error;
        setSuccessMessage('Obat baru berhasil ditambahkan!');
      }

      fetchProducts();
      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error('Error saving product:', err.message);
      setErrorMessage('Gagal menyimpan: ' + err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Apakah Anda yakin ingin menonaktifkan (Soft Delete) obat ini? Obat tidak akan muncul di katalog pelanggan.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);

      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Error soft-deleting product:', err.message);
      alert('Gagal menghapus obat: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full pb-10 text-left">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Mengelola katalog produk, stok obat, resep, dan status aktif produk apotek online.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchProducts} 
            className="p-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors shadow-sm flex items-center gap-1 cursor-pointer text-xs font-semibold"
            title="Muat ulang data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} className="mr-1.5" />
            Tambah Obat
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} name={category.name} image={category.image} />
          ))}
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md border border-gray-150">
            <ChevronRight size={20} />
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-20 text-center text-gray-500 shadow-sm">
          <RefreshCw className="animate-spin mx-auto text-4xl mb-3 text-green-600" />
          <p className="font-semibold text-sm">Menghubungkan ke Supabase...</p>
          <p className="text-xs text-gray-400 mt-1">Mengambil daftar produk katalog obat terbaru.</p>
        </div>
      ) : (
        <ProductTable 
          items={products} 
          onEdit={handleOpenEditModal} 
          onDelete={handleDelete} 
        />
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-green-700 font-bold text-sm">
              {editingProduct ? 'EO' : 'TO'}
            </span>
            <h3 className="text-sm font-extrabold text-zinc-900">{editingProduct ? 'Edit Informasi Obat' : 'Tambah Obat Baru ke Katalog'}</h3>
          </div>
        }
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-150 rounded-lg text-xs font-semibold text-red-700 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-lg text-xs font-semibold text-emerald-700 flex items-start gap-2">
              <Check size={16} className="flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">SKU Kode Obat (Wajib)</label>
              <input
                type="text"
                required
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
                placeholder="cth. OBT-001"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nama Obat (Wajib)</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
                placeholder="cth. Paracetamol 500mg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Kategori Golongan Obat</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
              >
                <option value="Obat Bebas">Obat Bebas</option>
                <option value="Obat Bebas Terbatas">Obat Bebas Terbatas</option>
                <option value="Obat Keras">Obat Keras</option>
                <option value="Suplemen">Suplemen</option>
                <option value="Alkes">Alkes</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Satuan Kemasan</label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
                placeholder="cth. tablet, strip, botol"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Harga Rupiah (Wajib)</label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Jumlah Stok Obat (Wajib)</label>
              <input
                type="number"
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dosis Harian (Refill Parameter)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.daily_dosage}
                onChange={(e) => setForm({ ...form, daily_dosage: parseFloat(e.target.value) || 1.0 })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
                placeholder="cth. 3.0 (3 tablet/hari)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tanggal Kedaluwarsa (Expiry)</label>
              <input
                type="date"
                value={form.expiry_date}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tautan Gambar Obat (Image URL)</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Deskripsi Khasiat &amp; Aturan Pakai</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700 resize-none"
              placeholder="Tulis informasi obat..."
            />
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-6 items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.requires_prescription}
                  onChange={(e) => setForm({ ...form, requires_prescription: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-600 cursor-pointer"
                />
                <span>Membutuhkan Resep Dokter (K)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-600 cursor-pointer"
                />
                <span>Tampilkan di Katalog Publik</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all shadow-sm cursor-pointer ml-auto"
            >
              {editingProduct ? 'Perbarui Data' : 'Simpan Obat'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;