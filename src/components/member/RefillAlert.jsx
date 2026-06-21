import React from "react";
import { AlertCircle, ArrowRight, Pill } from "lucide-react";

export default function RefillAlert({ medicineName = "Amlodipine 5mg", daysLeft = 2, message }) {
  const displayMessage = message || `Stok obat kronis ${medicineName} Anda tinggal ${daysLeft} hari lagi. Harap segera lakukan penebusan resep.`;
  return (
    <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left shadow-xs transition-all hover:bg-amber-50">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5 leading-none">
            <Pill className="w-3.5 h-3.5 text-amber-600" /> Pengingat Refill Obat Kronis
          </h4>
          <p className="text-xs text-amber-800 font-semibold leading-relaxed mt-1.5">
            {displayMessage}
          </p>
        </div>
      </div>
      <button className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-sm shrink-0 cursor-pointer w-fit">
        Tebus Resep <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
