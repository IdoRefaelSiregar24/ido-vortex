import React from "react";
import { FaCheckCircle, FaAward, FaGift, FaChevronRight } from "react-icons/fa";

export default function RewardCard({ orderData, onProceedToDashboard }) {
  const isMember = orderData?.isMember;
  const isMemberCreated = orderData?.triggerMember;
  const patientName = orderData?.fullName || "Budi Santoso";
  
  // Calculate values based on user condition
  const pointsEarned = orderData?.pointsEarned || 0;
  const newTotalPoints = orderData?.newTotalPoints || 1250;
  const points = isMember ? newTotalPoints : (isMemberCreated ? 1250 : 0);
  const currentTier = "Gold Member";
  const nextTierPoints = 2500;
  const progressPercentage = Math.min((points / nextTierPoints) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-left py-6">
      {/* Order Status Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 text-white rounded-full mb-2">
          <FaCheckCircle className="text-2xl" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight leading-none">
          {isMember ? "Pembayaran Member Berhasil!" : "Pembayaran Berhasil!"}
        </h2>
        <p className="text-xs text-zinc-400 font-mono">Kode Order: ORD-{Math.floor(100000 + Math.random() * 900000)} · Transaksi Hari Ini</p>
      </div>

      {/* Transaction summary card */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
        <h4 className="text-xs font-bold text-zinc-900 border-b border-zinc-100 pb-2">
          {isMember ? "Detail Transaksi Member" : "Detail Transaksi"}
        </h4>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-medium">Penerima</span>
          <span className="font-bold text-zinc-900">{patientName}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-medium">Alamat</span>
          <span className="font-bold text-zinc-900 truncate max-w-xs">{orderData?.address}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500 font-medium">Metode Pengiriman</span>
          <span className="font-bold text-zinc-900">
            {isMember || isMemberCreated ? "Gratis Ongkir Instan (Benefit Member)" : "Reguler (Rp 15.000)"}
          </span>
        </div>
      </div>

      {/* Conditional Reward display based on user flow */}
      {isMember ? (
        /* Flow A: Existing Member Checkout */
        <div className="bg-white border border-zinc-250/90 rounded-lg p-6 space-y-6 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-zinc-900" />
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-300/40 text-[9px] font-bold uppercase rounded-md">
                <FaAward className="text-xs" /> Poin Bertambah
              </span>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight leading-snug">Pesanan Member Terdaftar</h3>
              <p className="text-xs text-zinc-400 font-medium">Data transaksi obat disinkronkan otomatis ke rekam medis dan pengingat konsumsi Anda.</p>
            </div>
            
            <div className="bg-zinc-900 text-white p-4 rounded-xl border border-zinc-800 text-right w-full sm:w-auto flex-shrink-0">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Membership Tier</span>
              <span className="text-base font-black tracking-tight">{currentTier}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Poin Diperoleh</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-emerald-700">+{pointsEarned}</span>
                <span className="text-xs text-zinc-500 font-bold">pts</span>
              </div>
            </div>
            <div className="space-y-2 text-xs font-semibold text-zinc-500 text-left sm:text-right">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Total Poin Anda</p>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-zinc-900 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between sm:justify-end gap-2 text-[10px] text-zinc-400">
                <span>{points} pts</span>
                <span>/</span>
                <span>{nextTierPoints} pts ke Platinum</span>
              </div>
            </div>
          </div>
        </div>
      ) : isMemberCreated ? (
        /* Flow B: Guest Checkout + Instant Account Activation */
        <div className="bg-white border border-zinc-250/90 rounded-lg p-6 space-y-6 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-zinc-900" />
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-300/40 text-[9px] font-bold uppercase rounded-md">
                <FaAward className="text-xs" /> Akun CRM Diaktifkan
              </span>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight leading-snug">Selamat Datang di Program Keanggotaan!</h3>
              <p className="text-xs text-zinc-400 font-medium">Profil medis dan kartu anggota digital Anda telah berhasil di-setup.</p>
            </div>
            
            <div className="bg-zinc-900 text-white p-4 rounded-xl border border-zinc-800 text-right w-full sm:w-auto flex-shrink-0">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Membership Tier</span>
              <span className="text-base font-black tracking-tight">{currentTier}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Loyalty Points Unlocked</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-zinc-900">{points.toLocaleString("id-ID")}</span>
                <span className="text-xs text-zinc-500 font-bold">pts</span>
              </div>
            </div>
            <div className="space-y-2 text-xs font-semibold text-zinc-500 text-left sm:text-right">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Level Progress</p>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-zinc-900 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between sm:justify-end gap-2 text-[10px] text-zinc-400">
                <span>{points} pts</span>
                <span>/</span>
                <span>{nextTierPoints} pts ke Platinum</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 text-left">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <FaGift className="text-zinc-700" /> Benefit Member Gold Terbuka:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-zinc-700">
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-150 p-3 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 flex-shrink-0" />
                <span>Diskon 5% Semua Obat</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-150 p-3 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 flex-shrink-0" />
                <span>Gratis Ongkir Instan Unlimited</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Flow C: Simple Guest Checkout */
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 space-y-4 text-center">
          <p className="text-sm font-semibold text-zinc-800 leading-snug">Pesanan Anda berhasil kami terima!</p>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
            Transaksi diproses sebagai Guest. Dapatkan potongan harga, konsultasi apoteker gratis, dan kumpulkan poin loyalitas pada pesanan berikutnya dengan mengaktifkan keanggotaan.
          </p>
        </div>
      )}

      {/* Dynamic CTA Button based on state */}
      <button
        onClick={onProceedToDashboard}
        className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>
          {isMember 
            ? "Kembali ke Dashboard Member" 
            : (isMemberCreated ? "Masuk ke Dashboard CRM" : "Kembali ke Katalog Obat")}
        </span> 
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
}
