import React, { useState, useEffect } from "react";
import { FaUserShield, FaExclamationTriangle, FaUserCheck } from "react-icons/fa";
import { supabase } from "../../lib/supabase";

export default function CheckoutForm({ cartItems, onSubmit, triggerMember, setTriggerMember, userProfile, patientHealthData }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    allergies: "",
    chronicDisease: ""
  });

  const [loyaltyConfig, setLoyaltyConfig] = useState({
    points_to_currency_rate: 100,
    max_redeem_percentage: 50.00
  });
  const [pointsInput, setPointsInput] = useState(0);
  const [pointsError, setPointsError] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.full_name || "",
        phone: patientHealthData?.phone || userProfile.phone || "",
        email: userProfile.email || "",
        address: patientHealthData?.address || "",
        allergies: patientHealthData?.allergies || "",
        chronicDisease: patientHealthData?.chronicDisease || ""
      });
      setTriggerMember(true); // Members always get member benefits/rules
    } else {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        allergies: "",
        chronicDisease: ""
      });
      setTriggerMember(true); // Default guest opt-in to free member creation
    }
  }, [userProfile, patientHealthData, setTriggerMember]);

  useEffect(() => {
    const fetchLoyaltyConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("loyalty_config")
          .select("*")
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();
        if (!error && data) {
          setLoyaltyConfig({
            points_to_currency_rate: parseFloat(data.points_to_currency_rate) || 100,
            max_redeem_percentage: parseFloat(data.max_redeem_percentage) || 50
          });
        }
      } catch (err) {
        console.error("Gagal memuat loyalty config:", err);
      }
    };
    fetchLoyaltyConfig();
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.harga * (item.quantity || 1), 0);
  const maxRedeemablePoints = Math.floor((totalAmount * (loyaltyConfig.max_redeem_percentage / 100)) / loyaltyConfig.points_to_currency_rate);

  const handlePointsChange = (val) => {
    setPointsInput(val);
    if (val < 0) {
      setPointsError("Jumlah poin tidak valid.");
    } else if (userProfile && val > (userProfile.membership_points || 0)) {
      setPointsError(`Saldo poin tidak mencukupi. Saldo Anda: ${userProfile.membership_points} pts.`);
    } else if (val > maxRedeemablePoints) {
      setPointsError(`Maksimal penukaran poin untuk transaksi ini adalah ${maxRedeemablePoints} pts.`);
    } else {
      setPointsError("");
    }
  };

  const handleRedeemMax = () => {
    const maxVal = Math.min(userProfile?.membership_points || 0, maxRedeemablePoints);
    handlePointsChange(maxVal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      triggerMember: userProfile ? false : triggerMember, // Only trigger member creation if they are not already a member
      totalAmount,
      items: cartItems,
      pointsRedeemed: pointsInput,
      discountAmount: pointsInput * loyaltyConfig.points_to_currency_rate
    });
  };

  const fillDummy = () => {
    setFormData({
      fullName: "Budi Santoso",
      phone: "0812-3456-7890",
      email: "budi.santoso@email.com",
      address: "Jl. Sudirman No. 12, Pekanbaru, Riau",
      allergies: "Amoxicillin",
      chronicDisease: "Hipertensi Kronis"
    });
    setTriggerMember(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Form Section (7 Columns) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Informasi Pengiriman</h3>
            <button
              type="button"
              onClick={fillDummy}
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-350 px-2.5 py-1 rounded transition-all cursor-pointer"
            >
              Gunakan Data Demo Budi
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-250/90 rounded-md focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 font-medium"
                placeholder="cth. Budi Santoso"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nomor Telepon</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-250/90 rounded-md focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 font-medium"
                placeholder="cth. 0812-xxxx-xxxx"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Alamat Surel (Email)</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-250/90 rounded-md focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 font-medium"
              placeholder="cth. budi@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Alamat Pengiriman</label>
            <textarea
              required
              rows="3"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-250/90 rounded-md focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 resize-none font-medium"
              placeholder="Masukkan alamat pengiriman lengkap..."
            ></textarea>
          </div>
        </div>

        {/* Conditional CRM block based on whether user is member or guest */}
        {userProfile ? (
          /* Active Member CRM Block */
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
              <FaUserCheck className="text-emerald-755 text-lg flex-shrink-0" />
              <div>
                <h4 className="text-sm font-black text-emerald-900 leading-none">
                  Akun Terhubung: {userProfile.membership_status?.toUpperCase() || 'GOLD'} MEMBER (Aktif)
                </h4>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Poin saat ini: {userProfile.membership_points?.toLocaleString("id-ID")} pts. Anda otomatis mendapatkan gratis ongkir member.
                </p>
              </div>
            </div>

            {/* Loyalty Points Redemption Accordion */}
            <div className="border-t border-zinc-150 pt-4 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Tukarkan Poin Loyalitas</label>
                <span className="text-[9px] text-zinc-500 font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  1 Poin = Rp {loyaltyConfig.points_to_currency_rate}
                </span>
              </div>
              
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center text-zinc-650 font-semibold">
                  <span>Saldo Poin Anda:</span>
                  <span className="font-bold text-zinc-900">{userProfile.membership_points?.toLocaleString("id-ID")} pts</span>
                </div>
                <div className="flex justify-between items-center text-zinc-650 font-semibold">
                  <span>Batas Maksimal Penukaran ({loyaltyConfig.max_redeem_percentage}%):</span>
                  <span className="font-bold text-zinc-900">
                    {maxRedeemablePoints.toLocaleString("id-ID")} pts (Setara Rp {((maxRedeemablePoints) * loyaltyConfig.points_to_currency_rate).toLocaleString("id-ID")})
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-3">
                  <input
                    type="number"
                    min="0"
                    max={Math.min(userProfile.membership_points || 0, maxRedeemablePoints)}
                    value={pointsInput}
                    onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
                    className="w-32 px-3 py-2 text-xs bg-white border border-zinc-300 rounded-md focus:ring-1 focus:ring-zinc-900 outline-none font-bold text-zinc-800"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={handleRedeemMax}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[10px] uppercase rounded-md transition-all cursor-pointer"
                  >
                    Tukarkan Maksimal
                  </button>
                </div>
                
                {pointsInput > 0 && !pointsError && (
                  <p className="text-[11px] text-green-700 font-bold mt-1">
                    ✓ Berhasil diterapkan! Potongan harga: Rp {(pointsInput * loyaltyConfig.points_to_currency_rate).toLocaleString("id-ID")}
                  </p>
                )}
                {pointsError && (
                  <p className="text-[11px] text-red-650 font-bold mt-1">
                    ⚠ {pointsError}
                  </p>
                )}
              </div>
            </div>

            {/* Pre-filled editable medical profile inputs */}
            <div className="pt-2 border-t border-zinc-150 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Alergi Obat (Verifikasi Akun)</label>
                  <span className="text-[9px] text-zinc-500 font-semibold bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200/50">Medis</span>
                </div>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-250/90 rounded-md focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 font-semibold text-zinc-700"
                  placeholder="Cth. Penisilin (Kosongkan jika tidak ada)"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Penyakit Kronis (Verifikasi Akun)</label>
                  <span className="text-[9px] text-zinc-500 font-semibold bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200/50">Medis</span>
                </div>
                <input
                  type="text"
                  value={formData.chronicDisease}
                  onChange={(e) => setFormData({ ...formData, chronicDisease: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-250/90 rounded-md focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 font-semibold text-zinc-700"
                  placeholder="Cth. Hipertensi Kronis"
                />
              </div>
              <div className="sm:col-span-2 text-[10px] font-semibold text-zinc-500 leading-relaxed flex items-start gap-1.5 bg-zinc-50 border border-zinc-200 p-3 rounded-lg">
                <FaExclamationTriangle className="text-zinc-700 text-xs flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Informasi Keamanan Resep:</strong> Data alergi dan rekam penyakit kronis di atas telah disinkronkan dengan data rekam medis *Patient 360* Anda. Tim apoteker kami akan memverifikasi kesesuaian obat sebelum pesanan disiapkan.
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Guest Instant Member Activation CRM Block */
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-5 flex items-center">
                <input
                  id="instant-member"
                  type="checkbox"
                  checked={triggerMember}
                  onChange={(e) => setTriggerMember(e.target.checked)}
                  className="w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-900 focus:ring-opacity-20 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="instant-member" className="text-sm font-bold text-zinc-900 select-none cursor-pointer flex items-center gap-1.5">
                  <FaUserShield className="text-zinc-600 text-base" /> Simpan data medis &amp; Aktifkan Member Gold Gratis
                </label>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Dapatkan bonus instan <strong className="text-zinc-800">1.250 Poin</strong> pada pesanan ini, voucher diskon 5%, gratis ongkir instan, dan pantau riwayat obat otomatis.
                </p>
              </div>
            </div>

            {/* Expanded Medical Profile Inputs */}
            {triggerMember && (
              <div className="pt-4 border-t border-zinc-150 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Alergi Obat</label>
                    <span className="text-[9px] text-zinc-500 font-semibold bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200/50">Medis</span>
                  </div>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-250/90 rounded-md focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 font-semibold text-zinc-700"
                    placeholder="Cth. Penisilin, Amoxicillin (Kosongkan jika tidak ada)"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Penyakit Kronis</label>
                    <span className="text-[9px] text-zinc-500 font-semibold bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200/50">Medis</span>
                  </div>
                  <input
                    type="text"
                    value={formData.chronicDisease}
                    onChange={(e) => setFormData({ ...formData, chronicDisease: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-250/90 rounded-md focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 font-semibold text-zinc-700"
                    placeholder="Cth. Diabetes Tipe 2, Hipertensi Kronis"
                  />
                </div>
                <div className="sm:col-span-2 text-[10px] font-semibold text-zinc-500 leading-relaxed flex items-start gap-1.5 bg-zinc-50 border border-zinc-200 p-3 rounded-lg">
                  <FaExclamationTriangle className="text-zinc-700 text-xs flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Informasi Keamanan:</strong> Data alergi dan rekam penyakit kronis digunakan oleh apoteker kami untuk memverifikasi keamanan resep Anda sebelum penyerahan obat demi mencegah interaksi yang membahayakan jiwa.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Cart Summary Section (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-150 pb-4">Ringkasan Pesanan</h3>

          {cartItems.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">Keranjang belanja kosong</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate leading-snug">{item.nama}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{item.quantity || 1} unit · {item.kategori}</p>
                  </div>
                  <span className="text-xs font-black text-zinc-900">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(item.harga * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-zinc-150 pt-4 space-y-2 text-xs font-medium">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalAmount)}</span>
            </div>
            
            <div className="flex justify-between text-zinc-500">
              <span>Biaya Pengiriman</span>
              <span>{userProfile || triggerMember ? <span className="line-through">Rp 15.000</span> : "Rp 15.000"}</span>
            </div>
            
            {(userProfile || triggerMember) && (
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg">
                <span>Reward Ongkir Member</span>
                <span>Gratis Ongkir</span>
              </div>
            )}

            {pointsInput > 0 && !pointsError && (
              <div className="flex justify-between text-red-650 font-bold bg-red-50 border border-red-100 p-2 rounded-lg">
                <span>Tukar {pointsInput} Poin</span>
                <span>-{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(pointsInput * loyaltyConfig.points_to_currency_rate)}</span>
              </div>
            )}

            <div className="border-t border-zinc-150 pt-4 flex justify-between items-baseline text-zinc-950">
              <span className="font-bold text-sm">Total Pembayaran</span>
              <span className="text-lg font-black">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
                  Math.max(0, totalAmount - (pointsInput > 0 && !pointsError ? pointsInput * loyaltyConfig.points_to_currency_rate : 0) + (userProfile || triggerMember ? 0 : 15000))
                )}
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={cartItems.length === 0 || !!pointsError}
            className="w-full py-3 text-xs font-bold tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 rounded-md transition-all shadow-sm cursor-pointer"
          >
            {userProfile ? "Bayar Sekarang (Benefit Member)" : (triggerMember ? "Bayar & Aktifkan Member Gold" : "Proses Pembayaran Guest")}
          </button>
        </div>
      </div>
    </div>
  );
}
