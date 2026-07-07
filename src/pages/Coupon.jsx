import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdContentCopy, MdCheck } from "react-icons/md";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import Modal from "../components/Modal";
import OrderStatCard from "../components/OrderStatCard";
import { Alert, AlertDescription } from "../components/ui/alert";
import { supabase } from "../lib/supabase";

export default function Coupon() {
  const { setPageTitle } = useOutletContext();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [userId, setUserId] = useState(null);
  
  // Notification states
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Forms
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: 10,
    minPurchase: 0,
    expiryDate: "",
    usageLimit: 100,
    status: "active",
    description: ""
  });

  // Map database entity to UI format
  const mapPromoToCoupon = (p) => {
    return {
      id: p.id,
      code: p.code,
      type: p.discount_type, // percentage or fixed
      value: Number(p.discount_value),
      minPurchase: Number(p.min_purchase) || 0,
      expiryDate: p.valid_until ? p.valid_until.split("T")[0] : "",
      usageLimit: p.usage_limit || 100,
      usedCount: p.usage_count || 0,
      status: p.is_active ? "active" : "inactive",
      description: p.description || ""
    };
  };

  // Fetch current authenticated user ID
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
      }
    });
  }, []);

  // Fetch coupons from Supabase
  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("promos")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Gagal memuat data kupon: " + fetchError.message);
      } else {
        const mapped = (data || []).map(mapPromoToCoupon);
        setCoupons(mapped);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data kupon dari database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setPageTitle) {
      setPageTitle("Coupon Codes");
    }
    fetchCoupons();
  }, [setPageTitle]);

  // Set timeout for success alerts
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // Set timeout for errors
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 3500);
      return () => clearTimeout(t);
    }
  }, [error]);

  // Set timeout for clipboard indicator
  useEffect(() => {
    if (copiedCode) {
      const t = setTimeout(() => setCopiedCode(""), 2000);
      return () => clearTimeout(t);
    }
  }, [copiedCode]);

  // Calculations for stats
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === "active").length;
  const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const totalDiscountValue = coupons.reduce((sum, c) => sum + (c.usedCount * c.value), 0);

  // Filters
  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || c.type === filterType;
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setSuccess(`Kode kupon "${code}" berhasil disalin ke clipboard!`);
  };

  const openAddModal = () => {
    setForm({
      code: "",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days later
      usageLimit: 100,
      status: "active",
      description: ""
    });
    setIsAddModalOpen(true);
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.code.trim()) {
      setError("Kode kupon tidak boleh kosong!");
      return;
    }

    const codeUpper = form.code.trim().toUpperCase();
    if (coupons.some(c => c.code === codeUpper)) {
      setError(`Kode kupon "${codeUpper}" sudah terdaftar!`);
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        code: codeUpper,
        discount_type: form.type,
        discount_value: Number(form.value),
        min_purchase: Number(form.minPurchase) || 0,
        valid_until: new Date(form.expiryDate).toISOString(),
        usage_limit: Number(form.usageLimit) || null,
        is_active: form.status === "active",
        description: form.description || `Diskon kupon sebesar ${form.type === "percentage" ? form.value + "%" : "$" + form.value}`,
        created_by: userId
      };

      const { data, error: insertError } = await supabase
        .from("promos")
        .insert([payload])
        .select();

      if (insertError) {
        setError("Gagal menyimpan kupon: " + insertError.message);
      } else {
        setSuccess(`Kupon "${codeUpper}" berhasil ditambahkan!`);
        setIsAddModalOpen(false);
        fetchCoupons(); // Reload from database
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
      status: coupon.status,
      description: coupon.description
    });
    setIsEditModalOpen(true);
  };

  const handleEditCoupon = async (e) => {
    e.preventDefault();
    if (!selectedCoupon) return;
    setError("");
    setSuccess("");

    const codeUpper = form.code.trim().toUpperCase();
    if (coupons.some(c => c.code === codeUpper && c.id !== selectedCoupon.id)) {
      setError(`Kode kupon "${codeUpper}" sudah terdaftar oleh kupon lain!`);
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        code: codeUpper,
        discount_type: form.type,
        discount_value: Number(form.value),
        min_purchase: Number(form.minPurchase) || 0,
        valid_until: new Date(form.expiryDate).toISOString(),
        usage_limit: Number(form.usageLimit) || null,
        is_active: form.status === "active",
        description: form.description,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from("promos")
        .update(payload)
        .eq("id", selectedCoupon.id);

      if (updateError) {
        setError("Gagal memperbarui kupon: " + updateError.message);
      } else {
        setSuccess(`Kupon "${codeUpper}" berhasil diperbarui!`);
        setIsEditModalOpen(false);
        fetchCoupons(); // Reload from database
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;
    setError("");
    setSuccess("");

    setActionLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("promos")
        .delete()
        .eq("id", selectedCoupon.id);

      if (deleteError) {
        setError("Gagal menghapus kupon: " + deleteError.message);
      } else {
        setSuccess(`Kupon "${selectedCoupon.code}" berhasil dihapus!`);
        setIsDeleteModalOpen(false);
        setSelectedCoupon(null);
        fetchCoupons(); // Reload from database
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status, expiry) => {
    const today = new Date().toISOString().split("T")[0];
    const isExpired = expiry < today;

    if (isExpired || status === "expired") {
      return "bg-red-50 text-red-700 border border-red-100 font-semibold animate-pulse";
    }
    if (status === "active") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold";
    }
    return "bg-gray-150 text-gray-500 border border-gray-250";
  };

  return (
    <div className="w-full space-y-6">
      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OrderStatCard title="Total Kupon" value={totalCoupons.toString()} trendValue="Daftar Kupon" trendDirection="none" period="Semua Kode" />
        <OrderStatCard title="Kupon Aktif" value={activeCoupons.toString()} trendValue="Berjalan" trendDirection="up" period="Siap Digunakan" />
        <OrderStatCard title="Redeemed Count" value={totalUsed.toString()} trendValue="+14%" trendDirection="up" period="Klaim Terpakai" />
        <OrderStatCard title="Diskon Diberikan" value={`$${totalDiscountValue.toLocaleString()}`} trendValue="Loyalty Cost" trendDirection="none" period="Nilai Estimasi" />
      </div>

      {/* Notifications */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-600 font-semibold flex items-center gap-2">
            <BsFillExclamationDiamondFill size={16} />
            <span>{error}</span>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <AlertDescription className="text-emerald-700 font-semibold flex items-center gap-2">
            <MdCheck className="text-emerald-600" size={18} />
            <span>{success}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Header */}
      <div className="flex justify-end items-center">
        <button
          onClick={openAddModal}
          className="bg-ocean-green hover:opacity-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <MdAdd className="text-lg" />
          Tambah Kupon Baru
        </button>
      </div>

      {/* Search and Table Box */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full text-left font-sans animate-fade-in">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Query */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode kupon..."
                className="w-full pl-4 pr-10 py-2 bg-[#f8fafc] border-none rounded-lg text-[13px] font-medium text-gray-700 outline-none focus:ring-1 focus:ring-ocean-green"
              />
              <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {/* Filter Jenis Kupon */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-[13px] bg-[#f8fafc] border-none rounded-lg outline-none focus:ring-1 focus:ring-ocean-green text-gray-700 font-semibold cursor-pointer"
            >
              <option value="all">Semua Tipe Diskon</option>
              <option value="percentage">Persentase (%)</option>
              <option value="fixed">Nilai Tetap ($)</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-[13px] bg-[#f8fafc] border-none rounded-lg outline-none focus:ring-1 focus:ring-ocean-green text-gray-700 font-semibold cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
            Total: {filteredCoupons.length} Kupon
          </span>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
              <ImSpinner2 className="animate-spin text-ocean-green text-3xl" />
              <span className="text-sm font-medium">Memuat data kupon dari Supabase...</span>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm font-semibold uppercase tracking-wider mb-1">Kupon Tidak Ditemukan</p>
              <p className="text-xs text-gray-300">Coba ganti filter pencarian atau buat kupon baru.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-aqua-spring text-cyprus text-[13px] font-semibold">
                  <th className="py-3 px-4 rounded-l-md w-10">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-ocean-green focus:ring-ocean-green cursor-pointer" />
                  </th>
                  <th className="py-3 px-2 w-12">No.</th>
                  <th className="py-3 px-4 w-40">Kode Kupon</th>
                  <th className="py-3 px-4">Potongan Diskon</th>
                  <th className="py-3 px-4">Min. Belanja</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Penggunaan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 rounded-r-md text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon, index) => {
                  const today = new Date().toISOString().split("T")[0];
                  const isExpired = coupon.expiryDate < today;
                  const displayStatus = isExpired ? "expired" : coupon.status;
                  const usagePercentage = Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100);

                  return (
                    <tr key={coupon.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-4">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-ocean-green focus:ring-ocean-green cursor-pointer" />
                      </td>
                      <td className="py-4 px-2 text-[14px] font-medium text-gray-700">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[13px] text-cyprus bg-aqua-spring px-2.5 py-1 rounded-lg border border-ocean-green/10 animate-fade-in">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="p-1 text-gray-400 hover:text-ocean-green hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                            title="Salin Kode Kupon"
                          >
                            {copiedCode === coupon.code ? <MdCheck className="text-success animate-scale-up" size={16} /> : <MdContentCopy size={15} />}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium mt-1.5 max-w-xs truncate">{coupon.description}</p>
                      </td>

                      <td className="py-4 px-4 text-[14px]">
                        <span className="font-bold text-cyprus">
                          {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{coupon.type} Discount</p>
                      </td>

                      <td className="py-4 px-4 text-[14px]">
                        <span className="text-gray-600 font-semibold">
                          {coupon.minPurchase > 0 ? `$${coupon.minPurchase}` : "Tidak Ada"}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-[14px]">
                        <span className={isExpired ? "text-red-500 font-semibold" : "text-gray-600"}>
                          {new Date(coupon.expiryDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </td>

                      <td className="py-4 px-4 min-w-[140px] text-[14px]">
                        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                          <span>{coupon.usedCount} Terpakai</span>
                          <span>{coupon.usageLimit} Limit</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${usagePercentage >= 100 ? 'bg-red-500' : 'bg-ocean-green'}`} 
                            style={{ width: `${usagePercentage}%` }} 
                          />
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${getStatusBadge(displayStatus, coupon.expiryDate)}`}>
                          {displayStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-indigo-100"
                            title="Edit Kupon"
                          >
                            <MdEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(coupon)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100"
                            title="Hapus Kupon"
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Add Coupon */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Kupon Promo Baru 🏷️">
        <form onSubmit={handleAddCoupon} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kode Kupon</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="CONTOH: SEHAT25"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm uppercase font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Masa Berlaku (Expiry Date)</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm text-gray-700 font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe Diskon</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm text-gray-700 font-semibold"
              >
                <option value="percentage">Persentase (%)</option>
                <option value="fixed">Nilai Tetap ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nilai Diskon</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Math.max(0, Number(e.target.value)) })}
                placeholder={form.type === "percentage" ? "10" : "10"}
                min="0"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Min. Belanja ($)</label>
              <input
                type="number"
                value={form.minPurchase}
                onChange={(e) => setForm({ ...form, minPurchase: Math.max(0, Number(e.target.value)) })}
                placeholder="Contoh: 50"
                min="0"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Limit Kuota Penggunaan</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: Math.max(1, Number(e.target.value)) })}
                placeholder="Contoh: 100"
                min="1"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status Awal</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm text-gray-700 font-semibold"
              >
                <option value="active">Active (Langsung Aktif)</option>
                <option value="inactive">Inactive (Mati/Draft)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi & Catatan Promo</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Jelaskan mengenai promo atau ketentuan pemakaian kupon ini..."
              rows="3"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl text-sm font-semibold text-gray-600 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2.5 bg-ocean-green hover:opacity-95 text-white transition-all rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {actionLoading && <ImSpinner2 className="animate-spin text-white" />}
              Simpan Kupon
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Coupon */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Kupon Promo 🏷️">
        <form onSubmit={handleEditCoupon} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kode Kupon</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm uppercase font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Masa Berlaku (Expiry Date)</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm text-gray-700 font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe Diskon</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm text-gray-700 font-semibold"
              >
                <option value="percentage">Persentase (%)</option>
                <option value="fixed">Nilai Tetap ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nilai Diskon</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Math.max(0, Number(e.target.value)) })}
                min="0"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Min. Belanja ($)</label>
              <input
                type="number"
                value={form.minPurchase}
                onChange={(e) => setForm({ ...form, minPurchase: Math.max(0, Number(e.target.value)) })}
                min="0"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Limit Kuota Penggunaan</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: Math.max(1, Number(e.target.value)) })}
                min="1"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status Kupon</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm text-gray-700 font-semibold"
              >
                <option value="active">Active (Aktif)</option>
                <option value="inactive">Inactive (Mati)</option>
                <option value="expired">Expired (Kadaluarsa)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi & Catatan Promo</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-sm"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl text-sm font-semibold text-gray-600 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2.5 bg-ocean-green hover:opacity-95 text-white transition-all rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {actionLoading && <ImSpinner2 className="animate-spin text-white" />}
              Perbarui Kupon
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirm Delete */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus Kupon Promo ⚠️">
        <div className="text-left space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus kode kupon <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-mono">{selectedCoupon?.code}</span>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl text-sm font-semibold text-gray-600 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteCoupon}
              disabled={actionLoading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white transition-colors rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {actionLoading && <ImSpinner2 className="animate-spin text-white" />}
              Ya, Hapus Kupon
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
