import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FaCoins, FaArrowUp, FaArrowDown, FaStar, FaExclamationTriangle, FaSlidersH } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function MemberPointsHistory({ userId, currentPoints }) {
    const [transactions, setTransactions] = useState([]);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [txRes, cfgRes] = await Promise.all([
                supabase
                    .from("points_transactions")
                    .select("*")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false })
                    .limit(50),
                supabase
                    .from("loyalty_config")
                    .select("*")
                    .eq("is_active", true)
                    .limit(1)
                    .single()
            ]);

            if (!txRes.error) setTransactions(txRes.data || []);
            if (!cfgRes.error) setConfig(cfgRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

    const getTypeStyle = (type) => {
        switch (type) {
            case "earn": return { icon: <FaArrowUp />, bg: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Dapat", sign: "+" };
            case "redeem": return { icon: <FaArrowDown />, bg: "bg-blue-50 text-blue-600 border-blue-200", label: "Tukar", sign: "" };
            case "bonus": return { icon: <FaStar />, bg: "bg-amber-50 text-amber-600 border-amber-200", label: "Bonus", sign: "+" };
            case "expire": return { icon: <FaExclamationTriangle />, bg: "bg-red-50 text-red-600 border-red-200", label: "Expired", sign: "" };
            case "adjustment": return { icon: <FaSlidersH />, bg: "bg-purple-50 text-purple-600 border-purple-200", label: "Koreksi", sign: "" };
            default: return { icon: <FaCoins />, bg: "bg-gray-100 text-gray-500 border-gray-200", label: type, sign: "" };
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
                <ImSpinner2 className="animate-spin text-ocean-green text-3xl" />
                <span className="text-sm text-gray-400">Memuat riwayat poin...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-cyprus flex items-center gap-2">
                    <FaCoins className="text-ocean-green" /> Riwayat Poin Loyalitas
                </h2>
                <p className="text-xs text-gray-400 mt-1">Histori perolehan dan penggunaan poin Anda</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-cyprus text-white p-5 rounded-2xl shadow-sm">
                    <span className="text-[10px] text-teal-300 uppercase tracking-widest font-bold block mb-1">Saldo Saat Ini</span>
                    <h3 className="text-3xl font-black">{(currentPoints || 0).toLocaleString("id-ID")} <span className="text-sm font-medium text-teal-200">pts</span></h3>
                </div>
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Total Didapat</span>
                    <h3 className="text-3xl font-black text-emerald-600">
                        +{transactions.filter(t => t.points > 0).reduce((sum, t) => sum + t.points, 0).toLocaleString("id-ID")}
                    </h3>
                </div>
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Total Ditukar</span>
                    <h3 className="text-3xl font-black text-blue-600">
                        {transactions.filter(t => t.points < 0).reduce((sum, t) => sum + t.points, 0).toLocaleString("id-ID")}
                    </h3>
                </div>
            </div>

            {/* Loyalty Config Info */}
            {config && (
                <div className="bg-gradient-to-r from-aqua-spring to-white border border-ocean-green/10 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-cyprus mb-2">ℹ️ Konfigurasi Poin Aktif</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                            <span className="text-gray-400">Earn Rate</span>
                            <p className="font-bold text-cyprus">{config.earn_percentage}% per transaksi</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Nilai Tukar</span>
                            <p className="font-bold text-cyprus">1 poin = Rp {config.points_to_currency_rate?.toLocaleString("id-ID")}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Maks Redeem</span>
                            <p className="font-bold text-cyprus">{config.max_redeem_percentage}% dari subtotal</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Multiplier</span>
                            <p className="font-bold text-cyprus">Premium ×{config.multiplier_premium} · VIP ×{config.multiplier_vip}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-400">Filter:</span>
                {["all", "earn", "redeem", "bonus", "adjustment"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                            filter === f
                                ? "bg-ocean-green text-white border-ocean-green"
                                : "bg-white text-gray-500 border-gray-200 hover:border-ocean-green hover:text-ocean-green"
                        }`}
                    >
                        {f === "all" ? "Semua" : f === "earn" ? "Dapat" : f === "redeem" ? "Tukar" : f === "bonus" ? "Bonus" : "Koreksi"}
                    </button>
                ))}
            </div>

            {/* Transaction List */}
            {filtered.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                    <FaCoins className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Belum ada riwayat poin.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50">
                    {filtered.map((tx) => {
                        const style = getTypeStyle(tx.type);
                        return (
                            <div key={tx.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm border ${style.bg}`}>
                                        {style.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-cyprus">{tx.description || style.label}</p>
                                        <p className="text-[11px] text-gray-400">{formatDate(tx.created_at)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-black ${tx.points >= 0 ? "text-emerald-600" : "text-blue-600"}`}>
                                        {tx.points >= 0 ? "+" : ""}{tx.points.toLocaleString("id-ID")} pts
                                    </p>
                                    <p className="text-[10px] text-gray-400">Saldo: {tx.balance_after?.toLocaleString("id-ID")} pts</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
