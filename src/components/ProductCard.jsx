import React from 'react';

// Komponen Badge Status Kecil (Reuseable)
const StatusBadge = ({ text = "Delivered", variant = "success" }) => {
  const baseClasses = "inline-flex items-center justify-center px-3 py-1 text-label font-medium rounded-full";
  
  const variants = {
    success: "bg-success/20 text-success", // Latar hijau muda, teks hijau
    pending: "bg-pending/20 text-pending", // Latar kuning muda, teks kuning
    // error: "bg-error/20 text-error", // (Untuk tambahan varian status lain)
  };

  const variantClasses = variants[variant] || variants.success;

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {text}
    </span>
  );
};

export default function ProductListItem({
  orderId = "2341",
  productName = "Campus",
  imageUrl = "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=100&q=80", // Placeholder sepatu
  date = "22 Mar 2023",
  quantity = "x1",
  status = "Delivered", // 'Delivered' atau 'Pending'
  statusVariant = "success", // 'success' atau 'pending'
  price = "$25"
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-garis hover:bg-aqua-spring/20 transition-colors">
      
      {/* 1. Bagian Gambar & Info Dasar (Order ID + Nama Produk) */}
      <div className="flex items-center gap-4 flex-grow max-w-sm">
        {/* Gambar Produk Kecil (seperti di referensi) */}
        <div className="w-[52px] h-[52px] bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-garis">
          <img 
            src={imageUrl} 
            alt={productName} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {/* Detail Produk */}
        <div className="flex flex-col">
          <h4 className="text-body font-normal text-cyprus whitespace-nowrap">
            {productName}
          </h4>
          <span className="text-label text-grey mt-0.5">
            Order ID: {orderId}
          </span>
        </div>
      </div>

      {/* 2. Bagian Tanggal (Sesuai kolom tabel) */}
      <div className="text-label text-grey flex-shrink-0 w-32 text-center">
        {date}
      </div>

      {/* 3. Bagian Jumlah (Sesuai kolom tabel) */}
      <div className="text-label font-medium text-cyprus flex-shrink-0 w-16 text-center">
        {quantity}
      </div>

      {/* 4. Bagian Status (Badge) */}
      <div className="flex-shrink-0 w-32 text-center">
        <StatusBadge text={status} variant={statusVariant} />
      </div>

      {/* 5. Bagian Harga (Sesuai kolom tabel) */}
      <div className="text-body font-bold text-cyprus flex-shrink-0 w-24 text-right">
        {price}
      </div>
      
    </div>
  );
}