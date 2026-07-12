import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FaPills, FaPause, FaPlay, FaTimes, FaPlus, FaTruck, FaCalendarAlt, FaBoxOpen } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function MemberSubscriptions({ userId }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDeliveryLog, setShowDeliveryLog] = useState(null);
    const [deliveries, setDeliveries] = useState([]);

    // Form state untuk subscription baru
    const [newSub, setNewSub] = useState({
        product_id: "",
        quantity: 1,
        interval_days: 30,
        shipping_address: ""
    });

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("subscriptions")
                .select("*, products(name, sku, price, image_url, unit)")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (!error) setSubscriptions(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        const { data } = await supabase
            .from("products")
            .select("id, name, sku, price, unit, category")
            .eq("is_active", true)
            .order("name");
        setProducts(data || []);
    };

    const fetchDeliveries = async (subId) => {
        const { data } = await supabase
            .from("subscription_deliveries")
            .select("*")
            .eq("subscription_id", subId)
            .order("delivery_date", { ascending: false });
        setDeliveries(data || []);
        setShowDeliveryLog(subId);
    };

    useEffect(() => {
        if (userId) {
            fetchSubscriptions();
            fetchProducts();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const showMsg = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    };

    const handleCreateSubscription = async (e) => {
        e.preventDefault();
        if (!newSub.product_id) return;
        setActionLoading(true);
        try {
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + parseInt(newSub.interval_days));

            const { error } = await supabase.from("subscriptions").insert({
                user_id: userId,
                product_id: newSub.product_id,
                quantity: parseInt(newSub.quantity),
                interval_days: parseInt(newSub.interval_days),
                next_delivery_date: nextDate.toISOString().split("T")[0],
                shipping_address: newSub.shipping_address,
                status: "active"
            });

            if (error) {
                showMsg("Gagal membuat langganan: " + error.message, "error");
            } else {
                showMsg("Langganan obat rutin berhasil dibuat! 🎉");
                setShowNewModal(false);
                setNewSub({ product_id: "", quantity: 1, interval_days: 30, shipping_address: "" });
                fetchSubscriptions();
            }
        } catch (err) {
            showMsg("Terjadi kesalahan.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const updateStatus = async (subId, newStatus) => {
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from("subscriptions")
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq("id", subId);

            if (error) {
                showMsg("Gagal mengubah status: " + error.message, "error");
            } else {
                const label = newStatus === "paused" ? "dijeda" : newStatus === "active" ? "diaktifkan kembali" : "dibatalkan";
                showMsg(`Langganan berhasil ${label}.`);
                fetchSubscriptions();
            }
        } catch (err) {
            showMsg("Terjadi kesalahan.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "active": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "paused": return "bg-amber-50 text-amber-700 border-amber-200";
            case "cancelled": return "bg-red-50 text-red-700 border-red-200";
            case "expired": return "bg-gray-100 text-gray-500 border-gray-200";
            default: return "bg-gray-100 text-gray-500 border-gray-200";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "active": return "Aktif";
            case "paused": return "Dijeda";
            case "cancelled": return "Dibatalkan";
            case "expired": return "Kedaluwarsa";
            default: return status;
        }
    };

    const intervalLabel = (days) => {
        if (days === 7) return "Mingguan";
        if (days === 14) return "2 Minggu";
        if (days === 30) return "Bulanan";
        if (days === 60) return "2 Bulan";
        if (days === 90) return "3 Bulan";
        return `${days} hari`;
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
                <ImSpinner2 className="animate-spin text-ocean-green text-3xl" />
                <span className="text-sm text-gray-400">Memuat data langganan...</span>
            </div>
        );
    }

    return (
        <div className="bg-[#FAFBFB] min-h-screen">
            <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-cyprus flex items-center gap-2">
                        <FaPills className="text-ocean-green" /> Langganan Obat Rutin
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Kelola langganan obat untuk penyakit kronis Anda</p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-ocean-green text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm cursor-pointer"
                >
                    <FaPlus /> Langganan Baru
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-3 text-sm rounded-xl border ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    {message.text}
                </div>
            )}

            {/* Subscription List */}
            {subscriptions.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                    <FaBoxOpen className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-medium">Belum ada langganan obat rutin.</p>
                    <p className="text-xs text-gray-300 mt-1">Klik "Langganan Baru" untuk mulai berlangganan obat kronis Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subscriptions.map((sub) => (
                        <div key={sub.id} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                            {/* Header card */}
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-cyprus">{sub.products?.name || "Produk"}</h3>
                                    <p className="text-[11px] text-gray-400">{sub.products?.sku} · {sub.products?.unit}</p>
                                </div>
                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(sub.status)}`}>
                                    {getStatusLabel(sub.status)}
                                </span>
                            </div>

                            {/* Detail */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <span className="text-gray-400 block mb-0.5">Jumlah</span>
                                    <span className="font-bold text-cyprus">{sub.quantity} {sub.products?.unit}/kirim</span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <span className="text-gray-400 block mb-0.5">Interval</span>
                                    <span className="font-bold text-cyprus">{intervalLabel(sub.interval_days)}</span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <span className="text-gray-400 block mb-0.5">Pengiriman Berikutnya</span>
                                    <span className="font-bold text-ocean-green flex items-center gap-1">
                                        <FaCalendarAlt className="text-[10px]" /> {formatDate(sub.next_delivery_date)}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <span className="text-gray-400 block mb-0.5">Biaya/Kirim</span>
                                    <span className="font-bold text-cyprus">{formatCurrency((sub.products?.price || 0) * sub.quantity)}</span>
                                </div>
                            </div>

                            {/* Total deliveries */}
                            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                                <span>Total pengiriman: <strong className="text-cyprus">{sub.total_deliveries}x</strong></span>
                                <button
                                    onClick={() => fetchDeliveries(sub.id)}
                                    className="text-ocean-green font-bold hover:underline cursor-pointer"
                                >
                                    Lihat Riwayat
                                </button>
                            </div>

                            {/* Actions */}
                            {sub.status !== "cancelled" && sub.status !== "expired" && (
                                <div className="flex gap-2 pt-1">
                                    {sub.status === "active" && (
                                        <button
                                            onClick={() => updateStatus(sub.id, "paused")}
                                            disabled={actionLoading}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl hover:bg-amber-100 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            <FaPause className="text-[10px]" /> Jeda
                                        </button>
                                    )}
                                    {sub.status === "paused" && (
                                        <button
                                            onClick={() => updateStatus(sub.id, "active")}
                                            disabled={actionLoading}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            <FaPlay className="text-[10px]" /> Aktifkan
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Yakin ingin membatalkan langganan ini?")) {
                                                updateStatus(sub.id, "cancelled");
                                            }
                                        }}
                                        disabled={actionLoading}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-xl hover:bg-red-100 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <FaTimes className="text-[10px]" /> Batalkan
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Delivery Log Modal */}
            {showDeliveryLog && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowDeliveryLog(null)}>
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[70vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-cyprus flex items-center gap-2">
                                <FaTruck className="text-ocean-green" /> Riwayat Pengiriman
                            </h3>
                            <button onClick={() => setShowDeliveryLog(null)} className="text-gray-400 hover:text-red-500 cursor-pointer text-lg">✕</button>
                        </div>
                        {deliveries.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">Belum ada riwayat pengiriman.</p>
                        ) : (
                            <div className="space-y-3">
                                {deliveries.map((d) => (
                                    <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                                        <div>
                                            <span className="font-bold text-cyprus">{formatDate(d.delivery_date)}</span>
                                            {d.notes && <p className="text-gray-400 mt-0.5">{d.notes}</p>}
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                            d.status === "delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            d.status === "processing" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                            d.status === "failed" ? "bg-red-50 text-red-700 border-red-200" :
                                            "bg-gray-100 text-gray-500 border-gray-200"
                                        }`}>
                                            {d.status === "delivered" ? "Terkirim" : d.status === "processing" ? "Diproses" : d.status === "failed" ? "Gagal" : "Terjadwal"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* New Subscription Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowNewModal(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-cyprus">Langganan Obat Baru 💊</h3>
                            <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-red-500 cursor-pointer text-lg">✕</button>
                        </div>
                        <form onSubmit={handleCreateSubscription} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Pilih Obat</label>
                                <select
                                    value={newSub.product_id}
                                    onChange={e => setNewSub({ ...newSub, product_id: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green"
                                    required
                                >
                                    <option value="">-- Pilih obat --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} — {formatCurrency(p.price)}/{p.unit}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Jumlah per Kirim</label>
                                    <input
                                        type="number" min="1" max="100"
                                        value={newSub.quantity}
                                        onChange={e => setNewSub({ ...newSub, quantity: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-ocean-green/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Interval Pengiriman</label>
                                    <select
                                        value={newSub.interval_days}
                                        onChange={e => setNewSub({ ...newSub, interval_days: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-ocean-green/20"
                                    >
                                        <option value="7">Setiap 7 hari</option>
                                        <option value="14">Setiap 14 hari</option>
                                        <option value="30">Setiap 30 hari (Bulanan)</option>
                                        <option value="60">Setiap 60 hari</option>
                                        <option value="90">Setiap 90 hari</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Alamat Pengiriman</label>
                                <textarea
                                    rows="2"
                                    value={newSub.shipping_address}
                                    onChange={e => setNewSub({ ...newSub, shipping_address: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-ocean-green/20 resize-none"
                                    placeholder="Jl. Sudirman No. 12, Pekanbaru..."
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
                                <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer font-semibold">Batal</button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-5 py-2 bg-ocean-green text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {actionLoading ? "Menyimpan..." : "Buat Langganan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}
