import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FaAward, FaGift, FaUserCheck, FaRocket, FaClock, FaCheckCircle } from "react-icons/fa";
import RefillAlert from "../components/member/RefillAlert";
import DoseReminder from "../components/crm/DoseReminder";
import LiveChatConsultation from "../components/crm/LiveChatConsultation";


export default function MemberDashboard() {
    const { user, fetchProfile } = useOutletContext();
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        document.title = "Dashboard Anggota - Apotek Sehat Pekanbaru";
    }, []);

    // Simulate claiming a benefit
    const claimBenefit = async (cost, rewardName) => {
        if (!user) return;
        if (user.membership_points < cost) {
            setMessage({ text: `Poin Anda tidak mencukupi untuk klaim ${rewardName}.`, type: "error" });
            return;
        }

        setActionLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const newPoints = user.membership_points - cost;
            const { error } = await supabase
                .from("profiles")
                .update({ membership_points: newPoints })
                .eq("id", user.id);

            if (error) {
                setMessage({ text: "Gagal klaim benefit: " + error.message, type: "error" });
            } else {
                setMessage({ text: `Sukses klaim ${rewardName}! ${cost} poin telah didebit.`, type: "success" });
                fetchProfile(user.id);
            }
        } catch (err) {
            setMessage({ text: "Terjadi kesalahan saat klaim.", type: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    // Simulate upgrading membership
    const upgradeTier = async (newTier, pointBonus) => {
        if (!user) return;
        setActionLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ 
                    membership_status: newTier,
                    membership_points: user.membership_points + pointBonus
                })
                .eq("id", user.id);

            if (error) {
                setMessage({ text: "Gagal upgrade keanggotaan: " + error.message, type: "error" });
            } else {
                setMessage({ 
                    text: `Selamat! Keanggotaan Anda telah berhasil di-upgrade menjadi ${newTier.toUpperCase()}. Poin bonus +${pointBonus} ditambahkan!`, 
                    type: "success" 
                });
                fetchProfile(user.id);
            }
        } catch (err) {
            setMessage({ text: "Terjadi kesalahan saat upgrade.", type: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const initials = user?.full_name
        ? user.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
        : "M";

    let badgeColor = "bg-emerald-100 text-emerald-700 border border-emerald-200";
    if (user?.membership_status === "premium") badgeColor = "bg-indigo-100 text-indigo-700 border border-indigo-200";
    else if (user?.membership_status === "vip") badgeColor = "bg-red-100 text-red-700 border border-red-200";

    return (
        <div className="bg-[#f8f9fa] min-h-screen font-inter pb-16">

            <main className="max-w-6xl mx-auto px-6 pt-10 space-y-8">
                {/* Welcome & Notification */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-cyprus tracking-tight">Halo, {user?.full_name}! 👋</h1>
                        <p className="text-sm text-gray-500 mt-1">Selamat datang kembali di area member Apotek Sehat Pekanbaru.</p>
                    </div>
                </div>

                {/* Refill Alert Banner */}
                <RefillAlert 
                    medicineName="Amlodipine" 
                    message="Halo Pak Budi, jangan lupa konsumsi Amlodipine Anda hari ini untuk menjaga tekanan darah tetap stabil." 
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Stats and Benefits */}
                    <div className="lg:col-span-8 space-y-8">
                        {message.text && (
                            <div className={`p-4 text-sm rounded-xl flex items-center shadow-sm border ${
                                message.type === "success" 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-150" 
                                    : "bg-red-50 text-red-700 border-red-150"
                            }`}>
                                <FaCheckCircle className="mr-3 text-lg flex-shrink-0" />
                                <span>{message.text}</span>
                            </div>
                        )}

                        {/* Scorecard Keanggotaan */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                            {/* Card Member */}
                            <div className="md:col-span-7 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-ocean-green/5 rounded-full -translate-y-6 translate-x-6"></div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kartu Anggota</span>
                                        <span className={`px-3 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${badgeColor}`}>
                                            {user?.membership_status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                        <div className="w-12 h-12 rounded-full bg-aqua-spring border border-ocean-green/20 flex items-center justify-center text-ocean-green font-bold text-lg">
                                            {initials}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-cyprus">{user?.full_name}</h3>
                                            <p className="text-xs text-gray-400">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-8 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 mt-6">
                                    <span>Bergabung Sejak:</span>
                                    <span className="font-semibold text-cyprus">
                                        {user?.membership_joined_at ? new Date(user.membership_joined_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Card Poin */}
                            <div className="md:col-span-5 bg-cyprus text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="text-xs text-teal-300 font-bold uppercase tracking-widest block">Loyalty Points</span>
                                    <h2 className="text-5xl font-black">{user?.membership_points.toLocaleString("id-ID")} <span className="text-sm font-medium text-teal-200">pts</span></h2>
                                </div>
                                <p className="text-xs text-teal-200 leading-relaxed mt-4">
                                    Kumpulkan poin terus untuk klaim hadiah voucher belanja obat dan suplemen gratis di bawah.
                                </p>
                            </div>
                        </div>

                        {/* Klaim Benefit Section */}
                        <div className="space-y-4 text-left">
                            <h2 className="text-xl font-bold text-cyprus flex items-center gap-2">
                                <FaGift className="text-ocean-green" /> Klaim Benefit & Voucher
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Benefit 1 */}
                                <div className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-cyprus text-sm">Voucher Diskon Rp 10.000</h3>
                                        <p className="text-xs text-gray-400">Tukarkan 100 poin loyalitas</p>
                                    </div>
                                    <button
                                        onClick={() => claimBenefit(100, "Voucher Diskon Rp 10.000")}
                                        disabled={actionLoading || (user?.membership_points || 0) < 100}
                                        className="px-4 py-2 bg-ocean-green hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                                    >
                                        Klaim (100 Pts)
                                    </button>
                                </div>
                                {/* Benefit 2 */}
                                <div className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-cyprus text-sm">Gratis Suplemen Vitamin C</h3>
                                        <p className="text-xs text-gray-400">Tukarkan 250 poin loyalitas</p>
                                    </div>
                                    <button
                                        onClick={() => claimBenefit(250, "Gratis Suplemen Vitamin C")}
                                        disabled={actionLoading || (user?.membership_points || 0) < 250}
                                        className="px-4 py-2 bg-ocean-green hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                                    >
                                        Klaim (250 Pts)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Membership Area */}
                        {user?.membership_status !== "vip" && (
                            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4 text-left">
                                <h2 className="text-xl font-bold text-cyprus flex items-center gap-2">
                                    <FaRocket className="text-ocean-green" /> Tingkatkan Keanggotaan
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Upgrade tier member Anda untuk melipatgandakan perolehan poin transaksi dan dapatkan benefit gratis ongkir instan.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {user?.membership_status === "free" && (
                                        <button
                                            onClick={() => upgradeTier("premium", 200)}
                                            disabled={actionLoading}
                                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                        >
                                            Upgrade ke Premium (+200 Poin Bonus)
                                        </button>
                                    )}
                                    <button
                                        onClick={() => upgradeTier("vip", 500)}
                                        disabled={actionLoading}
                                        className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                    >
                                        Upgrade ke VIP (+500 Poin Bonus)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Sidebar Widget */}
                    <div className="lg:col-span-4 space-y-6">
                        <DoseReminder />
                        <LiveChatConsultation />


                        {/* Riwayat Aktivitas singkat */}
                        <div className="space-y-4 text-left">
                            <h2 className="text-xl font-bold text-cyprus flex items-center gap-2">
                                <FaClock className="text-ocean-green" /> Riwayat Aktivitas Member
                            </h2>
                            <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 shadow-sm overflow-hidden">
                                <div className="p-4 flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-2 font-semibold text-cyprus">
                                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                                        Bergabung dengan Apotek Sehat Pekanbaru
                                    </span>
                                    <span className="text-xs text-gray-400">Hari ini</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
