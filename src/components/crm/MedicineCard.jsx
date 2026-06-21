import React from "react";
import { FaPills } from "react-icons/fa";

export default function MedicineCard({ medicine, onAddToCart, inCart }) {
  const getKategoriBadge = (kategori) => {
    switch (kategori) {
      case "Obat Keras":
        return "bg-zinc-100 text-zinc-900 border border-zinc-350/50 font-bold";
      default:
        return "bg-zinc-50 text-zinc-650 border border-zinc-200 font-medium";
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 flex flex-col justify-between hover:shadow-xs hover:border-zinc-300 transition-all text-left">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full ${getKategoriBadge(medicine.kategori)}`}>
            {medicine.kategori}
          </span>
          {medicine.kategori === "Obat Keras" && (
            <span className="text-[9px] font-bold text-zinc-900 uppercase bg-zinc-100 px-2 py-0.5 rounded-sm border border-zinc-350/30">
              Resep Dokter
            </span>
          )}
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700 flex-shrink-0">
            <FaPills className="text-sm" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 tracking-tight text-base leading-snug">{medicine.nama}</h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{medicine.id}</p>
          </div>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed mt-4 font-normal">{medicine.deskripsi}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Harga</span>
          <span className="text-base font-black text-zinc-900">{formatCurrency(medicine.harga)}</span>
        </div>
        
        <button
          onClick={() => onAddToCart(medicine)}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer border ${
            inCart
              ? "bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200"
              : "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 shadow-sm"
          }`}
        >
          {inCart ? "Ditambahkan" : "Tambah"}
        </button>
      </div>
    </div>
  );
}
